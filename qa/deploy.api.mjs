import assert from 'node:assert/strict';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, join } from 'node:path';
const root = resolve(import.meta.dirname, '..');
const out = resolve(root, process.env.QA_EVIDENCE_DIR || 'qa/deploy-evidence');
const base = process.env.QA_BASE_URL || 'http://127.0.0.1:3120';
const code = process.env.QA_ACCESS_CODE || 'qa-container-access-code';
const label = process.env.QA_API_LABEL || 'container';
const outcomes = []; let cookies = {};
// Compose restart returns before the app has reopened its listening socket.
for(let i=0;i<90;i++) {
  try { if((await fetch(base+'/api/health')).ok) break; } catch {}
  await new Promise(r=>setTimeout(r,500));
}
async function req(path, body) {
  const response = await fetch(base + path, { method: body === undefined ? 'GET' : 'POST', headers: { ...(body === undefined ? {} : { 'content-type': 'application/json' }), cookie: Object.entries(cookies).map(([k,v]) => `${k}=${v}`).join('; ') }, body: body === undefined ? undefined : JSON.stringify(body) });
  for (const c of response.headers.getSetCookie()) { const [k,v] = c.split(';')[0].split('='); cookies[k]=v; }
  return { status: response.status, body: await response.json(), headers: response.headers };
}
function strip(v) {
  if (Array.isArray(v)) return v.forEach(strip);
  if (v && typeof v==='object') for (const [k,child] of Object.entries(v)) {
    assert(!['answerKey','acceptedAnswers','explanation','referenceTranslation','modelAnswer','sampleAnswer','sourceNotes','script'].includes(k), `private field ${k}`); strip(child);
  }
}
async function check(name, fn) { try { const details = await fn(); outcomes.push({name,pass:true,details}); console.log(`PASS ${name}`); } catch(e) { outcomes.push({name,pass:false,error:e.message}); console.log(`FAIL ${name}: ${e.message}`); } }
const blank = () => ({ listening:{}, reading:{}, writing:{translations:{},email:''},speaking:{} });
await check('health, auth and all 8 Units listed', async () => {
  const h=await req('/api/health'); assert.equal(h.status,200); assert.deepEqual(h.body,{status:'ok'});
  assert.equal((await req('/api/grade',{sessionId:'invalid',answers:blank()})).status,401);
  assert.equal((await req('/api/access',{code:'wrong'})).status,401);
  assert.equal((await req('/api/access',{code})).status,200);
  const list=await req('/api/units'); assert.equal(list.status,200); strip(list.body);
  assert.deepEqual(list.body.units.filter(u=>u.available).map(u=>u.unit),[1,2,3,4,5,6,7,8]);
});
for(let unit=1;unit<=8;unit++) await check(`Unit ${unit}: all public skills stripped, perfect/blank/wrong Reading/Listening`,async()=>{
  const exam=JSON.parse(readFileSync(join(root,`data/units/unit-${unit}.json`),'utf8'));
  for(const scope of ['writing','speaking','full']) {
    const r=await req('/api/session',{unit,mode:'practice',scope}); assert.equal(r.status,200); strip(r.body);
    // Dispose a practice metadata probe by grading only when no AI is selected;
    // instead use separate authenticated device per Unit to avoid open-session caps.
  }
  for(const scope of ['reading','listening']) for(const gradeCase of ['perfect','blank','wrong']) {
    const perfect=gradeCase==='perfect';
    const r=await req('/api/session',{unit,mode:'practice',scope}); assert.equal(r.status,200); strip(r.body);
    const id=r.body.session.sessionId; assert.equal((await req(`/api/grade?sessionId=${id}`)).status,409);
    const a=blank();
    const rdata=exam.reading;
    const questions=scope==='listening'?exam.listening.parts.flatMap(p=>p.questions):[...rdata.matching.items,...rdata.grammar,...rdata.vocabulary,...rdata.passageMcq.questions,...rdata.passageTrueFalse.questions];
    if(gradeCase!=='blank')for(const q of questions){
      a[scope][q.id]=perfect?(q.answerKey??q.acceptedAnswers[0]):q.acceptedAnswers?'not an answer':q.answerKey==='T'?'F':q.answerKey==='F'?'T':q.answerKey==='A'?'B':'A';
    }
    const g=await req('/api/grade',{sessionId:id,answers:a}); assert.equal(g.status,200);
    assert.equal(g.body.result.skills[scope].score,perfect?2.5:0);
    const reviews=g.body.result.skills[scope].questions; assert.equal(reviews.length,scope==='reading'?30:10);
    for(const review of reviews){const source=questions.find(q=>q.id===review.id);assert(source);assert.equal(review.correctAnswer,source.answerKey??source.acceptedAnswers.join(' / '));}
    assert(reviews.every(q=>q.correct===perfect)); assert(!JSON.stringify(g.body.result).includes('sourceNotes'));
  }
  // New cookie/device per unit, bounded login attempts (10 total).
  cookies={}; assert.equal((await req('/api/access',{code})).status,200);
  return {readingPerfect:2.5,readingBlank:0,readingWrong:0,listeningPerfect:2.5,listeningBlank:0,listeningWrong:0,privateFieldsBeforeSubmit:false,reviewAnswerKeysMatch:true};
});
// Separate mode persists cookies in a private local file for quota restart checks.
const quotaPath=join(out,'quota-cookies.json');
if(process.env.QA_QUOTA_PHASE==='before') await check('container quota before restart: 3/device,5/IP',async()=>{
  let saved;
  for(let i=0;i<3;i++) {
    const s=await req('/api/session',{unit:6,mode:'practice',scope:'writing'}); assert.equal(s.status,200);
    const g=await req('/api/grade',{sessionId:s.body.session.sessionId,answers:blank()}); assert.equal(g.status,200); saved=s.body.session.sessionId;
  }
  const s=await req('/api/session',{unit:6,mode:'practice',scope:'writing'}); assert.equal((await req('/api/grade',{sessionId:s.body.session.sessionId,answers:blank()})).status,429);
  writeFileSync(quotaPath,JSON.stringify(cookies),{mode:0o600});
  cookies={}; assert.equal((await req('/api/access',{code})).status,200);
  for(let i=0;i<2;i++){const s=await req('/api/session',{unit:6,mode:'practice',scope:'speaking'}); assert.equal((await req('/api/grade',{sessionId:s.body.session.sessionId,answers:blank()})).status,200);}
  return {deviceAccepted:3,deviceFourth:429,ipAccepted:5};
});
if(process.env.QA_QUOTA_PHASE==='after') await check('SQLite IP and device quota preserved across restart',async()=>{
  cookies=JSON.parse(readFileSync(quotaPath,'utf8'));
  let s=await req('/api/session',{unit:6,mode:'practice',scope:'writing'}); assert.equal(s.status,200); assert.equal((await req('/api/grade',{sessionId:s.body.session.sessionId,answers:blank()})).status,429);
  cookies={}; assert.equal((await req('/api/access',{code})).status,200);
  s=await req('/api/session',{unit:6,mode:'practice',scope:'writing'}); assert.equal((await req('/api/grade',{sessionId:s.body.session.sessionId,answers:blank()})).status,429);
});
writeFileSync(join(out,`api-${label}-results.json`),JSON.stringify({sourceCommit:'07c4fac',base,realModel:false,outcomes},null,2));
console.log(JSON.stringify({passed:outcomes.filter(r=>r.pass).length,failed:outcomes.filter(r=>!r.pass).length}));
if(outcomes.some(r=>!r.pass))process.exitCode=1;
