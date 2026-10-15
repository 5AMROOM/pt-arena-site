const VENUES=[['C','ภาคกลาง · นนทบุรี','14–15 พ.ย. 2569'],['S','ภาคใต้ · สุราษฎร์ธานี','21–22 พ.ย. 2569'],['E','ภาคตะวันออก · ชลบุรี','28–29 พ.ย. 2569'],['N','ภาคเหนือ · แพร่','19–20 ธ.ค. 2569'],['NE','ภาคตะวันออกเฉียงเหนือ · ร้อยเอ็ด','26–27 ธ.ค. 2569']];
const TABS=[['overview','ภาพรวมสนาม','หัวหน้ากรรมการ'],['devices','ห้องควบคุม','หัวหน้างาน'],['checkin','เช็กอิน & ตรวจหุ่น','จุดลงทะเบียน'],['judge','กรรมการให้คะแนน','ประจำสนาม'],['board','กระดานผล','ทุกคน'],['live','สด','ดูแข่งสด'],['team','หน้าทีม','ครู · นักเรียน'],['field','สนาม','ภาพสนาม'],['screen','จอใหญ่','จอในงาน'],['mc','เรียกคิว','พิธีกร'],['admin','ตั้งค่า','แอดมิน']];
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
  return{venue:'C',rounds:2,pin:'1234',staffPin:'2026',comps,classes,teams,runs,order,timers:{},live:{},clips:{},drive:{url:'',key:''},ts,
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
const DATA_KEYS=['venue','rounds','pin','staffPin','live','clips','drive','classes','teams','runs','order','timers','ts'];
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

/* ---------- roles: the link decides what a device sees (#staff, #judge, #judge-A, #timer-A, #cam-A, #screen, #mc, none = viewers) ---------- */
const ROLE_TABS={view:['team','board','field','live'],judge:['judge','board'],timer:['timer'],cam:['cam'],screen:['screen'],mc:['mc','board'],staff:TABS.map(t=>t[0])};
const STAFF_KEY='ptarena:staffcode',MYTEAM_KEY='ptarena:myteam',FIELD_KEY='ptarena:field';
const rememberField=()=>{if(ROLE==='judge')try{localStorage.setItem(FIELD_KEY,S.ui.field)}catch(e){}};
let ROLE='view',LOCK=null;
function readHash(){
  const h=decodeURIComponent(location.hash.slice(1)).trim(),m=/^(judge|timer|cam)-(.+)$/i.exec(h);
  if(m){ROLE=m[1].toLowerCase();LOCK=m[2].toUpperCase()}else{LOCK=null;ROLE=h==='staff'||h==='screen'||h==='mc'||h==='judge'?h:'view'}
  // #judge without a field: the judge picks the field on the page, and this phone remembers it
  if(ROLE==='judge'&&!LOCK){try{S.ui.field=localStorage.getItem(FIELD_KEY)||S.ui.field}catch(e){}}
  if(ROLE!=='staff'){let q='';try{q=localStorage.getItem(MYTEAM_KEY)||''}catch(e){}S.ui.teamQuery=q}
}
const staffOk=()=>{if(CLOUD)return CLOUD_STAFF;try{return localStorage.getItem(STAFF_KEY)===S.staffPin}catch(e){return false}};
const keepStaff=()=>{if(CLOUD)return;try{localStorage.setItem(STAFF_KEY,S.staffPin)}catch(e){}};
// the sample-data mode (?local) holds nothing real, so it asks for no code
const needGate=()=>CLOUD&&(ROLE==='judge'||ROLE==='timer'||ROLE==='cam'||ROLE==='staff')&&!staffOk();
const rememberTeam=q=>{if(ROLE!=='staff')try{localStorage.setItem(MYTEAM_KEY,q)}catch(e){}};
// slash = hidden, open eye = shown
const eyeIcon=shown=>`<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="display:block"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>${shown?'':'<path d="M4 4l16 16"/>'}</svg>`;
function vGate(){return`<div class="panel" style="max-width:420px;margin:0 auto;width:100%"><h2>สำหรับเจ้าหน้าที่</h2>
  <div class="row gate"><span class="pw"><input type="password" id="sc" placeholder="รหัสเจ้าหน้าที่" autocapitalize="none" autocomplete="off" autocorrect="off" spellcheck="false"><button class="eye" data-act="eye" aria-label="แสดงรหัส" aria-pressed="false">${eyeIcon(false)}</button></span><button class="btn pri" data-act="gate">เข้า</button></div></div>`}
document.addEventListener('fullscreenchange',()=>{if(S.ui.view==='timer'&&!document.fullscreenElement)render()});
window.addEventListener('hashchange',()=>{readHash();window.PT_BACKEND?.role?.();render()});

/* ---------- shell ---------- */
const ICO={team:'<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-6 8-6s8 2 8 6"/>',
  live:'<circle cx="12" cy="12" r="2"/><path d="M8.5 8.5a5 5 0 0 0 0 7M15.5 8.5a5 5 0 0 1 0 7M5.6 5.6a9 9 0 0 0 0 12.8M18.4 5.6a9 9 0 0 1 0 12.8"/>',
  board:'<path d="M8 4h8v6a4 4 0 0 1-8 0zM8 6H5a3 3 0 0 0 3 4M16 6h3a3 3 0 0 1-3 4M12 14v4M8 20h8"/>',
  field:'<path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2zM9 4v14M15 6v14"/>',
  judge:'<path d="M9 3h6v4H9zM8 5H5v16h14V5h-3M9 13l2 2 4-4"/>',
  flag:'<path d="M5 21V4M5 4h11l-2 4 2 4H5"/>',
  bell:'<path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4zM10 21h4"/>',
  check:'<path d="M5 12l5 5 9-10"/>',
  wait:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  alert:'<path d="M12 3l10 18H2zM12 10v4M12 17.5v.5"/>',
  play:'<path d="M7 4l13 8-13 8z"/>'};
const icon=n=>`<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICO[n]}</svg>`;
function renderShell(){
  const tabs=needGate()?[]:TABS.filter(t=>ROLE_TABS[ROLE].includes(t[0]));
  $('#venue').innerHTML=VENUES.map(v=>`<option value="${v[0]}" ${v[0]===S.venue?'selected':''}>${v[1]} · ${v[2]}</option>`).join('');
  $('#venue').disabled=ROLE!=='staff'||needGate();
  $('#demo').hidden=ROLE!=='staff'||needGate();
  // viewers and judges do not pick the venue: they get its name, and on a phone their few tabs sit at the thumb
  const staff=ROLE==='staff'&&!needGate(),few=tabs.length>1&&tabs.length<=4;
  $('.venue').hidden=!staff;$('#sub').textContent=staff?'ระบบวันแข่ง':VENUES.find(v=>v[0]===S.venue)[1];
  $('.tabs-wrap').classList.toggle('few',few);document.body.classList.toggle('hasnav',few);
  $('.tabs-wrap').hidden=tabs.length<2;
  // a judge scoring on a phone gets the whole screen for the sheet: no header, no tab bar
  document.body.classList.toggle('jfocus',ROLE==='judge'&&!needGate()&&S.ui.view==='judge');
  document.body.classList.toggle('camfocus',ROLE==='cam'&&!needGate());
  document.body.classList.toggle('crwall',ROLE==='staff'&&!needGate()&&S.ui.view==='devices');
  $('#tabs').innerHTML=tabs.map(t=>`<button class="tab" role="tab" data-act="tab" data-v="${t[0]}" aria-selected="${S.ui.view===t[0]}">${ICO[t[0]]?icon(t[0]):''}<b>${t[1]}</b><small>${t[2]}</small></button>`).join('');
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
  // the timer picture in full screen must stay where it is: moving it in the page would drop out of full screen,
  // and everything it shows is drawn on it anyway
  if(S.ui.view==='timer'&&CV&&document.fullscreenElement===CV)return;
  // in full screen only the inside is swapped: replacing the element itself would drop out of full screen
  const fs=document.fullscreenElement;
  if(S.ui.view==='screen'&&fs&&fs.id==='stage'){const tmp=document.createElement('div');tmp.innerHTML=vScreen();fs.innerHTML=tmp.querySelector('#stage').innerHTML;clock();return}
  if(v==='live'&&$('#livebody')&&$('#ytbox')?.dataset.k===liveKey()){$('#livebody').innerHTML=liveBody();$('.chbar').innerHTML=chBar();return}
  const map={overview:vOverview,checkin:vCheckin,judge:vJudge,timer:vTimer,board:vBoard,team:vTeam,field:vField,live:vLive,cam:vCam,devices:vDevices,screen:vScreen,mc:vMc,admin:vAdmin};
  const typing=document.activeElement?.id==='tfind';
  $('#view').innerHTML=map[v]();if(typing){const i=$('#tfind');if(i){i.focus();i.setSelectionRange(i.value.length,i.value.length)}}
  if(ROLE==='view')noteCheck();
  if(v==='checkin')renderCkList();if(v==='judge'){tickSW();sigAfter()}if(v==='timer')timerAfter();if(v==='cam')camAfter();if(v==='screen')clock();}

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
      <div class="grid" style="align-content:start"><div class="row between"><h2>ทุกสนามในจอเดียว</h2><span class="small muted">แตะการ์ดเพื่อเปิดหน้ากรรมการ</span></div><div class="fields">${cards}</div></div>
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
   every device works out how far its own clock is from the server's (OFFSET), so a start time means the same instant
   on the laptop and on the phone, and the phone does not trail behind by the network delay. */
let DEVICE;try{DEVICE=sessionStorage.getItem('ptarena:device')||Math.random().toString(36).slice(2,8);sessionStorage.setItem('ptarena:device',DEVICE)}catch(e){DEVICE=Math.random().toString(36).slice(2,8)}
let OFFSET=0,OFFSET_OK=false;            // server clock minus this device's clock; set by sync.js
const nowS=()=>Date.now()+OFFSET;        // "now" on the shared clock
const MYSTART={};                        // this device's own clock at the moment it started a run: exact, whatever OFFSET does later
const timerOf=field=>S.timers[field]||{state:'idle',ms:0};
const tElapsed=t=>t.state!=='run'?t.ms||0:Math.max(0,t.by===DEVICE&&MYSTART[t.startAt]!=null?Date.now()-MYSTART[t.startAt]:nowS()-t.startAt);
const limitOf=field=>S.comps[clsOfField(field).comp].timeLimit*1000;
function tStart(field){
  const c=clsOfField(field),q=queue(c.id),t=timerOf(field);if(!q.length)return false;
  // a stopped clock stays until the judge submits or resets, so a stray press cannot wipe a result
  if(t.state!=='idle'&&t.team===q[0].id&&t.round===curRound(c.id))return false;
  const same=t.team===q[0].id&&t.round===curRound(c.id);
  const at=nowS();MYSTART[at]=Date.now();
  S.timers[field]={state:'run',team:q[0].id,round:curRound(c.id),startAt:at,sentAt:at,by:DEVICE,ms:0,live:same&&t.live||null,ev:same&&t.ev||null};return true}
function tStop(field,ms){const t=timerOf(field);if(t.state!=='run')return false;
  // kept to the hundredth that is shown, so two times that look equal are equal when ranking
  S.timers[field]={...t,state:'stop',ms:Math.floor(Math.min(ms??tElapsed(t),limitOf(field))/10)*10,sentAt:nowS()};return true}
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
      ${f.editRunId?`<div class="editbar"><span>กำลังแก้คะแนน · ระบบเก็บประวัติการแก้ไว้</span><button class="btn sm" data-act="canceledit">ยกเลิก</button></div>`:''}
      <div class="jtop"><div class="jwho"><div class="small muted">สนาม ${c.field} · ${esc(S.comps[c.comp].tag)} ${esc(c.level)} · รอบ ${f.round}/${S.rounds}</div><div class="jteam"><span class="tid">${t.id}</span> ${esc(t.name)}</div><div class="small muted">${esc(t.school)}</div></div>
        <div class="jclock"><span class="t mono ${running?'run':''} ${el>lim*1000?'over':''}" id="sw">${fmtMs(el)}</span><div class="small muted">จาก ${Math.floor(lim/60)}:${String(lim%60).padStart(2,'0')}</div></div>
        <details class="jmenu"><summary aria-label="เมนูเพิ่มเติม">⋯</summary><div class="jpop">
          <button class="btn" data-act="swreset">รีเซ็ตรอบนี้</button>
          <label class="jmt"><span>แก้เวลาเอง (วินาที)</span><input type="number" id="mt" inputmode="decimal" step="0.01" min="0" value="${(f.ms/1000).toFixed(2)}"></label>
          ${f.editRunId?'':`<button class="btn" data-act="skip">ทีมไม่มา · ข้ามคิว</button>`}
          ${ROLE==='judge'?`<button class="btn" data-act="tab" data-v="board">ดูกระดานผล</button>`:''}</div></details></div>
      <div class="jtimer">
        ${running?`<button class="btn big jmain stop" data-act="swstop">■ หยุดเวลา</button>`:T||f.editRunId?'':`<button class="btn pri big jmain" data-act="swstart">▶ เริ่มจับเวลา</button>`}
        <button class="btn" data-act="swgiveup">ทีมขอหยุด</button>
        ${cp.setup&&!T&&!f.editRunId?`<button class="btn" data-act="setup"><span id="su">${f.setupEnd?'ตั้งหุ่น …':'ตั้งหุ่น '+Math.floor(cp.setup/60)+':'+String(cp.setup%60).padStart(2,'0')}</span></button>`:''}
      </div>
      <div class="jlist">${cp.missions.map(row).join('')}
        <div class="jm retry"><div class="lbl"><b>Retry</b><small>ไม่หักคะแนน</small></div><div class="jstep"><button data-act="pdec" aria-label="ลด" ${f.pen?'':'disabled'}>−</button><span><b>${f.pen}</b></span><button data-act="pinc" aria-label="เพิ่ม">+</button></div><div class="sub muted small">ครั้ง</div></div></div>
      <div class="jbar"><div class="jsum"><span class="small muted">รวม</span><b class="n">${formTotal(f)}</b></div>
        ${f.confirm?`<button class="jok ${f.nosign?'':'on'}" data-act="signopen">${f.nosign?'ทีมไม่เซ็น':'✓ เซ็นแล้ว'}</button><button class="btn pri big" data-act="submit">${f.editRunId?'บันทึก':'ส่งคะแนน'}</button>`
          :`<button class="btn pri big" data-act="signopen">ยืนยันผล</button>`}</div>
    </div>`}
  const qhtml=q.map((t,i)=>`<div class="qitem ${i===0?'now':''}"><span class="qn">${i+1}</span><span class="tid">${t.id}</span><span style="flex:1;min-width:0">${esc(t.name)}</span>${i===0?'<span class="pill ac">ในสนาม</span>':''}</div>`).join('');
  const done=S.runs.filter(x=>team(x.team)?.cls===c.id).sort((a,b)=>b.ts-a.ts);
  const dhtml=done.map(x=>{const t=team(x.team);return`<div class="qitem" style="flex-wrap:wrap"><span class="tid">${t.id}</span><span style="flex:1;min-width:0">รอบ ${x.round} · <b class="mono">${score(x)}</b> · <span class="mono muted">${fmtMs(x.ms)}</span>${x.edits?` <span class="pill warn">แก้ ${x.edits} ครั้ง</span>`:''}</span>
    ${S.clips?.[x.id]?`<a class="pill ac" href="${clipLink(S.clips[x.id])}" target="_blank" rel="noopener">▶ คลิป</a>`:''}
    ${x.sign==='yes'?`<button class="pill ok" data-act="signview" data-id="${x.id}">ลายเซ็น</button>`:x.sign==='no'?'<span class="pill warn">ทีมไม่เซ็น</span>':''}
    ${S.ui.pinFor===x.id?`<span class="row" style="width:100%"><input type="password" id="pin" inputmode="numeric" placeholder="PIN หัวหน้ากรรมการ" style="width:150px"><button class="btn sm pri" data-act="pinok" data-id="${x.id}">แก้คะแนน</button><button class="btn sm" data-act="pincancel">ยกเลิก</button></span>`:`<button class="btn sm jfix" data-act="editask" data-id="${x.id}">แก้</button>`}</div>`}).join('');
  // the team reads its score and signs with a finger on the judge's phone, as the rules ask ("ลงชื่อรับทราบผล")
  const signer=f&&S.ui.signing?(t=>`<div class="signer"><div><div class="small muted">สนาม ${c.field} · ${esc(cp.tag)} ${esc(c.level)} · รอบ ${f.round}</div><div class="jteam"><span class="tid">${t.id}</span> ${esc(t.name)}</div></div>
    <div class="sgscore"><b class="mono">${formTotal(f)}</b><span>คะแนน</span><span class="mono muted">เวลา ${fmtMs(elapsed(f))} · Retry ${f.pen}</span></div>
    <div class="sgpad"><canvas id="sig"></canvas><span class="sghint">ทีมเซ็นชื่อตรงนี้</span></div>
    <div class="sgrow"><button class="btn" data-act="signclear">ล้าง</button><button class="btn" data-act="signno">ทีมไม่เซ็น</button></div>
    <div class="sgrow"><button class="btn" data-act="signcancel">กลับ</button><button class="btn pri big" id="sgok" data-act="signok" disabled>รับทราบผล</button></div></div>`)(team(f.teamId)):'';
  const sv=S.ui.signView,viewer=sv?`<div class="signer"><div><div class="jteam">ลายเซ็นรับทราบผล · <span class="tid">${esc(sv.id.replace('_',' รอบ '))}</span></div><div class="small muted">${sv.d?`${sv.d.score} คะแนน · ${fmtMs(sv.d.ms)} · เซ็นเวลา ${esc(sv.d.at)}`:'ไม่มีลายเซ็นรอบนี้'}</div></div>
    ${sv.d?.pts?`<div class="sgpad"><canvas id="sigv"></canvas></div>`:''}<div class="sgrow"><button class="btn pri big" data-act="signclose">ปิด</button></div></div>`:'';
  return`<div class="grid">${signer}${viewer}
    ${LOCK?'':`<div class="chips fchips">${fieldChips}</div><select id="fsel" class="fsel" aria-label="เลือกสนาม">${fieldsSorted().map(x=>`<option value="${x.field}" ${x.field===S.ui.field?'selected':''}>สนาม ${x.field} · ${esc(S.comps[x.comp].tag)} ${esc(x.level)}</option>`).join('')}</select>`}
    <div class="grid g-side">${form}
      <div class="grid" style="align-content:start">
        <div class="panel"><h3>คิวสนาม ${c.field}${curRound(c.id)?' · รอบ '+curRound(c.id):''}</h3><div>${qhtml||'<span class="muted small">ไม่มีทีมรอคิว</span>'}</div></div>
        <div class="panel"><h3>ส่งคะแนนแล้ว</h3><p class="small muted" style="margin:0">ส่งแล้วคะแนนจะล็อก แก้ได้เฉพาะหัวหน้ากรรมการ${ROLE==='staff'?` (PIN ตัวอย่าง: ${S.pin})`:''}</p><div>${dhtml||'<span class="muted small">ยังไม่มี</span>'}</div></div>
        ${ROLE==='judge'?`<button class="btn narrow jboard" data-act="tab" data-v="board">ดูกระดานผล</button>`:''}
      </div></div></div>`;
}
/* signature: strokes are kept as points on a 1000-wide grid, so they redraw the same on any screen */
let SIG=[],SIGON=false;
const SIGN_KEY='ptarena:signs',sigDecode=s=>s?s.split(';').map(a=>a.split(',').map(Number)):[];
function sigPaint(id,strokes){
  const cv=$('#'+id);if(!cv)return;const r=cv.getBoundingClientRect(),d=window.devicePixelRatio||1;cv.width=r.width*d;cv.height=r.height*d;
  const x=cv.getContext('2d'),k=cv.width/1000;x.lineWidth=2.8*d;x.lineCap=x.lineJoin='round';x.strokeStyle='#10151F';
  strokes.forEach(s=>{x.beginPath();x.moveTo(s[0]*k,s[1]*k);for(let i=2;i<s.length;i+=2)x.lineTo(s[i]*k,s[i+1]*k);if(s.length===2)x.lineTo(s[0]*k+.5,s[1]*k);x.stroke()});
}
function sigAfter(){sigPaint('sig',SIG);const ok=$('#sgok');if(ok)ok.disabled=!SIG.length;const h=$('.sghint');if(h)h.hidden=!!SIG.length;if(S.ui.signView?.d?.pts)sigPaint('sigv',sigDecode(S.ui.signView.d.pts))}
const sigPt=e=>{const r=$('#sig').getBoundingClientRect(),k=1000/r.width;return[Math.round((e.clientX-r.left)*k),Math.round((e.clientY-r.top)*k)]};
document.addEventListener('pointerdown',e=>{if(e.target.id!=='sig')return;e.preventDefault();SIGON=true;SIG.push(sigPt(e));sigAfter()});
document.addEventListener('pointermove',e=>{if(!SIGON||!$('#sig'))return;const s=SIG[SIG.length-1],p=sigPt(e);if(Math.abs(p[0]-s[s.length-2])+Math.abs(p[1]-s[s.length-1])<4)return;s.push(...p);sigAfter()});
['pointerup','pointercancel'].forEach(n=>document.addEventListener(n,()=>{SIGON=false}));
// signatures are not public like scores: they go to a staff-only place, and this phone keeps its own copy too
const localSigns=()=>{try{return JSON.parse(localStorage.getItem(SIGN_KEY))||{}}catch(e){return{}}};
function saveSign(id,d){
  const k=S.venue+'_'+id;try{const m=localSigns();m[k]=d;localStorage.setItem(SIGN_KEY,JSON.stringify(m))}catch(e){}
  if(CLOUD)window.PT_BACKEND.sign(k,d).catch(()=>toast('ลายเซ็นยังไม่ได้อัปโหลด เซฟไว้ในเครื่องนี้แล้ว'));
}
const getSign=id=>{const k=S.venue+'_'+id,mine=localSigns()[k]||null;return CLOUD?window.PT_BACKEND.getSign(k).then(d=>d||mine,()=>mine):Promise.resolve(mine)};
function tickSW(){const f=S.ui.form,el=$('#sw');if(!f||!el)return;const ms=elapsed(f);el.textContent=fmtMs(ms);const lim=compOf(team(f.teamId).cls).timeLimit*1000;el.classList.toggle('over',ms>lim);
  const su=$('#su');if(su&&f.setupEnd){const left=f.setupEnd-Date.now();su.textContent=left>0?'ตั้งหุ่น '+fmtMs(left):'หมดเวลาตั้งหุ่น';su.classList.toggle('over',left<=0)}}
setInterval(()=>{autoStop();if(S.ui.view==='judge'&&S.ui.form)tickSW();if(S.ui.view==='timer')tickTimer();if(S.ui.view==='screen'||S.ui.view==='live'||S.ui.view==='devices')document.querySelectorAll('[data-tm]').forEach(el=>el.textContent=fmtMs(tElapsed(timerOf(el.dataset.tm))))},40);

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
        <div style="font-size:18px">${label}</div>
        <div><button class="btn" data-act="tfull">⛶ เต็มจอ</button></div><div class="sub2">ปุ่มที่กดล่าสุด: <b>${esc(LASTKEY||'ยังไม่มี')}</b></div>
        ${CAMERR?`<div><b>เปิดกล้องไม่ได้</b><ol style="margin:4px 0;padding-left:20px"><li>เช็กว่าเสียบกล้องแล้ว</li><li>กดรูปกล้องบนแถบที่อยู่เว็บ แล้วเลือกอนุญาต</li><li>กดปุ่มข้างล่าง</li></ol><button class="btn sm" data-act="camon">เปิดกล้องอีกครั้ง</button></div>`:''}
        ${RECERR?`<div><b>อัดวิดีโอไม่ได้</b> <span class="sub2">${esc(RECERR)}</span></div>`:''}
        ${CAMS.length||PHONE||CAMID==='phone'?`<label class="tset"><span>กล้อง</span><select id="camsel" ${t.state==='run'?'disabled':''}>${CAMS.map((d,n)=>`<option value="${esc(d.deviceId)}" ${d.deviceId===CAMID?'selected':''}>${esc(d.label||'กล้อง '+(n+1))}</option>`).join('')}<option value="phone" ${CAMID==='phone'?'selected':''}>กล้องมือถือ (#cam-${esc(LOCK)})${PHONE?' · ต่ออยู่':''}</option></select></label>`:''}
        ${CAMID==='phone'&&!PHONE?`<div class="sub2"><b>รอภาพจากมือถือ</b> เปิดลิงก์ #cam-${esc(LOCK)} บนมือถือที่ต่อ Wi‑Fi เดียวกัน แล้วกด ▶ เริ่มส่งภาพ</div>`:''}
        <label class="tset"><span>ความชัด</span><select id="qsel" ${t.state==='run'?'disabled':''}>${Object.entries(CAMQ).map(([k,q])=>`<option value="${k}" ${k===QUAL?'selected':''}>${q.label}</option>`).join('')}</select></label>
        <label class="tset"><span>เสียงในคลิป · <b id="audwhere">${esc(audioWhere())}</b></span><select id="audsel" ${t.state==='run'?'disabled':''}><option value="on" ${AUDIO?'selected':''}>เปิด</option><option value="off" ${AUDIO?'':'selected'}>ปิด</option></select></label>
        <label class="tset"><span>ความลื่น (ภาพต่อวินาที)</span><select id="fpsel" ${t.state==='run'?'disabled':''}>${Object.entries(FPS_LIST).map(([k,v])=>`<option value="${k}" ${+k===FPS?'selected':''}>${v}</option>`).join('')}</select></label>
        ${CAMREAL?`<div class="sub2" id="camreal">กล้องส่งภาพมา ${CAMREAL}</div>`:''}
        <div class="tset"><span>รูปแบบกราฟิก · ${Object.keys(GFX_LIST).length} แบบ</span>${(()=>{const opt=(k,tag,extra)=>{const [nm,ds]=GFX_LIST[k].split(' · '),w=GFX_SW[k]||['#333','#999'];return`<${tag} class="gopt" ${extra}><i style="background:linear-gradient(135deg,${w[0]} 50%,${w[1]} 50%)"></i><b>${esc(nm)}</b><small>${esc(ds||'')}</small></${tag}>`};
          return`<details class="gdrop"><summary>${opt(GFX,'span','')}<em aria-hidden="true">▾</em></summary><div class="glist" id="glist">${Object.keys(GFX_LIST).map(k=>opt(k,'button',`data-act="gfx" data-v="${k}" aria-pressed="${k===GFX}"`)).join('')}</div></details>`})()}</div>
        ${lensPanel()}
        ${CAM?`<label class="tset"><span>ครอปภาพ: เลื่อนแถบเพื่อซูม ลากบนภาพเพื่อเลือกส่วน</span><input type="range" id="czoom" min="1" max="3" step="0.05" value="${CROP.z}"></label>
        <div class="row"><button class="btn sm" data-act="cropreset">ภาพเต็ม</button><button class="btn sm" data-act="rotl" title="หมุนซ้าย 90°">⟲ หมุนซ้าย</button><button class="btn sm" data-act="rotr" title="หมุนขวา 90°">⟳ หมุนขวา</button><button class="btn sm" data-act="flip" aria-pressed="${FLIP}">⇋ กลับด้าน</button><span class="sub2">${ROT}°${FLIP?' · กลับด้าน':''}</span></div>`:''}
        <div class="sub2">เซฟคลิปที่: <b>${esc(DIR&&DIRSTATE==='ok'?DIR.name:'Downloads')}</b>${SAVED?`<br>ล่าสุด: ${esc(SAVED)}`:''}</div>
        ${S.drive?.url?`<div class="sub2" id="upst">${esc(upText())}</div>`:''}
        ${canPick?`<div class="row">${DIR&&DIRSTATE==='ask'?`<button class="btn sm pri" data-act="dirpick">ใช้โฟลเดอร์ ${esc(DIR.name)} ต่อ</button>`:''}<button class="btn sm" data-act="dirnew">เลือกโฟลเดอร์</button></div>`:''}
        ${CLIP&&t.state!=='run'?`<div class="sub2">ดูย้อนหลัง · ${esc(CLIP.name)}</div><video id="clip" controls src="${CLIP.url}"></video>`:''}</div>
    </div></div>`;
}
function timerAfter(){
  $('#cvbox')?.append(stageCanvas());if(!CAM&&!CAMERR&&!CAMASK)camOn();phoneListen();if(AUDIO&&!LAPMIC&&!MICERR)micOn();if(!DIRASKED){DIRASKED=true;dirLoad()}
  // a fresh recording has no length written in it; jumping to the end once makes the browser work it out, so the bar can be dragged
  const v=$('#clip');if(v)v.onloadedmetadata=()=>{if(v.duration===Infinity){v.ontimeupdate=()=>{v.ontimeupdate=null;v.currentTime=0};v.currentTime=1e9}};
}

/* The picture shown on the timer laptop and written into the recording: webcam frame with broadcast graphics on top.
   Drawing is fenced off from the clock: if a frame fails it is skipped, timing and scoring carry on. */
const LOGO=new Image();LOGO.src='logo-mark.png';
// Camera choices made on the timer laptop, remembered on that laptop. The graphics are laid out for 1280 x 720 and
// scaled to whichever size is picked; the sizes per run are for a full 3 minute match.
const CAMQ={low:{w:854,h:480,bps:1200000,label:'ประหยัด 480p · ราว 25 MB ต่อรอบ'},mid:{w:1280,h:720,bps:2500000,label:'ปกติ 720p · ราว 55 MB ต่อรอบ'},high:{w:1920,h:1080,bps:5000000,label:'ชัดมาก 1080p · ราว 110 MB ต่อรอบ'}};
const keep=(k,v)=>{try{if(v===undefined)return localStorage.getItem(k)||'';localStorage.setItem(k,v)}catch(e){return''}};
// which part of the camera picture is used: z = zoom (1 = as much as fits), x and y = where the window sits (0..1)
// the camera picture may be mounted any way round above the field: turned in steps of 90°, and mirrored if needed
let ROT=[0,90,180,270].includes(+keep('ptarena:rot'))?+keep('ptarena:rot'):0,FLIP=keep('ptarena:flip')==='on';
const setRot=r=>{ROT=((+r%360)+360)%360;keep('ptarena:rot',String(ROT))},setFlip=f=>{FLIP=!!f;keep('ptarena:flip',FLIP?'on':'off')};
let CROP={z:1,x:.5,y:.5};try{const c=JSON.parse(keep('ptarena:crop')||'null');if(c&&c.z>=1&&c.z<=4)CROP={z:+c.z,x:Math.min(1,Math.max(0,+c.x)),y:Math.min(1,Math.max(0,+c.y))}}catch(e){}
const saveCrop=()=>keep('ptarena:crop',JSON.stringify(CROP));
// Graphic layouts the timer laptop can switch between. BAR holds the looks that share the bottom-bar layout of drawBar.
const GFX_LIST={none:'ภาพล้วน · ไม่มีกราฟิก',logo:'โลโก้อย่างเดียว · มุมขวาบน',strip:'Midnight · แถบล่าง น้ำเงินม่วง',tower:'Pit Lane · แถบข้างซ้าย แดงดำ',clean:'Arctic · แถบล่าง สีขาว',neon:'Neon · แถบล่าง ฟ้าม่วง',gold:'Champion · แถบล่าง ดำทอง',cast:'Broadcast · แถบเดียวเต็มขอบล่าง',head:'Headline · แถบเดียวเต็มขอบบน',bug:'Scorebug · กล่องเล็กมุมซ้ายบน',carbon:'Carbon · แถบล่าง เทาแดง',mono:'Mono · แถบล่าง ขาวดำ',sunset:'Sunset · แถบล่าง ส้มชมพู',emerald:'Emerald · แถบล่าง เขียว',royal:'Royal · แถบข้างซ้าย น้ำเงินทอง',day:'Daylight · กล่องเล็กมุมซ้ายบน สีขาว',studio:'Studio · แถบเดียวขอบล่าง สีขาว',crimson:'Crimson · แถบล่าง แดงดำ',ocean:'Ocean · แถบล่าง น้ำเงินเขียวทะเล',amber:'Amber · แถบเดียวขอบล่าง เหลืองอำพัน',rally:'Rally · กล่องเล็กมุมซ้ายบน ส้ม',matrix:'Matrix · แถบข้างซ้าย เขียวดำ'};
// two colours that stand for each look in the picker
const GFX_SW={none:['#20262f','#20262f'],logo:['#20262f','#7A4FE0'],strip:['#3B6FE8','#7A4FE0'],tower:['#E10600','#0C0C10'],clean:['#FFFFFF','#1F5BD6'],neon:['#00E0FF','#7A4FE0'],gold:['#F5D06B','#0C0C0E'],cast:['#0E1218','#2F6BFF'],head:['#0E1218','#12B886'],bug:['#2F6BFF','#FFFFFF'],carbon:['#1B1E22','#E5383B'],mono:['#000000','#FFFFFF'],sunset:['#FF8A00','#E52E71'],emerald:['#19C37D','#06181A'],royal:['#1B2A6B','#F5D06B'],day:['#FFFFFF','#10151F'],studio:['#FFFFFF','#1F5BD6'],crimson:['#FF3B3B','#0A0A0C'],ocean:['#00C2A8','#0077FF'],amber:['#0E1218','#FFB020'],rally:['#FF5A1F','#0D1118'],matrix:['#0E9F6E','#06140F']};
const BAR={
  clean:{panel:'#FFFFFF',ink:'#10151F',dim:'#5B6677',a:'#1F5BD6',b:'#1F5BD6',on:'#FFFFFF',ok:'#1C8A57',warn:'#B86E05',r:10,skew:0,pips:false,shade:.3,glow:null},
  neon:{panel:'rgba(8,10,26,.9)',ink:'#FFFFFF',dim:'#A9B4D0',a:'#00E0FF',b:'#7A4FE0',on:'#FFFFFF',ok:'#00E0FF',warn:'#FFC857',r:0,skew:16,pips:true,shade:.75,glow:'#00E0FF'},
  carbon:{panel:'rgba(27,30,34,.95)',ink:'#FFFFFF',dim:'#A3ABB5',a:'#E5383B',b:'#E5383B',on:'#FFFFFF',ok:'#FFFFFF',warn:'#FFB454',r:3,skew:0,pips:false,shade:.6,glow:null},
  mono:{panel:'rgba(0,0,0,.92)',ink:'#FFFFFF',dim:'#9A9A9A',a:'#FFFFFF',b:'#FFFFFF',on:'#000000',ok:'#FFFFFF',warn:'#FFFFFF',r:0,skew:0,pips:true,shade:.6,glow:null},
  sunset:{panel:'rgba(22,10,24,.9)',ink:'#FFFFFF',dim:'#D9BCCB',a:'#FF8A00',b:'#E52E71',on:'#FFFFFF',ok:'#FFB36B',warn:'#FFD166',r:0,skew:16,pips:true,shade:.7,glow:null},
  emerald:{panel:'rgba(6,24,20,.93)',ink:'#FFFFFF',dim:'#A8C9BE',a:'#19C37D',b:'#0E9F6E',on:'#FFFFFF',ok:'#3EE6A0',warn:'#FFC857',r:12,skew:0,pips:false,shade:.65,glow:null},
  crimson:{panel:'rgba(10,10,12,.93)',ink:'#FFFFFF',dim:'#C9B5B8',a:'#FF3B3B',b:'#B00020',on:'#FFFFFF',ok:'#FF6B6B',warn:'#FFC857',r:0,skew:16,pips:true,shade:.72,glow:null},
  ocean:{panel:'rgba(8,20,40,.93)',ink:'#FFFFFF',dim:'#A9C0DA',a:'#00C2A8',b:'#0077FF',on:'#FFFFFF',ok:'#3FE0C5',warn:'#FFC857',r:14,skew:0,pips:false,shade:.65,glow:null},
  gold:{panel:'rgba(12,12,14,.92)',ink:'#FFFFFF',dim:'#B9B4A6',a:'#F5D06B',b:'#C99A2E',on:'#14110A',ok:'#F5D06B',warn:'#FF9F5A',r:4,skew:0,pips:true,shade:.7,glow:null}};
let GFX=GFX_LIST[keep('ptarena:gfx')]?keep('ptarena:gfx'):'strip';
let CAMID=keep('ptarena:cam'),QUAL=CAMQ[keep('ptarena:camq')]?keep('ptarena:camq'):'mid',CAMS=[],CAMREAL='';
// frames per second for the picture, the drawing and the recording; 60 needs a camera that gives 60 and a laptop that keeps up
const FPS_LIST={25:'25 fps · ประหยัดเครื่อง',30:'30 fps · ปกติ',60:'60 fps · ลื่น ไฟล์ใหญ่ขึ้นราว 1.6 เท่า'};
let FPS=FPS_LIST[keep('ptarena:fps')]?+keep('ptarena:fps'):30,DRAWT=null;
// sound in the clip: the phone's microphone when the picture comes from the phone, else this laptop's (or the webcam's)
let AUDIO=keep('ptarena:audio')!=='off',LAPMIC=null,MICERR='';
async function micOn(){
  if(!AUDIO||LAPMIC)return;
  try{LAPMIC=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:false,noiseSuppression:true,autoGainControl:true},video:false});MICERR=''}
  catch(e){LAPMIC=null;MICERR=e.name||'error'}
  if(S.ui.view==='timer')render();
}
const recAudio=()=>{if(!AUDIO)return null;const ph=CAMID==='phone'&&PHONE?.getAudioTracks?.()[0];return ph&&ph.readyState==='live'?ph:LAPMIC?.getAudioTracks()[0]||null};
const audioWhere=()=>!AUDIO?'ปิดอยู่':CAMID==='phone'&&PHONE?.getAudioTracks?.().length?'ไมค์มือถือ':LAPMIC?'ไมค์เครื่องนี้':MICERR?'ใช้ไมค์ไม่ได้ ('+MICERR+')':'รออนุญาตไมค์';
let CV=null,CX=null,VID=null,CSTREAM=null,G={score:0,target:0,bump:0,evn:null,pop:null};
const FONT={ui:'"IBM Plex Sans Thai",sans-serif',head:'"Chakra Petch","IBM Plex Sans Thai",sans-serif',num:'"IBM Plex Sans Thai",sans-serif'};
/* The webcam's own lens controls, when the camera offers them: zoom in, pan, tilt, and focus held still
   (autofocus hunting each time a hand passes is the usual problem). Settings are remembered per camera. */
const LENS_KEYS={zoom:'ซูม',pan:'เลื่อนซ้าย-ขวา',tilt:'เลื่อนขึ้น-ลง',focusDistance:'ระยะโฟกัส'};
let LENS=null;   // {caps:{key:{min,max,step}}, val:{key:number}, focusAuto:bool, canFocus:bool}
async function lensRead(){
  LENS=null;const tr=CAM?.getVideoTracks?.()[0];if(!tr||CAMID==='phone'||!tr.getCapabilities)return;
  const cap=tr.getCapabilities(),set=tr.getSettings(),caps={};
  Object.keys(LENS_KEYS).forEach(k=>{if(cap[k]&&cap[k].max>cap[k].min)caps[k]={min:cap[k].min,max:cap[k].max,step:cap[k].step||((cap[k].max-cap[k].min)/100)}});
  const canFocus=(cap.focusMode||[]).includes('manual')&&!!caps.focusDistance;if(!canFocus)delete caps.focusDistance;
  if(!Object.keys(caps).length&&!canFocus)return;
  let saved={};try{saved=JSON.parse(keep('ptarena:lens:'+(set.deviceId||''))||'{}')}catch(e){}
  LENS={caps,canFocus,focusAuto:saved.focusAuto!==false,val:{}};
  Object.keys(caps).forEach(k=>LENS.val[k]=saved[k]??set[k]??caps[k].min);
  await lensApply();
}
async function lensApply(){
  const tr=CAM?.getVideoTracks?.()[0];if(!tr||!LENS)return;const a={};
  Object.keys(LENS.caps).forEach(k=>{if(k!=='focusDistance')a[k]=LENS.val[k]});
  if(LENS.canFocus){a.focusMode=LENS.focusAuto?'continuous':'manual';if(!LENS.focusAuto)a.focusDistance=LENS.val.focusDistance}
  try{await tr.applyConstraints({advanced:[a]})}catch(e){}
  keep('ptarena:lens:'+(tr.getSettings().deviceId||''),JSON.stringify({...LENS.val,focusAuto:LENS.focusAuto}));
}
function lensPanel(){
  if(!CAM||CAMID==='phone')return'';
  if(!LENS)return`<div class="sub2">เลนส์กล้อง: กล้องนี้ซูม/โฟกัสจากเว็บไม่ได้ ใช้ครอปข้างล่างแทน</div>`;
  return`<div class="tset"><span>เลนส์กล้อง (ปรับที่ตัวกล้อง)</span>
    ${Object.keys(LENS.caps).filter(k=>k!=='focusDistance').map(k=>{const c=LENS.caps[k];return`<label class="lensrow"><span>${LENS_KEYS[k]}</span><input type="range" data-lens="${k}" min="${c.min}" max="${c.max}" step="${c.step}" value="${LENS.val[k]}"></label>`}).join('')}
    ${LENS.canFocus?`<label class="lensrow"><span>โฟกัส</span><select data-lensfocus><option value="auto" ${LENS.focusAuto?'selected':''}>อัตโนมัติ</option><option value="lock" ${LENS.focusAuto?'':'selected'}>ล็อกไว้</option></select></label>
      ${LENS.focusAuto?'':`<label class="lensrow"><span>ระยะโฟกัส</span><input type="range" data-lens="focusDistance" min="${LENS.caps.focusDistance.min}" max="${LENS.caps.focusDistance.max}" step="${LENS.caps.focusDistance.step}" value="${LENS.val.focusDistance}"></label>`}`:''}
    <div><button class="btn sm" data-act="lensreset">เลนส์ค่าเริ่มต้น</button></div></div>`;
}
function drawLoop(){clearInterval(DRAWT);DRAWT=setInterval(()=>{try{drawStage()}catch(e){}},Math.floor(1000/FPS))}
function stageCanvas(){
  if(CV)return CV;
  CV=document.createElement('canvas');CV.width=CAMQ[QUAL].w;CV.height=CAMQ[QUAL].h;CX=CV.getContext('2d');
  ['500 20px '+FONT.ui,'600 20px '+FONT.ui,'700 20px '+FONT.head,'600 20px '+FONT.num].forEach(f=>document.fonts?.load(f,'ทีม 0'));
  drawLoop();
  // drag on the picture to move the cropped window
  let drag=null;CV.style.touchAction='none';CV.style.cursor='grab';
  CV.addEventListener('pointerdown',e=>{drag={x:e.clientX,y:e.clientY};CV.setPointerCapture(e.pointerId);CV.style.cursor='grabbing'});
  CV.addEventListener('pointermove',e=>{if(!drag)return;const k=1280/CV.clientWidth,dx=(e.clientX-drag.x)*k,dy=(e.clientY-drag.y)*k;drag={x:e.clientX,y:e.clientY};
    if(G.ex>0)CROP.x=Math.min(1,Math.max(0,CROP.x-dx/G.ex));if(G.ey>0)CROP.y=Math.min(1,Math.max(0,CROP.y-dy/G.ey))});
  const drop=()=>{if(drag){drag=null;CV.style.cursor='grab';saveCrop()}};CV.addEventListener('pointerup',drop);CV.addEventListener('pointercancel',drop);
  return CV;
}
// camera picture into one region of the frame, cropped as chosen; false when there is no picture yet
function drawCam(x,rx,ry,rw,rh){
  x.fillStyle='#0A0F1A';x.fillRect(rx,ry,rw,rh);
  if(!(VID&&VID.readyState>=2&&VID.videoWidth))return false;
  // a quarter turn swaps the picture's width and height; the crop window is worked out on the turned picture
  const side=ROT===90||ROT===270,W0=side?VID.videoHeight:VID.videoWidth,H0=side?VID.videoWidth:VID.videoHeight;
  const k=Math.max(rw/W0,rh/H0)*CROP.z;G.ex=W0*k-rw;G.ey=H0*k-rh;
  x.save();x.beginPath();x.rect(rx,ry,rw,rh);x.clip();
  x.translate(rx+rw/2+G.ex*(0.5-CROP.x),ry+rh/2+G.ey*(0.5-CROP.y));if(FLIP)x.scale(-1,1);x.rotate(ROT*Math.PI/180);   // mirror on screen, after the turn
  x.drawImage(VID,-VID.videoWidth*k/2,-VID.videoHeight*k/2,VID.videoWidth*k,VID.videoHeight*k);x.restore();return true;
}
// bottom-bar layout drawn from a look in BAR: separate blocks for team, missions, retries and score
function drawBar(x,c,t,tm,cp,lim,now,T){
  const W=1280,H=720,M=36,GAP=6;
  const text=(str,px,py,font,color,align='left',glow)=>{x.save();x.font=font;x.fillStyle=color;x.textAlign=align;x.textBaseline='alphabetic';if(glow){x.shadowColor=glow;x.shadowBlur=16}x.fillText(str,px,py);x.restore()};
  const width=(str,font)=>{x.font=font;return x.measureText(str).width};
  const fit=(str,font,max)=>{if(width(str,font)<=max)return str;while(str.length>1&&width(str+'…',font)>max)str=str.slice(0,-1);return str+'…'};
  const grad=(px,pw)=>{const g=x.createLinearGradient(px,0,px+pw,0);g.addColorStop(0,T.a);g.addColorStop(1,T.b);return g};
  const box=(px,py,pw,ph,fill,l=T.skew,r=T.skew)=>{x.fillStyle=fill;x.beginPath();if(T.skew){x.moveTo(px+l,py);x.lineTo(px+pw,py);x.lineTo(px+pw-r,py+ph);x.lineTo(px,py+ph);x.closePath()}else x.roundRect(px,py,pw,ph,T.r);x.fill()};
  if(!drawCam(x,0,0,W,H))text(CAMERR?'ไม่มีภาพจากกล้อง':'กำลังเปิดกล้อง…',W/2,H/2,'500 26px '+FONT.ui,'#4D5B74','center');
  let g=x.createLinearGradient(0,0,0,160);g.addColorStop(0,`rgba(0,0,0,${T.shade*.7})`);g.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=g;x.fillRect(0,0,W,160);
  g=x.createLinearGradient(0,H-240,0,H);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,`rgba(0,0,0,${T.shade})`);x.fillStyle=g;x.fillRect(0,H-240,W,240);

  // top left: mark, then what and where
  const n1='700 23px '+FONT.head,n2='500 18px '+FONT.ui,where=`สนาม ${c.field}  ·  ${c.level}${t.round&&t.state!=='idle'?'  ·  รอบ '+t.round:''}`;
  box(M,M,66,64,grad(M,66));
  if(LOGO.complete&&LOGO.naturalWidth){const lh=40,lw=lh*LOGO.naturalWidth/LOGO.naturalHeight;x.save();if(T.on!=='#FFFFFF')x.filter='brightness(0)';x.drawImage(LOGO,M+33-lw/2,M+32-lh/2,lw,lh);x.restore()}
  const lw2=Math.max(width(cp.name,n1),width(where,n2))+38+T.skew;
  box(M+66+GAP-T.skew,M,lw2,64,T.panel);text(cp.name,M+66+GAP+18,M+28,n1,T.ink);text(where,M+66+GAP+18,M+52,n2,T.dim);

  // top right: clock, with the time left under it
  const ms=Math.min(shownMs(t),lim),late=t.state==='run'&&lim-ms<30000,cw=300,cx=W-M-cw;
  box(cx,M,cw,86,T.panel,T.skew,0);
  text(t.state==='stop'?'หยุดเวลา':'เวลา',cx+20+T.skew,M+27,'600 15px '+FONT.ui,T.dim);
  text(fmtMs(ms),W-M-18,M+66,'600 50px '+FONT.num,late?'#E5484D':T.ink,'right',t.state==='run'&&!late?T.glow:null);
  x.save();x.globalAlpha=.16;x.fillStyle=T.ink;x.fillRect(cx+20,M+75,cw-38,4);x.restore();
  x.fillStyle=late?'#E5484D':grad(cx+20,cw-38);x.fillRect(cx+20,M+75,(cw-38)*(1-ms/lim),4);

  // bottom: team | missions | retries | score
  const bh=100,by=H-M-bh,items=t.live?.items||{},retry=t.live?.pen||0,scW=200,rtW=104,fl='600 15px '+FONT.ui,fv='600 28px '+FONT.num,PIP=20;
  const cols=cp.missions.map(m=>({m,name:m.short||m.label,w:Math.max(width(m.short||m.label,fl),T.pips?m.max*(PIP+6)-6:width(m.max+'/'+m.max,fv))+28}));
  const misW=cols.reduce((a,k)=>a+k.w,0)+20+T.skew,scX=W-M-scW,rtX=scX-GAP-rtW+T.skew,misX=rtX-GAP-misW+T.skew,teamW=misX-GAP-M+T.skew;
  box(M,by,teamW,bh,T.panel,0,T.skew);x.fillStyle=grad(M,8);x.beginPath();if(T.skew)x.rect(M,by,8,bh);else x.roundRect(M,by,8,bh,[T.r,0,0,T.r]);x.fill();
  if(tm){
    const fi='600 21px '+FONT.num,fn='700 34px '+FONT.head,iw=width(tm.id,fi)+24;
    x.save();x.globalAlpha=.1;x.fillStyle=T.ink;x.fillRect(M+26,by+17,iw,36);x.restore();text(tm.id,M+38,by+43,fi,T.ink);
    text(fit(tm.name,fn,teamW-iw-86),M+26+iw+14,by+47,fn,T.ink);text(fit(tm.school,'500 19px '+FONT.ui,teamW-70),M+26,by+81,'500 19px '+FONT.ui,T.dim);
  }else text('รอทีมถัดไป',M+26,by+60,'600 26px '+FONT.ui,T.dim);
  box(misX,by,misW,bh,T.panel);
  let px=misX+14+T.skew;
  cols.forEach(k=>{
    const n=Math.min(items[k.m.id]||0,k.m.max),hot=!!G.pop&&G.pop.id===k.m.id;
    text(k.name,px,by+36,fl,n>=k.m.max?T.ok:T.dim);
    if(T.pips)for(let q=0;q<k.m.max;q++){const qx=px+q*(PIP+6),qy=by+52;if(q<n){x.fillStyle=T.ok;x.fillRect(qx,qy,PIP,PIP)}else{x.save();x.globalAlpha=.4;x.strokeStyle=T.ink;x.lineWidth=2;x.strokeRect(qx+1,qy+1,PIP-2,PIP-2);x.restore()}}
    else text(n+'/'+k.m.max,px,by+76,fv,hot?T.ok:n?T.ink:T.dim);
    px+=k.w;
  });
  box(rtX,by,rtW,bh,T.panel);
  text('Retry',rtX+rtW/2,by+36,fl,retry?T.warn:T.dim,'center');text(String(retry),rtX+rtW/2,by+78,'600 34px '+FONT.num,retry?T.warn:T.ink,'center');
  box(scX,by,scW,bh,grad(scX,scW),T.skew,0);
  text('คะแนน',scX+22+T.skew,by+34,'600 16px '+FONT.ui,T.on);
  const bump=Math.max(0,1-(now-(G.bump||0))/320);
  text(String(Math.round(G.score)),W-M-20,by+86,`600 ${Math.round(64+10*bump)}px ${FONT.num}`,T.on,'right');

  // the judge's last tap, above the score
  if(G.pop){
    const age=now-G.pop.at,fa='600 25px '+FONT.ui,fp='700 28px '+FONT.num,lw=width(G.pop.label,fa)+44+T.skew,vw=width(G.pop.value,fp)+40+T.skew,inn=Math.min(1,age/260),e=1-Math.pow(1-inn,3),out=age>2200?(2600-age)/400:1,dx=(1-e)*90,ph=56,py=by-ph-10,rx=W-M;
    x.save();x.globalAlpha=Math.max(0,out)*inn;
    box(rx-vw-GAP-lw+T.skew+dx,py,lw,ph,T.panel);text(G.pop.label,rx-vw-GAP-lw+T.skew+dx+22+T.skew,py+37,fa,T.ink);
    box(rx-vw+dx,py,vw,ph,G.pop.color,T.skew,0);text(G.pop.value,rx-18+dx,py+39,fp,'#fff','right');
    x.restore();
  }
}
// television layout: one bar edge to edge along the bottom carrying everything, clock included, so the picture stays clear
function drawCast(x,c,t,tm,cp,lim,now,o){
  const W=1280,H=720,BH=96,y0=o.top?0:H-BH,INK=o.ink||'#FFFFFF',DIM=o.dim||'#98A6B9',BG=o.bg||'rgba(14,18,24,.96)',AC=o.ac,OK=o.ok||'#36D07F',WARN=o.warn||'#FFB454',RULE=o.rule||'rgba(255,255,255,.13)',OFF=o.off||'#5F6B7C';
  const text=(str,px,py,font,color,align='left')=>{x.font=font;x.fillStyle=color;x.textAlign=align;x.textBaseline='alphabetic';x.fillText(str,px,py)};
  const width=(str,font)=>{x.font=font;return x.measureText(str).width};
  const fit=(str,font,max)=>{if(width(str,font)<=max)return str;while(str.length>1&&width(str+'…',font)>max)str=str.slice(0,-1);return str+'…'};
  const rule=px=>{x.fillStyle=RULE;x.fillRect(px,y0+18,1,BH-36)};
  if(!drawCam(x,0,0,W,H))text(CAMERR?'ไม่มีภาพจากกล้อง':'กำลังเปิดกล้อง…',W/2,H/2-40,'500 26px '+FONT.ui,'#4D5B74','center');
  // top left: a small tag saying what is on
  const tag=`${cp.name}  ·  สนาม ${c.field}  ·  ${c.level}${t.round&&t.state!=='idle'?'  ·  รอบ '+t.round:''}`,ft='600 18px '+FONT.ui,tw=width(tag,ft)+36;
  const ty=o.top?H-72:32;x.fillStyle=BG;x.fillRect(32,ty,tw,40);x.fillStyle=AC;x.fillRect(32,ty,4,40);text(tag,52,ty+27,ft,INK);
  // the bar
  x.fillStyle=BG;x.fillRect(0,y0,W,BH);x.fillStyle=AC;x.fillRect(0,o.top?BH:y0-3,W,3);
  const LW=104,SW=176,CW=214,RW=96,fl='600 14px '+FONT.ui,fv='600 30px '+FONT.num;
  x.fillStyle=AC;x.fillRect(0,y0,LW,BH);
  if(LOGO.complete&&LOGO.naturalWidth){const lh=54,lw=lh*LOGO.naturalWidth/LOGO.naturalHeight;x.drawImage(LOGO,LW/2-lw/2,y0+BH/2-lh/2,lw,lh)}
  const items=t.live?.items||{},retry=t.live?.pen||0;
  const cols=cp.missions.map(m=>({m,name:m.short||m.label,w:Math.max(width(m.short||m.label,fl),width(m.max+'/'+m.max,fv))+36}));
  const misW=cols.reduce((a,k)=>a+k.w,0),scX=W-SW,ckX=scX-CW,rtX=ckX-RW,misX=rtX-misW,teamW=misX-LW;
  // team
  if(tm){const fn='700 32px '+FONT.head,fi='600 16px '+FONT.num;
    text(fit(tm.name,fn,teamW-48),LW+24,y0+46,fn,INK);text(fit(tm.id+'  ·  '+tm.school,'500 17px '+FONT.ui,teamW-48),LW+24,y0+74,'500 17px '+FONT.ui,DIM)}
  else text('รอทีมถัดไป',LW+24,y0+58,'600 26px '+FONT.ui,DIM);
  // missions: name on top, how many of how many under it; the one just scored turns green
  let px=misX;
  cols.forEach(k=>{rule(px);const n=Math.min(items[k.m.id]||0,k.m.max),hot=!!G.pop&&G.pop.id===k.m.id,cx=px+k.w/2;
    text(k.name,cx,y0+34,fl,DIM,'center');text(n+'/'+k.m.max,cx,y0+72,fv,hot||n>=k.m.max?OK:n?INK:OFF,'center');px+=k.w});
  rule(rtX);text('RETRY',rtX+RW/2,y0+34,fl,DIM,'center');text(String(retry),rtX+RW/2,y0+72,fv,retry?WARN:OFF,'center');
  // clock, with the time left as a line under the digits
  const ms=Math.min(shownMs(t),lim),late=t.state==='run'&&lim-ms<30000;
  rule(ckX);text(t.state==='stop'?'หยุดเวลา':'เวลา',ckX+CW/2,y0+30,fl,t.state==='stop'?WARN:DIM,'center');
  text(fmtMs(ms),ckX+CW/2,y0+68,'600 36px '+FONT.num,late?'#FF6B6B':INK,'center');
  x.fillStyle=RULE;x.fillRect(ckX+24,y0+80,CW-48,3);x.fillStyle=late?'#FF6B6B':AC;x.fillRect(ckX+24,y0+80,(CW-48)*(1-ms/lim),3);
  // score: the one light block on the bar
  x.fillStyle=o.sbg||'#FFFFFF';x.fillRect(scX,y0,SW,BH);text('คะแนน',scX+20,y0+30,fl,o.slab||'#5B6677');
  const bump=Math.max(0,1-(now-(G.bump||0))/320);
  text(String(Math.round(G.score)),W-22,y0+82,`600 ${Math.round(62+8*bump)}px ${FONT.num}`,o.sink||'#0E1218','right');
  // the judge's last tap rises from the bar on the right
  if(G.pop){
    const age=now-G.pop.at,fa='600 24px '+FONT.ui,fp='700 26px '+FONT.num,lw=width(G.pop.label,fa)+40,vw=width(G.pop.value,fp)+34,inn=Math.min(1,age/240),e=1-Math.pow(1-inn,3),out=age>2200?(2600-age)/400:1,ph=52,py=o.top?BH+13-(1-e)*30:y0-3-ph-10+(1-e)*30;
    x.save();x.globalAlpha=Math.max(0,out)*inn;
    x.fillStyle=BG;x.fillRect(W-32-vw-lw,py,lw,ph);text(G.pop.label,W-32-vw-lw+20,py+35,fa,INK);
    x.fillStyle=G.pop.color;x.fillRect(W-32-vw,py,vw,ph);text(G.pop.value,W-32-17,py+36,fp,'#fff','right');
    x.restore();
  }
}
// scorebug: one small box in the top left corner, the way a match score sits on a sports broadcast
function drawBug(x,c,t,tm,cp,lim,now,o){
  const W=1280,H=720,BX=32,BY=32,BW=470,INK=o.ink||'#FFFFFF',DIM=o.dim||'#9FACBD',BG=o.bg||'rgba(13,17,24,.95)',BG2=o.bg2||'rgba(24,30,40,.95)',AC=o.ac||'#2F6BFF',OK=o.ok||'#36D07F',WARN=o.warn||'#FFB454',RULE=o.rule||'rgba(255,255,255,.12)',OFF=o.off||'#5F6B7C';
  const text=(str,px,py,font,color,align='left')=>{x.font=font;x.fillStyle=color;x.textAlign=align;x.textBaseline='alphabetic';x.fillText(str,px,py)};
  const width=(str,font)=>{x.font=font;return x.measureText(str).width};
  const fit=(str,font,max)=>{if(width(str,font)<=max)return str;while(str.length>1&&width(str+'…',font)>max)str=str.slice(0,-1);return str+'…'};
  if(!drawCam(x,0,0,W,H))text(CAMERR?'ไม่มีภาพจากกล้อง':'กำลังเปิดกล้อง…',W/2,H/2,'500 26px '+FONT.ui,'#4D5B74','center');
  const items=t.live?.items||{},retry=t.live?.pen||0,ms=Math.min(shownMs(t),lim),late=t.state==='run'&&lim-ms<30000;
  // row 1: mark, team, score
  const R1=64,SW=112;
  x.fillStyle=AC;x.fillRect(BX,BY,R1,R1);
  if(LOGO.complete&&LOGO.naturalWidth){const lh=40,lw=lh*LOGO.naturalWidth/LOGO.naturalHeight;x.drawImage(LOGO,BX+R1/2-lw/2,BY+R1/2-lh/2,lw,lh)}
  x.fillStyle=BG;x.fillRect(BX+R1,BY,BW-R1-SW,R1);
  if(tm){text(fit(tm.name,'700 27px '+FONT.head,BW-R1-SW-32),BX+R1+16,BY+31,'700 27px '+FONT.head,INK);text(fit(tm.id+'  ·  '+tm.school,'500 15px '+FONT.ui,BW-R1-SW-32),BX+R1+16,BY+53,'500 15px '+FONT.ui,DIM)}
  else text('รอทีมถัดไป',BX+R1+16,BY+40,'600 22px '+FONT.ui,DIM);
  x.fillStyle=o.sbg||'#FFFFFF';x.fillRect(BX+BW-SW,BY,SW,R1);
  const bump=Math.max(0,1-(now-(G.bump||0))/320);
  text(String(Math.round(G.score)),BX+BW-SW/2,BY+48,`600 ${Math.round(42+6*bump)}px ${FONT.num}`,o.sink||'#0E1218','center');
  // row 2: clock on the left, where and which round on the right, the time left as a line along the bottom
  const R2=42,y2=BY+R1;
  x.fillStyle=BG2;x.fillRect(BX,y2,BW,R2);
  text(fmtMs(ms),BX+16,y2+30,'600 25px '+FONT.num,late?'#FF6B6B':t.state==='stop'?WARN:INK);
  text(`สนาม ${c.field} · ${c.level}${t.round&&t.state!=='idle'?' · รอบ '+t.round:''}`,BX+BW-16,y2+28,'500 16px '+FONT.ui,DIM,'right');
  x.fillStyle=RULE;x.fillRect(BX,y2+R2-3,BW,3);x.fillStyle=late?'#FF6B6B':AC;x.fillRect(BX,y2+R2-3,BW*(1-ms/lim),3);
  // row 3: every mission and the retries, evenly spaced
  const R3=54,y3=y2+R2,cells=[...cp.missions.map(m=>({id:m.id,name:m.short||m.label,val:Math.min(items[m.id]||0,m.max)+'/'+m.max,on:(items[m.id]||0)>0,full:(items[m.id]||0)>=m.max,color:OK})),{id:'retry',name:'Retry',val:String(retry),on:retry>0,full:false,color:WARN}],cw=BW/cells.length;
  x.fillStyle=BG;x.fillRect(BX,y3,BW,R3);
  cells.forEach((k,n)=>{const cx=BX+cw*n+cw/2,hot=!!G.pop&&G.pop.id===k.id;
    if(hot){x.fillStyle=k.id==='retry'?'rgba(255,180,84,.2)':'rgba(54,208,127,.2)';x.fillRect(BX+cw*n,y3,cw,R3)}
    if(n){x.fillStyle=RULE;x.fillRect(BX+cw*n,y3+10,1,R3-20)}
    text(fit(k.name,'600 12px '+FONT.ui,cw-10),cx,y3+20,'600 12px '+FONT.ui,DIM,'center');
    text(k.val,cx,y3+44,'600 20px '+FONT.num,k.id==='retry'?(k.on?WARN:OFF):hot||k.full?OK:k.on?INK:OFF,'center')});
  // top right: what is being played
  const ft='600 18px '+FONT.ui,tw=width(cp.name,ft)+36;
  x.fillStyle=BG;x.fillRect(W-32-tw,32,tw,40);x.fillStyle=AC;x.fillRect(W-36,32,4,40);text(cp.name,W-32-tw+16,59,ft,INK);
  // the judge's last tap drops out from under the box
  if(G.pop){
    const age=now-G.pop.at,fa='600 22px '+FONT.ui,fp='700 24px '+FONT.num,lw=width(G.pop.label,fa)+36,vw=width(G.pop.value,fp)+30,inn=Math.min(1,age/240),e=1-Math.pow(1-inn,3),out=age>2200?(2600-age)/400:1,ph=46,py=y3+R3+8-(1-e)*24;
    x.save();x.globalAlpha=Math.max(0,out)*inn;
    x.fillStyle=BG;x.fillRect(BX,py,lw,ph);text(G.pop.label,BX+18,py+31,fa,INK);
    x.fillStyle=G.pop.color;x.fillRect(BX+lw,py,vw,ph);text(G.pop.value,BX+lw+vw/2,py+32,fp,'#fff','center');
    x.restore();
  }
}
// side layout: a column down the left with everything in rows, the camera picture keeps the rest of the frame clear
function drawTower(x,c,t,tm,cp,lim,now,o){
  const W=1280,H=720,TW=292,P=22,RED=o.head||'#E10600',DIM='#9AA3B5',INK='#fff',ROW=46,OKC=o.ok||'#39D98A';
  const text=(str,px,py,font,color,align='left')=>{x.font=font;x.fillStyle=color;x.textAlign=align;x.textBaseline='alphabetic';x.fillText(str,px,py)};
  const width=(str,font)=>{x.font=font;return x.measureText(str).width};
  const fit=(str,font,max)=>{if(width(str,font)<=max)return str;while(str.length>1&&width(str+'…',font)>max)str=str.slice(0,-1);return str+'…'};
  if(!drawCam(x,TW,0,W-TW,H))text(CAMERR?'ไม่มีภาพจากกล้อง':'กำลังเปิดกล้อง…',TW+(W-TW)/2,H/2,'500 26px '+FONT.ui,'#4D5B74','center');
  x.fillStyle=o.bg||'#0C0C10';x.fillRect(0,0,TW,H);
  // what and where
  x.fillStyle=RED;x.fillRect(0,0,TW,94);
  let tx=P;if(LOGO.complete&&LOGO.naturalWidth){const lh=40,lw=lh*LOGO.naturalWidth/LOGO.naturalHeight;x.drawImage(LOGO,P,27,lw,lh);tx=P+lw+12}
  text(fit(cp.name,'700 20px '+FONT.head,TW-tx-P),tx,42,'700 20px '+FONT.head,INK);
  text(`สนาม ${c.field} · ${c.level}${t.round&&t.state!=='idle'?' · รอบ '+t.round:''}`,tx,68,'500 16px '+FONT.ui,'rgba(255,255,255,.92)');
  // who
  let y=94;
  if(tm){text(tm.id,P,y+34,'600 17px '+FONT.num,DIM);text(fit(tm.name,'700 30px '+FONT.head,TW-P*2),P,y+72,'700 30px '+FONT.head,INK);text(fit(tm.school,'500 16px '+FONT.ui,TW-P*2),P,y+100,'500 16px '+FONT.ui,DIM)}
  else text('รอทีมถัดไป',P,y+66,'600 24px '+FONT.ui,DIM);
  y+=120;
  // one row per mission; the row the judge just scored lights up with what was added
  const items=t.live?.items||{},retry=t.live?.pen||0,pop=G.pop;
  const row=(name,val,on,hot,extra,color)=>{
    if(hot){x.fillStyle=color==='#F0B45A'?'rgba(240,180,90,.18)':'rgba(57,217,138,.18)';x.fillRect(0,y,TW,ROW)}
    x.fillStyle='rgba(255,255,255,.1)';x.fillRect(0,y,TW,1);
    const v=val+(hot&&extra?'  '+extra:''),fv='600 19px '+FONT.num;
    text(v,TW-P,y+30,fv,on?color:'#5D6677','right');text(fit(name,'500 18px '+FONT.ui,TW-P*2-width(v,fv)-12),P,y+30,'500 18px '+FONT.ui,on?INK:DIM);y+=ROW};
  cp.missions.forEach(m=>{const n=Math.min(items[m.id]||0,m.max),hot=!!pop&&pop.id===m.id;row(m.short||m.label,n+'/'+m.max,n>0,hot,hot&&pop.value,OKC)});
  row('Retry',String(retry),retry>0,!!pop&&pop.id==='retry','','#F0B45A');
  x.fillStyle='rgba(255,255,255,.1)';x.fillRect(0,y,TW,1);
  // score, then the clock at the foot with the time left running across its top edge
  const CH=84,SH=124,sy=H-CH-SH,ms=Math.min(shownMs(t),lim),late=t.state==='run'&&lim-ms<30000;
  x.fillStyle=o.sbg||'#fff';x.fillRect(0,sy,TW,SH);text('คะแนน',P,sy+32,'600 17px '+FONT.ui,o.slab||'#5D6677');
  const bump=Math.max(0,1-(now-(G.bump||0))/320);
  text(String(Math.round(G.score)),TW-P,sy+SH-20,`600 ${Math.round(78+10*bump)}px ${FONT.num}`,o.sink||'#0C0C10','right');
  x.fillStyle=t.state==='stop'?'#1B1B22':RED;x.fillRect(0,H-CH,TW,CH);
  x.fillStyle='rgba(0,0,0,.28)';x.fillRect(0,H-CH,TW,6);x.fillStyle=late?'#FFD166':'#fff';x.fillRect(0,H-CH,TW*(1-ms/lim),6);
  text(t.state==='stop'?'หยุดเวลา':t.state==='run'?'เวลา':'พร้อม',P,H-CH+34,'600 15px '+FONT.ui,'rgba(255,255,255,.85)');
  text(fmtMs(ms),TW-P,H-22,'600 44px '+FONT.num,late?'#FFD166':INK,'right');
}
function drawStage(){
  if(ROLE!=='timer'||!READY||needGate())return;const c=clsOfField(LOCK);if(!c)return;
  CX.setTransform(CV.width/1280,0,0,CV.width/1280,0,0);
  const x=CX,W=1280,H=720,M=40,now=Date.now(),t=timerOf(LOCK),tm=t.team&&team(t.team)||queue(c.id)[0],cp=S.comps[c.comp],lim=limitOf(LOCK);
  const INK='#fff',DIM='#B4C0D4',PANEL='rgba(8,12,22,.9)';
  const text=(str,px,py,font,color,align='left')=>{x.font=font;x.fillStyle=color;x.textAlign=align;x.textBaseline='alphabetic';x.fillText(str,px,py)};
  const width=(str,font)=>{x.font=font;return x.measureText(str).width};
  // slanted panel: the shape television timing graphics are built from
  const slab=(px,py,pw,ph,fill,l=18,r=18)=>{x.fillStyle=fill;x.beginPath();x.moveTo(px+l,py);x.lineTo(px+pw,py);x.lineTo(px+pw-r,py+ph);x.lineTo(px,py+ph);x.closePath();x.fill()};
  const grad=(px,pw,a='#3B6FE8',b='#7A4FE0')=>{const g=x.createLinearGradient(px,0,px+pw,0);g.addColorStop(0,a);g.addColorStop(1,b);return g};
  const fit=(str,font,max)=>{if(width(str,font)<=max)return str;while(str.length>1&&width(str+'…',font)>max)str=str.slice(0,-1);return str+'…'};

  // shared by both layouts: the score eases to its new value, and the judge's last tap is kept for a moment
  const target=liveScore(LOCK)??0;if(target!==G.target){G.bump=now;G.target=target}
  G.score+=(target-G.score)*.3;if(Math.abs(target-G.score)<.5)G.score=target;
  if(t.ev&&t.ev.n!==G.evn){
    if(G.evn!==null||t.state==='run'){const e=t.ev,pos=e.pts>0;
      G.pop={at:now,id:e.pts?e.id:'retry',pts:e.pts,label:e.pts?e.label:'Retry',value:e.pts?(pos?'+':'−')+Math.abs(e.pts):'ครั้งที่ '+e.retry,color:pos?'#16A865':e.pts<0?'#5C6880':'#D48A16'}}
    G.evn=t.ev.n;
  }else if(!t.ev)G.evn=0;
  if(G.pop&&now-G.pop.at>2600)G.pop=null;
  // clean picture for a broadcast that adds its own graphics: nothing on top, or only the logo in a corner
  if(GFX==='none'||GFX==='logo'){
    if(!drawCam(x,0,0,W,H))text(CAMERR?'ไม่มีภาพจากกล้อง':'กำลังเปิดกล้อง…',W/2,H/2,'500 26px '+FONT.ui,'#4D5B74','center');
    if(GFX==='logo'&&LOGO.complete&&LOGO.naturalWidth){const lh=64,lw=lh*LOGO.naturalWidth/LOGO.naturalHeight;x.save();x.globalAlpha=.9;x.shadowColor='rgba(0,0,0,.55)';x.shadowBlur=12;x.drawImage(LOGO,W-M-lw,M,lw,lh);x.restore()}
    return;
  }
  if(GFX==='tower'){drawTower(x,c,t,tm,cp,lim,now,{});return}
  if(GFX==='royal'){drawTower(x,c,t,tm,cp,lim,now,{head:'#1B2A6B',bg:'#0A1030',sbg:'#F5D06B',sink:'#0A1030',slab:'#5B4A12',ok:'#F5D06B'});return}
  if(BAR[GFX]){drawBar(x,c,t,tm,cp,lim,now,BAR[GFX]);return}
  if(GFX==='cast'){drawCast(x,c,t,tm,cp,lim,now,{top:false,ac:'#2F6BFF'});return}
  if(GFX==='head'){drawCast(x,c,t,tm,cp,lim,now,{top:true,ac:'#12B886'});return}
  if(GFX==='bug'){drawBug(x,c,t,tm,cp,lim,now,{});return}
  if(GFX==='rally'){drawBug(x,c,t,tm,cp,lim,now,{ac:'#FF5A1F',ok:'#FFB36B'});return}
  if(GFX==='amber'){drawCast(x,c,t,tm,cp,lim,now,{top:false,ac:'#FFB020',sbg:'#FFB020',sink:'#14110A',slab:'#5B4A12',ok:'#FFD27A'});return}
  if(GFX==='matrix'){drawTower(x,c,t,tm,cp,lim,now,{head:'#0E9F6E',bg:'#06140F',sbg:'#0E9F6E',sink:'#FFFFFF',slab:'rgba(255,255,255,.85)',ok:'#3EE6A0'});return}
  const LIGHT={ink:'#10151F',dim:'#5B6677',bg:'rgba(255,255,255,.97)',bg2:'rgba(236,240,245,.97)',ac:'#1F5BD6',ok:'#1C8A57',warn:'#B86E05',off:'#B5BDC9',rule:'rgba(16,21,31,.13)'};
  if(GFX==='day'){drawBug(x,c,t,tm,cp,lim,now,{...LIGHT,sbg:'#10151F',sink:'#FFFFFF'});return}
  if(GFX==='studio'){drawCast(x,c,t,tm,cp,lim,now,{...LIGHT,top:false,sbg:'#1F5BD6',sink:'#FFFFFF',slab:'rgba(255,255,255,.88)'});return}
  if(!drawCam(x,0,0,W,H))text(CAMERR?'ไม่มีภาพจากกล้อง':'กำลังเปิดกล้อง…',W/2,H/2,'500 26px '+FONT.ui,'#4D5B74','center');
  // soft shade top and bottom so the graphics read over any picture
  let g=x.createLinearGradient(0,0,0,170);g.addColorStop(0,'rgba(0,0,0,.6)');g.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=g;x.fillRect(0,0,W,170);
  g=x.createLinearGradient(0,H-250,0,H);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(0,0,0,.72)');x.fillStyle=g;x.fillRect(0,H-250,W,250);

  // top left: event mark, then where and what
  slab(M,M,74,56,grad(M,74),14,14);
  if(LOGO.complete&&LOGO.naturalWidth){const lh=42,lw=lh*LOGO.naturalWidth/LOGO.naturalHeight;x.drawImage(LOGO,M+37-lw/2,M+28-lh/2,lw,lh)}else text('PT',M+37,M+38,'700 26px '+FONT.head,INK,'center');
  text(cp.name,M+88,M+25,'700 23px '+FONT.head,INK);
  text(`สนาม ${c.field}  ·  ${c.level}${t.round&&t.state!=='idle'?'  ·  รอบ '+t.round:''}`,M+88,M+51,'500 19px '+FONT.ui,DIM);

  // top right: the clock, with the match time running out underneath
  const ms=Math.min(shownMs(t),lim),cw=356,cx=W-M-cw,late=t.state==='run'&&lim-ms<30000;
  slab(cx,M,cw,96,PANEL,22,0);slab(cx,M,30,96,late?'#E5484D':t.state==='stop'?'#E2B748':grad(cx,30),22,22);
  text(t.state==='stop'?'หยุดเวลา':'เวลา',cx+46,M+30,'600 17px '+FONT.ui,t.state==='stop'?'#E2B748':DIM);
  text(fmtMs(ms),W-M-22,M+70,'600 56px '+FONT.num,late?'#FF8A85':INK,'right');
  x.fillStyle='rgba(255,255,255,.16)';x.fillRect(cx+38,M+82,cw-60,5);x.fillStyle=late?'#E5484D':'#7AA2FF';x.fillRect(cx+38,M+82,(cw-60)*(1-ms/lim),5);

  // bottom strip: team | each mission as it stands | retries | score
  const by=H-M-104,bh=104,items=t.live?.items||{},retry=t.live?.pen||0;
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
  if(G.pop){
    const age=now-G.pop.at;
    {const fa='600 26px '+FONT.ui,fv='700 30px '+FONT.num,lw=width(G.pop.label,fa)+52,vw=width(G.pop.value,fv)+44,inn=Math.min(1,age/260),e=1-Math.pow(1-inn,3),out=age>2200?(2600-age)/400:1,dx=(1-e)*90,ph=58,py=by-ph-12,rx=W-M;
      x.globalAlpha=Math.max(0,out)*inn;
      slab(rx-vw-lw+18+dx,py,lw,ph,PANEL,18,18);text(G.pop.label,rx-vw-lw+18+dx+30,py+38,fa,INK);
      slab(rx-vw+dx,py,vw,ph,G.pop.color,18,0);text(G.pop.value,rx-20+dx,py+40,fv,INK,'right');
      x.globalAlpha=1}
  }
}

/* Where clips go: a folder the laptop picked once (for example one that Google Drive keeps in step), else Downloads. */
let DIR=null,DIRSTATE='none',DIRASKED=false,SAVED='';
const kv=(mode,fn)=>new Promise((ok,no)=>{const o=indexedDB.open('ptarena',1);o.onupgradeneeded=()=>o.result.createObjectStore('kv');o.onerror=()=>no(o.error);
  o.onsuccess=()=>{const db=o.result,tx=db.transaction('kv',mode),rq=fn(tx.objectStore('kv'));tx.oncomplete=()=>{db.close();ok(rq.result)};tx.onerror=()=>{db.close();no(tx.error)}}});
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
/* Clips to Google Drive: after a run the clip is saved on this laptop as before, and a copy is sent in pieces to a small
   script on the owner's Google account (tools/drive_upload.gs). Clips wait in this browser until they have gone up. */
const UPCHUNK=8*1024*1024,clipLink=id=>`https://drive.google.com/file/d/${encodeURIComponent(id)}/view`;
let UPQ=[],UPBUSY=false,UPERR='',UPWAIT=5000,UPFAIL=[];
const UPTRIES=8;   // a clip that keeps failing is set aside so the ones behind it still go up; its original stays on this laptop
const upText=()=>(UPQ.length?`ไดรฟ์: รออัปโหลด ${UPQ.length} คลิป${UPERR?' · อัปโหลดไม่สำเร็จ จะลองใหม่เอง ('+UPERR+')':''}`:'ไดรฟ์: อัปโหลดครบแล้ว')+(UPFAIL.length?` · อัปโหลดไม่ได้ ${UPFAIL.length} คลิป (${UPFAIL.join(', ')}) คลิปยังอยู่ในเครื่องนี้`:'');
const upShow=msg=>{const el=$('#upst');if(el)el.textContent=msg||upText()};
const drivePost=body=>fetch(S.drive.url,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify({key:S.drive.key,...body})}).then(r=>r.json());
const b64=blob=>new Promise((ok,no)=>{const r=new FileReader();r.onload=()=>ok(r.result.slice(r.result.indexOf(',')+1));r.onerror=()=>no(r.error);r.readAsDataURL(blob)});
async function upLoad(){try{UPQ=((await kv('readonly',st=>st.getAll(IDBKeyRange.bound('up:','up:￿'))))||[]).filter(x=>x&&x.blob&&x.key).sort((a,b)=>a.key<b.key?-1:1)}catch(e){}upShow();upRun()}
function upAdd(blob,name,runId){
  if(!S.drive?.url||!blob.size)return;
  // the storage key carries the time, so a run played again in the same minute does not replace the first clip
  const it={key:'up:'+Date.now().toString(36)+':'+name,blob,name,runId,venue:S.venue,field:LOCK,tries:0};UPQ.push(it);
  kv('readwrite',st=>st.put(it,it.key)).catch(()=>{});upShow();upRun();
}
async function upOne(it){
  const type=it.blob.type.split(';')[0]||'video/webm',total=it.blob.size,folder=VENUES.find(v=>v[0]===it.venue)?.[1]||it.venue;
  const st=await drivePost({op:'start',name:`สนาม${it.field}_${it.name}`,size:total,type,folder});if(!st.ok)throw new Error(st.error);
  if(st.done)return st.id;   // already in Drive from an earlier try whose reply was lost
  for(let at=0;at<total;at+=UPCHUNK){
    const r=await drivePost({op:'chunk',session:st.session,start:at,total,type,data:await b64(it.blob.slice(at,at+UPCHUNK))});if(!r.ok)throw new Error(r.error);
    upShow(`ไดรฟ์: กำลังอัปโหลด ${it.name} · ${Math.round(Math.min(at+UPCHUNK,total)/total*100)}%${UPQ.length>1?` · รออีก ${UPQ.length-1}`:''}`);
    if(r.done)return r.id;
  }
  throw new Error('อัปโหลดแล้ว แต่ไดรฟ์ไม่ตอบกลับ');
}
// one clip at a time; a clip that fails is sent again from its start, waiting longer each time
// two timer tabs on one laptop share the queue: a browser lock lets only one of them send
async function upRun(){
  if(UPBUSY||!UPQ.length||!S.drive?.url||!navigator.onLine)return;UPBUSY=true;
  const step=async()=>{
    const it=UPQ[0],drop=async()=>{UPQ.shift();await kv('readwrite',st=>st.delete(it.key)).catch(()=>{})};
    try{
      const id=await upOne(it);await drop();
      if(it.runId&&it.venue===S.venue){S.clips={...S.clips,[it.runId]:id};save()}
      UPERR='';UPWAIT=5000;
    }catch(e){
      UPERR=String(e.message||e).slice(0,120);UPWAIT=Math.min(UPWAIT*2,120000);
      if(++it.tries>=UPTRIES){UPFAIL.push(it.name);await drop();UPERR=''}else kv('readwrite',st=>st.put(it,it.key)).catch(()=>{});
    }
  };
  try{if(navigator.locks)await navigator.locks.request('ptarena-upload',{ifAvailable:true},l=>l?step():null);else await step()}catch(e){}
  UPBUSY=false;upShow();if(UPQ.length)setTimeout(upRun,UPERR?UPWAIT:300);
}
window.addEventListener('online',upRun);
// also picks the queue up again after a wait, and once the Drive link arrives from the database
setInterval(()=>{if(UPQ.length&&!UPBUSY)upRun()},30000);
/* Phone as a camera: #cam-A runs in the phone's browser (iPhone or Android, no app) and sends its camera straight to the
   timer laptop of field A over the local network (WebRTC). The two pages swap a short note through the database
   (or, in sample mode, between two tabs of one browser) to find each other. */
const RTC_CFG={iceServers:[{urls:'stun:stun.l.google.com:19302'}]};
const rtcBus=(()=>{let bc=null;try{bc=new BroadcastChannel('ptarena-rtc')}catch(e){}
  return{send:(f,d)=>bc?.postMessage({...d,field:f}),watch:(f,cb)=>{const h=e=>{if(e.data?.field===f)cb(e.data)};bc?.addEventListener('message',h);return()=>bc?.removeEventListener('message',h)}}})();
const rtcSend=(f,d)=>CLOUD?window.PT_BACKEND?.rtcSend(f,d):rtcBus.send(f,d);
const rtcWatch=(f,cb)=>CLOUD?window.PT_BACKEND?.rtcWatch(f,cb):rtcBus.watch(f,cb);
const iceDone=pc=>new Promise(ok=>{if(pc.iceGatheringState==='complete')return ok();const t=setTimeout(ok,2500);pc.addEventListener('icegatheringstatechange',()=>{if(pc.iceGatheringState==='complete'){clearTimeout(t);ok()}})});

// laptop side
let PHONERTT=0,PHONE=null,PHONEPC=null,PHONESID='',RTCUN=null,PHONEMT=null,PHONELAG=500;   // PHONELAG: how far the phone picture is behind, in ms
// The official time comes from the clicker and is never changed here. Only the clock drawn on the picture is held back
// by the picture's delay, so in the clip the digits and the robot line up.
const usingPhone=()=>CAMID==='phone'&&!!PHONE;
function shownMs(t){
  if(!usingPhone()||!t.startAt||t.state==='idle')return tElapsed(t);
  const raw=(t.state==='run'?tElapsed(t):nowS()-t.startAt)-PHONELAG;
  return Math.max(0,t.state==='run'?raw:Math.min(raw,t.ms||0));
}
function phoneListen(){
  if(ROLE!=='timer'||!LOCK||RTCUN)return;
  RTCUN=rtcWatch(LOCK,d=>{
    if(d&&d.bye&&d.bye===PHONESID){try{PHONEPC?.close()}catch(e){}PHONEPC=null;PHONE=null;if(CAMID==='phone'){CAM=null;VID=null;CAMREAL=''}if(S.ui.view==='timer')render();return}
    if(d&&d.offer&&d.sid&&d.sid!==PHONESID&&Date.now()-(d.t||0)<120000)phoneAnswer(d).catch(()=>{});
  })||null;
}
async function phoneAnswer(d){
  PHONESID=d.sid;try{PHONEPC?.close()}catch(e){}
  const pc=new RTCPeerConnection(RTC_CFG);PHONEPC=pc;
  pc.ontrack=e=>{if(pc!==PHONEPC)return;try{e.receiver.jitterBufferTarget=400}catch(x){}try{e.receiver.playoutDelayHint=0.4}catch(x){}PHONE=e.streams[0]||new MediaStream([e.track]);if(CAMID!=='phone')toast('กล้องมือถือต่อแล้ว สลับไปใช้ภาพจากมือถือ');CAMID='phone';camOn()};
  pc.onconnectionstatechange=()=>{if(pc!==PHONEPC)return;if(pc.connectionState==='failed'||pc.connectionState==='closed'){PHONE=null;if(CAMID==='phone'){CAM=null;VID=null;CAMREAL=''}if(S.ui.view==='timer')render()}};
  await pc.setRemoteDescription({type:'offer',sdp:d.offer});
  await pc.setLocalDescription(await pc.createAnswer());await iceDone(pc);
  rtcSend(LOCK,{answer:pc.localDescription.sdp,asid:d.sid});
}
// reads what actually arrives from the phone, so the line under the picture says what it really delivers
function phoneMeter(){
  clearInterval(PHONEMT);let last=null;
  PHONEMT=setInterval(async()=>{
    if(CAMID!=='phone'||!PHONEPC){clearInterval(PHONEMT);return}
    try{const st=await PHONEPC.getStats();st.forEach(r=>{if(r.type==='candidate-pair'&&r.nominated&&r.currentRoundTripTime)PHONERTT=r.currentRoundTripTime*1000});st.forEach(r=>{
      if(r.type!=='inbound-rtp'||r.kind!=='video'||!r.frameWidth)return;
      const d=last&&r.timestamp>last.timestamp?(r.timestamp-last.timestamp)/1000:0,mbps=d?((r.bytesReceived-last.bytesReceived)*8/d/1e6):0;
      const got=d?(r.packetsReceived-last.packetsReceived):0,lost=d?Math.max(0,(r.packetsLost||0)-(last.packetsLost||0)):0,lossPct=got+lost?lost/(got+lost)*100:0;
      const freezes=d?(r.freezeCount||0)-(last.freezeCount||0):0;
      const buf=d&&r.jitterBufferEmittedCount>last.jitterBufferEmittedCount?(r.jitterBufferDelay-last.jitterBufferDelay)/(r.jitterBufferEmittedCount-last.jitterBufferEmittedCount):0;
      if(buf)PHONELAG=Math.round(Math.min(3000,buf*1000+(PHONERTT||0)/2+60));
      CAMREAL=`${r.frameWidth} × ${r.frameHeight} · ${Math.round(r.framesPerSecond||0)} fps · ${mbps.toFixed(1)} Mbps · ดีเลย์ ${(PHONELAG/1000).toFixed(2)} วิ · ภาพหาย ${lossPct.toFixed(1)}%${freezes>0?' · ค้าง '+freezes+' ครั้ง':''} (มือถือ)`;
      last=r;
    })}catch(e){}
    const el=$('#camreal');if(el)el.textContent='กล้องส่งภาพมา '+CAMREAL;
  },2000);
}
// phone side
// size choices for the phone, with the most the encoder may send for each (times 1.5 at 60 fps); a home or venue router carries this easily
const CAM_RES={480:[854,480,4000000],720:[1280,720,10000000],1080:[1920,1080,16000000]};
const camCap=()=>CAM_RES[CAMP.res][2]*(CAMP.fps>30?1.5:1);
const CAM_SHAPE={land:'แนวนอน',port:'แนวตั้ง',auto:'ตามการหมุนเครื่อง'};
const CAMP={mic:null,full:false,shape:CAM_SHAPE[keep('ptarena:camshape')]?keep('ptarena:camshape'):'land',locked:false,mode:keep('ptarena:cammode')==='sharp'?'sharp':'smooth',net:'',res:CAM_RES[keep('ptarena:camres')]?+keep('ptarena:camres'):1080,stream:null,pc:null,sid:'',state:'idle',fps:60,facing:'environment',dev:'',devs:[],zoom:null,real:'',tries:[],wake:null,un:null,err:''};
function vCam(){
  const st={idle:['','ยังไม่ได้ส่งภาพ'],wait:['warn','รอจุดจับเวลาสนาม '+LOCK],on:['ok','● ส่งภาพอยู่'],lost:['bad','หลุด กำลังต่อใหม่…']}[CAMP.state];
  return`<div class="campg">
    <div class="row between"><b>กล้อง · สนาม ${esc(LOCK)}</b><span class="pill ${st[0]}" id="camst">${st[1]}</span></div>
    ${CAMP.shape!=='auto'&&camPortrait()!==(CAMP.shape==='port')?`<div class="callout warn camrot"><b>หมุนมือถือเป็น${CAM_SHAPE[CAMP.shape]}</b><div class="small">ตั้งทิศภาพไว้เป็น${CAM_SHAPE[CAMP.shape]} ${camDims(CAMP.res).join(' × ')} ถือให้ตรงทิศ แล้วเปิดล็อกหมุนจอ</div></div>`:''}
    <div class="campv"><video id="campv" playsinline muted autoplay></video>${CAMP.stream?'':'<span>กด เริ่มส่งภาพ</span>'}
      ${CAMP.full?`<div class="camfbar"><span class="pill ${{idle:'',wait:'warn',on:'ok',lost:'bad'}[CAMP.state]}">${{idle:'ยังไม่ได้ส่งภาพ',wait:'รอจุดจับเวลา',on:'● ส่งภาพอยู่',lost:'หลุด กำลังต่อใหม่…'}[CAMP.state]}</span>${CAMP.locked?'<span class="pill ok">🔒</span>':''}<span class="camfnet" id="camfnet">${esc(CAMP.net)}</span><button class="btn" data-act="camfull">ย่อ</button></div>`:''}</div>
    <div class="small" id="camnet">${esc(CAMP.net)}</div>
    <div class="small muted" id="camgot">${CAMP.real?'ภาพที่ได้ '+esc(CAMP.real):'ภาพจะขึ้นที่จุดจับเวลาของสนามนี้ ไม่ต้องโหลดแอป'}</div>
    ${CAMP.tries.length?`<div class="small muted">ลองปรับกล้อง: ${CAMP.tries.map(esc).join(' · ')}</div>`:''}
    ${CAMP.err?`<div class="callout bad"><div><b>เปิดกล้องไม่ได้ (${esc(CAMP.err)})</b></div><ol style="margin:6px 0 0;padding-left:20px"><li>กดอนุญาตให้เว็บนี้ใช้กล้อง</li><li>iPhone: ตั้งค่า → Safari → กล้อง → อนุญาต</li><li>ปิดแอปอื่นที่ใช้กล้องอยู่ แล้วกดเริ่มใหม่</li></ol></div>`:''}
    ${CAMP.locked?`<div class="callout ok camlocked"><b>🔒 ล็อกกล้องอยู่</b><div class="small">หมุนเครื่องได้ ภาพไม่เปลี่ยน · กดค้าง 2 วิ เพื่อปลดล็อก</div></div><button class="btn big" data-act="camfull">⛶ เต็มจอ</button><button class="btn big" id="camunlock">กดค้างเพื่อปลดล็อก</button>`:`
    ${CAMP.devs.length>1?`<label class="tset" style="color:var(--muted)"><span>เลนส์ (มุมกว้าง / ปกติ / ซูม)</span><select id="camlens">${CAMP.devs.map((d,n)=>`<option value="${esc(d.deviceId)}" ${d.deviceId===CAMP.dev?'selected':''}>${esc(lensName(d.label,n))}</option>`).join('')}</select></label>`:''}
    ${CAMP.zoom?`<label class="tset" style="color:var(--muted)"><span>ซูม <b id="camzv">${CAMP.zoom.val.toFixed(1)}×</b></span><input type="range" id="camzoom" min="${CAMP.zoom.min}" max="${CAMP.zoom.max}" step="${CAMP.zoom.step}" value="${CAMP.zoom.val}"></label>`:CAMP.stream?'<div class="small muted">มือถือรุ่นนี้ซูมจากเว็บไม่ได้ · เลือกเลนส์แทน หรือครอปที่จุดจับเวลา</div>':''}
    <div class="row camctl"><label class="tset"><span>ทิศภาพ</span><select id="camshape">${Object.entries(CAM_SHAPE).map(([k,v])=>`<option value="${k}" ${k===CAMP.shape?'selected':''}>${k==='auto'?v:v+' '+(()=>{const [a,b]=CAM_RES[CAMP.res];return k==='port'?b+'×'+a:a+'×'+b})()}</option>`).join('')}</select></label><label class="tset"><span>ความชัด</span><select id="camres">${Object.keys(CAM_RES).map(r=>`<option value="${r}" ${+r===CAMP.res?'selected':''}>${r}p</option>`).join('')}</select></label><label class="tset"><span>เน้น</span><select id="cammode"><option value="smooth" ${CAMP.mode==='smooth'?'selected':''}>ลื่น</option><option value="sharp" ${CAMP.mode==='sharp'?'selected':''}>คม</option></select></label><label class="tset"><span>ความลื่น</span><select id="camfps">${[30,60].map(f=>`<option value="${f}" ${f===CAMP.fps?'selected':''}>${f} fps</option>`).join('')}</select></label>
      <button class="btn" data-act="camflip">สลับกล้องหน้า/หลัง</button><button class="btn" data-act="camrot" data-d="l" title="หมุนภาพซ้าย 90°">⟲</button><button class="btn" data-act="camrot" data-d="r" title="หมุนภาพขวา 90°">⟳</button><button class="btn" data-act="camflipimg" title="กลับด้านภาพ">⇋</button><button class="btn" data-act="camfull">⛶ เต็มจอ</button></div>
    <button class="btn ${CAMP.stream?'':'pri'} big" data-act="camgo">${CAMP.stream?'■ หยุดส่งภาพ':'▶ เริ่มส่งภาพ'}</button>
    ${CAMP.stream?`<button class="btn big" data-act="camlock">🔒 ล็อกกล้อง</button>`:''}`}
    <p class="small muted camtip" style="margin:0">ต่อ Wi‑Fi เดียวกับจุดจับเวลา · วางมือถือให้นิ่ง · เสียบชาร์จ · เปิดหน้านี้ค้างไว้</p></div>`;
}
function camAfter(){const pv=$('#campv');if(pv){const r=+(CTRL[LOCK]?.turn?.rot??CAMP.rotSeen??0),fl=(CTRL[LOCK]?.turn?.flip??CAMP.flipSeen)==='on';pv.style.transform=`rotate(${r}deg)${fl?' scaleX(-1)':''}`}const v=$('#campv');if(v&&CAMP.stream&&v.srcObject!==CAMP.stream){v.srcObject=CAMP.stream;v.play().catch(()=>{})}}
function camStatus(){const el=$('#camst');if(!el||CAMP.full)return render();const st={idle:['','ยังไม่ได้ส่งภาพ'],wait:['warn','รอจุดจับเวลาสนาม '+LOCK],on:['ok','● ส่งภาพอยู่'],lost:['bad','หลุด กำลังต่อใหม่…']}[CAMP.state];el.className='pill '+st[0];el.textContent=st[1]}
// lens names as phones report them, in plain words; unknown names are shown as they are
function lensName(label,n){
  const l=(label||'').toLowerCase();
  if(/ultra ?wide|อัลตร้า/.test(l))return'มุมกว้างพิเศษ (0.5×) · '+label;
  if(/tele/.test(l))return'ซูม (เทเล) · '+label;
  if(/front|user|หน้า/.test(l))return'กล้องหน้า · '+label;
  if(/triple|dual/.test(l))return'หลายเลนส์ (สลับเองตามซูม) · '+label;
  return label||'กล้อง '+(n+1);
}
// opens the camera; for 60 fps it asks firmly first at 1080p, then at 720p, before settling for 30
// Opens the camera, then, for 60 fps, asks the open camera to change: some phone browsers refuse a frame rate
// demanded at opening but accept it as a change afterwards. Every try and its answer is kept for the screen.
// width and height for a size, turned to the chosen shape
const camWantPort=()=>CAMP.shape==='port'||(CAMP.shape==='auto'&&camPortrait());
const camDims=r=>{const [a,b]=CAM_RES[r];return camWantPort()?[b,a]:[a,b]};
async function camOpen(){
  const pick=CAMP.dev?{deviceId:{exact:CAMP.dev}}:{facingMode:{ideal:CAMP.facing}},[w,h]=camDims(CAMP.res);
  const st=await navigator.mediaDevices.getUserMedia({video:{...pick,width:{ideal:w},height:{ideal:h},aspectRatio:{ideal:w/h},frameRate:{ideal:CAMP.fps}},audio:false});
  CAMP.tries=[];
  const tr=st.getVideoTracks()[0],fps=()=>Math.round(tr.getSettings().frameRate||0);
  // some phones open smaller than asked: ask again, firmly, for the chosen size, and say what came of it
  const got=()=>tr.getSettings().width||0,want=Math.max(w,h);
  if(Math.max(got(),tr.getSettings().height||0)<want){
    for(const [nm,c] of [[`บังคับ ${w}×${h}`,{width:{exact:w},height:{exact:h}}],[`ขั้นต่ำ ${w}×${h}`,{width:{min:w},height:{min:h}}]]){
      try{await tr.applyConstraints(c);const s2=tr.getSettings();CAMP.tries.push(nm+': ได้ '+s2.width+'×'+s2.height);if(Math.max(s2.width,s2.height)>=want)break}
      catch(e){CAMP.tries.push(nm+': ไม่ได้ ('+(e.constraint?e.constraint+' ':'')+(e.name||'error')+')')}
    }
  }
  if(CAMP.fps>30&&fps()<50){
    // the chosen size first, then smaller ones, then 60 at whatever size the phone picks
    const sizes=[1080,720,480].filter(r=>CAMP.mode==='sharp'?r===CAMP.res:r<=CAMP.res).map(r=>[r+'p 60',{width:{ideal:camDims(r)[0]},height:{ideal:camDims(r)[1]},frameRate:{exact:60}}]);
    for(const [nm,c] of CAMP.mode==='sharp'?sizes:[...sizes,['60 ขนาดไหนก็ได้',{frameRate:{exact:60}}],['60 แบบขอ',{frameRate:{ideal:60}}]]){
      try{await tr.applyConstraints(c);const f=fps();CAMP.tries.push(nm+': ได้ '+f+' fps');if(f>=50)break}
      catch(e){CAMP.tries.push(nm+': ไม่ได้ ('+(e.constraint?e.constraint+' ':'')+(e.name||'error')+')')}
    }
    if(fps()<50)try{await tr.applyConstraints({width:{ideal:w},height:{ideal:h},frameRate:{ideal:30}})}catch(e){}
  }
  return st;
}
// asks the phone's encoder for the bitrate that suits the chosen size and smoothness; weak Wi-Fi may still lower it
async function camBitrate(snd){
  try{const p=snd.getParameters();if(!p.encodings||!p.encodings.length)p.encodings=[{}];p.encodings[0].maxBitrate=Math.round(camCap());p.encodings[0].maxFramerate=CAMP.fps;p.degradationPreference=CAMP.mode==='sharp'?'maintain-resolution':'maintain-framerate';await snd.setParameters(p)}catch(e){}
}
// what the phone is really sending, and what the browser says is holding it back
function camNet(pc){
  let last=null;const iv=setInterval(async()=>{
    if(pc!==CAMP.pc){clearInterval(iv);return}
    try{(await pc.getStats()).forEach(r=>{
      if(r.type!=='outbound-rtp'||r.kind!=='video')return;
      const d=last&&r.timestamp>last.timestamp?(r.timestamp-last.timestamp)/1000:0,mbps=d?((r.bytesSent-last.bytesSent)*8/d/1e6):0;
      // sending at the ceiling we set is reported by the browser as a bandwidth limit: say what it really is
      // enough for this picture: about 4 Mbps for 720p and 8 for 1080p at 30 fps, half as much again at 60
      const atCap=mbps>=camCap()/1e6*0.85,enough=mbps>=(r.frameHeight>=1000||r.frameWidth>=1900?8:r.frameHeight>=700||r.frameWidth>=1200?4:2)*((r.framesPerSecond||30)>40?1.5:1);
      const why=atCap?'ถึงค่าสูงสุดที่ตั้งไว้ '+(camCap()/1e6).toFixed(0)+' Mbps (ปกติ)':enough&&r.qualityLimitationReason==='bandwidth'?'ส่งได้เต็มที่แล้ว (พอสำหรับภาพขนาดนี้)':{bandwidth:'เน็ตช้า',cpu:'เครื่องไม่ไหว (ร้อนหรือช้า)',other:'อื่นๆ',none:'ไม่ติดอะไร'}[r.qualityLimitationReason]||'';
      CAMP.net=r.frameWidth?`กำลังส่ง ${r.frameWidth} × ${r.frameHeight} · ${Math.round(r.framesPerSecond||0)} fps · ${mbps.toFixed(1)} Mbps${why?' · ติดที่: '+why:''}${r.encoderImplementation?' · '+r.encoderImplementation:''}`:'';
      last=r;
    })}catch(e){}
    const el=$('#camnet');if(el)el.textContent=CAMP.net;const fe=$('#camfnet');if(fe)fe.textContent=CAMP.net;
  },2000);
}
// The picture's shape follows how the phone is held when the camera opens. When the phone turns, the camera is opened
// again on the same link, so a phone turned to landscape sends a landscape picture.
const camPortrait=()=>matchMedia('(orientation: portrait)').matches;
let CAMROT=null;
let CAMWASP=null;
const camTurned=()=>{
  if(ROLE!=='cam')return;const p=camPortrait();if(p===CAMWASP)return;
  if(CAMP.locked||CAMP.shape!=='auto'){CAMWASP=p;clearTimeout(CAMROT);CAMROT=setTimeout(render,700);return}   // fixed shape: only refresh the noticeCAMWASP=p;clearTimeout(CAMROT);
  CAMROT=setTimeout(()=>{if(CAMP.stream)camSwap();else render()},700);   // wait for the turn to finish
};
matchMedia('(orientation: portrait)').addEventListener?.('change',camTurned);
window.addEventListener('resize',camTurned);
setInterval(camTurned,1000);   // some phones report a turn late or not at all
// Lock: the picture stays as it is. Turning the phone no longer reopens the camera, the settings are hidden from stray
// fingers, and focus, light and colour are held where they are now if the phone lets the page do that.
async function camLock(){
  CAMP.locked=true;if(CAMP.shape==='land')camLand(true);
  const tr=CAMP.stream?.getVideoTracks()[0],cap=tr?.getCapabilities?.()||{},hold={};
  [['focusMode'],['exposureMode'],['whiteBalanceMode']].forEach(([k])=>{if((cap[k]||[]).includes('manual'))hold[k]='manual'});
  if(tr&&Object.keys(hold).length)try{await tr.applyConstraints({advanced:[hold]})}catch(e){}
  render();toast(Object.keys(hold).length?'ล็อกกล้องแล้ว (โฟกัส แสง สี)':'ล็อกกล้องแล้ว (รุ่นนี้ล็อกโฟกัส/แสงจากเว็บไม่ได้)');
}
async function camUnlock(){
  CAMP.locked=false;const tr=CAMP.stream?.getVideoTracks()[0],cap=tr?.getCapabilities?.()||{},free={};
  [['focusMode'],['exposureMode'],['whiteBalanceMode']].forEach(([k])=>{if((cap[k]||[]).includes('continuous'))free[k]='continuous'});
  if(tr&&Object.keys(free).length)try{await tr.applyConstraints({advanced:[free]})}catch(e){}
  CAMWASP=null;render();
}
// unlocking takes a two-second press, so a brush of the hand while mounting the phone does nothing
let CAMHOLD=null;
document.addEventListener('pointerdown',e=>{if(e.target.closest?.('#camunlock')){const b=e.target.closest('#camunlock');b.classList.add('holding');CAMHOLD=setTimeout(()=>{CAMHOLD=null;camUnlock()},2000)}});
['pointerup','pointercancel','pointerleave'].forEach(n=>document.addEventListener(n,()=>{if(CAMHOLD){clearTimeout(CAMHOLD);CAMHOLD=null;$('#camunlock')?.classList.remove('holding')}},true));
// full screen for the phone page: the picture fills the screen. Where the browser cannot go full screen (iPhone),
// the page itself fills the window, which looks much the same.
async function camFull(on){
  CAMP.full=on;document.body.classList.toggle('camfull',on);
  try{
    if(on){if(!document.fullscreenElement)await document.documentElement.requestFullscreen?.();if(CAMP.shape==='land')await screen.orientation?.lock?.('landscape').catch(()=>{})}
    else if(document.fullscreenElement)await document.exitFullscreen();
  }catch(e){}
  render();
}
document.addEventListener('fullscreenchange',()=>{if(ROLE==='cam'&&!document.fullscreenElement&&CAMP.full){CAMP.full=false;document.body.classList.remove('camfull');render()}});
async function camLand(quiet){
  let full=false;
  try{if(!document.fullscreenElement)await document.documentElement.requestFullscreen?.();full=!!document.fullscreenElement}catch(e){}
  try{await screen.orientation.lock('landscape');if(!quiet)toast('เต็มจอ และล็อกแนวนอนแล้ว');return}catch(e){}
  if(!quiet)toast(full?'เต็มจอแล้ว แต่ล็อกแนวนอนจากเว็บไม่ได้ · หมุนเป็นแนวนอนแล้วเปิดล็อกหมุนจอ':'iPhone เปิดเต็มจอจากเว็บไม่ได้ · หมุนเป็นแนวนอนแล้วเปิดล็อกหมุนจอ');
}
function camRead(){
  const tr=CAMP.stream.getVideoTracks()[0],s=tr.getSettings(),cap=tr.getCapabilities?.()||{};
  CAMP.dev=s.deviceId||CAMP.dev;
  CAMP.zoom=cap.zoom&&cap.zoom.max>cap.zoom.min?{min:cap.zoom.min,max:cap.zoom.max,step:cap.zoom.step||0.1,val:s.zoom||cap.zoom.min}:null;
  CAMP.real=`${s.width||'?'} × ${s.height||'?'}${s.frameRate?' · '+Math.round(s.frameRate)+' fps':''}${cap.frameRate?.max?` (กล้องรองรับสูงสุด ${Math.round(cap.frameRate.max)} fps${cap.width?.max?' · '+cap.width.max+' × '+cap.height.max:''})`:''}`;
}
async function camStart(){
  CAMP.err='';
  try{CAMP.stream=await camOpen()}catch(e){CAMP.stream=null;CAMP.err=e.name||'error';render();return}
  // the phone's microphone goes along; without permission the picture still goes
  try{CAMP.mic=CAMP.mic||await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:false,noiseSuppression:true,autoGainControl:true},video:false})}catch(e){CAMP.mic=null}
  camRead();
  // lens names only show once the camera is allowed, so the list is read after opening it
  try{CAMP.devs=(await navigator.mediaDevices.enumerateDevices()).filter(d=>d.kind==='videoinput')}catch(e){}
  try{CAMP.wake=await navigator.wakeLock?.request('screen')}catch(e){}
  if(!CAMP.un)CAMP.un=rtcWatch(LOCK,d=>{const pc=CAMP.pc;if(d&&d.answer&&d.asid===CAMP.sid&&pc&&!pc.currentRemoteDescription)pc.setRemoteDescription({type:'answer',sdp:d.answer}).catch(()=>{})})||null;
  render();camOffer();
}
// another lens, side or smoothness while sending: the new picture replaces the old one on the same link, so the laptop keeps it
async function camSwap(){
  if(!CAMP.stream)return camStart();
  const old=CAMP.stream;old.getTracks().forEach(t=>t.stop());   // some phones open only one camera at a time
  try{CAMP.stream=await camOpen()}catch(e){CAMP.stream=null;CAMP.err=e.name||'error';camStop();return}
  camRead();
  const snd=CAMP.pc?.getSenders().find(x=>x.track?.kind==='video'||!x.track);
  try{if(snd){await snd.replaceTrack(CAMP.stream.getVideoTracks()[0]);await camBitrate(snd)}else camOffer()}catch(e){camOffer()}
  render();
}
function camStop(){
  // tells the laptop straight away, instead of leaving it on a frozen picture until the link times out
  if(CAMP.sid)rtcSend(LOCK,{bye:CAMP.sid,offer:null,sid:null});
  CAMP.locked=false;
  try{CAMP.pc?.close()}catch(e){}CAMP.pc=null;CAMP.stream?.getTracks().forEach(t=>t.stop());CAMP.stream=null;CAMP.mic?.getTracks().forEach(t=>t.stop());CAMP.mic=null;CAMP.state='idle';CAMP.real='';
  try{CAMP.wake?.release()}catch(e){}CAMP.wake=null;render();
}
async function camOffer(){
  if(!CAMP.stream)return;try{CAMP.pc?.close()}catch(e){}
  const pc=new RTCPeerConnection(RTC_CFG),sid=Date.now().toString(36)+Math.random().toString(36).slice(2,6);CAMP.pc=pc;CAMP.sid=sid;CAMP.state='wait';camStatus();
  CAMP.stream.getVideoTracks().forEach(t=>pc.addTrack(t,CAMP.stream));
  CAMP.mic?.getAudioTracks().forEach(t=>pc.addTrack(t,CAMP.stream));
  // phones have a video chip for H.264; using it keeps the phone cooler and steadier than encoding in software
  try{const tc=pc.getTransceivers()[0],cs=RTCRtpSender.getCapabilities('video').codecs;tc.setCodecPreferences([...cs.filter(c=>/h264/i.test(c.mimeType)),...cs.filter(c=>!/h264/i.test(c.mimeType))])}catch(e){}
  camNet(pc);
  pc.onconnectionstatechange=()=>{
    if(pc!==CAMP.pc)return;const cs=pc.connectionState;
    if(cs==='connected')CAMP.state='on';
    else if(cs==='failed'||cs==='disconnected'){CAMP.state='lost';setTimeout(()=>{if(pc===CAMP.pc&&CAMP.stream&&pc.connectionState!=='connected')camOffer()},4000)}
    camStatus();
  };
  await pc.setLocalDescription(await pc.createOffer());
  // ask the encoder for the full picture and the chosen smoothness; the network may still lower it on weak Wi-Fi
  await camBitrate(pc.getSenders().find(x=>x.track?.kind==='video'));
  await iceDone(pc);if(pc!==CAMP.pc)return;
  const offer={sid,offer:pc.localDescription.sdp,answer:null,asid:null,t:Date.now()};rtcSend(LOCK,offer);
  // the laptop page may open later: say it again until it answers
  const iv=setInterval(()=>{if(pc!==CAMP.pc||pc.currentRemoteDescription)return clearInterval(iv);rtcSend(LOCK,{...offer,t:Date.now()})},CLOUD?30000:2000);
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
  CAMASK=true;CAMERR='';
  if(CAMID==='phone'){
    const q=CAMQ[QUAL];if(CAM&&CAM!==PHONE)CAM.getTracks().forEach(k=>k.stop());CAM=PHONE;CAMREAL='';VID=null;
    if(PHONE){VID=document.createElement('video');VID.muted=true;VID.playsInline=true;VID.srcObject=PHONE;VID.play().catch(()=>{});phoneMeter()}
    try{CAMS=(await navigator.mediaDevices.enumerateDevices()).filter(d=>d.kind==='videoinput')}catch(e){}
    if(CV){CV.width=q.w;CV.height=q.h}CSTREAM=null;drawLoop();CAMASK=false;if(S.ui.view==='timer')render();return;
  }
  // the request for the camera's own zoom and pan is a bonus: a camera or browser that refuses it is opened without it
  const q=CAMQ[QUAL],ask=async id=>{const v={...(id?{deviceId:{exact:id}}:{}),width:{ideal:q.w},height:{ideal:q.h},frameRate:{ideal:FPS}};
    try{return await navigator.mediaDevices.getUserMedia({video:{...v,pan:true,tilt:true,zoom:true},audio:false})}catch(e){return navigator.mediaDevices.getUserMedia({video:v,audio:false})}};
  const why={NotReadableError:'มีแอปอื่นใช้กล้องนี้อยู่ ปิดแอปนั้นก่อน',OverconstrainedError:'กล้องไม่รองรับค่าที่ตั้ง',NotAllowedError:'ยังไม่ได้อนุญาตกล้อง',NotFoundError:'ไม่เจอกล้อง เช็กสาย USB'};
  try{
    if(CAM&&CAM!==PHONE)CAM.getTracks().forEach(k=>k.stop());
    // the chosen camera first; if it cannot open, say why, then fall back to whatever is there so the field still records
    try{CAM=await ask(CAMID)}catch(e){if(!CAMID)throw e;const nm=CAMS.find(d=>d.deviceId===CAMID)?.label||'ที่เลือก';CAMID='';CAM=await ask('');toast(`เปิดกล้อง ${nm} ไม่ได้: ${why[e.name]||e.name} · ใช้กล้องอื่นแทน`)}
    const st=CAM.getVideoTracks()[0].getSettings();CAMID=st.deviceId||CAMID;CAMREAL=st.width&&st.height?st.width+' × '+st.height+(st.frameRate?' · '+Math.round(st.frameRate)+' fps':''):'';
    CAMS=(await navigator.mediaDevices.enumerateDevices()).filter(d=>d.kind==='videoinput');
    await lensRead();
    VID=document.createElement('video');VID.muted=true;VID.playsInline=true;VID.srcObject=CAM;VID.play().catch(()=>{});
  }catch(e){CAM=null;CAMERR=e.name||'error'}
  if(CV){CV.width=q.w;CV.height=q.h}
  CSTREAM=null;drawLoop();   // the next recording picks up the new frame rate
  CAMASK=false;if(S.ui.view==='timer')render();
}
navigator.mediaDevices?.addEventListener?.('devicechange',async()=>{if(ROLE!=='timer'||!CAM)return;try{CAMS=(await navigator.mediaDevices.enumerateDevices()).filter(d=>d.kind==='videoinput')}catch(e){}if(S.ui.view==='timer')render()});
// recording follows the clock, whoever started it: this laptop, or the judge's phone
function syncRec(){
  if(ROLE!=='timer'||!LOCK||!CAM)return;const t=timerOf(LOCK);
  if(t.state==='run'&&!REC&&RECFAIL!==t.startAt){
    const aud=recAudio();
    const mime=(aud?['video/webm;codecs=vp9,opus','video/webm;codecs=vp8,opus','video/webm','video/mp4']:['video/webm;codecs=vp9','video/webm;codecs=vp8','video/webm','video/mp4']).find(m=>MediaRecorder.isTypeSupported(m));
    // the file name carries the team's name too, so a clip is easy to find in a folder; characters Windows refuses are dropped
    const tname=(team(t.team)?.name||'').replace(/[\\/:*?"<>|]+/g,'').trim().slice(0,40);
    const name=`${t.team}${tname?'_'+tname:''}_R${t.round}_${nowHM().replace(':','')}.${mime&&mime.startsWith('video/mp4')?'mp4':'webm'}`,chunks=[];
    let rec;
    // a recorder that refuses our settings must not take the clock down with it: fall back to the browser's own, then give up for this run
    // what is recorded is the picture with graphics; without that, the bare camera
    let src=CAM;try{CSTREAM=CSTREAM||stageCanvas().captureStream(FPS);src=aud?new MediaStream([...CSTREAM.getVideoTracks(),aud]):CSTREAM}catch(e){}
    try{rec=new MediaRecorder(src,{mimeType:mime,videoBitsPerSecond:Math.round(CAMQ[QUAL].bps*(FPS>30?1.6:1))})}catch(e){try{rec=new MediaRecorder(src)}catch(e2){RECERR=`${e2.name}: ${e2.message}`;RECFAIL=t.startAt;return}}
    REC=rec;RECERR='';
    rec.ondataavailable=e=>{if(e.data.size)chunks.push(e.data)};
    rec.onstop=()=>{
      REC=null;if(CLIP)URL.revokeObjectURL(CLIP.url);
      const blob=new Blob(chunks,{type:rec.mimeType});CLIP={url:URL.createObjectURL(blob),name};
      saveClip(blob,name).catch(()=>{}).then(()=>{if(S.ui.view==='timer')render()});
      upAdd(blob,name,t.team+'_'+t.round);
      if(S.ui.view==='timer')render();
    };
    try{rec.start(1000)}catch(e){REC=null;RECERR=`${e.name}: ${e.message}`;RECFAIL=t.startAt}
  }else if(t.state!=='run'&&REC&&REC.state==='recording'){
    // a moment more after the stop: the picture arrives late (a phone over Wi-Fi more so), and the finish must be in the clip
    if(!REC.stopAt)REC.stopAt=Date.now()+(usingPhone()?PHONELAG:0)+700;
    if(Date.now()>=REC.stopAt)REC.stop();
  }
}
setInterval(()=>{if(REC&&REC.stopAt)syncRec()},100);

/* ---------- board ---------- */
function vBoard(){
  const c=cls(S.ui.boardCls),rows=standings(c.id),cp=S.comps[c.comp];
  const chips=fieldsSorted().map(x=>`<button class="chip" data-act="bcls" data-v="${x.id}" aria-pressed="${x.id===c.id}">${esc(S.comps[x.comp].tag)} <b>${esc(x.level)}</b></button>`).join('');
  const head=Array.from({length:S.rounds},(_,i)=>`<th class="num">รอบ ${i+1}</th>`).join('');
  // phone: one card per team instead of a wide table
  const mine=ROLE==='staff'?null:myTeam();
  const isMe=r=>mine&&mine.id===r.t.id;
  const rounds=r=>Array.from({length:S.rounds},(_,i)=>{const x=runOf(r.t.id,i+1);return`<i class="${x?'on':''}">${x?score(x):'–'}</i>`}).join('');
  const top=rows.filter(r=>r.rank&&r.rank<=3);
  const podium=top.length?`<div class="podium">${[top[1],top[0],top[2]].map(r=>r?`<div class="pd p${r.rank} ${isMe(r)?'me':''}"><span class="rk r${r.rank}">${r.rank}</span><b>${esc(r.t.name)}</b><small>${esc(r.t.school)}</small><em class="mono">${r.b.score}</em><span class="pt mono">${icon('wait')} ${fmtMs(r.b.run.ms)}</span></div>`:'<div class="pd empty"></div>').join('')}</div>`:'';
  const cards=rows.filter(r=>!top.includes(r)).map(r=>`<div class="brow ${isMe(r)?'me':''}"><span class="rk">${r.rank||'–'}</span>
    <div class="who"><b>${esc(r.t.name)}${isMe(r)?' <span class="metag">ทีมฉัน</span>':''}</b><small>${esc(r.t.school)}</small>${r.b?`<span class="rds">${rounds(r)}<span class="mono">${icon('wait')} ${fmtMs(r.b.run.ms)}</span></span>`:''}</div>
    <b class="bs mono">${r.b?r.b.score:'–'}</b></div>`).join('');
  const body=rows.map(r=>{const rd=Array.from({length:S.rounds},(_,i)=>{const x=runOf(r.t.id,i+1);return`<td class="num">${x?score(x):'<span class="muted">–</span>'}</td>`}).join('');
    return`<tr><td>${r.rank?`<span class="rk ${r.rank<=3?'r'+r.rank:''}">${r.rank}</span>`:'<span class="muted small">รอแข่ง</span>'}</td>
      <td><span class="tid">${r.t.id}</span> <b>${esc(r.t.name)}</b><div class="small muted">${esc(r.t.school)}</div></td>${rd}
      <td class="num best">${r.b?r.b.score:'–'}</td><td class="num">${r.b?fmtMs(r.b.run.ms):'–'}</td><td class="num">${r.b?r.b.run.pen||0:'–'}</td></tr>`}).join('');
  return`<div class="panel">
    <div class="row between"><div><h2>${esc(cp.name)} · ${esc(c.level)}</h2><div class="small muted"><span class="livedot"></span>สนาม ${c.field} · อัปเดตสด</div></div>${ROLE==='staff'?'<button class="btn sm" data-act="copycsv">คัดลอกผลเป็น CSV</button>':''}</div>
    <div class="chips fchips">${chips}</div><select id="bsel" class="fsel" aria-label="เลือกรุ่น">${fieldsSorted().map(x=>`<option value="${x.id}" ${x.id===c.id?'selected':''}>${esc(S.comps[x.comp].tag)} ${esc(x.level)}</option>`).join('')}</select>
    ${mine&&mine.cls===c.id?`<button class="btn sm narrow tome" data-act="tome">↓ ไปที่ทีมฉัน</button>`:''}
    <div class="narrow bwrap">${podium}<div class="blist">${cards}</div></div>
    <div class="tbl-wrap wide"><table><thead><tr><th>อันดับ</th><th>ทีม</th>${head}<th class="num">คะแนนดีสุด</th><th class="num">เวลา</th><th class="num">Retry</th></tr></thead><tbody>${body}</tbody></table></div>
    <p class="small muted" style="margin:0">ใช้รอบที่ดีที่สุด · คะแนนเท่ากัน ดูเวลาน้อยกว่า แล้วดู Retry น้อยกว่า</p></div>`;
}

/* ---------- field pictures: files the owner drops into the fields folder, named after the field letter ---------- */
const FIELD_EXT=['jpg','png','webp','jpeg'],FIELD_PIC={};   // FIELD_PIC: which file type was found for a name, -1 = none
function fieldPic(name,alt,none){
  const n=FIELD_PIC[name]??0,src=`fields/${name}.${FIELD_EXT[Math.max(n,0)]}`;
  return`<a class="fpic" href="${src}" target="_blank" rel="noopener" ${n<0?'hidden':''}><img data-fpic="${name}" data-n="${Math.max(n,0)}" src="${src}" alt="${esc(alt)}"></a><div class="fnone" ${n<0&&none?'':'hidden'}>${none}</div>`;
}
document.addEventListener('load',e=>{const im=e.target;if(im.dataset?.fpic)FIELD_PIC[im.dataset.fpic]=+im.dataset.n},true);
document.addEventListener('error',e=>{const im=e.target;if(!im.dataset?.fpic)return;const n=+im.dataset.n+1,a=im.parentElement;
  if(n<FIELD_EXT.length){im.dataset.n=n;im.src=a.href=`fields/${im.dataset.fpic}.${FIELD_EXT[n]}`}
  else{FIELD_PIC[im.dataset.fpic]=-1;a.hidden=true;const none=a.nextElementSibling;none.hidden=!none.textContent}},true);
function vField(){
  const mine=ROLE==='staff'?null:myTeam(),c=cls(S.ui.fieldCls)||(mine&&cls(mine.cls))||fieldsSorted()[0],cp=S.comps[c.comp],lim=cp.timeLimit;
  const chips=fieldsSorted().map(x=>`<button class="chip" data-act="pcls" data-v="${x.id}" aria-pressed="${x.id===c.id}"><b>${x.field}</b> ${esc(S.comps[x.comp].tag)} ${esc(x.level)}</button>`).join('');
  return`<div class="panel fpage">
    <div><h2>สนาม ${c.field} · ${esc(cp.name)} · ${esc(c.level)}</h2><div class="small muted">เวลาแข่ง ${Math.floor(lim/60)}:${String(lim%60).padStart(2,'0')} นาที${mine&&mine.cls===c.id?' · สนามของทีมคุณ':''}</div></div>
    <div class="chips fchips">${chips}</div><select id="psel" class="fsel" aria-label="เลือกสนาม">${fieldsSorted().map(x=>`<option value="${x.id}" ${x.id===c.id?'selected':''}>สนาม ${x.field} · ${esc(S.comps[x.comp].tag)} ${esc(x.level)}</option>`).join('')}</select>
    ${fieldPic(c.field,'ภาพสนาม '+c.field,'ยังไม่มีภาพสนามนี้')}
    ${fieldPic('map','ผังงาน','')}
    <p class="small muted ftap">แตะภาพเพื่อดูขนาดเต็ม</p>
    ${ROLE==='staff'?`<p class="note" style="margin:0"><b>วิธีใส่ภาพ</b> · วางไฟล์ในโฟลเดอร์ <span class="mono">fields</span> ตั้งชื่อตามสนาม เช่น <span class="mono">A.jpg</span> ถึง <span class="mono">G.jpg</span> และ <span class="mono">map.jpg</span> สำหรับผังงาน ใช้ jpg png หรือ webp ได้</p>`:''}</div>`;
}

/* ---------- live: one channel per competition, video on top when a link is set, the fields of that competition under it ---------- */
function channels(){const m=[];fieldsSorted().forEach(c=>{const tag=S.comps[c.comp].tag;let ch=m.find(x=>x.tag===tag);if(!ch)m.push(ch={id:c.comp,tag,cls:[]});ch.cls.push(c)});return m}
const ytId=u=>{const m=/(?:youtu\.be\/|[?&]v=|\/live\/|\/embed\/|\/shorts\/)([\w-]{11})/.exec(u||'');return m?m[1]:null};
function liveCh(){const all=channels(),mine=ROLE==='staff'?null:myTeam();return all.find(x=>x.id===S.ui.liveCh)||(mine&&all.find(x=>x.cls.some(c=>c.id===mine.cls)))||all[0]}
const liveKey=()=>{const ch=liveCh();return ch.id+'|'+((S.live||{})[ch.id]||'')};
const chBar=()=>{const on=liveCh();return channels().map(ch=>`<button class="ch" data-act="ch" data-v="${ch.id}" aria-pressed="${ch.id===on.id}"><b>${esc(ch.tag)}</b><small>สนาม ${ch.cls.map(c=>c.field).join(' ')}${ch.cls.some(c=>timerOf(c.field).state==='run')?' <i class="dot"></i>':''}</small></button>`).join('')};
function liveBody(){
  const ch=liveCh(),mine=ROLE==='staff'?null:myTeam();
  return ch.cls.map(c=>{
    const cp=S.comps[c.comp],t=timerOf(c.field),q=queue(c.id),on=t.state!=='idle'&&team(t.team),now=on||q[0],rest=q.filter(x=>!now||x.id!==now.id),sc=on?liveScore(c.field):null,items=t.live?.items||{};
    const state=on?(t.state==='run'?'<span class="pill bad">● กำลังแข่ง</span>':'<span class="pill warn">หยุดเวลา · รอส่งคะแนน</span>'):now?'<span class="pill ac">รอเริ่ม</span>':'<span class="pill">ว่าง</span>';
    const myIdx=mine&&mine.cls===c.id?q.findIndex(x=>x.id===mine.id):-1;
    const top=standings(c.id).filter(r=>r.rank).slice(0,3);
    return`<div class="panel lcard ${on&&t.state==='run'?'run':''}">
      <div class="row between"><h3>สนาม ${c.field} · ${esc(c.level)}${on?` · รอบ ${t.round}`:''}</h3>${state}</div>
      ${now?`<div class="lnow"><div class="who"><b>${esc(now.name)}${mine&&mine.id===now.id?' <span class="metag">ทีมฉัน</span>':''}</b><small><span class="tid">${now.id}</span> ${esc(now.school)}</small></div>
        ${on?`<div class="lnum"><b class="mono">${sc??0}</b><small>คะแนน</small></div>`:''}</div>
        ${on?`<div class="lclock mono" data-tm="${c.field}">${fmtMs(tElapsed(t))}</div>
        <div class="lmis">${cp.missions.map(m=>{const n=Math.min(items[m.id]||0,m.max);return`<span class="${n?'on':''}">${esc(m.short||m.label)} <b class="mono">${n}/${m.max}</b></span>`}).join('')}<span class="${t.live?.pen?'rty':''}">Retry <b class="mono">${t.live?.pen||0}</b></span></div>`:''}`
        :`<p class="muted small" style="margin:0">ยังไม่มีทีมในคิว</p>`}
      ${myIdx>0?`<div class="lmine">ทีมคุณอีก ${myIdx} คิว</div>`:''}
      ${rest.length?`<div class="small muted">ถัดไป: ${rest.slice(0,3).map(x=>`<span class="tid">${x.id}</span> ${esc(x.name)}`).join(' · ')}</div>`:''}
      ${top.length?`<div class="ltop">${top.map(r=>`<span><i class="rk r${r.rank}">${r.rank}</i>${esc(r.t.name)} <b class="mono">${r.b.score}</b></span>`).join('')}</div>`:''}
    </div>`}).join('');
}
function vLive(){
  const ch=liveCh(),url=((S.live||{})[ch.id]||'').trim(),id=ytId(url);
  const video=id?`<div class="yt"><iframe src="https://www.youtube-nocookie.com/embed/${id}?playsinline=1&rel=0" title="ไลฟ์ ${esc(ch.tag)}" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe></div>`
    :/^https:\/\//.test(url)?`<a class="btn pri big" style="justify-content:center" href="${esc(url)}" target="_blank" rel="noopener">▶ ดูไลฟ์</a>`:'';
  return`<div class="live"><div class="chbar">${chBar()}</div><div id="ytbox" data-k="${esc(liveKey())}">${video}</div><div id="livebody" class="grid">${liveBody()}</div></div>`;
}

/* ---------- "your turn" alerts on a team's phone: one when a single team is ahead, one when it is their turn.
   They show while the page is open, even tucked in the background. On iPhone the page must be added to the home screen first. */
const NOTE_KEY='ptarena:notify',NOTE_SEEN='ptarena:notified';
const noteOn=()=>keep(NOTE_KEY)==='on';
const iosNotApp=()=>/iphone|ipad/i.test(navigator.userAgent)&&!(matchMedia('(display-mode: standalone)').matches||navigator.standalone);
let NOTEAC=null;
const noteSoundReady=()=>{try{NOTEAC=NOTEAC||new (window.AudioContext||window.webkitAudioContext)();NOTEAC.resume()}catch(e){}};
function noteSound(n){
  if(!NOTEAC)return;
  for(let i=0;i<n;i++)try{const o=NOTEAC.createOscillator(),g=NOTEAC.createGain(),t=NOTEAC.currentTime+i*0.35;o.frequency.value=880;o.connect(g);g.connect(NOTEAC.destination);
    g.gain.setValueAtTime(0.001,t);g.gain.exponentialRampToValueAtTime(0.3,t+0.02);g.gain.exponentialRampToValueAtTime(0.001,t+0.28);o.start(t);o.stop(t+0.3)}catch(e){}
}
async function noteEnable(){
  noteSoundReady();keep(NOTE_KEY,'on');
  if('Notification' in window&&Notification.permission==='default')try{await Notification.requestPermission()}catch(e){}
  try{localStorage.removeItem(NOTE_SEEN)}catch(e){}
  toast('เปิดแจ้งเตือนแล้ว');render();   // render last: an alert that is already due shows over this message
}
function noteHint(){
  if(!('Notification' in window))return iosNotApp()?'iPhone: กดปุ่มแชร์ → "เพิ่มลงหน้าจอโฮม" แล้วเปิดจากไอคอนนั้น จึงจะแจ้งเตือนได้ · ตอนนี้เตือนด้วยเสียงบนหน้านี้แทน':'เครื่องนี้รับแจ้งเตือนจากเว็บไม่ได้ · จะเตือนด้วยเสียงบนหน้านี้แทน';
  if(Notification.permission==='denied')return'การแจ้งเตือนถูกปิดอยู่ · เปิดได้ที่ตั้งค่าเว็บไซต์ในเบราว์เซอร์ · ตอนนี้เตือนด้วยเสียงบนหน้านี้แทน';
  return'เปิดหน้านี้ค้างไว้ (สลับไปแอปอื่นได้) · ถ้าปิดเบราว์เซอร์จะไม่แจ้งเตือน';
}
function noteCheck(){
  if(ROLE!=='view'||!noteOn()||!READY)return;
  const t=myTeam();if(!t)return;const c=cls(t.cls),r=curRound(c.id);if(!r)return;
  const idx=queue(c.id).findIndex(x=>x.id===t.id),stage=idx===0?'now':idx===1?'next':null;if(!stage)return;
  const key=t.id+'_'+r+'_'+stage;let seen=[];try{seen=JSON.parse(localStorage.getItem(NOTE_SEEN)||'[]')}catch(e){}
  if(seen.includes(key))return;
  seen.push(key);try{localStorage.setItem(NOTE_SEEN,JSON.stringify(seen.slice(-40)))}catch(e){}
  const title=stage==='now'?`ถึงคิวแล้ว · ${t.name}`:`เตรียมตัว · อีก 1 คิว`,body=stage==='now'?`ไปที่สนาม ${c.field} ทันที · รอบ ${r}`:`${t.name} · สนาม ${c.field} · รอบ ${r} · เตรียมหุ่นให้พร้อม`;
  try{navigator.vibrate?.(stage==='now'?[400,150,400,150,400]:[250,120,250])}catch(e){}
  noteSound(stage==='now'?3:2);toast(title+' · '+body);
  if('Notification' in window&&Notification.permission==='granted'){
    const opt={body,tag:'ptarena-queue',renotify:true,icon:'logo-mark.png',vibrate:[300,100,300]};
    (navigator.serviceWorker?navigator.serviceWorker.getRegistration():Promise.resolve(null)).then(reg=>reg?reg.showNotification(title,opt):new Notification(title,opt)).catch(()=>{try{new Notification(title,opt)}catch(e){}});
  }
}
setInterval(noteCheck,15000);

/* ---------- device status: every staff device reports what it is doing; the head of the event sees them all on one page ----------
   A device writes when something that matters changes, and at least once a minute so the page can tell it is still there. */
const BEAT_MS=60000;
let BEATKEY='',BEATT=0,STATUS={},BATT=null;
navigator.getBattery?.().then(b=>{BATT=b;['levelchange','chargingchange'].forEach(e=>b.addEventListener(e,()=>beat()))}).catch(()=>{});
const statusBus=(()=>{try{const bc=new BroadcastChannel('ptarena-status');bc.onmessage=e=>{STATUS[e.data.key]=e.data.d;if(S?.ui?.view==='devices')render()};return bc}catch(e){return null}})();
function beatData(){
  const ua=navigator.userAgent,d={role:ROLE,field:LOCK||S.ui.field||'',online:navigator.onLine,dev:/iphone|ipad/i.test(ua)?'iPhone':/android/i.test(ua)?'Android':'คอม',
    bat:BATT?Math.round(BATT.level*100):null,charging:BATT?BATT.charging:null};
  if(ROLE==='timer'){const t=timerOf(LOCK);Object.assign(d,{clock:t.state,cam:CAMID==='phone'?'มือถือ':'เว็บแคม',camOk:!!(VID&&VID.readyState>=2),camReal:CAMREAL||'',camErr:CAMERR||'',
    rec:!!REC,recErr:RECERR||'',upQ:UPQ.length,upFail:UPFAIL.length,upErr:UPERR||'',drive:!!S.drive?.url,sound:audioWhere(),
    set:{gfx:GFX,qual:QUAL,fps:String(FPS),audio:AUDIO?'on':'off',src:CAMID==='phone'?'phone':'webcam',rot:String(ROT),flip:FLIP?'on':'off'}})}
  if(ROLE==='cam')Object.assign(d,{camState:CAMP.state,camReal:CAMP.real||'',net:CAMP.net||'',locked:CAMP.locked,
    set:{shape:CAMP.shape,res:String(CAMP.res),fps:String(CAMP.fps),mode:CAMP.mode,locked:CAMP.locked?'on':'off'}});
  if(ROLE==='judge')Object.assign(d,{team:S.ui.form?.teamId||''});
  return d;
}
// only what matters decides whether to write now; numbers that wobble every second (fps, Mbps) ride along without forcing a write
const beatKey=d=>JSON.stringify([d.field,d.online,d.bat==null?null:Math.round(d.bat/10),d.charging,d.clock,d.cam,d.camOk,d.camErr,d.rec,d.recErr,d.upQ,d.upFail,!!d.upErr,d.drive,d.camState,d.locked,d.team,d.set]);
function beat(force){
  if(!['timer','cam','judge'].includes(ROLE)||needGate()||!READY)return;
  const d=beatData(),k=beatKey(d),now=Date.now();
  if(!force&&k===BEATKEY&&now-BEATT<BEAT_MS)return;
  BEATKEY=k;BEATT=now;
  const key=ROLE+'_'+(d.field||'-')+'_'+String(DEVICE).slice(-4);
  if(CLOUD)window.PT_BACKEND?.beat?.(key,d);else{STATUS[key]={...d,t:Date.now()};statusBus?.postMessage({key,d:STATUS[key]})}
}
setInterval(()=>beat(),5000);
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')beat(true)});
setInterval(()=>{if(S?.ui?.view==='devices'&&!/^(SELECT|INPUT)$/.test(document.activeElement?.tagName||''))render()},5000);

const ROLE_NAME={timer:'จุดจับเวลา',cam:'กล้อง',judge:'กรรมการ'};
function devProblems(d){
  const p=[];
  if(d.online===false)p.push('เน็ตหลุด');
  if(d.bat!=null&&d.bat<20&&!d.charging)p.push('แบตเหลือ '+d.bat+'%');
  if(d.role==='timer'){
    if(!d.camOk)p.push(d.camErr?'เปิดกล้องไม่ได้ ('+d.camErr+')':'กล้องไม่มีภาพ');
    if(d.recErr)p.push('อัดวิดีโอไม่ได้');
    if(d.upFail)p.push('อัปโหลดไม่ได้ '+d.upFail+' คลิป');
    if(d.upQ>=3)p.push('คลิปรออัปโหลด '+d.upQ);
    else if(d.upErr)p.push('อัปโหลดสะดุด กำลังลองใหม่');
  }
  if(d.role==='cam'&&d.camState!=='on')p.push(d.camState==='idle'?'ยังไม่ได้กดส่งภาพ':d.camState==='wait'?'รอจุดจับเวลา':'ภาพหลุด กำลังต่อใหม่');
  return p;
}
/* ---------- control room: the head of the event sees every field and changes their settings from one machine ----------
   Orders go through the database (or between tabs in sample mode). They only touch the picture, sound and clip upload:
   the clock and the scores are never changed from here. A timer laptop in the middle of a run waits until the run is over.
   Each device notes the last order it carried out, so an order runs once, even across a reload, and a failing order
   only fails itself: everything here is fenced off from the rest of the page. */
let CTRL={},SNAPS={},CTRLLOG=[],CTRLSEEN=null,CTRLSOUND=false,CTRLAUTO=false;
const ctrlBus=(()=>{try{const bc=new BroadcastChannel('ptarena-ctrl');bc.onmessage=e=>{const m=e.data;
  if(m.kind==='ctrl'){CTRL=m.d;ctrlApply()}else if(m.kind==='snap'){SNAPS[m.key]=m.d;if(S?.ui?.view==='devices')render()}};return bc}catch(e){return null}})();
function ctrlSend(field,part,patch){
  const cur=CTRL[field]||{},next={...(cur[part]||{}),...patch,n:Date.now()};
  CTRL={...CTRL,[field]:{...cur,[part]:next}};
  if(CLOUD)window.PT_BACKEND?.ctrlSend?.(field,part,next);else ctrlBus?.postMessage({kind:'ctrl',d:CTRL});
}
// how the picture is turned is kept apart from the other settings, so turning it from anywhere never replays older orders
const ctrlSelf=patch=>ctrlSend(LOCK,'turn',patch);
const ctrlCmd=(field,target,op)=>ctrlSend(field,'cmd_'+target,{op,id:Date.now().toString(36)+Math.random().toString(36).slice(2,6)});
const ctrlDone=k=>{try{return JSON.parse(localStorage.getItem('ptarena:ctrldone')||'{}')[k]}catch(e){return null}};
const ctrlMark=(k,v)=>{try{const m=JSON.parse(localStorage.getItem('ptarena:ctrldone')||'{}');m[k]=v;localStorage.setItem('ptarena:ctrldone',JSON.stringify(m))}catch(e){}};
let CTRLBUSY=false;
async function ctrlApply(){
  if(CTRLBUSY||!['timer','cam'].includes(ROLE)||!LOCK||needGate()||!READY)return;CTRLBUSY=true;
  try{
    const c=CTRL[LOCK]||{},mine=c[ROLE];
    const turn=c.turn;
    if(ROLE==='timer'&&turn){
      let turned=false;
      if(turn.rot!=null&&+turn.rot!==ROT){setRot(turn.rot);turned=true}
      if(turn.flip&&(turn.flip==='on')!==FLIP){setFlip(turn.flip==='on');turned=true}
      if(turned){render();beat(true)}
    }
    if(ROLE==='timer'&&mine&&mine.n!==ctrlDone('timer'+LOCK)&&timerOf(LOCK).state!=='run'){
      ctrlMark('timer'+LOCK,mine.n);let reopen=false;
      if(mine.gfx&&GFX_LIST[mine.gfx]&&mine.gfx!==GFX){GFX=mine.gfx;keep('ptarena:gfx',GFX)}
      if(mine.qual&&CAMQ[mine.qual]&&mine.qual!==QUAL){QUAL=mine.qual;keep('ptarena:camq',QUAL);reopen=true}
      if(mine.fps&&FPS_LIST[mine.fps]&&+mine.fps!==FPS){FPS=+mine.fps;keep('ptarena:fps',String(FPS));reopen=true}
      if(mine.audio&&(mine.audio==='on')!==AUDIO){AUDIO=mine.audio==='on';keep('ptarena:audio',AUDIO?'on':'off');if(AUDIO)micOn();else{LAPMIC?.getTracks().forEach(k=>k.stop());LAPMIC=null}}
      if(mine.src==='phone'&&CAMID!=='phone'){CAMID='phone';reopen=true}
      if(mine.src==='webcam'&&CAMID==='phone'){const w=keep('ptarena:cam');CAMID=w&&w!=='phone'?w:'';reopen=true}
      if(reopen)await camOn();else render();
      toast('ห้องควบคุมปรับค่าแล้ว');beat(true);
    }
    if(ROLE==='cam'&&mine&&mine.n!==ctrlDone('cam'+LOCK)){
      ctrlMark('cam'+LOCK,mine.n);let swap=false;
      if(mine.shape&&CAM_SHAPE[mine.shape]&&mine.shape!==CAMP.shape){CAMP.shape=mine.shape;keep('ptarena:camshape',CAMP.shape);swap=true}
      if(mine.res&&CAM_RES[mine.res]&&+mine.res!==CAMP.res){CAMP.res=+mine.res;keep('ptarena:camres',String(CAMP.res));swap=true}
      if(mine.fps&&+mine.fps!==CAMP.fps){CAMP.fps=+mine.fps===60?60:30;swap=true}
      if(mine.mode&&mine.mode!==CAMP.mode){CAMP.mode=mine.mode==='sharp'?'sharp':'smooth';keep('ptarena:cammode',CAMP.mode);swap=true}
      if(swap&&CAMP.stream)await camSwap();
      if(mine.locked&&(mine.locked==='on')!==CAMP.locked&&CAMP.stream){if(mine.locked==='on')await camLock();else await camUnlock()}
      render();toast('ห้องควบคุมปรับค่าแล้ว');beat(true);
    }
    const cmd=c['cmd_'+ROLE];
    if(cmd&&cmd.id!==ctrlDone('cmd'+ROLE+LOCK)){
      ctrlMark('cmd'+ROLE+LOCK,cmd.id);
      // an old order found when the page opens is not carried out (a reload order would otherwise reload forever)
      if(Date.now()-(cmd.n||0)<120000){
        if(cmd.op==='snap')snapSend();
        if(cmd.op==='upnow'&&ROLE==='timer'){UPWAIT=5000;UPERR='';upRun();toast('ห้องควบคุมสั่งอัปโหลดคลิปที่ค้าง')}
        if(cmd.op==='reload'){toast('ห้องควบคุมสั่งรีเฟรช');setTimeout(()=>location.reload(),800)}
      }
    }
  }catch(e){}
  CTRLBUSY=false;
}
setInterval(ctrlApply,5000);
// a small picture of what this device shows now, for the control room
function snapSend(){
  try{
    let src=null,w=384,h=216;
    if(ROLE==='timer'&&CV)src=CV;
    if(ROLE==='cam'){const v=$('#campv');if(v&&v.videoWidth){src=v;h=Math.round(w*v.videoHeight/v.videoWidth)}}
    if(!src)return;
    const c=document.createElement('canvas');c.width=w;c.height=h;c.getContext('2d').drawImage(src,0,0,w,h);
    const img=c.toDataURL('image/jpeg',0.6),key=LOCK+'_'+ROLE;
    if(CLOUD)window.PT_BACKEND?.snapSend?.(key,img);else ctrlBus?.postMessage({kind:'snap',key,d:{img,t:Date.now()}});
  }catch(e){}
}
// problems that appear and clear, kept as a running log, with a sound when a new one appears
function ctrlScan(){
  if(ROLE!=='staff')return;
  try{
    const now=CLOUD?nowS():Date.now(),cur={};
    Object.entries(STATUS).forEach(([k,d])=>{const age=d.t?(now-d.t)/1000:1e9,who=`สนาม ${d.field||'-'} · ${ROLE_NAME[d.role]||d.role}`;
      if(age>1800)return;
      if(age>150)cur[k+'|off']=who+': ออฟไลน์ (ปิดหน้าหรือเน็ตหลุด)';else devProblems(d).forEach(p=>cur[k+'|'+p]=who+': '+p)});
    if(CTRLSEEN){
      const at=new Date().toLocaleTimeString('th-TH',{hour:'2-digit',minute:'2-digit'});let fresh=0;
      Object.keys(cur).forEach(k=>{if(!(k in CTRLSEEN)){CTRLLOG.unshift({at,txt:cur[k],bad:true});fresh++}});
      Object.keys(CTRLSEEN).forEach(k=>{if(!(k in cur))CTRLLOG.unshift({at,txt:CTRLSEEN[k]+' · แก้แล้ว',bad:false})});
      CTRLLOG=CTRLLOG.slice(0,40);
      if(fresh&&CTRLSOUND){noteSoundReady();noteSound(2)}
    }
    CTRLSEEN=cur;
  }catch(e){}
}
setInterval(ctrlScan,5000);
setInterval(()=>{if(CTRLAUTO&&ROLE==='staff')fieldsSorted().forEach(c=>ctrlCmd(c.field,'timer','snap'))},30000);

function vDevices(){
  const now=CLOUD?nowS():Date.now();
  const all=Object.entries(STATUS).map(([k,d])=>({k,...d,age:d.t?Math.max(0,(now-d.t)/1000):1e9}));
  const live=d=>d.age<=150,seen=d=>d.age<=600;
  const ago=a=>a<60?Math.round(a)+' วิ':a<3600?Math.round(a/60)+' นาที':a<86400?Math.round(a/3600)+' ชม.':'นานแล้ว';
  const issues=all.filter(live).flatMap(d=>devProblems(d).map(x=>({f:d.field,txt:`${ROLE_NAME[d.role]||d.role}: ${x}`})));
  const gone=all.filter(d=>d.age>3600);
  // one setting: what the control room asked for, else what the device reports, and whether the device has caught up
  const pick=(f,part,key,opts,label)=>{
    const want=CTRL[f]?.[part]?.[key],dev=all.filter(d=>d.field===f&&d.role===(part==='turn'?'timer':part)&&live(d)).map(d=>d.set?.[key])[0],cur=want??dev??'';
    return`<label class="cc"><span>${label}${want!=null&&dev!=null&&want!==dev?' <em>กำลังเปลี่ยน</em>':''}</span><select data-ctrl="${f}|${part}|${key}"><option value="" ${cur===''?'selected':''}>—</option>${opts.map(([v,t])=>`<option value="${v}" ${String(v)===String(cur)?'selected':''}>${esc(t)}</option>`).join('')}</select></label>`};
  const O={gfx:Object.entries(GFX_LIST).map(([k,v])=>[k,v.split(' · ')[0]]),qual:Object.entries(CAMQ).map(([k,q])=>[k,q.label.split(' · ')[1]||k]),fps:Object.keys(FPS_LIST).map(k=>[k,k+' fps']),
    audio:[['on','เปิด'],['off','ปิด']],src:[['webcam','เว็บแคม'],['phone','มือถือ']],shape:Object.entries(CAM_SHAPE),res:Object.keys(CAM_RES).map(k=>[k,k+'p']),cfps:[['30','30 fps'],['60','60 fps']],mode:[['smooth','ลื่น'],['sharp','คม']],locked:[['on','ล็อก'],['off','ปลด']],rot:[['0','0°'],['90','90° ขวา'],['180','180°'],['270','90° ซ้าย']],flip:[['off','ปกติ'],['on','กลับด้าน']]};
  const timerCtl=f=>[pick(f,'timer','gfx',O.gfx,'กราฟิก'),pick(f,'timer','src',O.src,'กล้อง'),pick(f,'timer','qual',O.qual,'ความชัด'),pick(f,'timer','fps',O.fps,'ความลื่น'),pick(f,'timer','audio',O.audio,'เสียง'),pick(f,'turn','rot',O.rot,'หมุนภาพ'),pick(f,'turn','flip',O.flip,'กลับด้าน')].join('');
  const camCtl=f=>[pick(f,'cam','shape',O.shape,'ทิศภาพ'),pick(f,'cam','res',O.res,'ความชัด'),pick(f,'cam','fps',O.cfps,'fps'),pick(f,'cam','mode',O.mode,'เน้น'),pick(f,'cam','locked',O.locked,'ล็อก')].join('');
  const led=(d,label)=>`<span class="led ${!d?'none':live(d)?(devProblems(d).length?'warn':'ok'):seen(d)?'warn':'off'}" title="${d?(live(d)?'ออนไลน์':'ออฟไลน์ '+ago(d.age)):'ยังไม่เปิด'}">${label}</span>`;
  const tile=c=>{
    const f=c.field,ds=all.filter(d=>d.field===f&&d.age<86400),one=r=>ds.filter(d=>d.role===r).sort((a,b)=>a.age-b.age)[0];
    const tl=one('timer'),cm=one('cam'),jg=one('judge'),t=timerOf(f),tm=t.state!=='idle'&&team(t.team)||queue(c.id)[0];
    const snap=SNAPS[f+'_timer']||SNAPS[f+'_cam'],probs=issues.filter(x=>x.f===f);
    const sc=t.state!=='idle'?liveScore(f):null;
    return`<div class="cr-tile ${probs.length?'bad':''} ${S.ui.crHi===f?'hi':''}" id="crtile-${f}">
      <div class="cr-head"><b class="cr-letter">${f}</b><span class="cr-what">${esc(S.comps[c.comp].tag)}<br>${esc(c.level)}</span><span class="cr-leds">${led(tl,'จับเวลา')}${led(cm,'กล้อง')}${led(jg,'กรรมการ')}</span></div>
      <div class="cr-pic" id="crpic-${f}">${snap?`<img src="${snap.img}" alt="ภาพสนาม ${f}"><span class="cr-age">${ago(Math.max(0,(now-snap.t)/1000))}ที่แล้ว</span>`:'<span class="cr-nopic">ยังไม่มีภาพ</span>'}
        ${tl?.rec?'<span class="cr-rec">● REC</span>':''}</div>
      <div class="cr-live"><div><b>${tm?esc(tm.name):'ไม่มีทีม'}</b><small>${tm?tm.id:''}${t.state==='run'?' · กำลังแข่ง':t.state==='stop'?' · รอส่งคะแนน':' · รอเริ่ม'}</small></div>
        <span class="cr-clock mono" ${t.state!=='idle'?`data-tm="${f}"`:''}>${fmtMs(tElapsed(t))}</span><span class="cr-score mono">${sc??'–'}</span></div>
      ${probs.length?`<div class="devp">${probs.map(p=>`<span>${esc(p.txt)}</span>`).join('')}</div>`:''}
      <div class="cr-info">${tl?`${tl.drive?(tl.upQ?'⤴ ค้าง '+tl.upQ:'⤴ ครบ'):'⤴ ยังไม่ตั้งไดรฟ์'} · 🎙 ${tl.sound&&tl.sound!=='ปิดอยู่'?(/มือถือ/.test(tl.sound)?'มือถือ':'เครื่อง'):'ปิด'}${tl.camReal?' · '+esc(tl.camReal.split(' (')[0].split(' · ')[0]):''}`:'ยังไม่เปิดหน้าจับเวลา'}</div>
      <div class="cr-act">
        <button class="btn sm pri" data-act="ctrlopen" data-f="${f}" title="ตั้งค่าสนามนี้">⚙ ตั้งค่า</button>
        <button class="btn sm" data-act="ctrlcmd" data-f="${f}" data-t="${tl&&live(tl)?'timer':'cam'}" data-op="snap" title="ขอภาพล่าสุด">📷 ภาพ</button>
        <button class="btn sm" data-act="ctrlcmd" data-f="${f}" data-t="timer" data-op="upnow" ${tl?.upQ||tl?.upFail?'':'disabled'} title="อัปโหลดคลิปที่ค้างขึ้นไดรฟ์">⤴ คลิป${tl?.upQ?' '+tl.upQ:''}</button>
        <button class="btn sm" data-act="ctrlcmd" data-f="${f}" data-t="timer" data-op="reload" ${t.state==='run'?'disabled title="กำลังแข่ง รีเฟรชแล้วคลิปจะขาด"':'title="รีเฟรชหน้าจับเวลา"'}>↻ รีเฟรช</button>
      </div></div>`};
  const allPick=(part,key,opts,label)=>`<label class="cc"><span>${label}</span><select data-ctrl="*|${part}|${key}"><option value="">—</option>${opts.map(([v,t])=>`<option value="${v}">${esc(t)}</option>`).join('')}</select></label>`;
  // the settings side panel: one field, or every field at once
  const cf=S.ui.crField,drawer=!cf?'':cf==='*'?`<div class="cr-drawer"><div class="row between"><h3>ตั้งค่าทุกสนาม</h3><button class="btn sm" data-act="ctrlclose">✕ ปิด</button></div>
      <p class="small muted" style="margin:0">ใช้กับทั้ง ${fieldsSorted().length} สนามทันที · สนามที่กำลังแข่งจะเปลี่ยนหลังจบรอบ</p>
      <div class="cr-grp"><b>จุดจับเวลา</b><div class="cr-ctl">${allPick('timer','gfx',O.gfx,'กราฟิก')}${allPick('timer','src',O.src,'กล้อง')}${allPick('timer','qual',O.qual,'ความชัด')}${allPick('timer','fps',O.fps,'ความลื่น')}${allPick('timer','audio',O.audio,'เสียง')}</div></div>
      <div class="cr-grp"><b>กล้อง</b><div class="cr-ctl">${allPick('cam','shape',O.shape,'ทิศภาพ')}${allPick('cam','res',O.res,'ความชัด')}${allPick('cam','fps',O.cfps,'fps')}${allPick('cam','mode',O.mode,'เน้น')}${allPick('cam','locked',O.locked,'ล็อก')}</div></div></div>`
    :(()=>{const c=cls(fieldsSorted().find(x=>x.field===cf)?.id),run=timerOf(cf).state==='run';return`<div class="cr-drawer"><div class="row between"><h3>ตั้งค่า สนาม ${cf}${c?' · '+esc(S.comps[c.comp].tag)+' '+esc(c.level):''}</h3><button class="btn sm" data-act="ctrlclose">✕ ปิด</button></div>
      ${run?'<div class="callout warn small">สนามนี้กำลังแข่ง จุดจับเวลาจะปรับหลังจบรอบ</div>':''}
      <div class="cr-grp"><b>จุดจับเวลา</b><div class="cr-ctl">${timerCtl(cf)}</div>
        <div class="row"><button class="btn sm" data-act="ctrlcmd" data-f="${cf}" data-t="timer" data-op="snap">📷 ภาพจุดจับเวลา</button><button class="btn sm" data-act="ctrlcmd" data-f="${cf}" data-t="timer" data-op="upnow">⤴ อัปโหลดคลิปค้าง</button><button class="btn sm" data-act="ctrlcmd" data-f="${cf}" data-t="timer" data-op="reload" ${run?'disabled':''}>รีเฟรช</button></div></div>
      <div class="cr-grp"><b>กล้อง</b><div class="cr-ctl">${camCtl(cf)}</div>
        <div class="row"><button class="btn sm" data-act="ctrlcmd" data-f="${cf}" data-t="cam" data-op="snap">📷 ภาพกล้อง</button><button class="btn sm" data-act="ctrlcmd" data-f="${cf}" data-t="cam" data-op="reload">รีเฟรช</button></div></div></div>`})();
  return`<div class="cr ${cf?'drawer-open':''}">
    <div class="cr-top">
      <div class="cr-title"><h2>ห้องควบคุม</h2><span class="small muted">ออนไลน์ ${all.filter(live).length} เครื่อง · อัปเดตทุก 5 วิ</span></div>
      <div class="cr-sum ${issues.length?'bad':'ok'}">${issues.length?`⚠ มีปัญหา ${issues.length} จุด`:all.some(live)?'✓ ทุกเครื่องปกติ':'ยังไม่มีเครื่องออนไลน์'}</div>
      <div class="cr-tools"><button class="btn sm pri" data-act="ctrlopen" data-f="*">⚙ ตั้งค่าทุกสนาม</button><button class="btn sm" data-act="ctrlsnapall">ดูภาพทุกสนาม</button>
        <button class="btn sm" data-act="ctrlauto" aria-pressed="${CTRLAUTO}">${CTRLAUTO?'■ หยุดอัปเดตภาพ':'อัปเดตภาพทุก 30 วิ'}</button>
        <button class="btn sm" data-act="ctrlsound" aria-pressed="${CTRLSOUND}">${CTRLSOUND?'🔔 เสียงเตือน':'🔕 เสียงเตือน'}</button>
        ${gone.length?`<button class="btn sm" data-act="devclean">ลบเครื่องที่ออฟไลน์ (${gone.length})</button>`:''}</div>
    </div>
    ${issues.length?`<div class="cr-issues">${issues.map(x=>`<button data-act="crgo" data-f="${x.f}"><b>สนาม ${x.f||'-'}</b> ${esc(x.txt)}</button>`).join('')}</div>`:''}
    <div class="cr-grid">${fieldsSorted().map(tile).join('')}</div>
    <div class="cr-body"><div class="panel cr-log"><h3>เหตุการณ์</h3>${CTRLLOG.length?CTRLLOG.map(l=>`<div class="${l.bad?'bad':'ok'}"><span class="mono">${l.at}</span> ${esc(l.txt)}</div>`).join(''):'<p class="small muted" style="margin:0">ยังไม่มีเหตุการณ์</p>'}</div></div>
    ${drawer}
  </div>`;
}

/* ---------- team phone ---------- */
// the team this phone picked; viewers pick once and the phone remembers
const myTeam=()=>{const q=S.ui.teamQuery.trim().toLowerCase();return q&&S.teams.find(x=>x.id.toLowerCase()===q)||null};
function teamList(){
  const q=(S.ui.teamFind||'').trim().toLowerCase(),hit=t=>!q||(t.id+' '+t.name+' '+t.school).toLowerCase().includes(q);
  return fieldsSorted().map(c=>{const ts=S.teams.filter(t=>t.cls===c.id&&hit(t));
    return ts.length?`<div class="tgrp"><h3>${esc(clsName(c,true))}<span>สนาม ${c.field}</span></h3>${ts.map(t=>`<button class="trow" data-act="teampick" data-v="${t.id}"><span class="tid">${t.id}</span><span class="who"><b>${esc(t.name)}</b><small>${esc(t.school)}</small></span><i aria-hidden="true">›</i></button>`).join('')}</div>`:''}).join('')
    ||`<p class="muted" style="text-align:center;margin:24px 0">ไม่พบทีมนี้<br>ลองพิมพ์ชื่อทีม ชื่อโรงเรียน หรือรหัสทีม</p>`;
}
function vTeam(){
  if(ROLE!=='staff'&&!myTeam())return`<div class="tfinder"><div class="tfhead"><h2>ทีมของคุณคือทีมไหน</h2><input type="text" id="tfind" placeholder="ค้นหาทีม โรงเรียน หรือรหัสทีม" value="${esc(S.ui.teamFind||'')}" autocomplete="off" autocapitalize="none" enterkeyhint="search"></div><div id="tlist">${teamList()}</div></div>`;
  const q=S.ui.teamQuery.trim().toLowerCase();
  const t=q&&S.teams.find(x=>x.id.toLowerCase()===q)||(q&&S.teams.find(x=>(x.id+' '+x.name).toLowerCase().includes(q)));
  let card='';
  if(t){const c=cls(t.cls),qq=queue(c.id),idx=qq.findIndex(x=>x.id===t.id),r=curRound(c.id);
    // where the team stands right now: one line, one big sign
    let tq;
    if(!t.checkin)tq=['warn',icon('alert'),'ยังไม่ได้เช็กอิน','ไปจุดลงทะเบียน พร้อมหุ่นและสมาชิกทีม'];
    else if(!t.inspect)tq=['warn',icon('wait'),'รอตรวจหุ่น','นำหุ่นไปที่จุดตรวจ'];
    else if(t.inspect.result==='fail')tq=['bad',icon('alert'),'ตรวจหุ่นไม่ผ่าน',(t.inspect.note?esc(t.inspect.note)+' · ':'')+'แก้แล้วกลับไปตรวจซ้ำ'];
    else if(idx===0)tq=['now',icon('flag'),'ถึงคิวแล้ว!',`ไปสนาม ${c.field} ทันที · รอบ ${r}`];
    else if(idx>0)tq=['next',`<b class="mono">${idx}</b>`,`อีก ${idx} คิว`,`สนาม ${c.field} · รอบ ${r} · เตรียมหุ่นให้พร้อม`,Math.max(12,100-idx*18)];
    else{const all=Array.from({length:S.rounds},(_,i)=>runOf(t.id,i+1)).every(Boolean);tq=['done',icon('check'),all?'แข่งครบแล้ว':'แข่งรอบนี้แล้ว',all?'รอประกาศผล':'รอเรียกรอบถัดไป']}
    const st=standings(c.id),me=st.find(x=>x.t.id===t.id);
    const steps=[['เช็กอิน',!!t.checkin],['ตรวจหุ่น',t.inspect?.result==='pass'],...Array.from({length:S.rounds},(_,i)=>['รอบ '+(i+1),!!runOf(t.id,i+1)])];
    const top=st.filter(x=>x.rank&&x.rank<=3),lb=me&&!top.includes(me)?[...top,me]:top;
    card=`<div class="panel thero"><div class="th-top"><div class="tav">${t.id}</div><div class="th-who"><h2>${esc(t.name)}</h2><div class="small muted">${esc(t.school)}</div></div>${ROLE==='staff'?'':`<button class="tchg" data-act="teamclear">เปลี่ยนทีม</button>`}</div>
      <span class="tchip">${icon('flag')}${esc(clsName(c))} · สนาม ${c.field}</span>
      <div class="steps">${steps.map(s=>`<div class="${s[1]?'on':''}"><i></i>${s[0]}</div>`).join('')}</div></div>
      <div class="panel tq ${tq[0]}"><div class="tqi" ${tq[4]?`style="--p:${tq[4]}%"`:''}>${tq[1]}</div><div class="tqt"><b>${tq[2]}</b><span>${tq[3]}</span></div></div>
      ${ROLE==='staff'?'':noteOn()?`<div class="panel notep"><div class="row between"><b>${icon('bell')} แจ้งเตือนเปิดอยู่</b><button class="btn sm" data-act="noteoff">ปิด</button></div><div class="small muted">เตือนตอนอีก 1 คิว และตอนถึงคิว · ${esc(noteHint())}</div></div>`:`<button class="btn pri big notebtn" data-act="noteon">${icon('bell')} เตือนเมื่อใกล้ถึงคิว</button>`}
      <div class="rtiles">${Array.from({length:S.rounds},(_,i)=>{const x=runOf(t.id,i+1);return`<div class="rt ${x?'on':''}"><small>รอบ ${i+1}</small><b class="mono">${x?score(x):'–'}</b><small class="mono">${x?fmtMs(x.ms):'ยังไม่แข่ง'}</small>${x&&S.clips?.[x.id]?`<a class="clip" href="${clipLink(S.clips[x.id])}" target="_blank" rel="noopener">${icon('play')} ดูคลิป</a>`:''}</div>`}).join('')}</div>
      <div class="panel tlb"><div class="row between"><h3>${icon('board')} อันดับ${me?.rank?` <span class="muted">· ที่ ${me.rank} จาก ${st.length}</span>`:''}</h3><button class="lnk" data-act="viewboard" data-v="${c.id}">ทั้งหมด ›</button></div>
        ${lb.length?lb.map(x=>`<div class="lbr ${x===me?'me':''}"><i class="rk ${x.rank&&x.rank<=3?'r'+x.rank:''}">${x.rank||'–'}</i><span>${esc(x.t.name)}${x===me?' (เรา)':''}</span><b class="mono">${x.b?x.b.score:'–'}</b></div>`).join(''):'<p class="small muted" style="margin:0">ยังไม่มีคะแนน</p>'}</div>`}
  else if(q)card=`<p class="muted">ไม่พบทีม ลองพิมพ์ Team ID เช่น C004</p>`;
  if(ROLE!=='staff')return`<div class="grid tview">${card}</div>`;
  return`<div class="phone-wrap">
    <div class="phone"><div class="notch"></div>
      <div class="eyebrow">PT Robotics 2026 · ${esc(VENUES.find(v=>v[0]===S.venue)[1])}</div>
      <div class="row"><input type="text" id="tq" placeholder="Team ID เช่น C004" value="${esc(S.ui.teamQuery)}" style="flex:1"><button class="btn pri" data-act="teamgo">ดู</button></div>
      ${card}</div>
    <div class="explain panel">
      <h2>ใช้แทนจอใหญ่ได้</h2>
      <ol>
        <li>ติดป้าย QR ที่จุดลงทะเบียน ข้างสนาม และโซนพักทีม</li>
        <li>ครูหรือนักเรียนสแกน แล้วเลือกทีมจากรายชื่อ ไม่ต้องโหลดแอป ไม่ต้องล็อกอิน</li>
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
  return`<div class="row between" style="margin-bottom:10px"><span class="small muted">เปิดบนจอใหญ่หรือทีวี · สลับรุ่นทุก 8 วิ</span><button class="btn sm" data-act="full">เต็มจอ</button></div>
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
  const links=[['คนดู · ทีมและครู',''],['จอในงาน','#screen'],['พิธีกร','#mc'],['เจ้าหน้าที่','#staff'],['กรรมการ · เลือกสนามเอง','#judge'],...fieldsSorted().map(c=>['กรรมการสนาม '+c.field+' · '+S.comps[c.comp].tag+' '+c.level,'#judge-'+c.field]),...fieldsSorted().map(c=>['จับเวลา สนาม '+c.field,'#timer-'+c.field]),...fieldsSorted().map(c=>['กล้อง สนาม '+c.field,'#cam-'+c.field])];
  const linkRows=links.map(l=>`<div class="qitem"><span style="flex:1;min-width:0">${esc(l[0])}<br><small class="mono muted" style="word-break:break-all">${esc(base+l[1])}</small></span><button class="btn sm" data-act="copylink" data-u="${esc(base+l[1])}">คัดลอก</button></div>`).join('');
  return`<div class="adm">
    <div class="panel"><h2>สนามและรอบ</h2><p class="small muted" style="margin:0">จับคู่รุ่นกับสนาม</p>${fieldRows}
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
    <div class="panel"><h2>ส่งคลิปขึ้น Google Drive</h2><p class="small muted" style="margin:0">คลิปยังเซฟในเครื่องจับเวลาเหมือนเดิม และอัปโหลดสำเนาขึ้นไดรฟ์ให้อัตโนมัติ วิธีตั้งค่าอยู่ใน README หัวข้อ "ส่งคลิปขึ้น Google Drive"</p>
      <label class="tset" style="color:var(--muted)"><span>ลิงก์สคริปต์อัปโหลด (ได้ตอน Deploy)</span><input type="text" inputmode="url" placeholder="https://script.google.com/macros/s/…/exec" value="${esc(S.drive?.url||'')}" data-bind="driveurl" style="width:100%"></label>
      <div class="row"><span class="pill ${S.drive?.key?'ok':'warn'}">${S.drive?.key?'มีกุญแจแล้ว':'ยังไม่มีกุญแจ'}</span><button class="btn sm" data-act="drivekey">${S.drive?.key?'สร้างกุญแจใหม่':'สร้างกุญแจ'}</button>${S.drive?.key?`<button class="btn sm" data-act="drivecopy">คัดลอกกุญแจ</button>`:''}<button class="btn sm" data-act="drivetest" ${S.drive?.url&&S.drive?.key?'':'disabled'}>ทดสอบ</button></div></div>
    <div class="panel"><h2>ไลฟ์ของแต่ละช่อง</h2><p class="small muted" style="margin:0">วางลิงก์ YouTube Live ของช่องนั้น ไลฟ์จะขึ้นในแท็บ "สด" ลิงก์อื่น เช่น Zoom จะขึ้นเป็นปุ่มกดเปิด เว้นว่างได้</p>
      ${channels().map(ch=>`<label class="tset" style="color:var(--muted)"><span>${esc(ch.tag)} · สนาม ${ch.cls.map(c=>c.field).join(' ')}</span><input type="text" inputmode="url" placeholder="https://youtube.com/live/…" value="${esc((S.live||{})[ch.id]||'')}" data-bind="live" data-c="${ch.id}" style="width:100%"></label>`).join('')}</div>
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
    case'tab':{const was=ui.view;ui.view=b.dataset.v;ui.pinFor=null;if((was==='live')!==(ui.view==='live'))window.PT_BACKEND?.role?.();break}
    case'ch':ui.liveCh=b.dataset.v;break;
    case'ctrlcmd':ctrlCmd(b.dataset.f,b.dataset.t,b.dataset.op);toast(b.dataset.op==='reload'?'สั่งรีเฟรชแล้ว':b.dataset.op==='upnow'?'สั่งอัปโหลดแล้ว':'ขอภาพแล้ว รอสักครู่');return;
    case'ctrlopen':ui.crField=b.dataset.f;break;
    case'ctrlclose':ui.crField=null;break;
    case'crgo':{const f=b.dataset.f;ui.crHi=f;render();document.getElementById('crtile-'+f)?.scrollIntoView({block:'center',behavior:'smooth'});setTimeout(()=>{if(ui.crHi===f){ui.crHi=null;render()}},2500);return}
    case'ctrlsnapall':fieldsSorted().forEach(c=>ctrlCmd(c.field,'timer','snap'));toast('ขอภาพทุกสนามแล้ว');return;
    case'ctrlauto':CTRLAUTO=!CTRLAUTO;if(CTRLAUTO)fieldsSorted().forEach(c=>ctrlCmd(c.field,'timer','snap'));break;
    case'ctrlsound':CTRLSOUND=!CTRLSOUND;if(CTRLSOUND){noteSoundReady();noteSound(1)}break;
    case'devclean':{const now=CLOUD?nowS():Date.now(),old=Object.keys(STATUS).filter(k=>!STATUS[k].t||now-STATUS[k].t>3600000);old.forEach(k=>delete STATUS[k]);if(CLOUD)window.PT_BACKEND?.dropStatus?.(old);break}
    case'noteon':noteEnable();return;
    case'noteoff':keep(NOTE_KEY,'off');render();return;
    case'lensreset':if(LENS){Object.keys(LENS.caps).forEach(k=>LENS.val[k]=k==='zoom'?LENS.caps[k].min:k==='focusDistance'?LENS.val[k]:(LENS.caps[k].min+LENS.caps[k].max)/2);LENS.focusAuto=true;lensApply().then(render)}return;
    case'camland':camLand();return;
    case'camfull':camFull(!CAMP.full);return;
    case'camlock':camLock();return;
    case'camgo':if(CAMP.stream)camStop();else{if(CAMP.shape==='land')camLand(true);camStart()}return;
    case'camflip':CAMP.facing=CAMP.facing==='environment'?'user':'environment';CAMP.dev='';if(CAMP.stream)camSwap();else render();return;
    case'drivekey':S.drive={url:S.drive?.url||'',key:[...crypto.getRandomValues(new Uint8Array(16))].map(x=>x.toString(16).padStart(2,'0')).join('')};toast('สร้างกุญแจแล้ว กดคัดลอกไปวางในสคริปต์ แล้ว Deploy ใหม่');break;
    case'drivecopy':navigator.clipboard?.writeText(S.drive.key).then(()=>toast('คัดลอกกุญแจแล้ว')).catch(()=>toast('คัดลอกไม่ได้ในหน้าต่างนี้'));return;
    case'drivetest':b.disabled=true;drivePost({op:'ping'}).then(r=>toast(r.ok?'เชื่อมต่อแล้ว · โฟลเดอร์ '+r.folder:'สคริปต์ตอบว่า: '+r.error)).catch(()=>toast('เชื่อมต่อไม่ได้ · เช็กลิงก์ · เช็กว่า Deploy แบบ Anyone')).then(()=>{b.disabled=false});return;
    case'gojudge':ui.view='judge';ui.field=b.dataset.f;break;
    case'field':ui.field=b.dataset.f;ui.pinFor=null;if(f&&f.editRunId)ui.form=null;rememberField();break;
    case'inc':case'dec':{const t=team(f.teamId),c=compOf(t.cls),m=c.missions.find(x=>x.id===b.dataset.m);if(a==='inc'&&!needsMet(c,f.items,m)){toast('ทำ'+needText(c,m)+'ให้ครบก่อน');return}
      if(a==='inc'&&closedBy(c,f.items,m)){toast(closedBy(c,f.items,m).label+' ต้องเป็นชิ้นสุดท้ายที่เก็บ');return}
      if(navigator.userActivation?.isActive)navigator.vibrate?.(12);const was=f.items[m.id]||0;f.items[m.id]=Math.max(0,Math.min(m.max,was+(a==='inc'?1:-1)));tidy(c,f.items);f.confirm=false;
      if(m.ends&&f.items[m.id]>was&&liveT(f)?.state==='run')tStop(f.field);
      if(f.items[m.id]!==was)liveSync(f,{id:m.id,label:m.label,pts:(f.items[m.id]-was)*m.pts});break}
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
      if(f.ms<=0){toast('ยังไม่มีเวลา · กดเริ่มจับเวลา หรือใส่เวลาเอง');return}
      const t=team(f.teamId);f.ms=Math.min(f.ms,compOf(t.cls).timeLimit*1000);
      let r;
      if(f.editRunId){r=S.runs.find(x=>x.id===f.editRunId);(r.history=r.history||[]).push({items:r.items,pen:r.pen,ms:r.ms,at:nowHM()});Object.assign(r,{items:{...f.items},pen:f.pen,ms:f.ms});r.edits++;toast('บันทึกการแก้แล้ว · '+t.id+' ได้ '+score(r)+' คะแนน')}
      else{r={id:t.id+'_'+f.round,team:t.id,round:f.round,items:{...f.items},pen:f.pen,ms:f.ms,at:nowHM(),ts:Date.now(),edits:0};S.runs.push(r);tReset(f.field);toast('ส่งคะแนนแล้ว · '+t.id+' ได้ '+score(r)+' คะแนน')}
      r.sign=f.nosign?'no':'yes';saveSign(r.id,{pts:f.nosign?'':f.sign,no:!!f.nosign,score:score(r),ms:r.ms,at:nowHM()});
      ui.form=null;break}
    case'signopen':SIG=[];ui.signing=true;break;
    case'signclear':SIG=[];sigAfter();return;
    case'signcancel':ui.signing=false;break;
    case'signok':if(!SIG.length)return;f.sign=SIG.map(s=>s.join(',')).join(';');f.nosign=false;f.confirm=true;ui.signing=false;break;
    case'signno':f.sign='';f.nosign=true;f.confirm=true;ui.signing=false;break;
    case'signview':{const id=b.dataset.id;getSign(id).then(d=>{ui.signView={id,d};render()});return}
    case'signclose':ui.signView=null;break;
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
    case'pcls':ui.fieldCls=b.dataset.v;break;
    case'viewboard':ui.boardCls=b.dataset.v;ui.view='board';break;
    case'copycsv':{const c=cls(ui.boardCls);const lines=['อันดับ,TeamID,ทีม,โรงเรียน,คะแนน,เวลา,Retry'].concat(standings(c.id).map(r=>[r.rank||'',r.t.id,r.t.name,r.t.school,r.b?r.b.score:'',r.b?fmtMs(r.b.run.ms):'',r.b?r.b.run.pen||0:''].join(',')));
      const txt=lines.join('\n');navigator.clipboard?.writeText(txt).then(()=>toast('คัดลอกผลแล้ว วางใน Excel ได้เลย')).catch(()=>toast('คัดลอกไม่ได้ในหน้าต่างนี้'));return}
    case'tpress':b.blur();tPress('คลิก');return;
    case'camon':CAMERR='';camOn();return;
    case'gfx':{if(!GFX_LIST[b.dataset.v])return;GFX=b.dataset.v;keep('ptarena:gfx',GFX);const top=$('#glist')?.scrollTop||0,box=$('.tbox')?.scrollTop||0;render();if($('#glist'))$('#glist').scrollTop=top;if($('.tbox'))$('.tbox').scrollTop=box;return}
    case'tfull':{const cv=stageCanvas();if(cv.requestFullscreen)cv.requestFullscreen().catch(()=>toast('เบราว์เซอร์นี้เปิดเต็มจอไม่ได้'));else toast('เบราว์เซอร์นี้เปิดเต็มจอไม่ได้');return}
    case'cropreset':CROP={z:1,x:.5,y:.5};saveCrop();render();return;
    case'rotl':setRot(ROT-90);ctrlSelf({rot:String(ROT)});beat(true);render();return;
    case'rotr':setRot(ROT+90);ctrlSelf({rot:String(ROT)});beat(true);render();return;
    case'flip':setFlip(!FLIP);ctrlSelf({flip:FLIP?'on':'off'});beat(true);render();return;
    case'camrot':{const cur=+(CTRL[LOCK]?.turn?.rot??CAMP.rotSeen??0);const next=((cur+(b.dataset.d==='l'?-90:90))%360+360)%360;CAMP.rotSeen=next;ctrlSend(LOCK,'turn',{rot:String(next)});toast('หมุนภาพเป็น '+next+'°');render();return}
    case'camflipimg':{const cur=(CTRL[LOCK]?.turn?.flip??CAMP.flipSeen??'off')==='on';CAMP.flipSeen=cur?'off':'on';ctrlSend(LOCK,'turn',{flip:CAMP.flipSeen});toast(cur?'ภาพกลับเป็นปกติ':'กลับด้านภาพแล้ว');render();return}
    case'dirpick':dirPick(false);return;
    case'dirnew':dirPick(true);return;
    case'omove':{const t=team(b.dataset.id),o=S.order[t.cls],n=o.indexOf(t.id),k=n+ +b.dataset.d;if(k<0||k>=o.length)return;[o[n],o[k]]=[o[k],o[n]];break}
    case'teampick':{const t=team(b.dataset.v);if(!t)return;ui.teamQuery=t.id;ui.teamFind='';ui.boardCls=t.cls;rememberTeam(t.id);window.scrollTo(0,0);break}
    case'teamclear':ui.teamQuery='';rememberTeam('');break;
    case'tome':document.querySelector('.bwrap .me')?.scrollIntoView({block:'center',behavior:'smooth'});return;
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
  if(el.id==='venue'){S.venue=el.value;toast('เปลี่ยนเป็น'+VENUES.find(v=>v[0]===el.value)[1]+(CLOUD?'':' (โหมดตัวอย่างใช้ข้อมูลชุดเดียวกัน)'));save();render();return}
  if(el.dataset?.ctrl){const [f,part,key]=el.dataset.ctrl.split('|'),v=el.value;if(!v)return;
    (f==='*'?fieldsSorted().map(c=>c.field):[f]).forEach(x=>ctrlSend(x,part,{[key]:v}));toast(f==='*'?'ใช้กับทุกสนามแล้ว':'ส่งคำสั่งแล้ว');render();return}
  if(el.id==='gsel'){GFX=GFX_LIST[el.value]?el.value:'strip';keep('ptarena:gfx',GFX);return}
  if(el.id==='camsel'){CAMID=el.value;keep('ptarena:cam',CAMID);camOn();return}
  if(el.id==='qsel'){QUAL=el.value;keep('ptarena:camq',QUAL);camOn();return}
  if(el.id==='camshape'){CAMP.shape=CAM_SHAPE[el.value]?el.value:'land';keep('ptarena:camshape',CAMP.shape);CAMWASP=camPortrait();if(CAMP.stream)camSwap();else render();return}
  if(el.id==='cammode'){CAMP.mode=el.value==='sharp'?'sharp':'smooth';keep('ptarena:cammode',CAMP.mode);const snd=CAMP.pc?.getSenders().find(x=>x.track?.kind==='video');if(snd)camBitrate(snd);return}
  if(el.id==='camres'){CAMP.res=CAM_RES[el.value]?+el.value:1080;keep('ptarena:camres',String(CAMP.res));if(CAMP.stream)camSwap();return}
  if(el.id==='camfps'){CAMP.fps=+el.value||30;if(CAMP.stream)camSwap();return}
  if(el.dataset?.lensfocus!==undefined&&LENS){LENS.focusAuto=el.value==='auto';lensApply().then(render);return}
  if(el.id==='camlens'){CAMP.dev=el.value;if(CAMP.stream)camSwap();return}
  if(el.id==='audsel'){AUDIO=el.value!=='off';keep('ptarena:audio',AUDIO?'on':'off');if(AUDIO)micOn();else{LAPMIC?.getTracks().forEach(k=>k.stop());LAPMIC=null;render()}return}
  if(el.id==='fpsel'){FPS=FPS_LIST[el.value]?+el.value:30;keep('ptarena:fps',String(FPS));camOn();return}
  if(el.id==='osel'){S.ui.orderCls=el.value;render();return}
  if(el.id==='bsel'){S.ui.boardCls=el.value;render();return}
  if(el.id==='psel'){S.ui.fieldCls=el.value;render();return}
  if(el.id==='fsel'){S.ui.field=el.value;S.ui.pinFor=null;if(S.ui.form?.editRunId)S.ui.form=null;rememberField();render();return}
  if(el.id==='mt'){const f=S.ui.form;if(liveT(f)?.state==='run')tStop(f.field);f.ms=Math.max(0,Math.round((+el.value||0)*1000));f.manual=true;save();render();return}
  const bd=el.dataset.bind;if(!bd)return;
  if(bd==='field')cls(el.dataset.c).field=el.value;
  if(bd==='rounds')S.rounds=+el.value;
  if(bd==='driveurl')S.drive={key:S.drive?.key||'',url:el.value.trim()};
  if(bd==='live')S.live={...S.live,[el.dataset.c]:el.value.trim()};
  if(bd==='pin')S.pin=el.value.trim()||'1234';
  if(bd==='staff'){S.staffPin=el.value.trim()||'2026';keepStaff()}
  S.ui.form=null;toast('บันทึกการตั้งค่าแล้ว');save();render();
});
document.addEventListener('input',e=>{if(e.target.dataset?.lens&&LENS){LENS.val[e.target.dataset.lens]=+e.target.value;lensApply()}if(e.target.id==='camzoom'&&CAMP.stream){const v=+e.target.value;CAMP.zoom.val=v;const zl=$('#camzv');if(zl)zl.textContent=v.toFixed(1)+'×';CAMP.stream.getVideoTracks()[0].applyConstraints({advanced:[{zoom:v}]}).catch(()=>{})}if(e.target.id==='tfind'){S.ui.teamFind=e.target.value;$('#tlist').innerHTML=teamList()}if(e.target.id==='ckq'){S.ui.ckQuery=e.target.value;renderCkList()}if(e.target.id==='czoom'){CROP.z=+e.target.value;saveCrop()}});
document.addEventListener('keydown',e=>{
  if(ROLE==='timer'&&S.ui.view==='timer'&&READY&&!needGate()&&clsOfField(LOCK)&&CLICKER.includes(e.key)&&!/^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)){e.preventDefault();if(!e.repeat)tPress(e.key===' '?'Space bar':e.key);return}
  if(e.key!=='Enter')return;
  if(e.target.id==='tq'){document.querySelector('[data-act="teamgo"]')?.click()}
  if(e.target.id==='sc'){document.querySelector('[data-act="gate"]')?.click()}
  if(e.target.id==='pin'){document.querySelector('[data-act="pinok"]')?.click()}
});
readHash();
render();
// keeps the page on this device, so it opens again when the hall's internet is down (see sw.js)
if('serviceWorker' in navigator)navigator.serviceWorker.register('sw.js').catch(()=>{});
// a timer laptop picks up clips that had not gone up to Drive when the page was last closed
if(ROLE==='timer')setTimeout(upLoad,3000);
