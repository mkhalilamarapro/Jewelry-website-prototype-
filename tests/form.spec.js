const {test,expect}=require('@playwright/test');
const path=require('path'),fs=require('fs');
const SITE='file://'+path.resolve(process.env.SITE||path.join(__dirname,'..','index.html'));
const THREE_DIR=path.join(__dirname,'..','node_modules','three');
const LONG=n=>('Ab1 '.repeat(Math.ceil(n/4))).slice(0,n);          // spaced, breakable
const LONG_NOSPACE=n=>'W'.repeat(n);                                // worst case: no break points

test.beforeEach(async({page},info)=>{
  page.__errors=[];page.on('pageerror',e=>page.__errors.push(e.message));
  await page.route('**/fonts.googleapis.com/**',r=>r.fulfill({body:'',contentType:'text/css'}));
  await page.route('**/cdn.jsdelivr.net/npm/three@0.128.0/**',r=>{
    const f=path.join(THREE_DIR,new URL(r.request().url()).pathname.replace('/npm/three@0.128.0/',''));
    fs.existsSync(f)?r.fulfill({path:f,contentType:'text/javascript'}):r.continue()});
  if(!info.title.includes('[no-mock]'))
    await page.addInitScript(()=>{                       // fake Claude page-runtime: slow db so races are visible
      const store={};window.__writes=[];
      window.claude={use:async n=>n=='db'?{collection:()=>({doc:id=>({
        get:async()=>({exists:!!store[id],data:()=>store[id]}),
        set:async d=>{await new Promise(r=>setTimeout(r,120));window.__writes.push(JSON.parse(JSON.stringify(d)));store[id]=d}})})}
        :{id:async()=>'u1',canEdit:async()=>false}}});
});
test.afterEach(async({page})=>{expect(page.__errors,'uncaught page errors').toEqual([])});

const SUBMIT=p=>p.getByRole('button',{name:'Envoyer ma demande'});
const NAME=p=>p.getByPlaceholder('Nom complet'),PHONE=p=>p.getByPlaceholder('Téléphone');
const ENGR=p=>p.getByPlaceholder(/Gravure/),NOTES=p=>p.getByPlaceholder(/inspiration/);
async function open(page){await page.goto(SITE+'#custom');await SUBMIT(page).waitFor()}
const writes=p=>p.evaluate(()=>window.__writes||[]);
const thanks=p=>p.getByRole('heading',{name:/^Merci/});
const overflow=p=>p.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);

test('empty submit is blocked and nothing is saved',async({page})=>{
  await open(page);await SUBMIT(page).click();
  await expect(thanks(page)).toHaveCount(0);expect(await writes(page)).toHaveLength(0);
  await expect(NAME(page)).toBeFocused();
});
test('whitespace-only name/phone is rejected',async({page})=>{
  await open(page);await NAME(page).fill('     ');await PHONE(page).fill('     ');await SUBMIT(page).click();
  await expect(thanks(page)).toHaveCount(0);expect(await writes(page)).toHaveLength(0);
});
test('there is no email field (invalid-email case not applicable to this form)',async({page})=>{
  await open(page);await expect(page.locator('input[type=email]')).toHaveCount(0);
});
for(const bad of ['abc','12','+++','phone: 22 345 678 ok?','22 345 6'])
test(`invalid phone "${bad}" is rejected with a visible error`,async({page})=>{
  await open(page);await NAME(page).fill('Amel Ben Salah');await PHONE(page).fill(bad);await SUBMIT(page).click();
  await expect(thanks(page)).toHaveCount(0);expect(await writes(page)).toHaveLength(0);
  await expect(page.getByRole('alert')).toBeVisible();
});
test('valid submit saves exactly once and shows thanks + WhatsApp link',async({page})=>{
  await open(page);
  await page.getByRole('button',{name:'Or rose',exact:true}).click();
  await page.getByRole('button',{name:'Solitaire',exact:true}).click();
  await ENGR(page).fill('Amel & Sami 2026');await NOTES(page).fill('Bague pour fiançailles');
  await NAME(page).fill('Amel Ben Salah');await PHONE(page).fill('+216 22 345 678');
  await SUBMIT(page).click();
  await expect(thanks(page)).toContainText('Amel Ben Salah');
  const w=await writes(page);expect(w).toHaveLength(1);
  const it=w[0].items[0];expect(it.name).toBe('Amel Ben Salah');expect(it.phone).toBe('+216 22 345 678');
  const d=Object.fromEntries(it.det.map(x=>[x.k,x.v]));
  expect(d['Métal']).toBe('Or rose');expect(d['Modèle']).toBe('Solitaire');expect(d['Gravure']).toBe('Amel & Sami 2026');
  const href=await page.getByRole('link',{name:/WhatsApp/}).getAttribute('href');
  expect(decodeURIComponent(href)).toContain('Amel Ben Salah');
});
test('valid submit without the Claude runtime falls back to WhatsApp [no-mock]',async({page})=>{
  await open(page);await NAME(page).fill('Amel');await PHONE(page).fill('22345678');await SUBMIT(page).click();
  await expect(thanks(page)).toBeVisible();await expect(page.getByText(/Envoyez-la par WhatsApp/)).toBeVisible();
});
test('double submit (double-click) saves once',async({page})=>{
  await open(page);await NAME(page).fill('Amel Ben Salah');await PHONE(page).fill('22345678');
  await SUBMIT(page).dblclick();await expect(thanks(page)).toBeVisible();await page.waitForTimeout(400);
  expect(await writes(page)).toHaveLength(1);
  expect((await writes(page))[0].items).toHaveLength(1);
});
test('double submit (Enter twice) saves once',async({page})=>{
  await open(page);await NAME(page).fill('Amel Ben Salah');await PHONE(page).fill('22345678');
  await PHONE(page).press('Enter');await PHONE(page).press('Enter').catch(()=>{});
  await expect(thanks(page)).toBeVisible();await page.waitForTimeout(400);
  const w=await writes(page);expect(w).toHaveLength(1);expect(w[0].items).toHaveLength(1);
});
for(const [label,gen] of [['spaced text',LONG],['unbroken text',LONG_NOSPACE]])
test(`very long input in every field (${label}) stays bounded and does not break layout`,async({page})=>{
  await open(page);
  for(const f of [NAME(page),PHONE(page),ENGR(page),NOTES(page)]){await f.focus();await page.keyboard.insertText(gen(10000))}
  expect(await overflow(page),'page scrolls sideways while typing').toBeLessThanOrEqual(1);
  const lens=await page.evaluate(()=>[...document.querySelectorAll('.cu input:not([type=date])')].map(i=>i.value.length));
  expect(Math.max(...lens),'no field should accept 10k chars').toBeLessThanOrEqual(500);
  await NAME(page).fill(gen(60));await PHONE(page).fill('22345678');await SUBMIT(page).click();
  await expect(thanks(page)).toBeVisible();
  expect(await overflow(page),'thank-you page overflows').toBeLessThanOrEqual(1);
  const href=await page.getByRole('link',{name:/WhatsApp/}).getAttribute('href');
  expect(href.length,'WhatsApp URL too long').toBeLessThan(2000);
});
test('keyboard-only: every control reachable in order, visible focus, no trap',async({page})=>{
  await open(page);
  const desc=`(e)=>e.tagName+':'+(e.getAttribute('aria-label')||e.placeholder||e.textContent.trim().slice(0,30))`;
  const expected=await page.evaluate(`(()=>{const d=${desc};return [...document.querySelectorAll('a[href],button:not([disabled]),input:not([type=hidden]),select,textarea')].filter(e=>{const r=e.getBoundingClientRect();return r.width>0&&r.height>0&&getComputedStyle(e).visibility!='hidden'&&!e.closest('[hidden]')}).map(d)})()`);
  expected.splice(expected.indexOf('BUTTON:Envoyer ma demande')+1);   // the form ends at its submit button (links after it, e.g. the footer, are outside this walk)
  await page.evaluate(()=>{document.activeElement&&document.activeElement.blur();window.scrollTo(0,0)});
  const seen=[];let guard=0;
  while(guard++<expected.length*4+10){
    await page.keyboard.press('Tab');
    const r=await page.evaluate(`(()=>{const e=document.activeElement,cs=getComputedStyle(e);return {d:(${desc})(e),ring:(cs.outlineStyle!='none'&&parseFloat(cs.outlineWidth)>0)||cs.boxShadow!='none'}})()`);
    if(!seen.length||seen[seen.length-1].d!==r.d)seen.push(r);   // date input has several internal tab stops
    if(r.d==='BUTTON:Envoyer ma demande')break;
  }
  expect(seen.map(s=>s.d)).toEqual(expected);
  expect(seen.filter(s=>!s.ring).map(s=>s.d),'controls with no visible focus indicator').toEqual([]);
  await page.keyboard.press('Tab');                       // must leave the page, not loop on a trap
  expect(await page.evaluate(()=>document.activeElement===document.body||!document.querySelector('main').contains(document.activeElement))).toBeTruthy();
});
test('keyboard-only: complete the whole form without a mouse, focus is never lost',async({page})=>{
  await open(page);
  const act=()=>page.evaluate(()=>{const e=document.activeElement;return e?e.tagName+':'+(e.placeholder||e.textContent.trim().slice(0,30)):''});
  async function tabTo(re,max=80){for(let i=0;i<max;i++){await page.keyboard.press('Tab');if(re.test(await act()))return}throw new Error('could not Tab to '+re)}
  await tabTo(/^BUTTON:Collier$/);await page.keyboard.press('Enter');
  expect(await act(),'focus lost after choosing a piece').toBe('BUTTON:Collier');
  await expect(page.getByText('Longueur',{exact:true})).toBeVisible();
  await tabTo(/^BUTTON:Or rose$/);await page.keyboard.press('Space');
  expect(await act(),'focus lost after choosing a metal').toBe('BUTTON:Or rose');
  await tabTo(/Gravure/);await page.keyboard.type('Amel');
  await page.keyboard.press('Tab');                       // leaving the field fires "change"
  expect(await act(),'focus lost when leaving the engraving field').toMatch(/^SELECT/);
  await tabTo(/Nom complet/);await page.keyboard.type('Amel Ben Salah');
  await page.keyboard.press('Tab');await page.keyboard.type('22345678');
  await tabTo(/Envoyer ma demande/);await page.keyboard.press('Enter');
  await expect(thanks(page)).toContainText('Amel Ben Salah');
  const w=await writes(page);expect(w).toHaveLength(1);
  expect(w[0].items[0].det.find(x=>x.k=='Pièce').v).toBe('Collier');
});
