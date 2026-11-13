import { chromium } from '@playwright/test';
import { writeFileSync } from 'node:fs';
import assert from 'node:assert/strict';
const baseURL=process.env.PLANNER_TEST_BASE_URL || 'http://localhost:3023';
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});
const reports=[];
try {
 for(const width of [320,1280]) {
  const page=await browser.newPage({viewport:{width,height:900}});await page.goto(baseURL+'/next-step');
  assert.equal(await page.getByText('Exported files are user-managed and unencrypted.',{exact:false}).isVisible(),true);
  await page.addScriptTag({path:'node_modules/axe-core/axe.min.js'});
  for(const state of ['editing','restore-confirmation','export-error']) {
   const action=page.getByLabel('One manageable action',{exact:true});await action.fill('Synthetic accessibility note');
   if(state==='restore-confirmation')await page.getByRole('button',{name:'Restore saved draft',exact:true}).click();
   if(state==='export-error') {await page.getByRole('button',{name:'Keep my edits',exact:true}).click();await page.evaluate(()=>{URL.createObjectURL=()=>{throw new Error('synthetic');};});await page.getByRole('button',{name:'Export all drafts as JSON',exact:true}).click();}
   const result=await page.evaluate(()=>window.axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}}));
   reports.push({width,state,violations:result.violations.map(x=>({id:x.id,impact:x.impact,nodes:x.nodes.map(n=>n.target)})),incomplete:result.incomplete.map(x=>x.id)});
  }
  await page.close();
 }
} finally {await browser.close();writeFileSync('/tmp/phase142-axe.json',JSON.stringify(reports,null,2));}
console.log(JSON.stringify(reports));if(reports.some(r=>r.violations.length))process.exitCode=1;
