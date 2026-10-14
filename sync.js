/* Cloud backend: keeps S in step with Firestore. app.js stays the owner of S and of every screen;
   this file only copies changes both ways. Loaded only when firebase-config.js is present. */
import {initializeApp} from 'https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js';
import {initializeFirestore,persistentLocalCache,persistentMultipleTabManager,serverTimestamp,getDocFromServer,doc,onSnapshot,setDoc,updateDoc,getDoc,getDocFromCache,deleteField,FieldPath} from 'https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js';
import {getAuth,onAuthStateChanged,signInAnonymously} from 'https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js';

const app=initializeApp(window.PT_FIREBASE);
// Persistent cache: scores entered with no signal stay on the device and go up when it returns.
const db=initializeFirestore(app,{localCache:persistentLocalCache({tabManager:persistentMultipleTabManager()})});
const auth=getAuth(app);

const J=x=>JSON.stringify(x),clone=x=>JSON.parse(J(x));
const stateRef=doc(db,'app','state'),codesRef=doc(db,'config','private');
const mainRef=v=>doc(db,'venues',v),runsRef=v=>doc(db,'venues',v,'data','runs'),timersRef=v=>doc(db,'venues',v,'data','timers');

let uid=null,venue=null,unsub=[],unsubT=null,lastSent=0,staleComps=false;
const got={state:false,main:false,runs:false,auth:false};
const exists={main:false,runs:false,timers:false},pending={main:false,runs:false,timers:false},last={main:null,runs:null,timers:null};
let synced={main:null,runs:null,timers:{},codes:null};

/* ---------- shapes: S split into the pieces that are written separately ---------- */
const body=o=>{const c=clone(o);delete c.id;return c};
// config/private as this device last read or wrote it; only the fields that differ are written back,
// so a device opened before someone else's change cannot put an old staff code back
const codesFields=()=>({staffCode:S.staffPin,chiefPin:S.pin,driveUrl:S.drive?.url||'',driveKey:S.drive?.key||''});
let codesSeen=null,unsubC=null;
function mainShape(){
  const order={},teams={},clips={};
  Object.keys(S.clips||{}).forEach(k=>clips[k]=J(S.clips[k]));
  S.classes.forEach(c=>order[c.id]=J(S.order[c.id]||[]));
  S.teams.forEach(t=>{if(t.id)teams[t.id]=J(body(t))});
  return{rounds:J(S.rounds),classes:J(S.classes),live:J(S.live||{}),order,teams,clips};
}
function runsShape(){const r={};S.runs.forEach(x=>{if(x.id)r[x.id]=J(body(x))});return r}
function timersShape(){const r={};Object.keys(S.timers||{}).forEach(k=>r[k]=J(S.timers[k]));return r}
const unpack=m=>Object.fromEntries(Object.entries(m).map(([k,v])=>[k,JSON.parse(v)]));

/* ---------- cloud -> S ---------- */
function ready(){
  if(READY||!(got.state&&got.main&&got.runs&&got.auth))return;
  cloudReady();
}
function showNet(){
  const el=document.querySelector('#net');if(!el)return;
  const wait=pending.main||pending.runs||pending.timers;
  el.hidden=!wait;el.textContent=navigator.onLine?'กำลังส่ง…':'เน็ตหลุด · เก็บไว้ในเครื่องแล้ว';
}
function applyMain(snap){
  pending.main=snap.metadata.hasPendingWrites;exists.main=snap.exists();showNet();
  const d=snap.data()||{},j=J(d);
  if(got.main&&j===last.main)return;
  last.main=j;
  S.rounds=d.rounds||2;S.live=d.live||{};S.clips=d.clips||{};
  // Scoring is never read from the database: it is the rule book, and it lives in the code (DEFAULT_COMPS).
  // An earlier version stored a copy here, which went stale and showed old scoring; that copy is removed on the next save.
  S.comps=clone(DEFAULT_COMPS);S.classes=withFields(d.classes);staleComps='comps' in d;
  S.teams=Object.entries(d.teams||{}).map(([id,t])=>({id,...t})).sort((a,b)=>a.id.localeCompare(b.id,undefined,{numeric:true}));
  S.order={};S.classes.forEach(c=>S.order[c.id]=[...((d.order||{})[c.id]||[])]);
  synced.main=mainShape();
  got.main=true;READY?remoteChanged():ready();
}
function applyRuns(snap){
  pending.runs=snap.metadata.hasPendingWrites;exists.runs=snap.exists();showNet();
  const d=snap.data()||{},j=J(d);
  if(got.runs&&j===last.runs)return;
  last.runs=j;
  S.runs=Object.entries(d.runs||{}).map(([id,r])=>({id,...r}));
  synced.runs=runsShape();
  got.runs=true;READY?remoteChanged():ready();
}
function applyTimers(snap){
  pending.timers=snap.metadata.hasPendingWrites;exists.timers=snap.exists();showNet();
  const d=snap.data()||{},j=J(d),first=last.timers===null;
  if(j===last.timers)return;
  last.timers=j;S.timers=d.timers||{};synced.timers=timersShape();
  // a live update from another device tells us how far its clock is from ours (plus the network delay)
  // a device that cannot measure the server clock itself (the big screen is not staff) falls back to a rougher guess:
  // the stamp on a live update, which is late by the network delay
  if(!OFFSET_OK&&!first&&!snap.metadata.fromCache&&!snap.metadata.hasPendingWrites)Object.values(S.timers).forEach(t=>{if(t.sentAt>lastSent&&t.by!==DEVICE){lastSent=t.sentAt;OFFSET=t.sentAt-Date.now()}});
  if(READY)remoteChanged();
}
// only the devices that run or show a match listen to the clocks; a viewer's phone listens only while its live tab is open,
// because every tap a judge makes costs one read for each phone listening
function watchTimers(){
  if(unsubT){unsubT();unsubT=null}
  last.timers=null;exists.timers=false;S.timers={};synced.timers={};
  if(venue&&(['judge','timer','staff','screen'].includes(ROLE)||S.ui.view==='live'))unsubT=onSnapshot(timersRef(venue),{includeMetadataChanges:true},applyTimers,fail);
}
function watchVenue(v){
  unsub.forEach(f=>f());
  venue=v;S.venue=v;got.main=got.runs=false;last.main=last.runs=null;
  const opt={includeMetadataChanges:true};
  unsub=[onSnapshot(mainRef(v),opt,applyMain,fail),onSnapshot(runsRef(v),opt,applyRuns,fail)];
  watchTimers();
}
onSnapshot(stateRef,snap=>{
  const v=(snap.data()||{}).venue||'C';got.state=true;
  if(v!==venue)watchVenue(v);
},fail);
window.addEventListener('online',showNet);window.addEventListener('offline',showNet);

/* ---------- S -> cloud ---------- */
function fail(e){
  console.error(e);
  toast(e.code==='permission-denied'?'เครื่องนี้ไม่มีสิทธิ์บันทึก ใส่รหัสเจ้าหน้าที่ใหม่':'บันทึกไม่สำเร็จ ลองอีกครั้ง');
}
function diff(key,cur,old){
  // one map (teams or runs): changed entries are replaced whole, missing ones removed
  const args=[];
  Object.keys(cur).forEach(k=>{if(cur[k]!==old[k])args.push(new FieldPath(key,k),JSON.parse(cur[k]))});
  Object.keys(old).forEach(k=>{if(!(k in cur))args.push(new FieldPath(key,k),deleteField())});
  return args;
}
function push(){
  if(!CLOUD_STAFF||!READY)return;
  if(S.venue!==venue){setDoc(stateRef,{venue:S.venue}).catch(fail);READY=false;return}
  const m=mainShape(),r=runsShape(),om=synced.main,or=synced.runs;
  if(!exists.main){setDoc(mainRef(venue),{rounds:S.rounds,live:clone(S.live||{}),classes:clone(S.classes),order:unpack(m.order),teams:unpack(m.teams),clips:unpack(m.clips)}).catch(fail);exists.main=true}
  else{
    const a=[];
    ['rounds','classes','live'].forEach(k=>{if(m[k]!==om[k])a.push(new FieldPath(k),JSON.parse(m[k]))});
    if(staleComps){a.push(new FieldPath('comps'),deleteField());staleComps=false}
    a.push(...diff('order',m.order,om.order),...diff('teams',m.teams,om.teams),...diff('clips',m.clips,om.clips||{}));
    if(a.length)updateDoc(mainRef(venue),...a).catch(fail);
  }
  if(!exists.runs){if(Object.keys(r).length){setDoc(runsRef(venue),{runs:unpack(r)}).catch(fail);exists.runs=true}}
  else{const a=diff('runs',r,or);if(a.length)updateDoc(runsRef(venue),...a).catch(fail)}
  if(unsubT){
    const t=timersShape();
    if(!exists.timers){if(Object.keys(t).length){setDoc(timersRef(venue),{timers:unpack(t)}).catch(fail);exists.timers=true}}
    else{const a=diff('timers',t,synced.timers);if(a.length)updateDoc(timersRef(venue),...a).catch(fail)}
    synced.timers=t;
  }
  synced.main=m;synced.runs=r;
  if(codesSeen){
    const now=codesFields(),ch={};Object.keys(now).forEach(k=>{if(now[k]!==codesSeen[k])ch[k]=now[k]});
    if(Object.keys(ch).length){
      codesSeen=now;
      // codes first, then this device's own pass, so the admin is not locked out by the change
      updateDoc(codesRef,ch).then(()=>{if('staffCode' in ch)return setDoc(doc(db,'staff',uid),{code:S.staffPin})}).catch(fail);
    }
  }
}

/* ---------- staff ---------- */
function takeCodes(snap){
  if(!snap.exists())return false;
  const d=snap.data();S.staffPin=d.staffCode;S.pin=d.chiefPin||'1234';S.drive={url:d.driveUrl||'',key:d.driveKey||''};codesSeen=codesFields();
  return true;
}
/* How far this device's clock is from the server's. A write stamped by the server lands somewhere between the moment
   we sent it and the moment it was confirmed; the midpoint is our best guess, and the fastest of a few tries is the best one. */
let clockBusy=false;
async function syncClock(){
  if(clockBusy||!uid||!CLOUD_STAFF||!navigator.onLine)return;clockBusy=true;
  try{
    const ref=doc(db,'staff',uid);let best=null;
    for(let n=0;n<4;n++){
      const t0=Date.now();await timeout(setDoc(ref,{code:S.staffPin,t:serverTimestamp()}),8000);const t1=Date.now();
      const ts=(await timeout(getDocFromServer(ref),8000)).data().t.toMillis();
      if(!best||t1-t0<best.rtt)best={rtt:t1-t0,off:ts-(t0+t1)/2};
    }
    OFFSET=Math.round(best.off);OFFSET_OK=true;
  }catch(e){}
  clockBusy=false;
}
window.addEventListener('online',()=>syncClock());
setInterval(syncClock,10*60*1000);
// staff devices follow config/private live, so a new Drive link or key reaches open timer laptops without a reload
function watchCodes(){
  if(unsubC||!CLOUD_STAFF)return;
  unsubC=onSnapshot(codesRef,s=>{if(!s.metadata.hasPendingWrites&&takeCodes(s)&&READY)render()},()=>{unsubC?.();unsubC=null});
}
async function checkStaff(){
  if(!uid){CLOUD_STAFF=false;return}
  // cached answer first so a tablet with weak signal opens straight away, then confirm with the server
  try{if(takeCodes(await getDocFromCache(codesRef)))CLOUD_STAFF=true}catch(e){}
  const confirm=getDoc(codesRef).then(s=>{CLOUD_STAFF=takeCodes(s)},e=>{if(e.code==='permission-denied')CLOUD_STAFF=false}).then(()=>{syncClock();watchCodes();if(READY)render()});
  if(!CLOUD_STAFF)await timeout(confirm,6000).catch(()=>{});
}
onAuthStateChanged(auth,async u=>{uid=u?u.uid:null;await checkStaff();got.auth=true;READY?render():ready()});

const timeout=(p,ms)=>Promise.race([p,new Promise((_,no)=>setTimeout(()=>no(new Error('timeout')),ms))]);
async function enter(code){
  if(!uid){await timeout(signInAnonymously(auth),15000);uid=auth.currentUser.uid}
  const pass=doc(db,'staff',uid);
  try{await timeout(setDoc(pass,{code}),15000)}
  catch(e){
    if(e.code!=='permission-denied')throw e;
    // either a wrong code, or nobody has set the codes yet: the first device to enter one sets it
    try{await setDoc(codesRef,{staffCode:code,chiefPin:S.pin});await setDoc(pass,{code})}catch(e2){return false}
  }
  await checkStaff();
  return CLOUD_STAFF;
}

// signatures: one staff-only document per run
const signRef=k=>doc(db,'signs',k);
const sign=(k,d)=>setDoc(signRef(k),{...d,t:serverTimestamp()}),getSign=k=>getDoc(signRef(k)).then(s=>s.exists()?s.data():null);
window.PT_BACKEND={push,enter,sign,getSign,role:()=>{if(venue)watchTimers()}};
