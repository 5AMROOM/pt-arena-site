const VENUES=[['C','ภาคกลาง · นนทบุรี','14–15 พ.ย. 2569'],['S','ภาคใต้ · สุราษฎร์ธานี','21–22 พ.ย. 2569'],['E','ภาคตะวันออก · ชลบุรี','28–29 พ.ย. 2569'],['N','ภาคเหนือ · แพร่','19–20 ธ.ค. 2569'],['NE','ภาคตะวันออกเฉียงเหนือ · ร้อยเอ็ด','26–27 ธ.ค. 2569']];
const TABS=[['overview','ภาพรวมสนาม','หัวหน้ากรรมการ'],['checkin','เช็กอิน & ตรวจหุ่น','จุดลงทะเบียน'],['judge','กรรมการให้คะแนน','แท็บเล็ตประจำสนาม'],['board','กระดานผล','ทุกคน'],['team','หน้าทีม','มือถือครู/นักเรียน'],['screen','โหมดจอ','ถ้ามีจอในงาน'],['mc','เรียกคิว','พิธีกร'],['admin','ตั้งค่า','แอดมิน']];
// Scoring and the inspection list follow the rule PDFs linked from the registration site; nothing here is our own rule. A mission with "needs" only counts once the missions
// it names are complete ('all' = every mission without "needs"). Retries cost no points; they only break ties.
// "closes": once this mission is scored the listed ones can no longer go up (KidsBiT: yellow is the last box collected).
// "ends": scoring this mission ends the match, so the clock stops (KidsBiT: yellow back at START).
// "ref" and "rules" name the clause each thing comes from; the settings tab shows them so anyone can check against the PDF.
const DEFAULT_COMPS={
  kb:{name:'PT KidsBiT ภารกิจส่งด่วน',tag:'PT KidsBiT',timeLimit:180,rules:{time:'ข้อ 1'},checks:['ใช้หุ่นยนต์ตามรูปแบบในเอกสารกติกา'],missions:[{id:'w',label:'Box ขาว',short:'ขาว',pts:10,max:4,ref:'ข้อ 2'},{id:'k',label:'Box ดำ',short:'ดำ',pts:10,max:4,ref:'ข้อ 2'},{id:'y',label:'Box เหลือง',short:'เหลือง',pts:10,max:1,ref:'ข้อ 2',closes:['w','k'],closeRef:'ข้อ 3'},{id:'yb',label:'Box เหลืองกลับถึง START',short:'เหลือง → START',pts:10,max:1,needs:['y'],ref:'ข้อ 2',ends:true,endRef:'ข้อ 9'}]},
  rs:{name:'หุ่นยนต์กู้ภัยระดับกลาง',tag:'Rescue Robot',timeLimit:180,setup:60,rules:{time:'กติกาการแข่งขัน ข้อ 15',setup:'เวลาที่ต้องใช้ ข้อ 2',stop:'กติกาการแข่งขัน ข้อ 8',best:'กติกาการแข่งขัน ข้อ 16',tie:'กติกาการแข่งขัน ข้อ 16–17',checks:'กฎข้อบังคับหุ่นยนต์ ข้อ 1–6',order:'รูปแบบการแข่งขัน'},checks:['ขนาดเมื่อขยายเต็มที่ไม่เกิน 200 × 200 มม.','ทำงานอัตโนมัติ ไม่มีรีโมทหรือช่องสัญญาณสื่อสาร','ใช้แผงวงจรควบคุมเพียง 1 แผง','แรงดันไฟไม่เกิน 12 V (ชาร์จเต็มไม่เกิน 13.5 V) หรือถ่าน AA ไม่เกิน 8 ก้อน','วัสดุขึ้นรูปมี 2 ด้านไม่เกิน 50 มม.'],missions:[{id:'cp',label:'ผ่านจุด CheckPoint',short:'CheckPoint',unit:'จุด',pts:15,max:2,ref:'ข้อ 15.1'},{id:'drop',label:'ปล่อยถุงยังชีพถูกจุด',short:'ถุงยังชีพ',unit:'จุด',pts:15,max:4,ref:'ข้อ 15.2'},{id:'fin',label:'กลับมาหยุดที่ FINISH',short:'FINISH',unit:'ครั้ง',pts:10,max:1,needs:'all',ref:'ข้อ 15.3'}]},
  dl:{name:'หุ่นยนต์ดิลิฟเวอร์ลี่',tag:'Delivery Robot',timeLimit:180,setup:60,rules:{time:'กติกาการแข่งขัน ข้อ 9',setup:'เวลาที่ต้องใช้ ข้อ 2',stop:'กติกาการแข่งขัน ข้อ 6',best:'กติกาการแข่งขัน ข้อ 10',tie:'กติกาการแข่งขัน ข้อ 10–11',checks:'กฎข้อบังคับหุ่นยนต์ ข้อ 1–6',order:'รูปแบบการแข่งขัน'},checks:['ขนาดไม่เกิน 250 × 250 มม.','ทำงานอัตโนมัติ ไม่มีรีโมทหรือช่องสัญญาณสื่อสาร','ใช้แผงวงจรควบคุมเพียง 1 แผง','แรงดันไฟไม่เกิน 12 V (ชาร์จเต็มไม่เกิน 13.5 V) หรือถ่าน AA ไม่เกิน 8 ก้อน','วัสดุขึ้นรูปมี 2 ด้านไม่เกิน 50 มม.'],missions:[{id:'place',label:'วางวัตถุถูกสี ตั้งตรง',short:'วางถูกสี',unit:'จุด',pts:15,max:6,ref:'ข้อ 9'},{id:'fin',label:'กลับมาหยุดที่ START',short:'START',unit:'ครั้ง',pts:10,max:1,needs:'all',ref:'ข้อ 9'}]},
  dl2:{name:'หุ่นยนต์ดิลิฟเวอร์ลี่',tag:'Delivery Robot',timeLimit:180,setup:60,rules:{time:'กติกาการแข่งขัน ข้อ 12',setup:'เวลาที่ต้องใช้ ข้อ 2',stop:'กติกาการแข่งขัน ข้อ 10',best:'กติกาการแข่งขัน ข้อ 13',tie:'กติกาการแข่งขัน ข้อ 13–14',checks:'กฎข้อบังคับหุ่นยนต์ ข้อ 1–6',order:'รูปแบบการแข่งขัน'},checks:['ขนาดไม่เกิน 250 × 250 มม.','ทำงานอัตโนมัติ ไม่มีรีโมทหรือช่องสัญญาณสื่อสาร','ใช้แผงวงจรควบคุมเพียง 1 แผง','แรงดันไฟไม่เกิน 12 V (ชาร์จเต็มไม่เกิน 13.5 V) หรือถ่าน AA ไม่เกิน 8 ก้อน','วัสดุขึ้นรูปมี 2 ด้านไม่เกิน 50 มม.'],missions:[{id:'cp',label:'ผ่านจุด CheckPoint',short:'CheckPoint',unit:'จุด',pts:10,max:2,ref:'ข้อ 12.1'},{id:'place',label:'วางวัตถุถูกสี ตั้งตรง',short:'วางถูกสี',unit:'จุด',pts:10,max:6,ref:'ข้อ 12.2'},{id:'fin',label:'กลับมาหยุดที่ FINISH',short:'FINISH',unit:'ครั้ง',pts:20,max:1,needs:'all',ref:'ข้อ 12.3'}]}
};
const DEFAULT_CLASSES=[{id:'kb-p',comp:'kb',level:'ประถม',field:'A'},{id:'kb-s',comp:'kb',level:'มัธยม',field:'B'},{id:'rs-p',comp:'rs',level:'ประถม',field:'C'},{id:'rs-s',comp:'rs',level:'มัธยม',field:'D'},{id:'dl-p',comp:'dl',level:'ประถม',field:'E'},{id:'dl-m',comp:'dl2',level:'ม.ต้น',field:'F'},{id:'dl-h',comp:'dl2',level:'ม.ปลาย',field:'G'}];
const NAMES=['Falcon','Nova','Titan','Spark','Orbit','Pixel','Volt','Comet','Atlas','Echo','Bolt','Zenith','Rocket','Gear','Byte','Quantum','Vector','Nimbus','Turbo','Matrix','Blaze','Photon','Circuit','Kite','Delta','Raptor','Lynx','Helix','Cobalt','Aero','Sonic','Ion','Radar','Prism','Nexus','Flux','Apex','Storm','Jet','Onyx','Polar','Ranger'];
const SCHOOLS=['โรงเรียนอรุณวิทยา','โรงเรียนดาวเหนือพิทยาคม','โรงเรียนศรีนครศึกษา','โรงเรียนบ้านคลองใหม่','โรงเรียนวังทองวิทยา','โรงเรียนสายรุ้งศึกษา','โรงเรียนชัยพฤกษ์วิทยา','โรงเรียนปทุมทองวิทยา','โรงเรียนเกษมพัฒนา','โรงเรียนราชพฤกษ์วิทยา','โรงเรียนน้ำใสพิทยา','โรงเรียนทุ่งทองศึกษา'];

const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function rng(seed){return()=>{seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
const hm=m=>String(Math.floor(m/60)).padStart(2,'0')+':'+String(m%60).padStart(2,'0');
const nowHM=()=>{const d=new Date();return hm(d.getHours()*60+d.getMinutes())};
// 00:00.00 = minutes : seconds . hundredths, cut (not rounded) so the clock never shows a time that has not happened yet
const fmtMs=ms=>{const cs=Math.max(0,Math.floor(ms/10)),p=n=>String(n).padStart(2,'0');return p(Math.floor(cs/6000))+':'+p(Math.floor(cs%6000/100))+'.'+p(cs%100)};

let S;
function seed(){
  const r=rng(2026);
  const comps=JSON.parse(JSON.stringify(DEFAULT_COMPS)),classes=JSON.parse(JSON.stringify(DEFAULT_CLASSES));
  const teams=[],runs=[],order={};let n=0,minute=7*60+40,ts=0;
  const mk=(t,round,comp)=>{const items={};comp.missions.forEach(m=>items[m.id]=Math.min(m.max,Math.floor(r()*(m.max+1.6))));tidy(comp,items);
    return{id:(++ts,t.id+'_'+round),team:t.id,round,items,pen:r()<.3?1:0,ms:Math.round((55+r()*(comp.timeLimit-60))*1000),at:hm(9*60+ts*2),ts,edits:0}};
  classes.forEach((c,ci)=>{order[c.id]=[];
    for(let i=0;i<6;i++){n++;const id='C'+String(n).padStart(3,'0');
      const t={id,name:'ทีม '+NAMES[n-1],school:SCHOOLS[(n*5)%SCHOOLS.length],cls:c.id,checkin:null,inspect:null};
      if(i<5){t.checkin=hm(minute+=1);t.inspect={result:'pass',at:hm(minute+4),by:'จุดตรวจ 1'}}
      if(c.id==='rs-s'&&i===4)t.inspect={result:'fail',at:hm(minute+4),by:'จุดตรวจ 2',note:'ความสูงเกินกำหนด 2 ซม.'};
      if(c.id==='dl-h'&&i===3)t.inspect=null;
      teams.push(t);order[c.id].push(id);
      const done=c.id==='dl-p'?5:(ci%2?3:2);
      if(t.inspect?.result==='pass'&&i<done)runs.push(mk(t,1,comps[c.comp]));
    }});
  teams.filter(t=>t.cls==='dl-p').slice(0,2).forEach(t=>runs.push(mk(t,2,comps.dl)));
  return{venue:'C',rounds:2,pin:'1234',staffPin:'2026',comps,classes,teams,runs,order,timers:{},ts,
    ui:{view:'overview',field:'A',boardCls:'kb-p',teamQuery:'C004',ckFilter:'all',ckQuery:'',openInspect:null,form:null,pinFor:null,screenIdx:0,adminMsg:'',resetAsk:false}};
}
S=seed();
// With firebase-config.js present the data comes from Firestore (sync.js); without it, from this browser only.
const CLOUD=!!window.PT_FIREBASE;let READY=!CLOUD,CLOUD_STAFF=false;
if(CLOUD){S.teams=[];S.runs=[];S.classes.forEach(c=>S.order[c.id]=[])}
function cloudReady(){READY=true;render()}
if(CLOUD)setTimeout(()=>{if(!READY)$('#view').innerHTML='<div class="panel"><h2>โหลดข้อมูลไม่ได้</h2><ol style="margin:0;padding-left:20px"><li>เช็กว่าต่อเน็ตอยู่</li><li>รีเฟรชหน้านี้</li></ol></div>'},12000);

/* ---------- storage: shared data lives in this browser for now (ui state stays per tab) ---------- */
const KEY='ptarena:v1';
// comps (the scoring) is deliberately not saved: it always comes from the code, so it cannot drift from the rules
const DATA_KEYS=['venue','rounds','pin','staffPin','classes','teams','runs','order','timers','ts'];
// saved classes only decide which field each class plays on; everything else about a class comes from the code
const withFields=saved=>DEFAULT_CLASSES.map(c=>({...c,field:((saved||[]).find(x=>x.id===c.id)||c).field}));
let lastSaved='';
function save(){if(CLOUD){window.PT_BACKEND?.push();return}const d={};DATA_KEYS.forEach(k=>d[k]=S[k]);const j=JSON.stringify(d);if(j===lastSaved)return;lastSaved=j;try{localStorage.setItem(KEY,j)}catch(e){}}
function load(j){try{const d=JSON.parse(j);if(!d||!Array.isArray(d.teams)||!Array.isArray(d.runs))return false;DATA_KEYS.forEach(k=>{if(k in d)S[k]=d[k]});S.classes=withFields(S.classes);lastSaved=j;return true}catch(e){return false}}
if(!CLOUD)try{load(localStorage.getItem(KEY))}catch(e){}
window.addEventListener('storage',e=>{if(!CLOUD&&e.key===KEY&&e.newValue&&load(e.newValue))remoteChanged()});
// Data changed on another tab or device: drop ui state that points at things now gone, redraw unless someone is mid-entry.
function remoteChanged(){
  const ui=S.ui,f=ui.form;
  if(f&&(!team(f.teamId)||(f.editRunId&&!S.runs.some(x=>x.id===f.editRunId))))ui.form=null;
  if(ui.openInspect&&!team(ui.openInspect))ui.openInspect=null;
  if(ui.pinFor&&!S.runs.some(x=>x.id===ui.pinFor))ui.pinFor=null;
  const typing=/^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement?.tagName||'');
  if(!ui.openInspect&&!ui.pinFor&&!typing)render();
}

const cls=id=>S.classes.find(c=>c.id===id);
const team=id=>S.teams.find(t=>t.id===id);
const compOf=clsId=>S.comps[cls(clsId).comp];
const clsName=(c,short)=>{const cp=S.comps[c.comp];return(short?cp.tag:cp.name)+' · '+c.level};
const clsOfField=f=>S.classes.find(c=>c.field===f);
const fieldsSorted=()=>[...S.classes].sort((a,b)=>a.field.localeCompare(b.field));
function needIds(c,m){return m.needs==='all'?c.missions.filter(x=>!x.needs).map(x=>x.id):m.needs||[]}
function needsMet(c,items,m){return needIds(c,m).every(id=>{const x=c.missions.find(y=>y.id===id);return x&&(items[id]||0)>=x.max})}
function tidy(c,items){c.missions.forEach(m=>{if(!needsMet(c,items,m))items[m.id]=0})}
const closedBy=(c,items,m)=>c.missions.find(x=>x.closes&&x.closes.includes(m.id)&&(items[x.id]||0)>0);
const needText=(c,m)=>m.needs==='all'?'ภารกิจอื่น':needIds(c,m).map(id=>c.missions.find(x=>x.id===id)?.label).join(', ');
function score(run){const t=team(run.team);if(!t)return 0;const c=compOf(t.cls);let s=0;c.missions.forEach(m=>s+=Math.min(run.items[m.id]||0,m.max)*m.pts);return s}
const runOf=(tid,r)=>S.runs.find(x=>x.team===tid&&x.round===r);
function best(tid){const rs=S.runs.filter(r=>r.team===tid);if(!rs.length)return null;return rs.map(r=>({run:r,score:score(r)})).sort((a,b)=>b.score-a.score||a.run.ms-b.run.ms||a.run.pen-b.run.pen)[0]}
function standings(clsId){
  const rows=S.teams.filter(t=>t.cls===clsId).map(t=>({t,b:best(t.id)}));
  rows.sort((a,b)=>{if(!a.b&&!b.b)return 0;if(!a.b)return 1;if(!b.b)return -1;return b.b.score-a.b.score||a.b.run.ms-b.b.run.ms||a.b.run.pen-b.b.run.pen});
  rows.forEach((r,i)=>r.rank=r.b?i+1:null);return rows;
}
const eligible=clsId=>(S.order[clsId]||[]).map(team).filter(t=>t&&t.inspect?.result==='pass');
function curRound(clsId){const el=eligible(clsId);if(!el.length)return null;for(let r=1;r<=S.rounds;r++)if(el.some(t=>!runOf(t.id,r)))return r;return null}
function queue(clsId){const r=curRound(clsId);if(!r)return[];return eligible(clsId).filter(t=>!runOf(t.id,r))}

function toast(msg){const t=$('#toast');t.textContent=msg;t.classList.add('on');clearTimeout(toast.h);toast.h=setTimeout(()=>t.classList.remove('on'),2400)}

/* ---------- roles: the link decides what a device sees (#staff, #judge-A, #timer-A, #screen, #mc, none = viewers) ---------- */
const ROLE_TABS={view:['team','board'],judge:['judge','board'],timer:['timer'],screen:['screen'],mc:['mc','board'],staff:TABS.map(t=>t[0])};
const STAFF_KEY='ptarena:staffcode',MYTEAM_KEY='ptarena:myteam';
let ROLE='view',LOCK=null;
function readHash(){
  const h=decodeURIComponent(location.hash.slice(1)).trim(),m=/^(judge|timer)-(.+)$/i.exec(h);
  if(m){ROLE=m[1].toLowerCase();LOCK=m[2].toUpperCase()}else{LOCK=null;ROLE=h==='staff'||h==='screen'||h==='mc'?h:'view'}
  if(ROLE!=='staff'){let q='';try{q=localStorage.getItem(MYTEAM_KEY)||''}catch(e){}S.ui.teamQuery=q}
}
const staffOk=()=>{if(CLOUD)return CLOUD_STAFF;try{return localStorage.getItem(STAFF_KEY)===S.staffPin}catch(e){return false}};
const keepStaff=()=>{if(CLOUD)return;try{localStorage.setItem(STAFF_KEY,S.staffPin)}catch(e){}};
const needGate=()=>(ROLE==='judge'||ROLE==='timer'||ROLE==='staff')&&!staffOk();
const rememberTeam=q=>{if(ROLE!=='staff')try{localStorage.setItem(MYTEAM_KEY,q)}catch(e){}};
// slash = hidden, open eye = shown
const eyeIcon=shown=>`<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="display:block"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>${shown?'':'<path d="M4 4l16 16"/>'}</svg>`;
function vGate(){return`<div class="panel" style="max-width:420px;margin:0 auto;width:100%"><h2>สำหรับเจ้าหน้าที่</h2>
  <div class="row"><input type="password" id="sc" placeholder="รหัสเจ้าหน้าที่" autocapitalize="none" autocomplete="off" autocorrect="off" spellcheck="false" style="flex:1"><button class="btn" data-act="eye" aria-label="แสดงรหัส" aria-pressed="false" style="padding:7px 10px">${eyeIcon(false)}</button><button class="btn pri" data-act="gate">เข้า</button></div></div>`}
window.addEventListener('hashchange',()=>{readHash();window.PT_BACKEND?.role?.();render()});

/* ---------- shell ---------- */
function renderShell(){
  const tabs=needGate()?[]:TABS.filter(t=>ROLE_TABS[ROLE].includes(t[0]));
  $('#venue').innerHTML=VENUES.map(v=>`<option value="${v[0]}" ${v[0]===S.venue?'selected':''}>${v[1]} · ${v[2]}</option>`).join('');
  $('#venue').disabled=ROLE!=='staff'||needGate();
  $('#demo').hidden=ROLE!=='staff'||needGate();
  // viewers and judges do not pick the venue: they get its name, and on a phone their few tabs sit at the thumb
  const staff=ROLE==='staff'&&!needGate(),few=tabs.length>1&&tabs.length<=3;
  $('.venue').hidden=!staff;$('#sub').textContent=staff?'ระบบวันแข่ง':VENUES.find(v=>v[0]===S.venue)[1];
  $('.tabs-wrap').classList.toggle('few',few);document.body.classList.toggle('hasnav',few);
  $('.tabs-wrap').hidden=tabs.length<2;
  $('#tabs').innerHTML=tabs.map(t=>`<button class="tab" role="tab" data-act="tab" data-v="${t[0]}" aria-selected="${S.ui.view===t[0]}"><b>${t[1]}</b><small>${t[2]}</small></button>`).join('');
}
function render(){
  if(!READY){$('#view').innerHTML='<p class="muted">กำลังโหลด…</p>';return}
  if(!ROLE_TABS[ROLE].includes(S.ui.view))S.ui.view=ROLE_TABS[ROLE][0];
  renderShell();
  if(needGate()){$('#view').innerHTML=vGate();return}
  if(LOCK&&!clsOfField(LOCK)){$('#view').innerHTML=`<div class="panel"><h2>ไม่พบสนาม ${esc(LOCK)}</h2><p class="muted">ขอลิงก์ใหม่จากแอดมิน</p></div>`;return}
  if(LOCK)S.ui.field=LOCK;
  if(!clsOfField(S.ui.field))S.ui.field=fieldsSorted()[0].field;
  const v=S.ui.view;
  syncRec();
  // in full screen only the inside is swapped: replacing the element itself would drop out of full screen
  const fs=document.fullscreenElement;
  if(S.ui.view==='screen'&&fs&&fs.id==='stage'){const tmp=document.createElement('div');tmp.innerHTML=vScreen();fs.innerHTML=tmp.querySelector('#stage').innerHTML;clock();return}
  const map={overview:vOverview,checkin:vCheckin,judge:vJudge,timer:vTimer,board:vBoard,team:vTeam,screen:vScreen,mc:vMc,admin:vAdmin};
  $('#view').innerHTML=map[v]();if(v==='checkin')renderCkList();if(v==='judge')tickSW();if(v==='timer')timerAfter();if(v==='screen')clock();}

/* ---------- overview ---------- */
function vOverview(){
  const tot=S.teams.length,ci=S.teams.filter(t=>t.checkin).length,ok=S.teams.filter(t=>t.inspect?.result==='pass').length;
  const expect=S.classes.reduce((a,c)=>a+eligible(c.id).length*S.rounds,0);
  const cards=fieldsSorted().map(c=>{
    const q=queue(c.id),r=curRound(c.id),el=eligible(c.id);
    const done=S.runs.filter(x=>team(x.team)?.cls===c.id).length,need=el.length*S.rounds;
    let chip=q.length?`<span class="pill ok">กำลังแข่ง · รอบ ${r}</span>`:(el.length?`<span class="pill ac">แข่งครบแล้ว</span>`:`<span class="pill warn">ยังไม่มีทีมพร้อม</span>`);
    return`<button class="fcard" data-act="gojudge" data-f="${c.field}">
      <div class="row between"><span class="fletter">สนาม ${c.field}</span>${chip}</div>
      <div class="fclass">${esc(clsName(c))}</div>
      <div class="kv"><span>ในสนาม</span><span>${q[0]?`<span class="tid">${q[0].id}</span> ${esc(q[0].name)}`:'—'}</span><span>ถัดไป</span><span>${q[1]?`<span class="tid">${q[1].id}</span> ${esc(q[1].name)}`:'—'}</span></div>
      <div class="bar"><i style="width:${need?Math.round(done/need*100):0}%"></i></div>
      <div class="small muted">ส่งคะแนนแล้ว <span class="mono">${done}/${need}</span> รอบ</div></button>`}).join('');
  const feed=[...S.runs].sort((a,b)=>b.ts-a.ts).slice(0,7).map(x=>{const t=team(x.team);if(!t)return'';const c=cls(t.cls);
    return`<div><span class="mono">${x.at}</span><span>สนาม ${c.field} · <span class="tid">${t.id}</span> รอบ ${x.round} · <b class="mono">${score(x)}</b> คะแนน${x.edits?' <span class="pill warn">แก้ไขแล้ว</span>':''}</span></div>`}).join('');
  const watch=S.teams.filter(t=>!t.checkin||t.inspect?.result==='fail'||(t.checkin&&!t.inspect)).map(t=>`<div class="qitem"><span class="tid">${t.id}</span><span style="flex:1;min-width:0">${esc(t.name)}<br><small class="muted">${esc(clsName(cls(t.cls),true))}</small></span>${!t.checkin?'<span class="pill warn">ยังไม่เช็กอิน</span>':t.inspect?.result==='fail'?'<span class="pill bad">ตรวจไม่ผ่าน</span>':'<span class="pill">รอตรวจหุ่น</span>'}</div>`).join('');
  return`<div class="grid">
    <div class="stats">
      <div class="stat"><div class="k">ทีมทั้งหมด</div><div class="v">${tot}</div></div>
      <div class="stat"><div class="k">เช็กอินแล้ว</div><div class="v">${ci}<small> / ${tot}</small></div></div>
      <div class="stat"><div class="k">ผ่านตรวจหุ่น</div><div class="v">${ok}<small> / ${tot}</small></div></div>
      <div class="stat"><div class="k">คะแนนที่ส่งแล้ว</div><div class="v">${S.runs.length}<small> / ${expect} รอบ</small></div></div>
    </div>
    <div class="grid g-side">
      <div class="grid" style="align-content:start"><div class="row between"><h2>ทุกสนามในจอเดียว</h2><span class="small muted">กดการ์ดเพื่อเปิดหน้ากรรมการของสนามนั้น</span></div><div class="fields">${cards}</div></div>
      <div class="grid" style="align-content:start">
        <div class="panel"><h3>คะแนนล่าสุด</h3><div class="feed">${feed||'<span class="muted">ยังไม่มีคะแนน</span>'}</div></div>
        <div class="panel"><h3>ทีมที่ต้องติดตาม</h3><div>${watch||'<span class="muted small">ทุกทีมพร้อมแข่ง</span>'}</div></div>
      </div>
    </div></div>`;
}

/* ---------- check-in ---------- */
function vCheckin(){
  const c=k=>S.teams.filter(k).length;
  const F=[['all','ทั้งหมด',c(()=>1)],['notin','ยังไม่เช็กอิน',c(t=>!t.checkin)],['wait','รอตรวจหุ่น',c(t=>t.checkin&&!t.inspect)],['pass','ผ่าน',c(t=>t.inspect?.result==='pass')],['fail','ไม่ผ่าน',c(t=>t.inspect?.result==='fail')]];
  return`<div class="panel">
    <div class="row between"><h2>เช็กอินและตรวจหุ่น</h2><span class="small muted">ของจริงสแกน QR ของ Team ID ได้ หรือพิมพ์ค้นหา</span></div>
    <div class="row"><input type="text" id="ckq" placeholder="ค้นหา Team ID ชื่อทีม หรือโรงเรียน" value="${esc(S.ui.ckQuery)}" style="flex:1 1 240px"></div>
    <div class="chips">${F.map(f=>`<button class="chip" data-act="ckf" data-v="${f[0]}" aria-pressed="${S.ui.ckFilter===f[0]}">${f[1]} <b>${f[2]}</b></button>`).join('')}</div>
    <div class="list" id="cklist"></div></div>`;
}
function renderCkList(){
  const q=S.ui.ckQuery.trim().toLowerCase(),f=S.ui.ckFilter;
  const rows=S.teams.filter(t=>{
    if(f==='notin'&&t.checkin)return false;if(f==='wait'&&!(t.checkin&&!t.inspect))return false;
    if(f==='pass'&&t.inspect?.result!=='pass')return false;if(f==='fail'&&t.inspect?.result!=='fail')return false;
    return!q||(t.id+' '+t.name+' '+t.school).toLowerCase().includes(q)});
  $('#cklist').innerHTML=rows.map(t=>{
    const c=cls(t.cls);
    let st=!t.checkin?'<span class="pill warn">ยังไม่เช็กอิน</span>':`<span class="pill ok">เช็กอิน ${t.checkin}</span>`;
    if(t.inspect)st+=t.inspect.result==='pass'?` <span class="pill ok">ตรวจผ่าน ${t.inspect.at}</span>`:` <span class="pill bad">ไม่ผ่าน: ${esc(t.inspect.note||'')}</span>`;
    else if(t.checkin)st+=' <span class="pill">รอตรวจหุ่น</span>';
    const act=!t.checkin?`<button class="btn pri sm" data-act="checkin" data-id="${t.id}">เช็กอิน</button>`:`<button class="btn sm" data-act="insp" data-id="${t.id}">${t.inspect?'ตรวจซ้ำ':'ตรวจหุ่น'}</button>`;
    const open=S.ui.openInspect===t.id?`<div class="inspect" data-insp="${t.id}">
      <h3>ตรวจหุ่น ${t.id} · ${esc(compOf(t.cls).name)} ${esc(c.level)}</h3>
      ${(compOf(t.cls).checks||[]).map((k,i)=>`<label><input type="checkbox" id="ck-${t.id}-${i}" data-chk> ${k}</label>`).join('')}
      <div class="row"><input type="text" id="n-${t.id}" placeholder="หมายเหตุ (ถ้าไม่ผ่าน ระบุเหตุผล)" style="flex:1 1 220px"></div>
      <div class="row"><button class="btn okb" data-act="ipass" data-id="${t.id}">ผ่าน · ติดสติกเกอร์</button><button class="btn badb" data-act="ifail" data-id="${t.id}">ไม่ผ่าน</button><button class="btn" data-act="iclose">ยกเลิก</button></div></div>`:'';
    return`<div class="li"><span class="tid">${t.id}</span><div class="who"><b>${esc(t.name)}</b><small>${esc(t.school)} · ${esc(clsName(c,true))} · สนาม ${c.field}</small></div><div class="row">${st}</div>${act}${open}</div>`}).join('')||'<p class="muted">ไม่พบทีมที่ตรงกับการค้นหา</p>';
}

/* ---------- judge ---------- */
function newForm(t,round,field){const c=compOf(t.cls);const items={};c.missions.forEach(m=>items[m.id]=0);return{field,teamId:t.id,round,items,pen:0,ms:0,startAt:null,confirm:false,editRunId:null}}
function ensureForm(){
  const c=clsOfField(S.ui.field),q=queue(c.id),f=S.ui.form;
  if(f&&f.editRunId&&f.field===S.ui.field)return f;
  if(!q.length){S.ui.form=null;return null}
  if(!f||f.field!==S.ui.field||f.teamId!==q[0].id)S.ui.form=newForm(q[0],curRound(c.id),S.ui.field);
  return S.ui.form;
}
/* One clock per field, shared by the judge's phone and the timer laptop. Whoever starts it stamps its own clock;
   other devices shift that by SKEW (their clock minus the sender's, measured when a live update arrives). */
let DEVICE;try{DEVICE=sessionStorage.getItem('ptarena:device')||Math.random().toString(36).slice(2,8);sessionStorage.setItem('ptarena:device',DEVICE)}catch(e){DEVICE=Math.random().toString(36).slice(2,8)}
let SKEW=0;
const timerOf=field=>S.timers[field]||{state:'idle',ms:0};
const tElapsed=t=>t.state==='run'?Math.max(0,Date.now()-t.startAt-(t.by===DEVICE?0:SKEW)):t.ms||0;
const limitOf=field=>S.comps[clsOfField(field).comp].timeLimit*1000;
function tStart(field){
  const c=clsOfField(field),q=queue(c.id),t=timerOf(field);if(!q.length)return false;
  // a stopped clock stays until the judge submits or resets, so a stray press cannot wipe a result
  if(t.state!=='idle'&&t.team===q[0].id&&t.round===curRound(c.id))return false;
  const same=t.team===q[0].id&&t.round===curRound(c.id);
  S.timers[field]={state:'run',team:q[0].id,round:curRound(c.id),startAt:Date.now(),sentAt:Date.now(),by:DEVICE,ms:0,live:same&&t.live||null,ev:same&&t.ev||null};return true}
function tStop(field,ms){const t=timerOf(field);if(t.state!=='run')return false;
  // kept to the hundredth that is shown, so two times that look equal are equal when ranking
  S.timers[field]={...t,state:'stop',ms:Math.floor(Math.min(ms??tElapsed(t),limitOf(field))/10)*10,sentAt:Date.now()};return true}
function tReset(field){S.timers[field]={state:'idle',ms:0}}
// The judge's taps ride on the field clock, so the timer laptop and the big screen show the score as it happens.
// ev is the last tap (what was scored), n makes each one distinct for the on-screen pop.
function liveSync(f,ev){
  if(f.editRunId)return;let t=timerOf(f.field);
  if(t.team&&(t.team!==f.teamId||t.round!==f.round))t={state:'idle',ms:0};
  S.timers[f.field]={...t,team:f.teamId,round:f.round,live:{items:{...f.items},pen:f.pen},ev:ev?{...ev,n:(t.ev?.n||0)+1}:t.ev||null};
}
function liveScore(field){
  const t=timerOf(field),tm=t.live&&team(t.team);if(!tm)return null;
  let s=0;compOf(tm.cls).missions.forEach(m=>s+=Math.min(t.live.items[m.id]||0,m.max)*m.pts);return s}
// the device that started the clock ends the match at the time limit
function autoStop(){
  const field=ROLE==='timer'?LOCK:S.ui.view==='judge'?S.ui.field:null;if(!field||!READY||!clsOfField(field))return;
  const t=timerOf(field);if(t.state==='run'&&t.by===DEVICE&&tElapsed(t)>=limitOf(field)){tStop(field,limitOf(field));save();render()}}
const liveT=f=>{const t=timerOf(f.field);return!f.editRunId&&t.state!=='idle'&&t.team===f.teamId&&t.round===f.round?t:null};
const elapsed=f=>{const t=liveT(f);return t&&t.state==='run'?tElapsed(t):f.ms};
function formTotal(f){const t=team(f.teamId);const c=compOf(t.cls);let s=0;c.missions.forEach(m=>s+=(f.items[m.id]||0)*m.pts);return s}
function vJudge(){
  const c=clsOfField(S.ui.field),f=ensureForm(),cp=S.comps[c.comp],q=queue(c.id);
  const T=f&&liveT(f),running=!!T&&T.state==='run';if(T&&T.state==='stop'&&!f.manual)f.ms=T.ms;
  const fieldChips=fieldsSorted().map(x=>`<button class="chip" data-act="field" data-f="${x.field}" aria-pressed="${x.field===S.ui.field}"><b>${x.field}</b> ${esc(S.comps[x.comp].tag)} ${esc(x.level)}</button>`).join('');
  let form;
  if(!f){form=`<div class="panel"><h2>${eligible(c.id).length?'สนามนี้แข่งครบทุกรอบแล้ว':'ยังไม่มีทีมที่ผ่านการตรวจหุ่น'}</h2><p class="muted">${eligible(c.id).length?'ไปดูอันดับได้ที่แท็บกระดานผล':'ทีมต้องเช็กอินและผ่านการตรวจหุ่นก่อน จึงจะขึ้นคิวในสนามนี้'}</p></div>`}
  else{const t=team(f.teamId),el=elapsed(f),lim=cp.timeLimit;
    // phone first: the clock stays on top and the total with the send button stays at the bottom while the missions scroll
    const row=m=>{const n=f.items[m.id]||0,shut=closedBy(cp,f.items,m),ok=needsMet(cp,f.items,m)&&!shut;
      const ctl=m.max===1
        ?`<button class="jtog ${n?'on':''}" data-act="${n?'dec':'inc'}" data-m="${m.id}" aria-pressed="${!!n}" ${ok||n?'':'disabled'}>${n?'✓ ได้':'ยังไม่ได้'}</button>`
        :`<div class="jstep"><button data-act="dec" data-m="${m.id}" aria-label="ลด" ${n?'':'disabled'}>−</button><span><b>${n}</b>/${m.max}</span><button data-act="inc" data-m="${m.id}" aria-label="เพิ่ม" ${ok&&n<m.max?'':'disabled'}>+</button></div>`;
      return`<div class="jm ${n?'has':''} ${ok?'':'lock'}"><div class="lbl"><b>${esc(m.label)}</b><small>${m.unit||'ชิ้น'}ละ ${m.pts}${m.needs?` · หลัง${esc(needText(cp,m))}ครบ`:''}${shut?` · ปิดแล้ว เพราะเก็บ ${esc(shut.label)} แล้ว`:''}</small></div>${ctl}<div class="sub">${n*m.pts}</div></div>`};
    form=`<div class="panel jsheet">
      ${f.editRunId?`<div class="editbar"><span>กำลังแก้คะแนนที่ส่งแล้ว · ระบบเก็บประวัติไว้</span><button class="btn sm" data-act="canceledit">ยกเลิก</button></div>`:''}
      <div class="jtop"><div class="jwho"><div class="small muted">สนาม ${c.field} · ${esc(S.comps[c.comp].tag)} ${esc(c.level)} · รอบ ${f.round}/${S.rounds}</div><div class="jteam"><span class="tid">${t.id}</span> ${esc(t.name)}</div><div class="small muted">${esc(t.school)}</div></div>
        <div class="jclock"><span class="t mono ${running?'run':''} ${el>lim*1000?'over':''}" id="sw">${fmtMs(el)}</span><div class="small muted">จาก ${Math.floor(lim/60)}:${String(lim%60).padStart(2,'0')}</div></div></div>
      <div class="jtimer">
        ${running?`<button class="btn big jmain stop" data-act="swstop">■ หยุดเวลา</button>`:T||f.editRunId?'':`<button class="btn pri big jmain" data-act="swstart">▶ เริ่มจับเวลา</button>`}
        <button class="btn" data-act="swreset">รีเซ็ต</button><button class="btn" data-act="swgiveup">ทีมขอหยุด</button>
        ${cp.setup&&!T&&!f.editRunId?`<button class="btn" data-act="setup"><span id="su">${f.setupEnd?'ตั้งหุ่น …':'ตั้งหุ่น '+Math.floor(cp.setup/60)+':'+String(cp.setup%60).padStart(2,'0')}</span></button>`:''}
        <details class="jedit"><summary>แก้เวลาเอง</summary><span class="row small"><label for="mt">วินาที</label><input type="number" id="mt" inputmode="decimal" step="0.01" min="0" style="width:110px" value="${(f.ms/1000).toFixed(2)}"></span></details>
      </div>
      <div class="jlist">${cp.missions.map(row).join('')}
        <div class="jm retry"><div class="lbl"><b>Retry</b><small>ไม่หักคะแนน</small></div><div class="jstep"><button data-act="pdec" aria-label="ลด" ${f.pen?'':'disabled'}>−</button><span><b>${f.pen}</b></span><button data-act="pinc" aria-label="เพิ่ม">+</button></div><div class="sub muted small">ครั้ง</div></div></div>
      <div class="jbar"><div class="jsum"><span class="small muted">รวม</span><b class="n">${formTotal(f)}</b></div>
        <label class="jok ${f.confirm?'on':''}"><input type="checkbox" id="cf" ${f.confirm?'checked':''}> ทีมยืนยัน</label>
        <button class="btn pri big" data-act="submit" ${f.confirm?'':'disabled'}>${f.editRunId?'บันทึก':'ส่งคะแนน'}</button></div>
      ${f.editRunId?'':`<div class="jskip"><button class="btn sm" data-act="skip">ทีมไม่มา · ข้ามคิว</button></div>`}
    </div>`}
  const qhtml=q.map((t,i)=>`<div class="qitem ${i===0?'now':''}"><span class="qn">${i+1}</span><span class="tid">${t.id}</span><span style="flex:1;min-width:0">${esc(t.name)}</span>${i===0?'<span class="pill ac">ในสนาม</span>':''}</div>`).join('');
  const done=S.runs.filter(x=>team(x.team)?.cls===c.id).sort((a,b)=>b.ts-a.ts);
  const dhtml=done.map(x=>{const t=team(x.team);return`<div class="qitem" style="flex-wrap:wrap"><span class="tid">${t.id}</span><span style="flex:1;min-width:0">รอบ ${x.round} · <b class="mono">${score(x)}</b> · <span class="mono muted">${fmtMs(x.ms)}</span>${x.edits?` <span class="pill warn">แก้ ${x.edits} ครั้ง</span>`:''}</span>
    ${S.ui.pinFor===x.id?`<span class="row" style="width:100%"><input type="password" id="pin" inputmode="numeric" placeholder="PIN หัวหน้ากรรมการ" style="width:150px"><button class="btn sm pri" data-act="pinok" data-id="${x.id}">แก้คะแนน</button><button class="btn sm" data-act="pincancel">ยกเลิก</button></span>`:`<button class="btn sm" data-act="editask" data-id="${x.id}">แก้</button>`}</div>`}).join('');
  return`<div class="grid">
    ${LOCK?'':`<div class="chips fchips">${fieldChips}</div><select id="fsel" class="fsel" aria-label="เลือกสนาม">${fieldsSorted().map(x=>`<option value="${x.field}" ${x.field===S.ui.field?'selected':''}>สนาม ${x.field} · ${esc(S.comps[x.comp].tag)} ${esc(x.level)}</option>`).join('')}</select>`}
    <div class="grid g-side">${form}
      <div class="grid" style="align-content:start">
        <div class="panel"><h3>คิวสนาม ${c.field}${curRound(c.id)?' · รอบ '+curRound(c.id):''}</h3><div>${qhtml||'<span class="muted small">ไม่มีทีมรอคิว</span>'}</div></div>
        <div class="panel"><h3>ส่งคะแนนแล้ว</h3><p class="small muted" style="margin:0">ส่งแล้วคะแนนจะล็อก แก้ได้เฉพาะหัวหน้ากรรมการ${ROLE==='staff'?` (PIN ตัวอย่าง: ${S.pin})`:''}</p><div>${dhtml||'<span class="muted small">ยังไม่มี</span>'}</div></div>
      </div></div></div>`;
}
function tickSW(){const f=S.ui.form,el=$('#sw');if(!f||!el)return;const ms=elapsed(f);el.textContent=fmtMs(ms);const lim=compOf(team(f.teamId).cls).timeLimit*1000;el.classList.toggle('over',ms>lim);
  const su=$('#su');if(su&&f.setupEnd){const left=f.setupEnd-Date.now();su.textContent=left>0?'ตั้งหุ่น '+fmtMs(left):'หมดเวลาตั้งหุ่น';su.classList.toggle('over',left<=0)}}
setInterval(()=>{autoStop();if(S.ui.view==='judge'&&S.ui.form)tickSW();if(S.ui.view==='timer')tickTimer();if(S.ui.view==='screen')document.querySelectorAll('[data-tm]').forEach(el=>el.textContent=fmtMs(tElapsed(timerOf(el.dataset.tm))))},40);

/* ---------- timer laptop: Space bar or a USB clicker starts and stops the clock, the webcam records the run ---------- */
const CLICKER=[' ','Enter','PageDown','PageUp','ArrowRight','ArrowLeft','ArrowUp','ArrowDown','b','B','.','F5'];
let CAM=null,CAMERR='',CAMASK=false,REC=null,RECERR='',RECFAIL=0,CLIP=null,LASTKEY='',LASTPRESS=0;
function vTimer(){
  const c=clsOfField(LOCK),q=queue(c.id),t=timerOf(LOCK),who=t.state!=='idle'&&team(t.team)||q[0];
  const label={idle:who?'พร้อม · กด Space bar เพื่อเริ่ม':'ไม่มีทีมรอคิว',run:'กำลังแข่ง · กด Space bar เพื่อหยุด',stop:'หยุดแล้ว · รอกรรมการส่งคะแนน'}[t.state];
  const canPick='showDirectoryPicker' in window;
  return`<div class="stage">
    <div class="stage-grid tgrid">
      <div style="position:relative"><div id="cvbox"></div>${REC?'<span class="pill bad" style="position:absolute;top:10px;left:50%;transform:translateX(-50%)">● กำลังอัด</span>':''}</div>
      <div class="tbox"><button class="tbig mono ${t.state}" id="tm" data-act="tpress" aria-label="เริ่มหรือหยุดเวลา">${fmtMs(tElapsed(t))}</button>
        <div style="font-size:18px">${label}</div><div class="sub2">ปุ่มล่าสุดที่รับได้: <b>${esc(LASTKEY||'ยังไม่มี')}</b></div>
        ${CAMERR?`<div><b>เปิดกล้องไม่ได้</b><ol style="margin:4px 0;padding-left:20px"><li>เช็กว่าเสียบเว็บแคมแล้ว</li><li>กดรูปกล้องบนแถบที่อยู่เว็บ แล้วเลือกอนุญาต</li><li>กดปุ่มข้างล่าง</li></ol><button class="btn sm" data-act="camon">เปิดกล้องอีกครั้ง</button></div>`:''}
        ${RECERR?`<div><b>อัดวิดีโอไม่ได้</b> <span class="sub2">${esc(RECERR)}</span></div>`:''}
        <div class="sub2">วิดีโอเก็บที่: <b>${esc(DIR&&DIRSTATE==='ok'?DIR.name:'Downloads')}</b>${SAVED?`<br>ล่าสุด: ${esc(SAVED)}`:''}</div>
        ${canPick?`<div class="row">${DIR&&DIRSTATE==='ask'?`<button class="btn sm pri" data-act="dirpick">ใช้โฟลเดอร์ ${esc(DIR.name)} ต่อ</button>`:''}<button class="btn sm" data-act="dirnew">เลือกโฟลเดอร์</button></div>`:''}
        ${CLIP&&t.state!=='run'?`<div class="sub2">ดูย้อนหลัง · ${esc(CLIP.name)}</div><video id="clip" controls src="${CLIP.url}"></video>`:''}</div>
    </div></div>`;
}
function timerAfter(){
  $('#cvbox')?.append(stageCanvas());if(!CAM&&!CAMERR&&!CAMASK)camOn();if(!DIRASKED){DIRASKED=true;dirLoad()}
  // a fresh recording has no length written in it; jumping to the end once makes the browser work it out, so the bar can be dragged
  const v=$('#clip');if(v)v.onloadedmetadata=()=>{if(v.duration===Infinity){v.ontimeupdate=()=>{v.ontimeupdate=null;v.currentTime=0};v.currentTime=1e9}};
}

/* The picture shown on the timer laptop and written into the recording: webcam frame with broadcast graphics on top.
   Drawing is fenced off from the clock: if a frame fails it is skipped, timing and scoring carry on. */
let CV=null,CX=null,VID=null,CSTREAM=null,G={score:0,target:0,bump:0,evn:null,pop:null};
const FONT={ui:'"IBM Plex Sans Thai",sans-serif',head:'"Chakra Petch","IBM Plex Sans Thai",sans-serif',num:'"IBM Plex Sans Thai",sans-serif'};
function stageCanvas(){
  if(CV)return CV;
  CV=document.createElement('canvas');CV.width=1280;CV.height=720;CX=CV.getContext('2d');
  ['500 20px '+FONT.ui,'600 20px '+FONT.ui,'700 20px '+FONT.head,'600 20px '+FONT.num].forEach(f=>document.fonts?.load(f,'ทีม 0'));
  setInterval(()=>{try{drawStage()}catch(e){}},40);
  return CV;
}
function drawStage(){
  if(ROLE!=='timer'||!READY||needGate())return;const c=clsOfField(LOCK);if(!c)return;
  const x=CX,W=1280,H=720,M=40,now=Date.now(),t=timerOf(LOCK),tm=t.team&&team(t.team)||queue(c.id)[0],cp=S.comps[c.comp],lim=limitOf(LOCK);
  const INK='#fff',DIM='#B4C0D4',PANEL='rgba(8,12,22,.9)';
  const text=(str,px,py,font,color,align='left')=>{x.font=font;x.fillStyle=color;x.textAlign=align;x.textBaseline='alphabetic';x.fillText(str,px,py)};
  const width=(str,font)=>{x.font=font;return x.measureText(str).width};
  // slanted panel: the shape television timing graphics are built from
  const slab=(px,py,pw,ph,fill,l=18,r=18)=>{x.fillStyle=fill;x.beginPath();x.moveTo(px+l,py);x.lineTo(px+pw,py);x.lineTo(px+pw-r,py+ph);x.lineTo(px,py+ph);x.closePath();x.fill()};
  const grad=(px,pw,a='#3B6FE8',b='#7A4FE0')=>{const g=x.createLinearGradient(px,0,px+pw,0);g.addColorStop(0,a);g.addColorStop(1,b);return g};
  const fit=(str,font,max)=>{if(width(str,font)<=max)return str;while(str.length>1&&width(str+'…',font)>max)str=str.slice(0,-1);return str+'…'};

  x.fillStyle='#0A0F1A';x.fillRect(0,0,W,H);
  if(VID&&VID.readyState>=2&&VID.videoWidth){const k=Math.max(W/VID.videoWidth,H/VID.videoHeight);x.drawImage(VID,(W-VID.videoWidth*k)/2,(H-VID.videoHeight*k)/2,VID.videoWidth*k,VID.videoHeight*k)}
  else text(CAMERR?'ไม่มีภาพจากกล้อง':'กำลังเปิดกล้อง…',W/2,H/2,'500 26px '+FONT.ui,'#4D5B74','center');
  // soft shade top and bottom so the graphics read over any picture
  let g=x.createLinearGradient(0,0,0,170);g.addColorStop(0,'rgba(0,0,0,.6)');g.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=g;x.fillRect(0,0,W,170);
  g=x.createLinearGradient(0,H-250,0,H);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(0,0,0,.72)');x.fillStyle=g;x.fillRect(0,H-250,W,250);

  // top left: event mark, then where and what
  slab(M,M,74,56,grad(M,74),14,14);text('PT',M+37,M+38,'700 26px '+FONT.head,INK,'center');
  text(cp.name,M+88,M+25,'700 23px '+FONT.head,INK);
  text(`สนาม ${c.field}  ·  ${c.level}${t.round&&t.state!=='idle'?'  ·  รอบ '+t.round:''}`,M+88,M+51,'500 19px '+FONT.ui,DIM);

  // top right: the clock, with the match time running out underneath
  const ms=Math.min(tElapsed(t),lim),cw=356,cx=W-M-cw,late=t.state==='run'&&lim-ms<30000;
  slab(cx,M,cw,96,PANEL,22,0);slab(cx,M,30,96,late?'#E5484D':t.state==='stop'?'#E2B748':grad(cx,30),22,22);
  text(t.state==='stop'?'หยุดเวลา':'เวลา',cx+46,M+30,'600 17px '+FONT.ui,t.state==='stop'?'#E2B748':DIM);
  text(fmtMs(ms),W-M-22,M+70,'600 56px '+FONT.num,late?'#FF8A85':INK,'right');
  x.fillStyle='rgba(255,255,255,.16)';x.fillRect(cx+38,M+82,cw-60,5);x.fillStyle=late?'#E5484D':'#7AA2FF';x.fillRect(cx+38,M+82,(cw-60)*(1-ms/lim),5);

  // bottom strip: team | each mission as it stands | retries | score
  const by=H-M-104,bh=104,target=liveScore(LOCK)??0,items=t.live?.items||{},retry=t.live?.pen||0;
  if(target!==G.target){G.bump=now;G.target=target}
  G.score+=(target-G.score)*.3;if(Math.abs(target-G.score)<.5)G.score=target;
  const scW=210,rtW=118,scX=W-M-scW,rtX=scX-rtW+18;
  // missions, measured first so the team block can take what is left
  const fl='600 15px '+FONT.ui,PIP=20,GAP=6;
  const cols=cp.missions.map(m=>({m,name:m.short||m.label,w:Math.max(width(m.short||m.label,fl),m.max*(PIP+GAP)-GAP)+30}));
  let misW=cols.reduce((a,k)=>a+k.w,0)+16,misX=rtX-misW+18;
  const teamW=Math.max(300,misX-M+18);
  slab(M,by,teamW,bh,PANEL,0,18);x.fillStyle='#E2B748';x.fillRect(M,by,8,bh);
  if(tm){
    const fi='600 22px '+FONT.num,fn='700 36px '+FONT.head,iw=width(tm.id,fi)+26;
    x.fillStyle='rgba(255,255,255,.13)';x.fillRect(M+28,by+18,iw,38);text(tm.id,M+41,by+46,fi,INK);
    text(fit(tm.name,fn,teamW-iw-90),M+28+iw+16,by+49,fn,INK);
    text(fit(tm.school,'500 20px '+FONT.ui,teamW-80),M+28,by+84,'500 20px '+FONT.ui,DIM);
  }else text('รอทีมถัดไป',M+28,by+62,'600 28px '+FONT.ui,DIM);
  slab(misX,by,misW,bh,'rgba(16,22,36,.92)',18,18);
  let px=misX+30;
  cols.forEach(k=>{
    const n=Math.min(items[k.m.id]||0,k.m.max),full=n>=k.m.max;
    text(k.name,px,by+38,fl,full?'#7EE0AE':DIM);
    for(let q=0;q<k.m.max;q++){const on=q<n,qx=px+q*(PIP+GAP),qy=by+56;
      if(on){x.fillStyle='#2BBF7F';x.fillRect(qx,qy,PIP,PIP)}else{x.strokeStyle='rgba(255,255,255,.34)';x.lineWidth=2;x.strokeRect(qx+1,qy+1,PIP-2,PIP-2)}}
    px+=k.w;
  });
  slab(rtX,by,rtW,bh,PANEL,18,18);
  text('RETRY',rtX+rtW/2,by+38,'600 15px '+FONT.ui,retry?'#F0B45A':DIM,'center');
  text(String(retry),rtX+rtW/2,by+82,'600 36px '+FONT.num,retry?'#F0B45A':INK,'center');
  slab(scX,by,scW,bh,grad(scX,scW),18,0);
  text('คะแนน',scX+34,by+34,'600 17px '+FONT.ui,'rgba(255,255,255,.86)');
  const bump=Math.max(0,1-(now-(G.bump||0))/320),fs=Math.round(66+10*bump);
  text(String(Math.round(G.score)),W-M-22,by+90,`600 ${fs}px ${FONT.num}`,INK,'right');

  // each tap from the judge wipes in above the score, holds, then fades
  if(t.ev&&t.ev.n!==G.evn){
    if(G.evn!==null||t.state==='run'){const e=t.ev,pos=e.pts>0;
      G.pop={at:now,label:e.pts?e.label:'Retry',value:e.pts?(pos?'+':'−')+Math.abs(e.pts):'ครั้งที่ '+e.retry,color:pos?'#16A865':e.pts<0?'#5C6880':'#D48A16'}}
    G.evn=t.ev.n;
  }else if(!t.ev)G.evn=0;
  if(G.pop){
    const age=now-G.pop.at;if(age>2600)G.pop=null;
    else{const fa='600 26px '+FONT.ui,fv='700 30px '+FONT.num,lw=width(G.pop.label,fa)+52,vw=width(G.pop.value,fv)+44,inn=Math.min(1,age/260),e=1-Math.pow(1-inn,3),out=age>2200?(2600-age)/400:1,dx=(1-e)*90,ph=58,py=by-ph-12,rx=W-M;
      x.globalAlpha=Math.max(0,out)*inn;
      slab(rx-vw-lw+18+dx,py,lw,ph,PANEL,18,18);text(G.pop.label,rx-vw-lw+18+dx+30,py+38,fa,INK);
      slab(rx-vw+dx,py,vw,ph,G.pop.color,18,0);text(G.pop.value,rx-20+dx,py+40,fv,INK,'right');
      x.globalAlpha=1}
  }
}

/* Where clips go: a folder the laptop picked once (for example one that Google Drive keeps in step), else Downloads. */
let DIR=null,DIRSTATE='none',DIRASKED=false,SAVED='';
const kv=(mode,fn)=>new Promise((ok,no)=>{const o=indexedDB.open('ptarena',1);o.onupgradeneeded=()=>o.result.createObjectStore('kv');o.onerror=()=>no(o.error);
  o.onsuccess=()=>{const tx=o.result.transaction('kv',mode),rq=fn(tx.objectStore('kv'));tx.oncomplete=()=>ok(rq.result);tx.onerror=()=>no(tx.error)}});
async function dirLoad(){
  try{DIR=await kv('readonly',st=>st.get('dir'))||null;if(DIR)DIRSTATE=await DIR.queryPermission({mode:'readwrite'})==='granted'?'ok':'ask'}catch(e){DIR=null}
  if(DIR&&S.ui.view==='timer')render();
}
// the browser forgets its permission when the page is reopened; one click on the remembered folder gives it back
async function dirPick(fresh){
  try{
    if(DIR&&!fresh){if(await DIR.requestPermission({mode:'readwrite'})==='granted')DIRSTATE='ok'}
    else{DIR=await showDirectoryPicker({mode:'readwrite'});DIRSTATE='ok';await kv('readwrite',st=>st.put(DIR,'dir'))}
  }catch(e){if(e.name!=='AbortError')toast('เลือกโฟลเดอร์ไม่ได้ ลองใช้ Chrome หรือ Edge')}
  if(S.ui.view==='timer')render();
}
async function saveClip(blob,name){
  if(DIR&&DIRSTATE==='ok'){
    try{const h=await DIR.getFileHandle(name,{create:true}),w=await h.createWritable();await w.write(blob);await w.close();SAVED=DIR.name+' / '+name;return}
    catch(e){DIRSTATE='ask'}
  }
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;document.body.append(a);a.click();a.remove();SAVED='Downloads / '+name;
}
function tickTimer(){const el=$('#tm');if(!el||!clsOfField(LOCK))return;const t=timerOf(LOCK),ms=tElapsed(t);el.textContent=fmtMs(ms);el.classList.toggle('over',ms>=limitOf(LOCK))}
function tPress(src){
  const now=Date.now();LASTKEY=src;
  if(now-LASTPRESS<1000){render();return} // a bouncing or double press counts once
  LASTPRESS=now;const t=timerOf(LOCK);
  if(t.state==='run')tStop(LOCK);
  else if(!tStart(LOCK))toast(t.state==='stop'?'รอกรรมการส่งคะแนนก่อน':'ไม่มีทีมรอคิว');
  save();render();
}
async function camOn(){
  CAMASK=true;
  try{CAM=await navigator.mediaDevices.getUserMedia({video:{width:{ideal:1280},height:{ideal:720}},audio:false});
    VID=document.createElement('video');VID.muted=true;VID.playsInline=true;VID.srcObject=CAM;VID.play().catch(()=>{})}catch(e){CAMERR=e.name||'error'}
  CAMASK=false;if(S.ui.view==='timer')render();
}
// recording follows the clock, whoever started it: this laptop, or the judge's phone
function syncRec(){
  if(ROLE!=='timer'||!LOCK||!CAM)return;const t=timerOf(LOCK);
  if(t.state==='run'&&!REC&&RECFAIL!==t.startAt){
    const mime=['video/webm;codecs=vp9','video/webm;codecs=vp8','video/webm','video/mp4'].find(m=>MediaRecorder.isTypeSupported(m));
    const name=`${t.team}_R${t.round}_${nowHM().replace(':','')}.${mime&&mime.startsWith('video/mp4')?'mp4':'webm'}`,chunks=[];
    let rec;
    // a recorder that refuses our settings must not take the clock down with it: fall back to the browser's own, then give up for this run
    // what is recorded is the picture with graphics; without that, the bare camera
    let src=CAM;try{CSTREAM=CSTREAM||stageCanvas().captureStream(25);src=CSTREAM}catch(e){}
    try{rec=new MediaRecorder(src,{mimeType:mime,videoBitsPerSecond:2500000})}catch(e){try{rec=new MediaRecorder(src)}catch(e2){RECERR=`${e2.name}: ${e2.message}`;RECFAIL=t.startAt;return}}
    REC=rec;RECERR='';
    rec.ondataavailable=e=>{if(e.data.size)chunks.push(e.data)};
    rec.onstop=()=>{
      REC=null;if(CLIP)URL.revokeObjectURL(CLIP.url);
      const blob=new Blob(chunks,{type:rec.mimeType});CLIP={url:URL.createObjectURL(blob),name};
      saveClip(blob,name).catch(()=>{}).then(()=>{if(S.ui.view==='timer')render()});
      if(S.ui.view==='timer')render();
    };
    try{rec.start(1000)}catch(e){REC=null;RECERR=`${e.name}: ${e.message}`;RECFAIL=t.startAt}
  }else if(t.state!=='run'&&REC&&REC.state==='recording')REC.stop();
}

/* ---------- board ---------- */
function vBoard(){
  const c=cls(S.ui.boardCls),rows=standings(c.id),cp=S.comps[c.comp];
  const chips=fieldsSorted().map(x=>`<button class="chip" data-act="bcls" data-v="${x.id}" aria-pressed="${x.id===c.id}">${esc(S.comps[x.comp].tag)} <b>${esc(x.level)}</b></button>`).join('');
  const head=Array.from({length:S.rounds},(_,i)=>`<th class="num">รอบ ${i+1}</th>`).join('');
  // phone: one card per team instead of a wide table
  const cards=rows.map(r=>`<div class="brow">${r.rank?`<span class="rk ${r.rank<=3?'r'+r.rank:''}">${r.rank}</span>`:'<span class="rk">–</span>'}
    <div class="who"><b>${esc(r.t.name)}</b><small><span class="tid">${r.t.id}</span> ${esc(r.t.school)}</small>
      <small class="mono">${Array.from({length:S.rounds},(_,i)=>{const x=runOf(r.t.id,i+1);return`รอบ ${i+1} <b>${x?score(x):'–'}</b>`}).join(' · ')}${r.b?` · ${fmtMs(r.b.run.ms)} · Retry ${r.b.run.pen||0}`:''}</small></div>
    <b class="bs mono">${r.b?r.b.score:'–'}</b></div>`).join('');
  const body=rows.map(r=>{const rd=Array.from({length:S.rounds},(_,i)=>{const x=runOf(r.t.id,i+1);return`<td class="num">${x?score(x):'<span class="muted">–</span>'}</td>`}).join('');
    return`<tr><td>${r.rank?`<span class="rk ${r.rank<=3?'r'+r.rank:''}">${r.rank}</span>`:'<span class="muted small">รอแข่ง</span>'}</td>
      <td><span class="tid">${r.t.id}</span> <b>${esc(r.t.name)}</b><div class="small muted">${esc(r.t.school)}</div></td>${rd}
      <td class="num best">${r.b?r.b.score:'–'}</td><td class="num">${r.b?fmtMs(r.b.run.ms):'–'}</td><td class="num">${r.b?r.b.run.pen||0:'–'}</td></tr>`}).join('');
  return`<div class="panel">
    <div class="row between"><div><h2>${esc(cp.name)} · ${esc(c.level)}</h2><div class="small muted">สนาม ${c.field} · อัปเดตทันทีที่กรรมการส่งคะแนน</div></div>${ROLE==='staff'?'<button class="btn sm" data-act="copycsv">คัดลอกผลเป็น CSV</button>':''}</div>
    <div class="chips fchips">${chips}</div><select id="bsel" class="fsel" aria-label="เลือกรุ่น">${fieldsSorted().map(x=>`<option value="${x.id}" ${x.id===c.id?'selected':''}>${esc(S.comps[x.comp].tag)} ${esc(x.level)}</option>`).join('')}</select>
    <div class="blist narrow">${cards}</div>
    <div class="tbl-wrap wide"><table><thead><tr><th>อันดับ</th><th>ทีม</th>${head}<th class="num">คะแนนดีสุด</th><th class="num">เวลา</th><th class="num">Retry</th></tr></thead><tbody>${body}</tbody></table></div>
    <p class="small muted" style="margin:0">นับรอบที่ได้คะแนนสูงสุด · คะแนนเท่ากันดูเวลาน้อยกว่า แล้วดู Retry น้อยกว่า</p></div>`;
}

/* ---------- team phone ---------- */
function vTeam(){
  const q=S.ui.teamQuery.trim().toLowerCase();
  const t=q&&S.teams.find(x=>x.id.toLowerCase()===q)||(q&&S.teams.find(x=>(x.id+' '+x.name).toLowerCase().includes(q)));
  let card='';
  if(t){const c=cls(t.cls),qq=queue(c.id),idx=qq.findIndex(x=>x.id===t.id),r=curRound(c.id);
    let co;
    if(!t.checkin)co=`<div class="callout warn"><div class="big">ยังไม่ได้เช็กอิน</div>ไปที่จุดลงทะเบียน พร้อมหุ่นและสมาชิกทีม</div>`;
    else if(!t.inspect)co=`<div class="callout warn"><div class="big">รอตรวจหุ่น</div>นำหุ่นไปที่จุดตรวจ</div>`;
    else if(t.inspect.result==='fail')co=`<div class="callout bad"><div class="big">ตรวจหุ่นไม่ผ่าน</div>${esc(t.inspect.note||'')} · แก้แล้วกลับไปตรวจซ้ำที่จุดตรวจ</div>`;
    else if(idx===0)co=`<div class="callout ok"><div class="big">ถึงคิวแล้ว</div>ไปที่สนาม ${c.field} ทันที · รอบ ${r}</div>`;
    else if(idx>0)co=`<div class="callout"><div class="big">อีก ${idx} ทีมถึงคิว</div>สนาม ${c.field} · รอบ ${r} · เตรียมหุ่นให้พร้อม</div>`;
    else{const all=Array.from({length:S.rounds},(_,i)=>runOf(t.id,i+1)).every(Boolean);co=`<div class="callout ok"><div class="big">${all?'แข่งครบทุกรอบแล้ว':'แข่งรอบนี้แล้ว'}</div>${all?'รอประกาศผล':'รอเรียกรอบถัดไป'}</div>`}
    const st=standings(c.id),me=st.find(x=>x.t.id===t.id);
    const steps=[['เช็กอิน',!!t.checkin],['ตรวจหุ่น',t.inspect?.result==='pass'],...Array.from({length:S.rounds},(_,i)=>['รอบ '+(i+1),!!runOf(t.id,i+1)])];
    card=`<div class="panel" style="padding:14px"><div><span class="tid">${t.id}</span></div><h2>${esc(t.name)}</h2><div class="small muted">${esc(t.school)}<br>${esc(clsName(c))} · สนาม ${c.field}</div>
      <div class="steps">${steps.map(s=>`<div class="${s[1]?'on':''}"><i></i>${s[0]}</div>`).join('')}</div></div>
      ${co}
      <div class="panel" style="padding:14px"><div class="row between"><h3>คะแนนของทีม</h3>${me?.rank?`<span class="pill ac">อันดับ ${me.rank} จาก ${st.length}</span>`:''}</div>
      ${Array.from({length:S.rounds},(_,i)=>{const x=runOf(t.id,i+1);return`<div class="row between small"><span>รอบ ${i+1}</span><span class="mono">${x?score(x)+' คะแนน · '+fmtMs(x.ms):'ยังไม่แข่ง'}</span></div>`}).join('')}
      <button class="btn sm" data-act="viewboard" data-v="${c.id}">ดูกระดานผลรุ่นนี้</button></div>`}
  else if(q)card=`<p class="muted">ไม่พบทีม ลองพิมพ์ Team ID เช่น C004</p>`;
  if(ROLE!=='staff')return`<div class="grid" style="max-width:480px;margin:0 auto;gap:12px"><div class="row"><input type="text" id="tq" placeholder="Team ID เช่น C004" value="${esc(S.ui.teamQuery)}" style="flex:1"><button class="btn pri" data-act="teamgo">ดู</button></div>${card}</div>`;
  return`<div class="phone-wrap">
    <div class="phone"><div class="notch"></div>
      <div class="eyebrow">PT Robotics 2026 · ${esc(VENUES.find(v=>v[0]===S.venue)[1])}</div>
      <div class="row"><input type="text" id="tq" placeholder="Team ID เช่น C004" value="${esc(S.ui.teamQuery)}" style="flex:1"><button class="btn pri" data-act="teamgo">ดู</button></div>
      ${card}</div>
    <div class="explain panel">
      <h2>ใช้แทนจอใหญ่ได้</h2>
      <ol>
        <li>ติดป้าย QR ที่จุดลงทะเบียน ข้างสนาม และโซนพักทีม</li>
        <li>ครูหรือนักเรียนสแกนแล้วใส่ Team ID ไม่ต้องติดตั้งแอป ไม่ต้องล็อกอิน</li>
        <li>เห็นว่าอีกกี่ทีมถึงคิว ต้องไปสนามไหน และคะแนนกับอันดับของทีมตัวเอง</li>
        <li>ส่งลิงก์เดียวกันเข้ากลุ่ม LINE ครูผู้ควบคุมก่อนวันแข่งได้เลย</li>
      </ol>
      <p class="small muted" style="margin:0">ลองเปลี่ยน Team ID เป็น C005, C023 (ตรวจไม่ผ่าน), C006 (ยังไม่เช็กอิน) หรือไปส่งคะแนนในแท็บกรรมการ แล้วกลับมาดูคิวที่ลดลง</p>
    </div></div>`;
}

/* ---------- screen ---------- */
function liveBadge(field){
  const t=timerOf(field),sc=liveScore(field);if(t.state!=='run'&&!sc)return'';
  return` <span class="pill ok">สด <b class="mono">${sc??0}</b>${t.state==='run'?` · <span class="mono" data-tm="${field}">${fmtMs(tElapsed(t))}</span>`:''}</span>`}
function vScreen(){
  const list=fieldsSorted(),c=list[S.ui.screenIdx%list.length],rows=standings(c.id).slice(0,6);
  const v=VENUES.find(x=>x[0]===S.venue);
  return`<div class="row between" style="margin-bottom:10px"><span class="small muted">หน้านี้เปิดบนโน้ตบุ๊กหรือทีวีที่ต่อจอ วนแสดงทีละรุ่นทุก 8 วินาที</span><button class="btn sm" data-act="full">เต็มจอ</button></div>
  <div class="stage" id="stage">
    <div class="stage-top"><div><div class="ev">THAILAND YOUTH ROBOTICS CHAMPIONSHIP 2026</div><div style="font-family:var(--f-display);font-size:18px;font-weight:600">${esc(v[1])}</div></div><div class="clk" id="clk">--:--</div></div>
    <div class="stage-grid">
      <div><div class="sub2">สนาม ${c.field} · อันดับปัจจุบัน</div><h2>${esc(S.comps[c.comp].name)} · ${esc(c.level)}</h2>
        <div>${rows.map(r=>`<div class="srow"><span class="rk ${r.rank&&r.rank<=3?'r'+r.rank:''}">${r.rank||'–'}</span><div style="min-width:0"><b>${esc(r.t.name)}</b><small>${r.t.id} · ${esc(r.t.school)}</small></div><span class="sc">${r.b?r.b.score:'–'}</span></div>`).join('')}</div></div>
      <div class="sq"><div class="sub2" style="margin-bottom:4px">คิวทุกสนาม</div>
        ${list.map(x=>{const q=queue(x.id);return`<div class="ql"><span class="L">${x.field}</span><div style="min-width:0">${q[0]?`<b>${q[0].id}</b> ${esc(q[0].name)}`:'<span>ไม่มีทีมในสนาม</span>'}${liveBadge(x.field)}<br><small>${esc(S.comps[x.comp].tag)} ${esc(x.level)}${q[1]?' · ถัดไป '+q[1].id:''}</small></div></div>`}).join('')}</div>
    </div>
    <div class="dots">${list.map((x,i)=>`<i class="${i===S.ui.screenIdx%list.length?'on':''}"></i>`).join('')}</div>
  </div>`;
}
setInterval(()=>{if(S.ui.view==='screen'){S.ui.screenIdx++;render()}},8000);
function clock(){const el=$('#clk');if(el){const d=new Date();el.textContent=d.toLocaleTimeString('th-TH',{hour:'2-digit',minute:'2-digit',second:'2-digit'})}}
setInterval(clock,1000);

/* ---------- mc ---------- */
function vMc(){
  const cards=fieldsSorted().map(c=>{
    const q=queue(c.id),r=curRound(c.id);let body;
    if(q.length)body=`<div><div class="small muted">เรียกตอนนี้</div><div class="jteam"><span class="tid" style="font-size:18px">${q[0].id}</span> ${esc(q[0].name)}</div><div class="small muted">${esc(q[0].school)}</div></div>
      ${q.length>1?`<div><div class="small muted">เตรียมตัว</div>${q.slice(1,3).map(t=>`<div><span class="tid">${t.id}</span> ${esc(t.name)} <small class="muted">${esc(t.school)}</small></div>`).join('')}</div>`:''}`;
    else if(eligible(c.id).length)body=`<div class="small muted">แข่งครบแล้ว · ประกาศผล</div>`+standings(c.id).filter(x=>x.rank&&x.rank<=3).map(x=>`<div class="row" style="flex-wrap:nowrap"><span class="rk r${x.rank}">${x.rank}</span><span style="flex:1;min-width:0"><b>${esc(x.t.name)}</b><br><small class="muted">${esc(x.t.school)}</small></span><b class="mono">${x.b.score}</b></div>`).join('');
    else body=`<span class="muted">ยังไม่มีทีมพร้อม</span>`;
    return`<div class="panel"><div class="row between"><span class="fletter">สนาม ${c.field}</span>${q.length?`<span class="pill ok">รอบ ${r}</span>`:''}</div><div class="fclass">${esc(clsName(c))}</div>${body}</div>`}).join('');
  const feed=[...S.runs].sort((a,b)=>b.ts-a.ts).slice(0,5).map(x=>{const t=team(x.team);if(!t)return'';
    return`<div><span class="mono">${x.at}</span><span>สนาม ${cls(t.cls).field} · ${esc(t.name)} <span class="tid">${t.id}</span> รอบ ${x.round} · <b class="mono">${score(x)}</b> คะแนน</span></div>`}).join('');
  return`<div class="grid"><div class="fields">${cards}</div><div class="panel"><h3>คะแนนล่าสุด</h3><div class="feed">${feed||'<span class="muted">ยังไม่มีคะแนน</span>'}</div></div></div>`;
}

/* ---------- admin ---------- */
function vAdmin(){
  const letters='ABCDEFGH'.split('');
  const fieldRows=S.classes.map(c=>`<div class="row between"><span>${esc(clsName(c))}</span><select data-bind="field" data-c="${c.id}" aria-label="สนามของ ${esc(clsName(c))}">${letters.map(l=>`<option ${l===c.field?'selected':''}>${l}</option>`).join('')}</select></div>`).join('');
  const ref=r=>r?`<small class="muted"> · ${esc(r)}</small>`:'';
  const mmss=n=>Math.floor(n/60)+':'+String(n%60).padStart(2,'0');
  const comps=Object.entries(S.comps).map(([k,cp])=>{const R=cp.rules||{};return`<div class="ccard"><h3>${esc(cp.name)} <span class="muted small">${esc(S.classes.filter(c=>c.comp===k).map(c=>c.level).join(', '))}</span></h3>
    <div class="mtab"><span class="h">ภารกิจ</span><span class="h">คะแนน</span><span class="h">สูงสุด</span>
    ${cp.missions.map(m=>`<span>${esc(m.label)}${ref(m.ref)}</span><span class="mono">${m.pts}</span><span class="mono">${m.max}</span>`).join('')}
    <span><b>คะแนนเต็ม</b></span><b class="mono">${cp.missions.reduce((a,m)=>a+m.pts*m.max,0)}</b><span></span></div>
    <div class="small" style="display:flex;flex-direction:column;gap:2px">
      <span>เวลาแข่ง <b class="mono">${mmss(cp.timeLimit)}</b>${ref(R.time)}</span>
      ${cp.setup?`<span>ตั้งหุ่นก่อนแข่ง <b class="mono">${mmss(cp.setup)}</b>${ref(R.setup)}</span>`:''}
      ${cp.missions.filter(m=>m.closes).map(m=>`<span>${esc(m.label)}ต้องเป็นชิ้นสุดท้ายที่เก็บ${ref(m.closeRef)}</span>`).join('')}
      ${cp.missions.filter(m=>m.ends).map(m=>`<span>${esc(m.label)} = จบการแข่งขัน เวลาหยุด${ref(m.endRef)}</span>`).join('')}
      ${R.stop?`<span>ทีมขอหยุด บันทึกเวลาเต็ม${ref(R.stop)}</span>`:''}
      ${R.best?`<span>แข่ง 2 ครั้ง นับครั้งที่ดีที่สุด${ref(R.best)}</span>`:''}
      ${R.tie?`<span>เสมอ: เวลาน้อยกว่า แล้ว Retry น้อยกว่า แล้วแข่งใหม่${ref(R.tie)}</span>`:'<span class="muted">จำนวนรอบและการตัดสินเสมอ: กติกาไม่ได้เขียนไว้</span>'}
      ${R.order?`<span>ลำดับแข่งจากการจับสลาก${ref(R.order)}</span>`:''}
      ${R.checks?`<span>รายการตรวจหุ่น${ref(R.checks)}</span>`:''}
    </div></div>`}).join('');
  const oc=cls(S.ui.orderCls)||S.classes[0],oids=S.order[oc.id]||[];
  const orderRows=oids.map((id,n)=>{const t=team(id);return t?`<div class="qitem"><span class="qn">${n+1}</span><span class="tid">${t.id}</span><span style="flex:1;min-width:0">${esc(t.name)}</span><button class="btn sm" data-act="omove" data-id="${t.id}" data-d="-1" aria-label="เลื่อนขึ้น" ${n?'':'disabled'}>▲</button><button class="btn sm" data-act="omove" data-id="${t.id}" data-d="1" aria-label="เลื่อนลง" ${n<oids.length-1?'':'disabled'}>▼</button></div>`:''}).join('');
  const base=location.href.split('#')[0];
  const links=[['คนดู · ทีมและครู',''],['จอในงาน','#screen'],['พิธีกร','#mc'],['เจ้าหน้าที่','#staff'],...fieldsSorted().map(c=>['กรรมการสนาม '+c.field+' · '+S.comps[c.comp].tag+' '+c.level,'#judge-'+c.field]),...fieldsSorted().map(c=>['จับเวลาสนาม '+c.field+' · โน้ตบุ๊ก','#timer-'+c.field])];
  const linkRows=links.map(l=>`<div class="qitem"><span style="flex:1;min-width:0">${esc(l[0])}<br><small class="mono muted" style="word-break:break-all">${esc(base+l[1])}</small></span><button class="btn sm" data-act="copylink" data-u="${esc(base+l[1])}">คัดลอก</button></div>`).join('');
  return`<div class="adm">
    <div class="panel"><h2>สนามและรอบ</h2><p class="small muted" style="margin:0">จับคู่รุ่นกับสนาม แต่ละสนามใช้แท็บเล็ต 1 เครื่อง</p>${fieldRows}
      <div class="row between" style="border-top:1px solid var(--line);padding-top:10px"><span>จำนวนรอบต่อทีม (นับรอบที่ดีที่สุด)</span><select data-bind="rounds" aria-label="จำนวนรอบ">${[1,2,3].map(n=>`<option ${n===S.rounds?'selected':''}>${n}</option>`).join('')}</select></div>
      <div class="row between"><span>PIN หัวหน้ากรรมการ</span><input type="text" value="${esc(S.pin)}" data-bind="pin" style="width:100px" aria-label="PIN"></div>
      <div class="row between"><span>รหัสเจ้าหน้าที่ (เข้าหน้ากรรมการ)</span><input type="text" value="${esc(S.staffPin)}" data-bind="staff" style="width:100px" aria-label="รหัสเจ้าหน้าที่"></div></div>
    <div class="panel"><h2>ลิงก์ของแต่ละคน</h2><p class="small muted" style="margin:0">แต่ละลิงก์เห็นเฉพาะหน้าของตัวเอง</p><div>${linkRows}</div></div>
    <div class="panel"><h2>เกณฑ์คะแนน</h2><p class="small muted" style="margin:0">ตามไฟล์กติกาบนเว็บสมัคร · แก้จากหน้านี้ไม่ได้ กันคะแนนเพี้ยนจากกติกา</p>${comps}</div>
    <div class="panel"><h2>นำเข้ารายชื่อทีม</h2><p class="small muted" style="margin:0">วางจาก Excel หรือ CSV ที่ได้จากผู้ดูแลเว็บสมัคร ใช้ 4 คอลัมน์: Team ID, ชื่อทีม, โรงเรียน, รหัสรุ่น</p>
      <p class="small muted" style="margin:0">รหัสรุ่น: ${S.classes.map(c=>`<span class="mono">${c.id}</span> ${esc(S.comps[c.comp].tag)} ${esc(c.level)}`).join(' · ')}</p>
      <textarea id="imp" rows="6">TeamID,ชื่อทีม,โรงเรียน,รุ่น
C101,ทีม Mango,โรงเรียนตัวอย่างวิทยา,kb-p
C102,ทีม Lotus,โรงเรียนตัวอย่างวิทยา,dl-h</textarea>
      <div class="row"><button class="btn pri" data-act="imp" data-mode="add">เพิ่มเข้ารายชื่อเดิม</button><button class="btn" data-act="imp" data-mode="replace">แทนที่ทั้งหมด</button></div>
      ${S.ui.adminMsg?`<div class="note">${S.ui.adminMsg}</div>`:''}</div>
    <div class="panel"><h2>ลำดับการแข่ง</h2><p class="small muted" style="margin:0">เรียงตามผลจับสลากของแต่ละรุ่น</p>
      <select id="osel" aria-label="เลือกรุ่น">${S.classes.map(c=>`<option value="${c.id}" ${c.id===oc.id?'selected':''}>${esc(S.comps[c.comp].tag)} ${esc(c.level)}</option>`).join('')}</select>
      <div>${orderRows||'<span class="muted small">ยังไม่มีทีมในรุ่นนี้</span>'}</div></div>
    <div class="panel"><h2>เริ่มใหม่</h2><p class="small muted" style="margin:0">ล้างข้อมูลที่ลองกดไว้ กลับเป็นข้อมูลตัวอย่างตั้งต้น</p>
      ${S.ui.resetAsk?`<div class="row"><span>ยืนยันล้างข้อมูล?</span><button class="btn badb" data-act="resetyes">ล้างข้อมูล</button><button class="btn" data-act="resetno">ยกเลิก</button></div>`:`<div><button class="btn" data-act="resetask">รีเซ็ตข้อมูลตัวอย่าง</button></div>`}</div>
  </div>`;
}

/* ---------- events ---------- */
document.addEventListener('click',e=>{
  const b=e.target.closest('[data-act]');if(!b)return;const a=b.dataset.act,ui=S.ui,f=ui.form;
  switch(a){
    case'tab':ui.view=b.dataset.v;ui.pinFor=null;break;
    case'gojudge':ui.view='judge';ui.field=b.dataset.f;break;
    case'field':ui.field=b.dataset.f;ui.pinFor=null;if(f&&f.editRunId)ui.form=null;break;
    case'inc':case'dec':{const t=team(f.teamId),c=compOf(t.cls),m=c.missions.find(x=>x.id===b.dataset.m);if(a==='inc'&&!needsMet(c,f.items,m)){toast('ทำ'+needText(c,m)+'ให้ครบก่อน');return}
      if(a==='inc'&&closedBy(c,f.items,m)){toast(closedBy(c,f.items,m).label+' ต้องเป็นชิ้นสุดท้ายที่เก็บ');return}
      if(navigator.userActivation?.isActive)navigator.vibrate?.(12);const was=f.items[m.id]||0;f.items[m.id]=Math.max(0,Math.min(m.max,was+(a==='inc'?1:-1)));tidy(c,f.items);f.confirm=false;
      if(m.ends&&f.items[m.id]>was&&liveT(f)?.state==='run')tStop(f.field);
      if(f.items[m.id]!==was)liveSync(f,{label:m.label,pts:(f.items[m.id]-was)*m.pts});break}
    case'pinc':f.pen++;f.confirm=false;liveSync(f,{label:'Retry',pts:0,retry:f.pen});break;
    case'pdec':f.pen=Math.max(0,f.pen-1);f.confirm=false;liveSync(f);break;
    case'swstart':if(!tStart(f.field)){toast('กดรีเซ็ตก่อนเริ่มจับเวลาใหม่');return}f.manual=false;f.setupEnd=null;break;
    case'setup':f.setupEnd=f.setupEnd?null:Date.now()+compOf(team(f.teamId).cls).setup*1000;render();return;
    case'swstop':tStop(f.field);break;
    // a false start: the whole attempt goes back to zero, on this sheet and on the timer screen
    case'swreset':if(!f.editRunId){tReset(f.field);Object.keys(f.items).forEach(k=>f.items[k]=0);f.pen=0}f.ms=0;f.manual=false;f.confirm=false;break;
    // a team may stop early, but the rules record the full match time
    case'swgiveup':{const lim=limitOf(f.field);if(liveT(f)?.state==='run')tStop(f.field,lim);f.ms=lim;f.manual=true;toast('บันทึกเวลาเป็น '+fmtMs(lim));break}
    case'submit':{if(!f.confirm)return;if(liveT(f)?.state==='run'){tStop(f.field);f.ms=timerOf(f.field).ms}
      if(f.ms<=0){toast('ยังไม่มีเวลาที่จับได้ กดเริ่มจับเวลา หรือใส่เวลาเอง');return}
      const t=team(f.teamId);f.ms=Math.min(f.ms,compOf(t.cls).timeLimit*1000);
      if(f.editRunId){const r=S.runs.find(x=>x.id===f.editRunId);(r.history=r.history||[]).push({items:r.items,pen:r.pen,ms:r.ms,at:nowHM()});Object.assign(r,{items:{...f.items},pen:f.pen,ms:f.ms});r.edits++;toast('บันทึกคะแนนที่แก้แล้ว · '+t.id+' ได้ '+score(r)+' คะแนน')}
      else{const r={id:t.id+'_'+f.round,team:t.id,round:f.round,items:{...f.items},pen:f.pen,ms:f.ms,at:nowHM(),ts:Date.now(),edits:0};S.runs.push(r);tReset(f.field);toast('ส่งคะแนนแล้ว · '+t.id+' ได้ '+score(r)+' คะแนน')}
      ui.form=null;break}
    case'skip':{const t=team(f.teamId),o=S.order[t.cls];o.splice(o.indexOf(t.id),1);o.push(t.id);tReset(f.field);ui.form=null;toast(t.id+' ไปต่อท้ายคิว');break}
    case'editask':ui.pinFor=b.dataset.id;render();setTimeout(()=>$('#pin')?.focus(),0);return;
    case'pincancel':ui.pinFor=null;break;
    case'pinok':{const v=$('#pin').value;if(v!==S.pin){toast('PIN ไม่ถูกต้อง');return}
      const r=S.runs.find(x=>x.id===b.dataset.id),t=team(r.team);ui.field=cls(t.cls).field;
      ui.form={field:ui.field,teamId:t.id,round:r.round,items:{...r.items},pen:r.pen,ms:r.ms,startAt:null,confirm:false,editRunId:r.id};ui.pinFor=null;break}
    case'canceledit':ui.form=null;break;
    case'ckf':ui.ckFilter=b.dataset.v;break;
    case'checkin':{const t=team(b.dataset.id);t.checkin=nowHM();ui.openInspect=t.id;toast(t.id+' เช็กอินแล้ว · ตรวจหุ่นต่อได้เลย');break}
    case'insp':ui.openInspect=b.dataset.id;break;
    case'iclose':ui.openInspect=null;break;
    case'ipass':case'ifail':{const id=b.dataset.id,t=team(id),box=document.querySelector(`[data-insp="${id}"]`);
      const all=[...box.querySelectorAll('[data-chk]')].every(x=>x.checked),note=$('#n-'+id).value.trim();
      if(a==='ipass'&&!all){toast('ติ๊กให้ครบทุกข้อก่อนกดผ่าน');return}
      if(a==='ifail'&&!note){toast('ระบุเหตุผลที่ไม่ผ่านในช่องหมายเหตุ');return}
      t.inspect={result:a==='ipass'?'pass':'fail',at:nowHM(),by:'จุดตรวจ 1',note};ui.openInspect=null;
      toast(a==='ipass'?id+' ผ่านการตรวจ · ขึ้นคิวสนาม '+cls(t.cls).field+' แล้ว':id+' ไม่ผ่าน · แจ้งทีมให้แก้แล้วกลับมาตรวจซ้ำ');break}
    case'bcls':ui.boardCls=b.dataset.v;break;
    case'viewboard':ui.boardCls=b.dataset.v;ui.view='board';break;
    case'copycsv':{const c=cls(ui.boardCls);const lines=['อันดับ,TeamID,ทีม,โรงเรียน,คะแนน,เวลา,Retry'].concat(standings(c.id).map(r=>[r.rank||'',r.t.id,r.t.name,r.t.school,r.b?r.b.score:'',r.b?fmtMs(r.b.run.ms):'',r.b?r.b.run.pen||0:''].join(',')));
      const txt=lines.join('\n');navigator.clipboard?.writeText(txt).then(()=>toast('คัดลอกผลแล้ว วางใน Excel ได้เลย')).catch(()=>toast('คัดลอกไม่ได้ในหน้าต่างนี้'));return}
    case'tpress':b.blur();tPress('คลิก');return;
    case'camon':CAMERR='';camOn();return;
    case'dirpick':dirPick(false);return;
    case'dirnew':dirPick(true);return;
    case'omove':{const t=team(b.dataset.id),o=S.order[t.cls],n=o.indexOf(t.id),k=n+ +b.dataset.d;if(k<0||k>=o.length)return;[o[n],o[k]]=[o[k],o[n]];break}
    case'teamgo':ui.teamQuery=$('#tq').value;rememberTeam(ui.teamQuery.trim());break;
    case'eye':{const i=$('#sc'),shown=i.type==='password';i.type=shown?'text':'password';b.setAttribute('aria-pressed',shown);b.innerHTML=eyeIcon(shown);i.focus();return}
    case'gate':{const v=$('#sc').value.trim();if(!v)return;
      if(CLOUD){if(!window.PT_BACKEND){toast('ยังโหลดไม่เสร็จ รอสักครู่แล้วกดใหม่');return}b.disabled=true;
        window.PT_BACKEND.enter(v).then(ok=>{if(!ok)toast('รหัสไม่ถูกต้อง');render()}).catch(()=>{toast('เข้าไม่ได้ เช็กเน็ตแล้วกดใหม่');render()});return}
      if(v!==S.staffPin){toast('รหัสไม่ถูกต้อง');return}keepStaff();break}
    case'copylink':navigator.clipboard?.writeText(b.dataset.u).then(()=>toast('คัดลอกลิงก์แล้ว')).catch(()=>toast('คัดลอกไม่ได้ในหน้าต่างนี้'));return;
    case'full':{const st=$('#stage');if(st.requestFullscreen)st.requestFullscreen().catch(()=>toast('เบราว์เซอร์นี้เปิดเต็มจอไม่ได้'));else toast('เบราว์เซอร์นี้เปิดเต็มจอไม่ได้');return}
    case'imp':{const mode=b.dataset.mode,lines=$('#imp').value.split(/\r?\n/).map(l=>l.trim()).filter(Boolean);let ok=0,bad=[];const add=[];
      lines.forEach((l,i)=>{const p=l.split(/\t|,/).map(x=>x.trim());if(i===0&&/team\s*id/i.test(p[0]))return;
        if(p.length<4||!cls(p[3])){bad.push(i+1);return}
        if(mode==='add'&&S.teams.some(t=>t.id===p[0])){bad.push(i+1);return}
        add.push({id:p[0],name:p[1],school:p[2],cls:p[3],checkin:null,inspect:null});ok++});
      if(mode==='replace'&&ok){S.teams=[];S.runs=[];S.classes.forEach(c=>S.order[c.id]=[]);ui.form=null}
      add.forEach(t=>{S.teams.push(t);S.order[t.cls].push(t.id)});
      ui.adminMsg=`นำเข้าแล้ว <b>${ok}</b> ทีม${bad.length?` · ข้ามบรรทัดที่ ${bad.join(', ')} (รหัสรุ่นไม่ถูกหรือ Team ID ซ้ำ)`:''}`;break}
    case'resetask':ui.resetAsk=true;break;
    case'resetno':ui.resetAsk=false;break;
    case'resetyes':{const k={view:S.ui.view,venue:S.venue,pin:S.pin,staffPin:S.staffPin};S=seed();S.ui.view=k.view;S.venue=k.venue;S.pin=k.pin;S.staffPin=k.staffPin;toast('กลับเป็นข้อมูลตัวอย่างตั้งต้นแล้ว');break}
    default:return;
  }
  save();render();
});
document.addEventListener('change',e=>{
  const el=e.target;
  if(el.id==='venue'){S.venue=el.value;toast('เปลี่ยนเป็น'+VENUES.find(v=>v[0]===el.value)[1]+(CLOUD?'':' (ต้นแบบใช้ข้อมูลตัวอย่างชุดเดียวกัน)'));save();render();return}
  if(el.id==='osel'){S.ui.orderCls=el.value;render();return}
  if(el.id==='bsel'){S.ui.boardCls=el.value;render();return}
  if(el.id==='fsel'){S.ui.field=el.value;S.ui.pinFor=null;if(S.ui.form?.editRunId)S.ui.form=null;render();return}
  if(el.id==='cf'){S.ui.form.confirm=el.checked;render();return}
  if(el.id==='mt'){const f=S.ui.form;if(liveT(f)?.state==='run')tStop(f.field);f.ms=Math.max(0,Math.round((+el.value||0)*1000));f.manual=true;save();render();return}
  const bd=el.dataset.bind;if(!bd)return;
  if(bd==='field')cls(el.dataset.c).field=el.value;
  if(bd==='rounds')S.rounds=+el.value;
  if(bd==='pin')S.pin=el.value.trim()||'1234';
  if(bd==='staff'){S.staffPin=el.value.trim()||'2026';keepStaff()}
  S.ui.form=null;toast('บันทึกการตั้งค่าแล้ว');save();render();
});
document.addEventListener('input',e=>{if(e.target.id==='ckq'){S.ui.ckQuery=e.target.value;renderCkList()}});
document.addEventListener('keydown',e=>{
  if(ROLE==='timer'&&S.ui.view==='timer'&&READY&&!needGate()&&clsOfField(LOCK)&&CLICKER.includes(e.key)&&!/^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)){e.preventDefault();if(!e.repeat)tPress(e.key===' '?'Space bar':e.key);return}
  if(e.key!=='Enter')return;
  if(e.target.id==='tq'){document.querySelector('[data-act="teamgo"]')?.click()}
  if(e.target.id==='sc'){document.querySelector('[data-act="gate"]')?.click()}
  if(e.target.id==='pin'){document.querySelector('[data-act="pinok"]')?.click()}
});
readHash();
render();
