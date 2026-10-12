/* Cloud backend: keeps S in step with Firestore. app.js stays the owner of S and of every screen;
   this file only copies changes both ways. Loaded only when firebase-config.js is present. */
import {initializeApp} from 'https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js';
import {initializeFirestore,persistentLocalCache,persistentMultipleTabManager,doc,onSnapshot,setDoc,updateDoc,getDoc,getDocFromCache,deleteField,FieldPath} from 'https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js';
import {getAuth,onAuthStateChanged,signInAnonymously} from 'https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js';

const app=initializeApp(window.PT_FIREBASE);
// Persistent cache: scores entered with no signal stay on the device and go up when it returns.
const db=initializeFirestore(app,{localCache:persistentLocalCache({tabManager:persistentMultipleTabManager()})});
const auth=getAuth(app);

const J=x=>JSON.stringify(x),clone=x=>JSON.parse(J(x));
const stateRef=doc(db,'app','state'),codesRef=doc(db,'config','private');
const mainRef=v=>doc(db,'venues',v),runsRef=v=>doc(db,'venues',v,'data','runs');

let uid=null,venue=null,unsub=[];
const got={state:false,main:false,runs:false,auth:false};
const exists={main:false,runs:false},pending={main:false,runs:false},last={main:null,runs:null};
let synced={main:null,runs:null,codes:null};

/* ---------- shapes: S split into the pieces that are written separately ---------- */
const body=o=>{const c=clone(o);delete c.id;return c};
function mainShape(){
  const order={},teams={};
  S.classes.forEach(c=>order[c.id]=J(S.order[c.id]||[]));
  S.teams.forEach(t=>{if(t.id)teams[t.id]=J(body(t))});
  return{rounds:J(S.rounds),comps:J(S.comps),classes:J(S.classes),order,teams};
}
function runsShape(){const r={};S.runs.forEach(x=>{if(x.id)r[x.id]=J(body(x))});return r}
const unpack=m=>Object.fromEntries(Object.entries(m).map(([k,v])=>[k,JSON.parse(v)]));

/* ---------- cloud -> S ---------- */
function ready(){
  if(READY||!(got.state&&got.main&&got.runs&&got.auth))return;
  cloudReady();
}
function showNet(){
  const el=document.querySelector('#net');if(!el)return;
  const wait=pending.main||pending.runs;
  el.hidden=!wait;el.textContent=navigator.onLine?'กำลังส่ง…':'เน็ตหลุด · เก็บไว้ในเครื่องแล้ว';
}
function applyMain(snap){
  pending.main=snap.metadata.hasPendingWrites;exists.main=snap.exists();showNet();
  const d=snap.data()||{},j=J(d);
  if(got.main&&j===last.main)return;
  last.main=j;
  S.rounds=d.rounds||2;
  S.comps=clone(d.comps||DEFAULT_COMPS);
  S.classes=clone(d.classes||DEFAULT_CLASSES);
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
function watchVenue(v){
  unsub.forEach(f=>f());
  venue=v;S.venue=v;got.main=got.runs=false;last.main=last.runs=null;
  const opt={includeMetadataChanges:true};
  unsub=[onSnapshot(mainRef(v),opt,applyMain,fail),onSnapshot(runsRef(v),opt,applyRuns,fail)];
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
  if(!exists.main){setDoc(mainRef(venue),{rounds:S.rounds,comps:clone(S.comps),classes:clone(S.classes),order:unpack(m.order),teams:unpack(m.teams)}).catch(fail);exists.main=true}
  else{
    const a=[];
    ['rounds','comps','classes'].forEach(k=>{if(m[k]!==om[k])a.push(new FieldPath(k),JSON.parse(m[k]))});
    a.push(...diff('order',m.order,om.order),...diff('teams',m.teams,om.teams));
    if(a.length)updateDoc(mainRef(venue),...a).catch(fail);
  }
  if(!exists.runs){if(Object.keys(r).length){setDoc(runsRef(venue),{runs:unpack(r)}).catch(fail);exists.runs=true}}
  else{const a=diff('runs',r,or);if(a.length)updateDoc(runsRef(venue),...a).catch(fail)}
  synced.main=m;synced.runs=r;
  const c=J([S.staffPin,S.pin]);
  if(synced.codes&&c!==synced.codes){
    synced.codes=c;
    // codes first, then this device's own pass, so the admin is not locked out by the change
    updateDoc(codesRef,{staffCode:S.staffPin,chiefPin:S.pin}).then(()=>setDoc(doc(db,'staff',uid),{code:S.staffPin})).catch(fail);
  }
}

/* ---------- staff ---------- */
function takeCodes(snap){
  if(!snap.exists())return false;
  const d=snap.data();S.staffPin=d.staffCode;S.pin=d.chiefPin||'1234';synced.codes=J([S.staffPin,S.pin]);
  return true;
}
async function checkStaff(){
  if(!uid){CLOUD_STAFF=false;return}
  // cached answer first so a tablet with weak signal opens straight away, then confirm with the server
  try{if(takeCodes(await getDocFromCache(codesRef)))CLOUD_STAFF=true}catch(e){}
  const confirm=getDoc(codesRef).then(s=>{CLOUD_STAFF=takeCodes(s)},e=>{if(e.code==='permission-denied')CLOUD_STAFF=false}).then(()=>{if(READY)render()});
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

window.PT_BACKEND={push,enter};
