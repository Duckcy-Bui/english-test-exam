import assert from 'node:assert/strict';
import { execFileSync, spawn } from 'node:child_process';
import { createServer } from 'node:http';
import { request } from 'node:https';
import { once } from 'node:events';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
const root=resolve(import.meta.dirname,'..'), out=resolve(root,'qa/deploy-evidence'), runtime=resolve(out,'runtime');
const outcomes=[];
const delay=ms=>new Promise(r=>setTimeout(r,ms));
function check(name,fn){return (async()=>{try{const details=await fn();outcomes.push({name,pass:true,details});console.log(`PASS ${name}`);}catch(e){outcomes.push({name,pass:false,error:e.message});console.log(`FAIL ${name}: ${e.message}`);}})();}
const template=readFileSync(resolve(root,'deploy/nginx.conf.example'),'utf8');
let child;
// Echo server measures headers actually received from the proxy, without secrets.
const echo=createServer((req,res)=>{res.setHeader('content-type','application/json');res.end(JSON.stringify({xff:req.headers['x-forwarded-for'],proto:req.headers['x-forwarded-proto'],host:req.headers.host}));});
function https(path,headers={},method='GET'){
  return new Promise((done,reject)=>{const req=request({hostname:'127.0.0.1',port:3122,path,method,servername:'example.com',ca:readFileSync(resolve(runtime,'localhost.crt')),headers:{Host:'example.com',...headers}},res=>{let text='';res.on('data',b=>text+=b);res.on('end',()=>done({status:res.statusCode,headers:res.headers,text}));});req.on('error',reject);req.end(method==='POST'?'x':undefined);});
}
try{
  mkdirSync(resolve(runtime,'certbot/.well-known/acme-challenge'),{recursive:true});writeFileSync(resolve(runtime,'certbot/.well-known/acme-challenge/qa-token'),'qa-acme-ok');
  let site=template.replace('listen 80;','listen 127.0.0.1:3121;').replace('listen [::]:80;','').replace('listen 443 ssl;','listen 127.0.0.1:3122 ssl;').replace('listen [::]:443 ssl;','').replace('/etc/letsencrypt/live/example.com/fullchain.pem',resolve(runtime,'localhost.crt')).replace('/etc/letsencrypt/live/example.com/privkey.pem',resolve(runtime,'localhost.key')).replace('/var/www/certbot',resolve(runtime,'certbot')).replace('http://127.0.0.1:3000','http://127.0.0.1:3120');
  // Extra test-only endpoint applies exactly the template's header directives.
  site=site.replace('    location / {\n        proxy_pass',`    location = /qa-echo {\n        proxy_pass http://127.0.0.1:3123;\n        proxy_set_header Host $host;\n        proxy_set_header X-Forwarded-Proto $scheme;\n        proxy_set_header X-Forwarded-For $remote_addr;\n    }\n    location / {\n        proxy_pass`);
  writeFileSync(resolve(runtime,'site.conf'),site);
  const config=resolve(runtime,'nginx.conf');
  writeFileSync(config,`worker_processes 1;\npid ${resolve(runtime,'nginx.pid')};\nerror_log ${resolve(out,'nginx-runtime.log')};\nevents { worker_connections 64; }\nhttp { access_log ${resolve(out,'nginx-access.log')}; client_body_temp_path ${resolve(runtime,'body')}; include ${resolve(runtime,'site.conf')}; }\n`);
  await check('nginx -t with template and local test certificate',()=>{const text=execFileSync('nginx',['-t','-c',config,'-p',runtime],{encoding:'utf8',stdio:['ignore','pipe','pipe']});return {syntax:true,stdout:text};});
  echo.listen(3123,'127.0.0.1');await once(echo,'listening');
  child=spawn('nginx',['-c',config,'-p',runtime,'-g','daemon off;'],{stdio:['ignore','ignore','pipe']});let stderr='';child.stderr.on('data',b=>stderr+=b);
  for(let i=0;i<30;i++){try{await https('/api/health');break;}catch{}await delay(200);}
  await check('HTTP 308 redirect and ACME exception',async()=>{
    const r=await fetch('http://127.0.0.1:3121/api/health',{headers:{Host:'example.com'},redirect:'manual'});assert.equal(r.status,308);assert.equal(r.headers.get('location'),'https://example.com/api/health');
    const a=await fetch('http://127.0.0.1:3121/.well-known/acme-challenge/qa-token',{headers:{Host:'example.com'}});assert.equal(a.status,200);assert.equal(await a.text(),'qa-acme-ok');return {redirect:308,acme:200};
  });
  await check('HTTPS proxy health and security/microphone headers, including 413',async()=>{
    const r=await https('/api/health');assert.equal(r.status,200);assert.deepEqual(JSON.parse(r.text),{status:'ok'});
    const expected={'x-content-type-options':'nosniff','x-frame-options':'DENY','referrer-policy':'same-origin','strict-transport-security':'max-age=31536000','permissions-policy':'microphone=(self), camera=()'};
    for(const[k,v]of Object.entries(expected))assert.equal(r.headers[k],v);
    const big=await https('/api/grade',{'Content-Length':String(49*1024*1024)},'POST');assert.equal(big.status,413);for(const[k,v]of Object.entries(expected))assert.equal(big.headers[k],v);
    return {health:200,headers:expected,body49MiB:413};
  });
  await check('Nginx overwrites forged XFF, forwards HTTPS scheme and Host',async()=>{
    const r=await https('/qa-echo',{'X-Forwarded-For':'1.2.3.4'});assert.equal(r.status,200);const h=JSON.parse(r.text);assert.equal(h.xff,'127.0.0.1');assert.equal(h.proto,'https');assert.equal(h.host,'example.com');return h;
  });
  if(stderr)writeFileSync(resolve(out,'nginx-stderr.log'),stderr);
}finally{
  if(child&&child.exitCode===null&&child.signalCode===null){child.kill('SIGTERM');await once(child,'exit');}
  if(echo.listening){echo.close();await once(echo,'close');}
  writeFileSync(resolve(out,'nginx-results.json'),JSON.stringify({sourceCommit:'07c4fac',certificate:'local self-signed QA CA, not public HTTPS deployment',outcomes,serversStopped:true},null,2));
}
if(outcomes.some(r=>!r.pass))process.exitCode=1;
