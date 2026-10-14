import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { resolve, join } from 'node:path';
import { readFileSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';

// Upstream controls valid grade strings. Credentials are synthetic and are
// intentionally unlike prose, so whitespace/split probes cannot be false positives.
const root = resolve(import.meta.dirname, '..');
const out = join(root, 'qa/unit6-app-r1-evidence');
mkdirSync(out, { recursive: true });
const secrets = { AI_API_KEY: 'zQ8mV6pR2+K9w/X4nT7=H3%uY5&bC1', SESSION_SECRET: 'sJ4dP9wF7!mR3qL8@cV6nZ2#tH5xG1', ACCESS_CODE: 'aN5cX9vB2/yD7kF4+rM8pQ3=zW6jT1' };
const base = 'http://127.0.0.1:3111';
const exam = JSON.parse(readFileSync(join(root, 'data/units/unit-6.json'), 'utf8'));
const tids = ['W31', 'W32', 'W33', 'W34', 'W35'];
const sids = ['S1-1', 'S1-2', 'S1-3', 'S2', 'S3'];
const delay = ms => new Promise(r => setTimeout(r, ms));
const percent = s => [...Buffer.from(s)].map(b => `%${b.toString(16).padStart(2, '0').toUpperCase()}`).join('');
const unicode = s => [...s].map(c => '\\u' + c.charCodeAt(0).toString(16).padStart(4, '0')).join('');
const chunks = (s, n) => [...s.matchAll(new RegExp(`.{1,${n}}`, 'gs'))].map(m => m[0]);
const representations = {
  raw: s => s,
  'truncated-head-16': s => s.slice(0, 16),
  'truncated-middle-8': s => s.slice(9, 17),
  'truncated-tail-16': s => s.slice(-16),
  'URL-encode': percent,
  'URL-double': s => percent(percent(s)),
  base64: s => Buffer.from(s).toString('base64'),
  base64url: s => Buffer.from(s).toString('base64url'),
  'base64-truncated-head': s => Buffer.from(s).toString('base64').slice(0, 16),
  'base64-truncated-tail': s => Buffer.from(s).toString('base64').slice(-16),
  'literal-unicode-escape': unicode,
  'wire-JSON-escape': s => s,
  'spaces-every-character': s => [...s].join(' '),
  'newlines-every-four': s => chunks(s, 4).join('\n'),
  'tabs-newlines-every-four': s => chunks(s, 4).join('\t\n'),
  'base64-newlines-four': s => chunks(Buffer.from(s).toString('base64'), 4).join('\n'),
  'URL-with-spaces': s => [...Buffer.from(s)].map(b => `%${b.toString(16).padStart(2, '0')}`).join(' '),
  'unicode-with-newlines': s => [...s].map(unicode).join('\n'),
};
const outcomes = [], calls = [];
let active, cookie = {}, processApp, appLog = '';
function answers() {
  return { listening: {}, reading: {}, writing: { translations: Object.fromEntries(exam.writing.translation.items.map(q => [q.id, q.referenceTranslation])), email: exam.writing.email.modelAnswer }, speaking: Object.fromEntries(sids.map(id => [id, { text: 'If our team used a reliable video system, we would communicate more clearly and reduce travel costs.' }])) };
}
function grade(writing, student) {
  const corrections = [{ original: 'The system work.', corrected: 'The system works.', note: 'Chia động từ cho chủ ngữ số ít.' }];
  return writing ? { translations: tids.map(id => ({ id, score: 0.125, feedback: 'Nhận xét sạch.' })), email: { steps: 0.25, layout: 0.125, grammar: 0.125, vocabulary: 0.125, wordCount: student.email.trim().split(/\s+/).length, feedback: 'Nhận xét sạch.', corrections } } : { task: 0.3125, unitGrammar: 0.3125, vocabulary: 0.3125, fluency: 0.3125, pronunciationAssessed: false, feedback: 'Nhận xét sạch.', corrections };
}
function applyAttack(g, writing, attack) {
  const section = writing ? g.email : g;
  const value = secrets[attack.secret];
  if (attack.representation === 'split-four') {
    const parts = chunks(value, 4); section.feedback = parts[0]; section.corrections = [];
    for (let i = 1; i < parts.length; i += 3) section.corrections.push({ original: parts[i], corrected: parts[i + 1] ?? 'Sửa câu.', note: parts[i + 2] ?? 'Ghi chú.' });
    return;
  }
  if (attack.representation === 'split-base64-four') {
    const parts = chunks(Buffer.from(value).toString('base64'), 4); section.feedback = parts[0]; section.corrections = [];
    for (let i = 1; i < parts.length; i += 3) section.corrections.push({ original: parts[i], corrected: parts[i + 1] ?? 'Sửa câu.', note: parts[i + 2] ?? 'Ghi chú.' });
    return;
  }
  const token = representations[attack.representation](value);
  if (attack.placement === 'translationFeedback' && writing) g.translations[0].feedback = token;
  else if (attack.placement === 'feedback') section.feedback = token;
  else section.corrections[0][attack.placement] = token;
}
function reconstruct(r, attack) {
  if (!r.data.result) return false;
  const g = r.data.result.skills[attack.skill][attack.skill];
  const section = attack.skill === 'writing' ? g.email : g;
  let value = attack.placement === 'translationFeedback' ? g.translations[0].feedback : attack.placement === 'feedback' ? section.feedback : section.corrections[0][attack.placement];
  if (attack.representation.startsWith('split-')) {
    value = section.feedback + section.corrections.flatMap(c => [c.original, c.corrected, c.note]).filter(v => !['Sửa câu.', 'Ghi chú.'].includes(v)).join('');
  }
  if (['spaces-every-character', 'newlines-every-four', 'tabs-newlines-every-four', 'base64-newlines-four', 'URL-with-spaces', 'unicode-with-newlines'].includes(attack.representation)) value = value.replace(/\s/g, '');
  if (attack.representation.startsWith('URL')) { value = decodeURIComponent(value); if (attack.representation === 'URL-double') value = decodeURIComponent(value); }
  if (['base64', 'base64url', 'base64-newlines-four', 'split-base64-four'].includes(attack.representation)) value = Buffer.from(value, 'base64').toString();
  if (attack.representation.includes('unicode')) value = value.replace(/\\u([0-9a-f]{4})/gi, (_, h) => String.fromCharCode(parseInt(h, 16)));
  return value === secrets[attack.secret];
}
async function req(path, body) {
  const headers = { cookie: Object.entries(cookie).map(([k, v]) => `${k}=${v}`).join('; '), 'x-forwarded-for': `203.0.113.${outcomes.length + 1}`, ...(body === undefined ? {} : { 'content-type': 'application/json' }) };
  const response = await fetch(base + path, { method: body === undefined ? 'GET' : 'POST', headers, body: body === undefined ? undefined : JSON.stringify(body), signal: AbortSignal.timeout(60000) });
  for (const c of response.headers.getSetCookie()) { const [k, v] = c.split(';')[0].split('='); cookie[k] = v; }
  const text = await response.text();
  return { status: response.status, data: JSON.parse(text), text };
}
function redacted(value, attack) {
  let text = JSON.stringify(value);
  for (const s of Object.values(secrets)) for (const encode of Object.values(representations)) text = text.replaceAll(JSON.stringify(encode(s)).slice(1, -1), '[SYNTHETIC_SECRET_REDACTED]');
  if (attack.representation.startsWith('split-') && value.result) {
    const g = value.result.skills[attack.skill][attack.skill];
    const section = attack.skill === 'writing' ? g.email : g;
    return { ...value, result: { ...value.result, skills: { [attack.skill]: { ...value.result.skills[attack.skill], [attack.skill]: { ...(attack.skill === 'writing' ? { translations: g.translations } : {}), ...(attack.skill === 'writing' ? { email: { ...section, feedback: '[FRAGMENT_1]', corrections: section.corrections.map((_, i) => ({ original: `[FRAGMENT_${i * 3 + 2}]`, corrected: `[FRAGMENT_${i * 3 + 3}]`, note: `[FRAGMENT_${i * 3 + 4}]` })) } } : { ...section, feedback: '[FRAGMENT_1]', corrections: section.corrections.map((_, i) => ({ original: `[FRAGMENT_${i * 3 + 2}]`, corrected: `[FRAGMENT_${i * 3 + 3}]`, note: `[FRAGMENT_${i * 3 + 4}]` })) }) } } } } };
  }
  return JSON.parse(text);
}
const fake = createServer(async (req, res) => {
  try {
    assert(active); let raw = ''; for await (const b of req) raw += b;
    const body = JSON.parse(raw); assert.equal(req.headers.authorization, `Bearer ${secrets.AI_API_KEY}`);
    assert.equal(req.url, '/v1beta/models/qa-secrets-primary:generateContent'); assert.equal(body.generationConfig.temperature, 0);
    const student = JSON.parse(body.contents[0].parts[0].text.split('\n')[1]); const writing = Object.hasOwn(student, 'email');
    assert.equal(writing, active.skill === 'writing'); active.count++;
    calls.push({ name: active.name, attempt: active.count, temperature: 0 });
    const g = grade(writing, student);
    if (!active.recover || active.count === 1) applyAttack(g, writing, active);
    let text = JSON.stringify(g);
    // Encode only JSON STRING CONTENT, not structural JSON characters.
    if (active.representation === 'wire-JSON-escape') text = JSON.stringify(g).replace(/"((?:[^"\\]|\\.)*)"/g, match => {
      const value = JSON.parse(match); return '"' + unicode(value) + '"';
    });
    res.writeHead(200, { 'content-type': 'application/json' }); res.end(JSON.stringify({ candidates: [{ finishReason: 'STOP', content: { parts: [{ text }] } }] }));
  } catch { res.writeHead(500, { 'content-type': 'application/json' }); res.end('{}'); outcomes.push({ name: 'fake-contract', pass: false }); }
});
async function runCase(attack) {
  active = { ...attack, name: `${attack.skill}/${attack.secret}/${attack.representation}/${attack.placement}${attack.recover ? '/recover' : ''}`, count: 0 };
  const record = { name: active.name, skill: attack.skill, secret: attack.secret, representation: attack.representation, placement: attack.placement, recover: !!attack.recover };
  try {
    // New device for every case avoids conflating leak results with open-session caps.
    cookie = {}; assert.equal((await req('/api/access', { code: secrets.ACCESS_CODE })).status, 200);
    const s = await req('/api/session', { unit: 6, scope: attack.skill, mode: 'practice' }); assert.equal(s.status, 200);
    const sessionId = s.data.session.sessionId;
    const r = await req('/api/grade', { sessionId, answers: answers() });
    const read = await req(`/api/grade?sessionId=${sessionId}`);
    record.postStatus = r.status; record.getStatus = read.status; record.calls = active.count;
    record.reconstructable = reconstruct(r, attack); record.readbackReconstructable = reconstruct(read, attack);
    record.savedResult = !!read.data.result;
    if (r.status !== (attack.recover ? 200 : 502) || record.reconstructable || record.readbackReconstructable) {
      writeFileSync(join(out, `leak-${active.name.replaceAll('/', '-')}.json`), JSON.stringify({ ...record, postResponse: redacted(r.data, attack), getResponse: redacted(read.data, attack) }, null, 2));
    }
    assert.equal(r.status, attack.recover ? 200 : 502, 'POST must reject tainted output or save only a clean retry');
    assert.equal(read.status, attack.recover ? 200 : 409, 'readback must not contain a tainted result');
    assert.equal(active.count, 2, 'exactly one invalid-output retry');
    assert(!record.reconstructable && !record.readbackReconstructable, 'browser must not reconstruct server secret');
    record.pass = true;
  } catch (e) { record.pass = false; record.error = e.message; }
  outcomes.push(record); console.log(`${record.pass ? 'PASS' : 'FAIL'} ${record.name}: POST=${record.postStatus}, GET=${record.getStatus}, calls=${record.calls}, reconstructable=${record.reconstructable}`);
}
try {
  fake.listen(3197, '127.0.0.1'); await once(fake, 'listening');
  const db = join(out, 'variants.sqlite'); for (const suffix of ['', '-wal', '-shm']) rmSync(db + suffix, { force: true });
  // Trusted-proxy mode isolates each probe's login bucket; the full regression
  // suite separately tests device/IP limits and forged XFF with TRUST_PROXY=0.
  processApp = spawn(process.execPath, ['.next/standalone/server.js'], { cwd: root, detached: true, stdio: ['ignore', 'pipe', 'pipe'], env: { ...process.env, ...secrets, AI_MOCK: '0', AI_BASE_URL: 'http://127.0.0.1:3197', AI_MODEL: 'qa-secrets-primary', AI_MODEL_FALLBACK: 'qa-secrets-fallback', PORT: '3111', HOSTNAME: '127.0.0.1', EXAM_DATA_DIR: join(root, 'data/units'), TRUST_PROXY: '1', RATE_LIMIT_PER_DEVICE: '1000', RATE_LIMIT_PER_IP: '2000', RATE_LIMIT_DB: db } });
  processApp.stdout.on('data', b => { appLog += b; }); processApp.stderr.on('data', b => { appLog += b; });
  let ready = false;
  for (let i = 0; i < 90; i++) { try { if ((await fetch(base + '/api/access')).ok) { ready = true; break; } } catch {} await delay(500); }
  assert(ready, 'production app ready');
  for (const skill of ['writing', 'speaking']) {
    for (const secret of Object.keys(secrets)) for (const representation of [...Object.keys(representations), 'split-four', 'split-base64-four']) {
      // URL/encoded cases also cover corrections fields; raw/truncated cover feedback.
      const placement = representation.includes('base64') ? 'corrected' : representation.includes('URL') ? 'original' : representation.includes('unicode') ? 'note' : 'feedback';
      await runCase({ skill, secret, representation, placement });
    }
    if (skill === 'writing') await runCase({ skill, secret: 'AI_API_KEY', representation: 'raw', placement: 'translationFeedback' });
    for (const secret of Object.keys(secrets)) await runCase({ skill, secret, representation: 'base64', placement: 'note', recover: true });
  }
} finally {
  if (processApp && processApp.exitCode === null && processApp.signalCode === null) {
    const exited = once(processApp, 'exit'); process.kill(-processApp.pid, 'SIGTERM'); await Promise.race([exited, delay(5000)]);
    if (processApp.exitCode === null && processApp.signalCode === null) { process.kill(-processApp.pid, 'SIGKILL'); await exited; }
  }
  if (fake.listening) { fake.close(); await once(fake, 'close'); }
  writeFileSync(join(out, 'variants-app.log'), appLog);
  outcomes.push({ name: 'no raw secret in app logs', pass: Object.values(secrets).every(s => !appLog.includes(s)) });
  writeFileSync(join(out, 'secret-variants-results.json'), JSON.stringify({ sourceCommit: 'e4eb51d', realModel: false, syntheticSecretsOnly: true, outcomes, calls, serversStopped: true }, null, 2));
}
console.log(JSON.stringify({ passed: outcomes.filter(r => r.pass).length, failed: outcomes.filter(r => !r.pass).length }));
if (outcomes.some(r => !r.pass)) process.exitCode = 1;
