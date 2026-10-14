import assert from 'node:assert/strict';
import { writeFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

// In-process route integration: seed a cached result to verify the real GET and
// cached POST guards independently of the upstream/retry path. No app edits.
const root = resolve(import.meta.dirname, '..');
const out = resolve(root, 'qa/unit6-app-r1-evidence');
mkdirSync(out, { recursive: true });
const secrets = { AI_API_KEY: 'zQ8mV6pR2+K9w/X4nT7=H3%uY5&bC1', SESSION_SECRET: 'sJ4dP9wF7!mR3qL8@cV6nZ2#tH5xG1', ACCESS_CODE: 'aN5cX9vB2/yD7kF4+rM8pQ3=zW6jT1' };
Object.assign(process.env, secrets, { AI_MOCK: '1', EXAM_DATA_DIR: resolve(root, 'data/units'), RATE_LIMIT_DB: resolve(out, 'cached.sqlite') });
const { GET, POST } = await import('../app/api/grade/route.ts');
const { createSession } = await import('../src/server/sessions.ts');
const { gradeSession } = await import('../src/server/grading.ts');
const { emptyAnswers } = await import('../src/types/app.ts');
const { issueAuth, issueDevice, deviceId } = await import('../src/server/security.ts');
const outcomes: unknown[] = [];
let failures = 0;
const cookie = `et_access=${encodeURIComponent(issueAuth())}; et_device=${encodeURIComponent(issueDevice())}`;
const device = deviceId(new Request('http://localhost', { headers: { cookie } }))!;
async function run(skill: 'writing' | 'speaking', method: 'GET' | 'POST', secretName: keyof typeof secrets, representation: string) {
  const name = `cached ${method}/${skill}/${secretName}/${representation}`;
  const record: Record<string, unknown> = { name, evidenceKind: 'in-process actual Next route handler', representation, secretName };
  let sessionId: string | undefined;
  try {
    const s = await createSession(device, 6, 'practice', skill);
    sessionId = s.id;
    s.result = await gradeSession(s, emptyAnswers()); s.status = 'submitted';
    const value = secrets[secretName];
    const section = skill === 'writing' ? s.result.skills.writing!.writing!.email : s.result.skills.speaking!.speaking!;
    if (representation === 'clean') section.feedback = 'Nhận xét sạch.';
    if (representation === 'raw') section.feedback = value;
    if (representation === 'base64') section.feedback = Buffer.from(value).toString('base64');
    if (representation === 'spaces') section.feedback = [...value].join(' ');
    if (representation === 'split-four') {
      const parts = value.match(/.{1,4}/g)!; section.feedback = parts[0]; section.corrections = [];
      for (let i = 1; i < parts.length; i += 3) section.corrections.push({ original: parts[i], corrected: parts[i + 1] ?? 'Sửa câu.', note: parts[i + 2] ?? 'Ghi chú.' });
    }
    const response = method === 'GET'
      ? await GET(new Request(`http://localhost/api/grade?sessionId=${s.id}`, { headers: { cookie } }))
      : await POST(new Request('http://localhost/api/grade', { method: 'POST', headers: { cookie, 'content-type': 'application/json' }, body: JSON.stringify({ sessionId: s.id, answers: emptyAnswers() }) }));
    record.status = response.status; record.resultRetained = !!s.result; record.sessionStatus = s.status;
    const body = await response.json(); record.publicResult = !!body.result;
    assert.equal(response.status, representation === 'clean' ? 200 : 502, 'cached route rejects unsafe grade');
    assert.equal(!!s.result, representation === 'clean', 'unsafe cached result removed');
    assert.equal(s.status, representation === 'clean' ? 'submitted' : 'idle');
    record.pass = true;
  } catch (e) { record.pass = false; record.error = (e as Error).message; failures++; }
  finally {
    // Dispose only the synthetic in-process fixture, avoiding the 20-open-session
    // cap while preserving the real response/status assertion above.
    if (sessionId) (globalThis as typeof globalThis & { etSessions?: Map<string, unknown> }).etSessions?.delete(sessionId);
  }
  outcomes.push(record); console.log(`${record.pass ? 'PASS' : 'FAIL'} ${name}: status=${record.status}, retained=${record.resultRetained}`);
}
for (const skill of ['writing', 'speaking'] as const) for (const method of ['GET', 'POST'] as const) {
  await run(skill, method, 'AI_API_KEY', 'clean');
  for (const secretName of Object.keys(secrets) as (keyof typeof secrets)[]) for (const representation of ['raw', 'base64', 'spaces', 'split-four']) await run(skill, method, secretName, representation);
}
writeFileSync(resolve(out, 'cached-results.json'), JSON.stringify({ sourceCommit: 'e4eb51d', syntheticSecretsOnly: true, outcomes }, null, 2));
console.log(JSON.stringify({ passed: outcomes.length - failures, failed: failures }));
process.exitCode = failures ? 1 : 0;
