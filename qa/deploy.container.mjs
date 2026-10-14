import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
const root=resolve(import.meta.dirname,'..');
const image='english-it-exam:qa-deploy-07c4fac';
const container='et-qa-deploy-07c4fac-app-1';
const run=(args)=>execFileSync('docker',args,{encoding:'utf8',maxBuffer:20*1024*1024});
const outcomes=[];
function check(name,fn){try{const details=fn();outcomes.push({name,pass:true,details});console.log(`PASS ${name}`);}catch(e){outcomes.push({name,pass:false,error:e.message});console.log(`FAIL ${name}: ${e.message}`);}}
const ii=JSON.parse(run(['image','inspect',image]))[0];
let ci=JSON.parse(run(['inspect',container]))[0];
// HEALTHCHECK is periodic; a restart can serve HTTP before its next probe.
for(let attempt=0;ci.State.Health.Status!=='healthy'&&attempt<120;attempt++){
  await new Promise(done=>setTimeout(done,500));ci=JSON.parse(run(['inspect',container]))[0];
}
check('image metadata: non-root and no runtime secrets baked in',()=>{
  assert.equal(ii.Config.User,'nextjs');
  const env=ii.Config.Env||[]; assert(!env.some(v=>/^(AI_API_KEY|ACCESS_CODE|SESSION_SECRET)=/.test(v)));
  const history=run(['history','--no-trunc',image]);
  assert(!/qa-container-(access-code|session-secret|key-sentinel)/.test(history));
  writeFileSync(resolve(root,'qa/deploy-evidence/image-history.log'),history);
  return {imageId:ii.Id,user:ii.Config.User,envNames:env.map(v=>v.split('=')[0]),secretsBakedIn:false};
});
check('container uid=1001, gid=1001, hardening and loopback bind',()=>{
  const id=run(['exec',container,'id']);assert(/uid=1001/.test(id)&&/gid=1001/.test(id));
  assert.equal(ci.HostConfig.ReadonlyRootfs,true);assert(ci.HostConfig.CapDrop.includes('ALL'));
  assert(ci.HostConfig.SecurityOpt.includes('no-new-privileges:true'));
  assert.equal(ci.State.Health.Status,'healthy');
  assert.deepEqual(ci.HostConfig.PortBindings['3000/tcp'],[{HostIp:'127.0.0.1',HostPort:'3120'}]);
  assert(ci.Mounts.some(m=>m.Type==='volume'&&m.Destination==='/var/lib/english-it'));
  return {id:id.trim(),readOnly:true,capDrop:ci.HostConfig.CapDrop,securityOpt:ci.HostConfig.SecurityOpt,port:ci.HostConfig.PortBindings['3000/tcp'],health:ci.State.Health.Status,volume:ci.Mounts.find(m=>m.Destination==='/var/lib/english-it').Name};
});
check('application image files: 8 Units; no .git,qa,audit,tests or .env',()=>{
  const script=`const fs=require('node:fs');const root='/app';const names=fs.readdirSync(root);const forbidden=names.filter(n=>['.git','qa','audit','tests','fixtures'].includes(n)||n==='.env'||n.startsWith('.env.'));const envFiles=[];function walk(d){for(const f of fs.readdirSync(d,{withFileTypes:true})){const p=d+'/'+f.name;if(f.name==='.env'||f.name.startsWith('.env.'))envFiles.push(p);if(f.isDirectory())walk(p);}}walk(root);console.log(JSON.stringify({rootEntries:names,forbidden,envFiles,units:fs.readdirSync('/app/data/units').filter(n=>/^unit-[1-8]\\.json$/.test(n)).sort()}));`;
  const info=JSON.parse(run(['exec',container,'node','-e',script]));
  assert.deepEqual(info.forbidden,[]);assert.deepEqual(info.envFiles,[]);assert.equal(info.units.length,8);
  return info;
});
check('quota DB is on volume, has rows and passes integrity',()=>{
  const script=`const {DatabaseSync}=require('node:sqlite');const {statSync}=require('node:fs');const path=process.env.RATE_LIMIT_DB;const db=new DatabaseSync(path,{readOnly:true});const counts=db.prepare('SELECT count(*) count,sum(used) used FROM quota').get();const integrity=db.prepare('PRAGMA integrity_check').get().integrity_check;db.close();console.log(JSON.stringify({path,uid:statSync(path).uid,counts,integrity}));`;
  const info=JSON.parse(run(['exec',container,'node','-e',script]));assert.equal(info.path,'/var/lib/english-it/rate-limits.sqlite');assert.equal(info.uid,1001);assert.equal(info.integrity,'ok');assert(info.counts.count>0);return info;
});
writeFileSync(resolve(root,'qa/deploy-evidence/container-results.json'),JSON.stringify({sourceCommit:'07c4fac',outcomes},null,2));
if(outcomes.some(r=>!r.pass))process.exitCode=1;
