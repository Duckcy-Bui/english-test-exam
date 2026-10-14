/** Never include the candidate, secret, field path or cause in this public error. */
export class UnsafeAiOutputError extends Error {
  constructor() {
    super(
      "Chưa thể chấm bài bằng AI. Vui lòng thử lại sau; chưa có điểm nào được ghi nhận.",
    );
    this.name = "UnsafeAiOutputError";
  }
}

const MIN_FRAGMENT = 8;
const ENCODED_FRAGMENT = 12;
const MAX_SCAN_BYTES = 512 * 1024;
const PUBLIC_KEY_PREFIXES = ["sk-ant-api03-", "sk-proj-", "AIzaSy", "sk-"];
interface Matcher {
  short: string[];
  fragments: Set<string>;
  encodedFragments: Set<string>;
}
let cache: { fingerprint: string; matcher: Matcher } | undefined;

function matcher(): Matcher {
  const values = [
    process.env.AI_API_KEY,
    process.env.SESSION_SECRET,
    process.env.ACCESS_CODE,
  ]
    .filter((value): value is string => !!value)
    .flatMap((value) => [value, value.trim()])
    .filter(Boolean);
  const fingerprint = JSON.stringify(values);
  if (cache?.fingerprint === fingerprint) return cache.matcher;
  const result: Matcher = {
    short: [],
    fragments: new Set(),
    encodedFragments: new Set(),
  };
  for (const value of new Set(values)) {
    const chars = Array.from(value);
    const prefix =
      PUBLIC_KEY_PREFIXES.find((p) => value.startsWith(p))?.length ?? 0;
    if (chars.length < MIN_FRAGMENT) result.short.push(value);
    else {
      for (let i = 0; i <= chars.length - MIN_FRAGMENT; i++) {
        // A public provider prefix alone does not identify a credential.
        if (i + MIN_FRAGMENT <= prefix) continue;
        const fragment = chars.slice(i, i + MIN_FRAGMENT).join("");
        result.fragments.add(fragment);
        // Include separately encoded fragments, not only base64(full secret).
        const encoded = Buffer.from(fragment)
          .toString("base64")
          .replace(/=+$/, "");
        if (encoded.length >= ENCODED_FRAGMENT)
          result.encodedFragments.add(encoded);
      }
    }
    const encoded = Buffer.from(value).toString("base64").replace(/=+$/, "");
    for (let i = 0; i <= encoded.length - ENCODED_FRAGMENT; i++) {
      if (((i + ENCODED_FRAGMENT) * 3) / 4 <= prefix) continue;
      result.encodedFragments.add(encoded.slice(i, i + ENCODED_FRAGMENT));
    }
  }
  cache = { fingerprint, matcher: result };
  return result;
}

function containsFragment(
  text: string,
  width: number,
  fragments: Set<string>,
): boolean {
  const chars = Array.from(text);
  for (let i = 0; i <= chars.length - width; i++) {
    if (fragments.has(chars.slice(i, i + width).join(""))) return true;
  }
  return false;
}
function percentDecoded(text: string): string {
  // A malformed '%' elsewhere must not prevent decoding a valid secret token.
  return text.replace(/(?:%[0-9a-f]{2})+/gi, (token) => {
    try {
      return decodeURIComponent(token);
    } catch {
      return token;
    }
  });
}
function unicodeDecoded(text: string): string {
  return text.replace(/\\u([0-9a-f]{4})/gi, (_, code: string) =>
    String.fromCharCode(Number.parseInt(code, 16)),
  );
}
function base64Decoded(token: string): string | null {
  if (token.length % 4 === 1) token = token.slice(0, -1); // truncated last sextet
  if (!token) return null;
  const bytes = Buffer.from(token, "base64");
  // Truncation can leave a partial UTF-8 character at the end.
  for (let cut = 0; cut <= Math.min(3, bytes.length - 1); cut++) {
    try {
      return new TextDecoder("utf-8", { fatal: true }).decode(
        bytes.subarray(0, bytes.length - cut),
      );
    } catch {
      /* Try a complete prefix. */
    }
  }
  return null;
}

/**
 * Reject the entire candidate rather than accepting a grade with scrubbed text.
 * Exact short secrets and identifying fragments >=8 codepoints are detected;
 * arbitrary one-character fragments cannot be distinguished from ordinary text.
 * Decode URL/Unicode/base64 wrappers at most twice, with a total text budget.
 */
export function assertNoServerSecrets(value: unknown): void {
  const patterns = matcher();
  if (
    !patterns.short.length &&
    !patterns.fragments.size &&
    !patterns.encodedFragments.size
  )
    return;
  const values: unknown[] = [value];
  const seenObjects = new WeakSet<object>();
  const strings: string[] = [];
  while (values.length) {
    const item = values.pop();
    if (typeof item === "string") strings.push(item);
    else if (
      item !== null &&
      typeof item === "object" &&
      !seenObjects.has(item)
    ) {
      seenObjects.add(item);
      if (Array.isArray(item)) values.push(...item);
      else
        for (const [key, child] of Object.entries(item)) {
          strings.push(key);
          values.push(child);
        }
    }
  }
  const queue = strings.map((text) => ({ text, depth: 0 }));
  const seenStrings = new Set<string>();
  let scanned = 0;
  for (let at = 0; at < queue.length; at++) {
    const { text, depth } = queue[at];
    if (seenStrings.has(text)) continue;
    seenStrings.add(text);
    scanned += Buffer.byteLength(text);
    if (scanned > MAX_SCAN_BYTES) throw new UnsafeAiOutputError();
    if (
      patterns.short.some((secret) => text.includes(secret)) ||
      containsFragment(text, MIN_FRAGMENT, patterns.fragments)
    )
      throw new UnsafeAiOutputError();
    if (depth < 2) {
      const decoded = percentDecoded(unicodeDecoded(text));
      if (decoded !== text) queue.push({ text: decoded, depth: depth + 1 });
    }
    for (const match of text.matchAll(/[A-Za-z0-9+/_-]{8,}={0,2}/g)) {
      const token = match[0].replace(/-/g, "+").replace(/_/g, "/");
      if (containsFragment(token, ENCODED_FRAGMENT, patterns.encodedFragments))
        throw new UnsafeAiOutputError();
      if (depth >= 2) continue;
      const unpacked = base64Decoded(token);
      if (unpacked && unpacked !== text)
        queue.push({ text: unpacked, depth: depth + 1 });
    }
  }
}

/** Only AI-generated grades are scanned; exam text and student answers are not AI output. */
export function assertSafeResult(result: {
  skills: Partial<Record<string, { writing?: unknown; speaking?: unknown }>>;
}): void {
  assertNoServerSecrets(result.skills.writing?.writing);
  assertNoServerSecrets(result.skills.speaking?.speaking);
}
