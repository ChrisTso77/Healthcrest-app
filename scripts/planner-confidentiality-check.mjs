import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
import { writeFileSync } from 'node:fs';
const browser = await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
const results=[];
const baseURL=process.env.PLANNER_TEST_BASE_URL || 'http://localhost:3023';
// Fail boundedly when a browser cannot provide the required event.
try {
 for (const width of [320,1280]) for (const version of [1,2,3]) {
  const context=await browser.newContext({viewport:{width,height:900},acceptDownloads:true});
  await context.addInitScript(({version})=>{
   const saved={version,selected:'Sleep',drafts:Object.fromEntries(['Fitness','Nutrition','Sleep','Stress'].map(p=>[p,{action:'Synthetic legacy plan',cue:'',support:'',reflection:'Legacy note',week:null}]))};
   localStorage.setItem('healthcrest.habit-draft.v1',JSON.stringify(saved));window.legacyRaw=localStorage.getItem('healthcrest.habit-draft.v1');window.writes=[];
   for(const method of ['setItem','removeItem','clear']){const original=Storage.prototype[method];Storage.prototype[method]=function(...args){window.writes.push([method,...args]);return original.apply(this,args);};}
  },{version});
  const page=await context.newPage();page.setDefaultTimeout(15000);console.error(`Checking ${width}px legacy v${version}`);await page.goto(baseURL+'/about');await page.goto(baseURL+'/next-step?pillar=sleep');
  await page.getByRole('button',{name:'Restore my plan',exact:true}).click();
  const action=page.getByRole('textbox',{name:/one manageable action/i});await action.fill('Synthetic private canary');
  await page.getByRole('button',{name:'Restore saved draft',exact:true}).click();await page.getByRole('button',{name:'Keep my edits',exact:true}).click();assert.equal(await action.inputValue(),'Synthetic private canary');
  const pending=page.waitForEvent('download');await page.getByRole('button',{name:'Export all drafts as JSON',exact:true}).click();const download=await pending;assert.ok(download.suggestedFilename().endsWith('.json'));
  const stream=await download.createReadStream();const chunks=[];for await(const chunk of stream)chunks.push(chunk);const bytes=Buffer.concat(chunks);const exported=JSON.parse(bytes);assert.equal(exported.drafts.Sleep.action,'Synthetic private canary');
  await page.getByLabel('Choose a Healthcrest backup',{exact:true}).setInputFiles({name:'synthetic.json',mimeType:'application/json',buffer:bytes});
  await page.getByRole('button',{name:'Replace page drafts with backup',exact:true}).click();assert.equal(await action.inputValue(),'Synthetic private canary');
  await page.getByRole('button',{name:'Start seven-day plan',exact:true}).click();const weekDownload=page.waitForEvent('download');await page.getByRole('button',{name:'Export week and all drafts',exact:true}).click();await weekDownload;

  await page.evaluate(()=>{URL.createObjectURL=()=>{throw new Error('synthetic export failure');};});await page.getByRole('button',{name:'Export all drafts as JSON',exact:true}).click();assert.equal(await action.inputValue(),'Synthetic private canary');
  const state=await page.evaluate(()=>({writes:window.writes,raw:localStorage.getItem('healthcrest.habit-draft.v1'),before:window.legacyRaw,overflow:document.documentElement.scrollWidth>innerWidth}));assert.deepEqual(state.writes,[]);assert.equal(state.raw,state.before);assert.equal(state.overflow,false);
  const prevented=await page.evaluate(()=>{const e=new Event('beforeunload',{cancelable:true});window.dispatchEvent(e);return e.defaultPrevented;});assert.ok(prevented);
  await page.getByRole('button',{name:'Remove saved plan',exact:true}).click();await page.getByRole('button',{name:'Keep saved plan',exact:true}).click();assert.equal(await page.evaluate(()=>localStorage.getItem('healthcrest.habit-draft.v1')),state.before);
  let navigationPrompts=0;page.once('dialog',async d=>{navigationPrompts++;await d.dismiss();});await page.getByRole('link',{name:'Learn',exact:true}).first().click();assert.equal(navigationPrompts,1);assert.ok(page.url().includes('/next-step'));
  console.error('Internal link cancellation verified');const notice=page.getByRole('link',{name:'Choose your privacy settings',exact:true});if(process.env.PLANNER_EXPECT_MEASUREMENT==='1')assert.equal(await notice.count(),1);if(await notice.count()){const dialog=page.waitForEvent('dialog');page.once('dialog',d=>d.dismiss());await notice.click();await dialog;assert.equal(await action.inputValue(),'Synthetic private canary');}
  console.error('Checking programmatic beforeunload');let programmaticPrompts=0; const programmaticDialog=page.waitForEvent('dialog'); page.once('dialog', async d => { programmaticPrompts++; assert.equal(d.type(),'beforeunload'); await d.dismiss(); }); await page.evaluate(() => { setTimeout(() => window.location.assign('/learn'), 0); }); await programmaticDialog; assert.equal(programmaticPrompts,1); assert.equal(await action.inputValue(),'Synthetic private canary');
  await page.getByRole('button',{name:'Remove saved plan',exact:true}).click();await page.getByRole('button',{name:'Remove saved copy',exact:true}).click();assert.equal(await page.evaluate(()=>localStorage.getItem('healthcrest.habit-draft.v1')),null);assert.equal(await action.inputValue(),'Synthetic private canary');
  await page.getByRole('button',{name:'Restore my plan',exact:true}).focus();for(let i=0;i<20;i++){await page.keyboard.press('Tab');assert.ok(await page.evaluate(()=>{const e=document.activeElement;if(!e||e===document.body)return false;const r=e.getBoundingClientRect();return r.width>0&&r.height>0;}));}
  assert.ok(await page.getByRole('status').count());assert.ok(await page.getByText('Export before browser Back/Forward or programmatic navigation.',{exact:false}).count());
  page.once('dialog',async d=>{await d.dismiss();});await page.reload({timeout:2000}).catch(()=>{});assert.equal(await action.inputValue(),'Synthetic private canary');
  page.once('dialog',async d=>{await d.accept();});await page.goBack();await page.waitForURL('**/about');await page.goForward();await page.waitForURL('**/next-step?pillar=sleep');

  results.push({width,version,passed:true,scope:'legacy restore/cancel; JSON export integrity and import; export failure; zero Storage writes before explicit removal; legacy preservation; internal link and measurement-link cancellation (when required); native programmatic/reload cancellation; Back/Forward completion; reflow and 20 Tab focus targets'});await context.close();
 }
} finally {await browser.close();writeFileSync('/tmp/phase142-browser.json',JSON.stringify(results,null,2));}
console.log(`${results.length} Chromium scenario groups PASS`);
