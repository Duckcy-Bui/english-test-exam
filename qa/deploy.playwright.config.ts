import { defineConfig } from '@playwright/test';
import { resolve } from 'node:path';
const root=resolve(import.meta.dirname,'..');
const data=resolve(root,'data/units');
process.env.E2E_DATA_DIR=data;
export default defineConfig({
  testDir:resolve(root,'tests/e2e'),outputDir:resolve(root,'qa/deploy-evidence/playwright'),
  workers:1,timeout:60_000,reporter:'list',
  use:{baseURL:'http://localhost:3106',headless:true,screenshot:'only-on-failure',trace:'retain-on-failure',launchOptions:{args:['--use-fake-device-for-media-stream','--use-fake-ui-for-media-stream']}},
  webServer:{command:'node .next/standalone/server.js',cwd:root,url:'http://localhost:3106',reuseExistingServer:false,env:{PORT:'3106',HOSTNAME:'127.0.0.1',ACCESS_CODE:'local-e2e-code',AI_MOCK:'1',EXAM_DATA_DIR:data,RATE_LIMIT_DB:resolve(root,'qa/deploy-evidence/e2e.sqlite'),TRUST_PROXY:'0',AI_API_KEY:'e2e-never-expose-this-key'}},
});
