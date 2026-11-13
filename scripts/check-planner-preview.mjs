import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { chromium, request, expect } from '@playwright/test';
import { PREVIEW_ORIGIN, PREVIEW_COMMIT, protectedPreviewAuth, protectedPreviewGet,
  protectedPreviewRoute, protectedPreviewIdentity, anonymousPreviewProtection,
  redactPreviewCredential } from './protected-preview-auth.mjs';

const credential = process.env.HEALTHCREST_PREVIEW_OIDC_TOKEN;
const environment = { ...process.env };
for (const key of ['HEALTHCREST_PREVIEW_OIDC_TOKEN', 'GH_TOKEN', 'GITHUB_TOKEN',
  'ACTIONS_ID_TOKEN_REQUEST_TOKEN', 'ACTIONS_ID_TOKEN_REQUEST_URL']) delete process.env[key];
const report = { createdAt: new Date().toISOString(), candidate: PREVIEW_COMMIT,
  origin: PREVIEW_ORIGIN, workflowHead: process.env.GITHUB_SHA,
  workflowRun: process.env.GITHUB_RUN_ID, deploymentId: 7769985368,
  protection: null, identity: null, scenarios: [], cms: { status: 'NOT VERIFIED' },
  accessibility: { automated: 'NOT VERIFIED', actualScreenReader: 'NOT VERIFIED', physicalDevices: 'NOT VERIFIED' },
  legacyDeletion: 'NOT PERFORMED', passed: false };
let browser;
try {
  const auth = protectedPreviewAuth(environment, process.env.HEALTHCREST_RELEASE_ORIGIN,
    process.env.HEALTHCREST_EXPECTED_COMMIT);
  // This unauthenticated request has no browser context/cookies or auth headers.
  const anonymous = await request.newContext();
  try { report.protection = anonymousPreviewProtection(await anonymous.get(PREVIEW_ORIGIN + '/',
    { maxRedirects: 0, timeout: 20000 })); } finally { await anonymous.dispose(); }
  browser = await chromium.launch({ ...(process.env.PLANNER_CHROMIUM_PATH ? {executablePath:process.env.PLANNER_CHROMIUM_PATH} : {}), headless: true });
  for (const width of [320,1280]) for (const version of [1,2,3]) {
    const context = await browser.newContext({viewport:{width,height:900},acceptDownloads:true,serviceWorkers:'block'});
    context.setDefaultTimeout(15000);
    context.setDefaultNavigationTimeout(20000);
    // Only GET/HEAD on this exact Preview receive the short-lived identity.
    await context.route('**/*', route => protectedPreviewRoute(route,auth));
    await context.addInitScript(({version}) => {
      const raw=JSON.stringify({version,selected:'Sleep',drafts:Object.fromEntries(
        ['Fitness','Nutrition','Sleep','Stress'].map(p=>[p,{action:'Synthetic legacy plan',cue:'',support:'',reflection:'Synthetic legacy note',week:null}]))});
      localStorage.setItem('healthcrest.habit-draft.v1',raw);
      window.plannerProbe={raw,writes:[]};
      for(const method of ['setItem','removeItem','clear']) {
        const original=Storage.prototype[method];
        Storage.prototype[method]=function(...args){window.plannerProbe.writes.push({method,key:args[0]});return original.apply(this,args);};
      }
    },{version});
    const page=await context.newPage();
    const response=await page.goto(PREVIEW_ORIGIN+'/next-step?pillar=sleep');
    report.identity=protectedPreviewIdentity(response,PREVIEW_COMMIT);
    const exportButton=page.getByRole('button',{name:'Export all drafts as JSON',exact:true});
    assert.equal(await exportButton.count(),1,'Expected redesigned Planner controls');
    assert.equal(await page.getByText('Exported files are user-managed and unencrypted.',{exact:false}).isVisible(),true);
    await page.getByRole('button',{name:'Restore my plan',exact:true}).click();
    const action=page.getByLabel('One manageable action',{exact:true});
    assert.equal(await action.inputValue(),'Synthetic legacy plan');
    await action.fill('Synthetic Preview private canary');
    await page.getByRole('button',{name:'Restore saved draft',exact:true}).click();
    const keep=page.getByRole('button',{name:'Keep my edits',exact:true});
    await expect(keep).toBeFocused();
    await keep.click();assert.equal(await action.inputValue(),'Synthetic Preview private canary');
    await expect(page.getByRole('button',{name:'Restore saved draft',exact:true})).toBeFocused();
    const pending=page.waitForEvent('download');await exportButton.click();const download=await pending;
    const stream=await download.createReadStream();assert.ok(stream,'JSON download available');
    const chunks=[];for await(const chunk of stream)chunks.push(chunk);const bytes=Buffer.concat(chunks);
    assert.equal(JSON.parse(bytes).drafts.Sleep.action,'Synthetic Preview private canary');
    assert.match(await page.getByRole('status').innerText(),/unencrypted sensitive notes/);
    await page.getByLabel('Choose a Healthcrest backup',{exact:true}).setInputFiles({name:'synthetic-preview.json',mimeType:'application/json',buffer:bytes});
    await page.getByRole('button',{name:'Replace page drafts with backup',exact:true}).click();
    assert.equal(await action.inputValue(),'Synthetic Preview private canary');
    await page.getByRole('button',{name:'Start seven-day plan',exact:true}).click();
    const week=page.waitForEvent('download');await page.getByRole('button',{name:'Export week and all drafts',exact:true}).click();await week;
    const pageErrors=[];page.on('pageerror',error=>pageErrors.push(error.message));
    await page.evaluate(()=>{
      window.reviewExportTransport={create:URL.createObjectURL.bind(URL),append:document.body.appendChild};
      URL.createObjectURL=()=>{throw new Error('synthetic export failure');};
    });
    await exportButton.click();assert.match(await page.getByRole('status').innerText(),/download is unavailable/);
    assert.equal(await action.inputValue(),'Synthetic Preview private canary');
    await page.getByRole('button',{name:'Download my next step',exact:true}).click();
    assert.match(await page.getByRole('status').innerText(),/Text download is unavailable/);
    assert.equal(await action.inputValue(),'Synthetic Preview private canary');
    await page.evaluate(()=>{
      URL.createObjectURL=window.reviewExportTransport.create;
      document.body.appendChild=function(node){
        if(node instanceof HTMLAnchorElement&&node.download)throw new Error('synthetic attachment failure');
        return window.reviewExportTransport.append.call(this,node);
      };
    });
    await page.getByRole('button',{name:'Download my next step',exact:true}).click();
    assert.match(await page.getByRole('status').innerText(),/Text download is unavailable/);
    assert.equal(await action.inputValue(),'Synthetic Preview private canary');
    await page.evaluate(()=>{document.body.appendChild=window.reviewExportTransport.append;});
    assert.deepEqual(pageErrors,[]);
    assert.equal(await page.locator('.hc-plan-unsaved').getAttribute('aria-live'),'polite');
    assert.equal(await page.getByRole('status').count(),1);
    await exportButton.focus();
    for(let i=0;i<8;i++) {
      await page.keyboard.press('Tab');
      assert.equal(await page.evaluate(()=>{const e=document.activeElement;if(!e||e===document.body)return false;const r=e.getBoundingClientRect();return r.width>0&&r.height>0;}),true);
    }
    let prompts=0;page.once('dialog',async d=>{prompts++;await d.dismiss();});
    await page.getByRole('link',{name:'Learn',exact:true}).first().click();
    assert.equal(prompts,1);assert.equal(await action.inputValue(),'Synthetic Preview private canary');
    await page.getByRole('button',{name:'Remove saved plan',exact:true}).click();
    assert.match(await page.getByRole('group',{name:'Remove the saved plan on this browser?',exact:true}).innerText(),/all four habits/);
    await page.getByRole('button',{name:'Keep saved plan',exact:true}).click();
    // No deletion is attempted, including against the synthetic legacy fixture.
    const state=await page.evaluate(()=>({writes:window.plannerProbe.writes,
      preserved:localStorage.getItem('healthcrest.habit-draft.v1')===window.plannerProbe.raw,
      overflow:document.documentElement.scrollWidth>innerWidth}));
    assert.deepEqual(state.writes,[]);assert.equal(state.preserved,true);assert.equal(state.overflow,false);
    report.scenarios.push({width,version,status:'PASS',storageWrites:0,legacyBytesPreserved:true,
      scope:'edit; read-only legacy recovery; restore cancellation/focus; JSON export/integrity/import; week export; JSON and text URL/attachment failures retain edits; removal cancellation only; internal navigation cancellation; keyboard targets; live-region semantics; reflow; export privacy messaging'});
    console.log(`PASS: ${width}px legacy v${version}; zero writes; legacy preserved`);
    await context.close();
  }
  report.accessibility.automated='PASS at stated keyboard/focus/live-region/reflow scope; no hosted axe scan';
  // A single bounded ordinary GET may close the previously unverified live-CMS case.
  const cmsRequest=await request.newContext();
  try {
    const response=await protectedPreviewGet(cmsRequest,PREVIEW_ORIGIN+'/api/presets',{timeout:12000},auth);
    const body=response.status()===200?await response.json():null;
    report.cms={status:response.status()===200&&body?.success===true&&Array.isArray(body.data)?'PASS':'NOT VERIFIED',httpStatus:response.status()};
  } catch { report.cms={status:'NOT VERIFIED',reason:'Bounded live-CMS GET did not establish success'}; }
  finally {await cmsRequest.dispose();}
  report.passed=report.scenarios.length===6&&report.protection?.protected===true&&report.identity===PREVIEW_COMMIT;
} catch(error) {report.error=redactPreviewCredential(error.message,credential);process.exitCode=1;}
finally {
  if(browser)await browser.close();
  await mkdir('artifacts/release-readiness',{recursive:true});
  await writeFile('artifacts/release-readiness/planner-preview.json',redactPreviewCredential(JSON.stringify(report,null,2),credential));
  console.log(JSON.stringify({passed:report.passed,scenarioGroups:report.scenarios.length,cms:report.cms.status}));
}
