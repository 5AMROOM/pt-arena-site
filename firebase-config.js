// Firebase web config for project pt-arena. Public by design: access is controlled by firestore.rules.
// Remove this file from index.html to run on sample data in this browser only.
window.PT_FIREBASE={
  apiKey:"AIzaSyAEy9BF51tUGYTYO-ehlmqYG6Ot9KaeBXo",
  authDomain:"pt-arena-676fa.firebaseapp.com",
  projectId:"pt-arena-676fa",
  storageBucket:"pt-arena-676fa.firebasestorage.app",
  messagingSenderId:"479532213234",
  appId:"1:479532213234:web:4c4517ef3e89777fae416b"
};
// Open the page with ?local at the end of the address to try things on sample data without touching the real data.
if(location.search==='?local')delete window.PT_FIREBASE;
