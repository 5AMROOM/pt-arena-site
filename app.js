const VENUES=[['C','ภาคกลาง · นนทบุรี','14–15 พ.ย. 2569'],['S','ภาคใต้ · สุราษฎร์ธานี','21–22 พ.ย. 2569'],['E','ภาคตะวันออก · ชลบุรี','28–29 พ.ย. 2569'],['N','ภาคเหนือ · แพร่','19–20 ธ.ค. 2569'],['NE','ภาคตะวันออกเฉียงเหนือ · ร้อยเอ็ด','26–27 ธ.ค. 2569']];
const TABS=[['overview','ภาพรวมสนาม','หัวหน้ากรรมการ'],['checkin','เช็กอิน & ตรวจหุ่น','จุดลงทะเบียน'],['judge','กรรมการให้คะแนน','แท็บเล็ตประจำสนาม'],['board','กระดานผล','ทุกคน'],['team','หน้าทีม','มือถือครู/นักเรียน'],['screen','โหมดจอ','ถ้ามีจอในงาน'],['mc','เรียกคิว','พิธีกร'],['admin','ตั้งค่า','แอดมิน']];
const DEFAULT_COMPS={
  kb:{name:'หยิบและวาง Box',tag:'PT KidsBiT',timeLimit:120,missions:[{id:'box',label:'Box กลับถึงจุดเริ่ม',pts:20,max:5},{id:'stop',label:'หยุดในเขตเริ่มเมื่อจบ',pts:20,max:1}],penalty:{label:'แตะหุ่นระหว่างแข่ง',pts:10}},
  rs:{name:'หุ่นยนต์กู้ภัย',tag:'Rescue Robot',timeLimit:150,missions:[{id:'cube',label:'ลูกบาศก์ลงพื้นที่เป้าหมาย',pts:20,max:4},{id:'cp',label:'ผ่านจุดตรวจบนเส้นทาง',pts:10,max:3}],penalty:{label:'ออกนอกเส้นทาง',pts:5}},
  dl:{name:'ดิลิฟเวอร์ลี่ ขนส่งทรงกระบอก',tag:'Delivery Robot',timeLimit:180,missions:[{id:'match',label:'วางตรงสีจุดส่ง',pts:25,max:4},{id:'wrong',label:'วางในจุดส่งแต่ผิดสี',pts:5,max:4},{id:'end',label:'จบในเขตเริ่ม',pts:15,max:1}],penalty:{label:'วัตถุตกระหว่างขนส่ง',pts:10}}
};
const DEFAULT_CLASSES=[{id:'kb-p',comp:'kb',level:'ประถม',field:'A'},{id:'kb-s',comp:'kb',level:'มัธยม',field:'B'},{id:'rs-p',comp:'rs',level:'ประถม',field:'C'},{id:'rs-s',comp:'rs',level:'มัธยม',field:'D'},{id:'dl-p',comp:'dl',level:'ประถม',field:'E'},{id:'dl-m',comp:'dl',level:'ม.ต้น',field:'F'},{id:'dl-h',comp:'dl',level:'ม.ปลาย',field:'G'}];
const NAMES=['Falcon','Nova','Titan','Spark','Orbit','Pixel','Volt','Comet','Atlas','Echo','Bolt','Zenith','Rocket','Gear','Byte','Quantum','Vector','Nimbus','Turbo','Matrix','Blaze','Photon','Circuit','Kite','Delta','Raptor','Lynx','Helix','Cobalt','Aero','Sonic','Ion','Radar','Prism','Nexus','Flux','Apex','Storm','Jet','Onyx','Polar','Ranger'];
const SCHOOLS=['โรงเรียนอรุณวิทยา','โรงเรียนดาวเหนือพิทยาคม','โรงเรียนศรีนครศึกษา','โรงเรียนบ้านคลองใหม่','โรงเรียนวังทองวิทยา','โรงเรียนสายรุ้งศึกษา','โรงเรียนชัยพฤกษ์วิทยา','โรงเรียนปทุมทองวิทยา','โรงเรียนเกษมพัฒนา','โรงเรียนราชพฤกษ์วิทยา','โรงเรียนน้ำใสพิทยา','โรงเรียนทุ่งทองศึกษา'];
const CHECKS=['ขนาดไม่เกินกำหนด (วางลงกล่องวัดได้)','น้ำหนักไม่เกินกำหนด','ใช้บอร์ดและอุปกรณ์ตามกติกา','ไม่มีขอบคม แบตไม่บวมหรือเสียหาย','มีสวิตช์เปิดปิดที่เข้าถึงง่าย'];

const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function rng(seed){return()=>{seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
const hm=m=>String(Math.floor(m/60)).padStart(2,'0')+':'+String(m%60).padStart(2,'0');
const nowHM=()=>{const d=new Date();return hm(d.getHours()*60+d.getMinutes())};
const fmtMs=ms=>{const s=ms/1000;const m=Math.floor(s/60);return m+':'+(s-m*60).toFixed(1).padStart(4,'0')};

let S;
function seed(){
  const r=rng(2026);
  const comps=JSON.parse(JSON.stringify(DEFAULT_COMPS)),classes=JSON.parse(JSON.stringify(DEFAULT_CLASSES));
  const teams=[],runs=[],order={};let n=0,minute=7*60+40,ts=0;
  const mk=(t,round,comp)=>{const items={};comp.missions.forEach(m=>items[m.id]=Math.min(m.max,Math.floor(r()*(m.max+1.6))));
    return{id:(++ts,t.id+'_'+round),team:t.id,round,items,pen:r()<.3?1:0,ms:Math.round((55+r()*(comp.timeLimit-60))*1000),at:hm(9*60+ts*2),ts,edits:0}};
  classes.forEach((c,ci)=>{order[c.id]=[];
    for(let i=0;i<6;i++){n++;const id='C'+String(n).padStart(3,'0');
      const t={id,name:'ทีม '+NAMES[n-1],school:SCHOOLS[(n*5)%SCHOOLS.length],cls:c.id,checkin:null,inspect:null};
      if(i<5){t.checkin=hm(minute+=1);t.inspect={result:'pass',at:hm(minute+4),by:'จุดตรวจ 1',weight:(0.8+r()*1.1).toFixed(2)}}
      if(c.id==='rs-s'&&i===4)t.inspect={result:'fail',at:hm(minute+4),by:'จุดตรวจ 2',note:'ความสูงเกินกำหนด 2 ซม.'};
      if(c.id==='dl-h'&&i===3)t.inspect=null;
      teams.push(t);order[c.id].push(id);
      const done=c.id==='dl-p'?5:(ci%2?3:2);
      if(t.inspect?.result==='pass'&&i<done)runs.push(mk(t,1,comps[c.comp]));
    }});
  teams.filter(t=>t.cls==='dl-p').slice(0,2).forEach(t=>runs.push(mk(t,2,comps.dl)));
  return{venue:'C',rounds:2,pin:'1234',staffPin:'2026',comps,classes,teams,runs,order,ts,
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
const DATA_KEYS=['venue','rounds','pin','staffPin','comps','classes','teams','runs','order','ts'];
let lastSaved='';
function save(){if(CLOUD){window.PT_BACKEND?.push();return}const d={};DATA_KEYS.forEach(k=>d[k]=S[k]);const j=JSON.stringify(d);if(j===lastSaved)return;lastSaved=j;try{localStorage.setItem(KEY,j)}catch(e){}}
function load(j){try{const d=JSON.parse(j);if(!d||!Array.isArray(d.teams)||!Array.isArray(d.runs))return false;DATA_KEYS.forEach(k=>{if(k in d)S[k]=d[k]});lastSaved=j;return true}catch(e){return false}}
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
function score(run){const t=team(run.team);if(!t)return 0;const c=compOf(t.cls);let s=0;c.missions.forEach(m=>s+=Math.min(run.items[m.id]||0,m.max)*m.pts);s-=(run.pen||0)*c.penalty.pts;return Math.max(0,s)}
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

/* ---------- roles: the link decides what a device sees (#staff, #judge-A, #screen, #mc, none = viewers) ---------- */
const ROLE_TABS={view:['team','board'],judge:['judge','board'],screen:['screen'],mc:['mc','board'],staff:TABS.map(t=>t[0])};
const STAFF_KEY='ptarena:staffcode',MYTEAM_KEY='ptarena:myteam';
let ROLE='view',LOCK=null;
function readHash(){
  const h=decodeURIComponent(location.hash.slice(1)).trim(),m=/^judge-(.+)$/i.exec(h);
  if(m){ROLE='judge';LOCK=m[1].toUpperCase()}else{LOCK=null;ROLE=h==='staff'||h==='screen'||h==='mc'?h:'view'}
  if(ROLE!=='staff'){let q='';try{q=localStorage.getItem(MYTEAM_KEY)||''}catch(e){}S.ui.teamQuery=q}
}
const staffOk=()=>{if(CLOUD)return CLOUD_STAFF;try{return localStorage.getItem(STAFF_KEY)===S.staffPin}catch(e){return false}};
const keepStaff=()=>{if(CLOUD)return;try{localStorage.setItem(STAFF_KEY,S.staffPin)}catch(e){}};
const needGate=()=>(ROLE==='judge'||ROLE==='staff')&&!staffOk();
const rememberTeam=q=>{if(ROLE!=='staff')try{localStorage.setItem(MYTEAM_KEY,q)}catch(e){}};
function vGate(){return`<div class="panel" style="max-width:420px;margin:0 auto;width:100%"><h2>สำหรับเจ้าหน้าที่</h2>
  <div class="row"><input type="password" id="sc" inputmode="numeric" placeholder="รหัสเจ้าหน้าที่" style="flex:1"><button class="btn pri" data-act="gate">เข้า</button></div></div>`}
window.addEventListener('hashchange',()=>{readHash();render()});

/* ---------- shell ---------- */
function renderShell(){
  const tabs=needGate()?[]:TABS.filter(t=>ROLE_TABS[ROLE].includes(t[0]));
  $('#venue').innerHTML=VENUES.map(v=>`<option value="${v[0]}" ${v[0]===S.venue?'selected':''}>${v[1]} · ${v[2]}</option>`).join('');
  $('#venue').disabled=ROLE!=='staff'||needGate();
  $('#demo').hidden=ROLE!=='staff'||needGate();
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
  const map={overview:vOverview,checkin:vCheckin,judge:vJudge,board:vBoard,team:vTeam,screen:vScreen,mc:vMc,admin:vAdmin};
  $('#view').innerHTML=map[v]();if(v==='checkin')renderCkList();if(v==='judge')tickSW();}

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
      ${CHECKS.map((k,i)=>`<label><input type="checkbox" id="ck-${t.id}-${i}" data-chk> ${k}</label>`).join('')}
      <div class="row"><label for="w-${t.id}" class="small">น้ำหนักที่ชั่งได้ (กก.)</label><input type="number" id="w-${t.id}" step="0.01" style="width:110px"></div>
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
const elapsed=f=>f.ms+(f.startAt?Date.now()-f.startAt:0);
function formTotal(f){const t=team(f.teamId);const c=compOf(t.cls);let s=0;c.missions.forEach(m=>s+=f.items[m.id]*m.pts);return Math.max(0,s-f.pen*c.penalty.pts)}
function vJudge(){
  const c=clsOfField(S.ui.field),f=ensureForm(),cp=S.comps[c.comp],q=queue(c.id);
  const fieldChips=fieldsSorted().map(x=>`<button class="chip" data-act="field" data-f="${x.field}" aria-pressed="${x.field===S.ui.field}"><b>${x.field}</b> ${esc(S.comps[x.comp].tag)} ${esc(x.level)}</button>`).join('');
  let form;
  if(!f){form=`<div class="panel"><h2>${eligible(c.id).length?'สนามนี้แข่งครบทุกรอบแล้ว':'ยังไม่มีทีมที่ผ่านการตรวจหุ่น'}</h2><p class="muted">${eligible(c.id).length?'ไปดูอันดับได้ที่แท็บกระดานผล':'ทีมต้องเช็กอินและผ่านการตรวจหุ่นก่อน จึงจะขึ้นคิวในสนามนี้'}</p></div>`}
  else{const t=team(f.teamId),el=elapsed(f);
    form=`<div class="panel">
      ${f.editRunId?`<div class="editbar"><span>กำลังแก้คะแนนที่ส่งแล้ว (สิทธิ์หัวหน้ากรรมการ) · ระบบเก็บประวัติการแก้ไว้</span><button class="btn sm" data-act="canceledit">ยกเลิกการแก้</button></div>`:''}
      <div class="jhead"><div><div class="small muted">สนาม ${c.field} · ${esc(clsName(c))} · รอบ ${f.round}/${S.rounds}</div><div class="jteam"><span class="tid" style="font-size:18px">${t.id}</span> ${esc(t.name)}</div><div class="small muted">${esc(t.school)}</div></div>
      ${f.editRunId?'':`<button class="btn sm" data-act="skip">ทีมไม่มา · ข้ามคิว</button>`}</div>
      <div class="sw"><span class="t mono ${f.startAt?'run':''} ${el>cp.timeLimit*1000?'over':''}" id="sw">${fmtMs(el)}</span>
        ${f.startAt?`<button class="btn big" data-act="swstop">หยุดเวลา</button>`:`<button class="btn pri big" data-act="swstart">${el?'จับเวลาต่อ':'เริ่มจับเวลา'}</button>`}
        <button class="btn" data-act="swreset">รีเซ็ต</button>
        <span class="row small muted"><label for="mt">แก้เวลา (วินาที)</label><input type="number" id="mt" step="0.1" min="0" style="width:90px" value="${(f.ms/1000).toFixed(1)}"></span>
        <span class="small muted" style="width:100%">เวลาแข่ง ${cp.timeLimit} วินาที · เลขเปลี่ยนเป็นสีแดงเมื่อเกินเวลา</span></div>
      <div>${cp.missions.map(m=>`<div class="mrow"><div class="lbl"><b>${esc(m.label)}</b><small>ชิ้นละ ${m.pts} คะแนน · สูงสุด ${m.max}</small></div>
        <div class="step"><button data-act="dec" data-m="${m.id}" aria-label="ลด">−</button><span>${f.items[m.id]}</span><button data-act="inc" data-m="${m.id}" aria-label="เพิ่ม">+</button></div><div class="sub">${f.items[m.id]*m.pts}</div></div>`).join('')}
        <div class="mrow"><div class="lbl"><b>บทลงโทษ: ${esc(cp.penalty.label)}</b><small>ครั้งละ −${cp.penalty.pts} คะแนน</small></div>
        <div class="step"><button data-act="pdec" aria-label="ลด">−</button><span>${f.pen}</span><button data-act="pinc" aria-label="เพิ่ม">+</button></div><div class="sub neg">${f.pen?'−'+f.pen*cp.penalty.pts:'0'}</div></div></div>
      <div class="total"><span class="small muted">คะแนนรวม (คำนวณอัตโนมัติ)</span><span class="n">${formTotal(f)}</span></div>
      <label class="confirm"><input type="checkbox" id="cf" ${f.confirm?'checked':''}> ตัวแทนทีมดูคะแนนบนจอนี้แล้ว และยืนยันว่าถูกต้อง</label>
      <button class="btn pri big" data-act="submit" ${f.confirm?'':'disabled'}>${f.editRunId?'บันทึกคะแนนที่แก้':'ส่งคะแนน · เรียกทีมถัดไป'}</button>
    </div>`}
  const qhtml=q.map((t,i)=>`<div class="qitem ${i===0?'now':''}"><span class="qn">${i+1}</span><span class="tid">${t.id}</span><span style="flex:1;min-width:0">${esc(t.name)}</span>${i===0?'<span class="pill ac">ในสนาม</span>':''}</div>`).join('');
  const done=S.runs.filter(x=>team(x.team)?.cls===c.id).sort((a,b)=>b.ts-a.ts);
  const dhtml=done.map(x=>{const t=team(x.team);return`<div class="qitem" style="flex-wrap:wrap"><span class="tid">${t.id}</span><span style="flex:1;min-width:0">รอบ ${x.round} · <b class="mono">${score(x)}</b> · <span class="mono muted">${fmtMs(x.ms)}</span>${x.edits?` <span class="pill warn">แก้ ${x.edits} ครั้ง</span>`:''}</span>
    ${S.ui.pinFor===x.id?`<span class="row" style="width:100%"><input type="password" id="pin" inputmode="numeric" placeholder="PIN หัวหน้ากรรมการ" style="width:150px"><button class="btn sm pri" data-act="pinok" data-id="${x.id}">แก้คะแนน</button><button class="btn sm" data-act="pincancel">ยกเลิก</button></span>`:`<button class="btn sm" data-act="editask" data-id="${x.id}">แก้</button>`}</div>`}).join('');
  return`<div class="grid">
    ${LOCK?'':`<div class="chips">${fieldChips}</div>`}
    <div class="grid g-side">${form}
      <div class="grid" style="align-content:start">
        <div class="panel"><h3>คิวสนาม ${c.field}${curRound(c.id)?' · รอบ '+curRound(c.id):''}</h3><div>${qhtml||'<span class="muted small">ไม่มีทีมรอคิว</span>'}</div></div>
        <div class="panel"><h3>ส่งคะแนนแล้ว</h3><p class="small muted" style="margin:0">ส่งแล้วคะแนนจะล็อก แก้ได้เฉพาะหัวหน้ากรรมการ${ROLE==='staff'?` (PIN ตัวอย่าง: ${S.pin})`:''}</p><div>${dhtml||'<span class="muted small">ยังไม่มี</span>'}</div></div>
      </div></div></div>`;
}
function tickSW(){const f=S.ui.form,el=$('#sw');if(!f||!el)return;const ms=elapsed(f);el.textContent=fmtMs(ms);const lim=compOf(team(f.teamId).cls).timeLimit*1000;el.classList.toggle('over',ms>lim)}
setInterval(()=>{if(S.ui.view==='judge'&&S.ui.form?.startAt)tickSW()},100);

/* ---------- board ---------- */
function vBoard(){
  const c=cls(S.ui.boardCls),rows=standings(c.id),cp=S.comps[c.comp];
  const chips=fieldsSorted().map(x=>`<button class="chip" data-act="bcls" data-v="${x.id}" aria-pressed="${x.id===c.id}">${esc(S.comps[x.comp].tag)} <b>${esc(x.level)}</b></button>`).join('');
  const head=Array.from({length:S.rounds},(_,i)=>`<th class="num">รอบ ${i+1}</th>`).join('');
  const body=rows.map(r=>{const rd=Array.from({length:S.rounds},(_,i)=>{const x=runOf(r.t.id,i+1);return`<td class="num">${x?score(x):'<span class="muted">–</span>'}</td>`}).join('');
    return`<tr><td>${r.rank?`<span class="rk ${r.rank<=3?'r'+r.rank:''}">${r.rank}</span>`:'<span class="muted small">รอแข่ง</span>'}</td>
      <td><span class="tid">${r.t.id}</span> <b>${esc(r.t.name)}</b><div class="small muted">${esc(r.t.school)}</div></td>${rd}
      <td class="num best">${r.b?r.b.score:'–'}</td><td class="num">${r.b?fmtMs(r.b.run.ms):'–'}</td></tr>`}).join('');
  return`<div class="panel">
    <div class="row between"><div><h2>${esc(cp.name)} · ${esc(c.level)}</h2><div class="small muted">สนาม ${c.field} · อัปเดตทันทีที่กรรมการส่งคะแนน</div></div>${ROLE==='staff'?'<button class="btn sm" data-act="copycsv">คัดลอกผลเป็น CSV</button>':''}</div>
    <div class="chips">${chips}</div>
    <div class="tbl-wrap"><table><thead><tr><th>อันดับ</th><th>ทีม</th>${head}<th class="num">คะแนนดีสุด</th><th class="num">เวลา</th></tr></thead><tbody>${body}</tbody></table></div>
    <p class="small muted" style="margin:0">นับรอบที่ได้คะแนนสูงสุด · คะแนนเท่ากันดูเวลาน้อยกว่า แล้วดูบทลงโทษน้อยกว่า (ตัวอย่างเกณฑ์ ตั้งค่าตามกติกาจริงได้)</p></div>`;
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
        ${list.map(x=>{const q=queue(x.id);return`<div class="ql"><span class="L">${x.field}</span><div style="min-width:0">${q[0]?`<b>${q[0].id}</b> ${esc(q[0].name)}`:'<span>ไม่มีทีมในสนาม</span>'}<br><small>${esc(S.comps[x.comp].tag)} ${esc(x.level)}${q[1]?' · ถัดไป '+q[1].id:''}</small></div></div>`}).join('')}</div>
    </div>
    <div class="dots">${list.map((x,i)=>`<i class="${i===S.ui.screenIdx%list.length?'on':''}"></i>`).join('')}</div>
  </div>`;
}
setInterval(()=>{if(S.ui.view==='screen'){S.ui.screenIdx++;const st=$('#stage'),fs=document.fullscreenElement===st;if(fs){const tmp=document.createElement('div');tmp.innerHTML=vScreen();st.innerHTML=tmp.querySelector('#stage').innerHTML}else render();clock()}},8000);
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
  const comps=Object.entries(S.comps).map(([k,cp])=>`<div class="ccard"><h3>${esc(cp.name)} <span class="muted small">${esc(cp.tag)}</span></h3>
    <div class="mtab"><span class="h">ภารกิจ</span><span class="h">คะแนน/ชิ้น</span><span class="h">สูงสุด</span>
    ${cp.missions.map(m=>`<span>${esc(m.label)}</span><input type="number" min="0" value="${m.pts}" data-bind="pts" data-k="${k}" data-m="${m.id}" aria-label="คะแนน ${esc(m.label)}"><input type="number" min="1" value="${m.max}" data-bind="max" data-k="${k}" data-m="${m.id}" aria-label="สูงสุด ${esc(m.label)}">`).join('')}
    <span>บทลงโทษ: ${esc(cp.penalty.label)}</span><input type="number" min="0" value="${cp.penalty.pts}" data-bind="pen" data-k="${k}" aria-label="หักคะแนน"><span class="small muted">ต่อครั้ง</span>
    <span>เวลาแข่ง (วินาที)</span><input type="number" min="10" value="${cp.timeLimit}" data-bind="time" data-k="${k}" aria-label="เวลาแข่ง"><span></span></div></div>`).join('');
  const base=location.href.split('#')[0];
  const links=[['คนดู · ทีมและครู',''],['จอในงาน','#screen'],['พิธีกร','#mc'],['เจ้าหน้าที่','#staff'],...fieldsSorted().map(c=>['กรรมการสนาม '+c.field+' · '+S.comps[c.comp].tag+' '+c.level,'#judge-'+c.field])];
  const linkRows=links.map(l=>`<div class="qitem"><span style="flex:1;min-width:0">${esc(l[0])}<br><small class="mono muted" style="word-break:break-all">${esc(base+l[1])}</small></span><button class="btn sm" data-act="copylink" data-u="${esc(base+l[1])}">คัดลอก</button></div>`).join('');
  return`<div class="adm">
    <div class="panel"><h2>สนามและรอบ</h2><p class="small muted" style="margin:0">จับคู่รุ่นกับสนาม แต่ละสนามใช้แท็บเล็ต 1 เครื่อง</p>${fieldRows}
      <div class="row between" style="border-top:1px solid var(--line);padding-top:10px"><span>จำนวนรอบต่อทีม (นับรอบที่ดีที่สุด)</span><select data-bind="rounds" aria-label="จำนวนรอบ">${[1,2,3].map(n=>`<option ${n===S.rounds?'selected':''}>${n}</option>`).join('')}</select></div>
      <div class="row between"><span>PIN หัวหน้ากรรมการ</span><input type="text" value="${esc(S.pin)}" data-bind="pin" style="width:100px" aria-label="PIN"></div>
      <div class="row between"><span>รหัสเจ้าหน้าที่ (เข้าหน้ากรรมการ)</span><input type="text" value="${esc(S.staffPin)}" data-bind="staff" style="width:100px" aria-label="รหัสเจ้าหน้าที่"></div></div>
    <div class="panel"><h2>ลิงก์ของแต่ละคน</h2><p class="small muted" style="margin:0">แต่ละลิงก์เห็นเฉพาะหน้าของตัวเอง</p><div>${linkRows}</div></div>
    <div class="panel"><div class="row between"><h2>เกณฑ์คะแนน</h2><span class="pill warn">ค่าสมมติ</span></div><p class="small muted" style="margin:0">แก้แล้วคะแนนทุกทีมคำนวณใหม่ทันที เปลี่ยนเป็นค่าจากกติกาจริงได้ภายหลัง</p>${comps}</div>
    <div class="panel"><h2>นำเข้ารายชื่อทีม</h2><p class="small muted" style="margin:0">วางจาก Excel หรือ CSV ที่ได้จากผู้ดูแลเว็บสมัคร ใช้ 4 คอลัมน์: Team ID, ชื่อทีม, โรงเรียน, รหัสรุ่น</p>
      <p class="small muted" style="margin:0">รหัสรุ่น: ${S.classes.map(c=>`<span class="mono">${c.id}</span> ${esc(S.comps[c.comp].tag)} ${esc(c.level)}`).join(' · ')}</p>
      <textarea id="imp" rows="6">TeamID,ชื่อทีม,โรงเรียน,รุ่น
C101,ทีม Mango,โรงเรียนตัวอย่างวิทยา,kb-p
C102,ทีม Lotus,โรงเรียนตัวอย่างวิทยา,dl-h</textarea>
      <div class="row"><button class="btn pri" data-act="imp" data-mode="add">เพิ่มเข้ารายชื่อเดิม</button><button class="btn" data-act="imp" data-mode="replace">แทนที่ทั้งหมด</button></div>
      ${S.ui.adminMsg?`<div class="note">${S.ui.adminMsg}</div>`:''}</div>
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
    case'inc':case'dec':{const t=team(f.teamId),m=compOf(t.cls).missions.find(x=>x.id===b.dataset.m);f.items[m.id]=Math.max(0,Math.min(m.max,f.items[m.id]+(a==='inc'?1:-1)));f.confirm=false;break}
    case'pinc':f.pen++;f.confirm=false;break;
    case'pdec':f.pen=Math.max(0,f.pen-1);f.confirm=false;break;
    case'swstart':f.startAt=Date.now();break;
    case'swstop':f.ms=elapsed(f);f.startAt=null;break;
    case'swreset':f.ms=0;f.startAt=null;break;
    case'submit':{if(!f.confirm)return;if(f.startAt){f.ms=elapsed(f);f.startAt=null}
      if(f.ms<=0){toast('ยังไม่มีเวลาที่จับได้ กดเริ่มจับเวลา หรือใส่เวลาเอง');return}
      const t=team(f.teamId);
      if(f.editRunId){const r=S.runs.find(x=>x.id===f.editRunId);(r.history=r.history||[]).push({items:r.items,pen:r.pen,ms:r.ms,at:nowHM()});Object.assign(r,{items:{...f.items},pen:f.pen,ms:f.ms});r.edits++;toast('บันทึกคะแนนที่แก้แล้ว · '+t.id+' ได้ '+score(r)+' คะแนน')}
      else{const r={id:t.id+'_'+f.round,team:t.id,round:f.round,items:{...f.items},pen:f.pen,ms:f.ms,at:nowHM(),ts:Date.now(),edits:0};S.runs.push(r);toast('ส่งคะแนนแล้ว · '+t.id+' ได้ '+score(r)+' คะแนน')}
      ui.form=null;break}
    case'skip':{const t=team(f.teamId),o=S.order[t.cls];o.splice(o.indexOf(t.id),1);o.push(t.id);ui.form=null;toast(t.id+' ไปต่อท้ายคิว');break}
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
      const all=[...box.querySelectorAll('[data-chk]')].every(x=>x.checked),note=$('#n-'+id).value.trim(),w=$('#w-'+id).value;
      if(a==='ipass'&&!all){toast('ติ๊กให้ครบทุกข้อก่อนกดผ่าน');return}
      if(a==='ifail'&&!note){toast('ระบุเหตุผลที่ไม่ผ่านในช่องหมายเหตุ');return}
      t.inspect={result:a==='ipass'?'pass':'fail',at:nowHM(),by:'จุดตรวจ 1',weight:w,note};ui.openInspect=null;
      toast(a==='ipass'?id+' ผ่านการตรวจ · ขึ้นคิวสนาม '+cls(t.cls).field+' แล้ว':id+' ไม่ผ่าน · แจ้งทีมให้แก้แล้วกลับมาตรวจซ้ำ');break}
    case'bcls':ui.boardCls=b.dataset.v;break;
    case'viewboard':ui.boardCls=b.dataset.v;ui.view='board';break;
    case'copycsv':{const c=cls(ui.boardCls);const lines=['อันดับ,TeamID,ทีม,โรงเรียน,คะแนน,เวลา'].concat(standings(c.id).map(r=>[r.rank||'',r.t.id,r.t.name,r.t.school,r.b?r.b.score:'',r.b?fmtMs(r.b.run.ms):''].join(',')));
      const txt=lines.join('\n');navigator.clipboard?.writeText(txt).then(()=>toast('คัดลอกผลแล้ว วางใน Excel ได้เลย')).catch(()=>toast('คัดลอกไม่ได้ในหน้าต่างนี้'));return}
    case'teamgo':ui.teamQuery=$('#tq').value;rememberTeam(ui.teamQuery.trim());break;
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
  if(el.id==='cf'){S.ui.form.confirm=el.checked;render();return}
  if(el.id==='mt'){const f=S.ui.form;f.ms=Math.max(0,Math.round((+el.value||0)*1000));f.startAt=null;render();return}
  const bd=el.dataset.bind;if(!bd)return;
  const k=el.dataset.k,cp=k&&S.comps[k];
  if(bd==='field')cls(el.dataset.c).field=el.value;
  if(bd==='rounds')S.rounds=+el.value;
  if(bd==='pin')S.pin=el.value.trim()||'1234';
  if(bd==='staff'){S.staffPin=el.value.trim()||'2026';keepStaff()}
  if(bd==='pts')cp.missions.find(m=>m.id===el.dataset.m).pts=Math.max(0,+el.value||0);
  if(bd==='max')cp.missions.find(m=>m.id===el.dataset.m).max=Math.max(1,+el.value||1);
  if(bd==='pen')cp.penalty.pts=Math.max(0,+el.value||0);
  if(bd==='time')cp.timeLimit=Math.max(10,+el.value||10);
  S.ui.form=null;toast('บันทึกการตั้งค่าแล้ว');save();render();
});
document.addEventListener('input',e=>{if(e.target.id==='ckq'){S.ui.ckQuery=e.target.value;renderCkList()}});
document.addEventListener('keydown',e=>{
  if(e.key!=='Enter')return;
  if(e.target.id==='tq'){document.querySelector('[data-act="teamgo"]')?.click()}
  if(e.target.id==='sc'){document.querySelector('[data-act="gate"]')?.click()}
  if(e.target.id==='pin'){document.querySelector('[data-act="pinok"]')?.click()}
});
readHash();
render();
