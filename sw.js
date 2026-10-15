/* PT Arena keeps itself on the device, so a page reloaded while the hall's internet is down still opens.
   Scores themselves are kept by the Firebase cache; this file only keeps the page, its fonts and the Firebase code.
   - the page: from the network when it answers within a few seconds, else the copy kept here
   - files whose address carries ?v=…: they never change, so the kept copy is used
   - fonts and the Firebase code from Google: the kept copy
   Nothing else (scores, sign-in, Drive, YouTube) passes through here. */
const CACHE = 'pt-arena-v1';
const WAIT = 4000;

// a tap on a "your turn" alert brings the page to the front
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(cs => cs.length ? cs[0].focus() : self.clients.openWindow('./')));
});

self.addEventListener('install', e => { self.skipWaiting(); e.waitUntil(warm()); });
self.addEventListener('activate', e => e.waitUntil((async () => {
  for (const k of await caches.keys()) if (k !== CACHE) await caches.delete(k);
  await self.clients.claim();
})()));

const fromGoogle = u => u.hostname === 'fonts.googleapis.com' || u.hostname === 'fonts.gstatic.com'
  || (u.hostname === 'www.gstatic.com' && u.pathname.startsWith('/firebasejs/'));

self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET') return;
  const u = new URL(r.url);
  if (r.mode === 'navigate') return e.respondWith(netFirst(r, true));
  if (u.origin === location.origin) {
    if (u.pathname.endsWith('/sw.js')) return;
    return e.respondWith(u.searchParams.has('v') ? keptFirst(r) : netFirst(r, false));
  }
  if (fromGoogle(u)) return e.respondWith(keptFirst(r));
});

async function keep(c, key, res) {
  if (!res || !(res.ok || res.type === 'opaque')) return;
  await c.put(key, res);
  // a new version of a file replaces the old one instead of piling up
  const u = new URL(typeof key === 'string' ? key : key.url, location.href);
  if (!u.searchParams.has('v')) return;
  for (const old of await c.keys()) {
    const o = new URL(old.url);
    if (o.origin === u.origin && o.pathname === u.pathname && o.search !== u.search) await c.delete(old);
  }
}

async function keptFirst(r) {
  const c = await caches.open(CACHE);
  const hit = await c.match(r);
  if (hit) return hit;
  const res = await fetch(r);
  keep(c, r, res.clone()).catch(() => {});
  return res;
}

async function netFirst(r, isPage) {
  const c = await caches.open(CACHE);
  const net = fetch(r).then(res => { keep(c, isPage ? './' : r, res.clone()).catch(() => {}); return res; });
  const kept = async () => (await c.match(r, { ignoreSearch: isPage })) || (isPage ? await c.match('./') : null);
  try {
    return await Promise.race([net, new Promise((_, no) => setTimeout(() => no(new Error('slow')), WAIT))]);
  } catch (e) {
    const k = await kept();
    if (k) return k;
    return net;   // nothing kept yet: keep waiting for the network
  }
}

// Right after install, fetch and keep everything the page needs, so the very first visit is already enough.
async function warm() {
  try {
    const c = await caches.open(CACHE);
    const page = await fetch('./', { cache: 'no-store' });
    if (!page.ok) return;
    await keep(c, './', page.clone());
    const html = await page.text();
    const urls = new Set([
      ...[...html.matchAll(/(?:src|href)=["']([^"'#]+)["']/g)].map(m => m[1]),
      ...[...html.matchAll(/['"]([\w./-]+\.js\?v=\w+)['"]/g)].map(m => m[1]),
    ]);
    for (const u of urls) {
      if (/^data:/.test(u)) continue;
      try {
        const res = await fetch(u);
        await keep(c, u, res.clone());
        const text = /fonts\.googleapis\.com\/css|sync\.js/.test(u) ? await res.text() : '';
        // the font files named inside the font sheet, and the Firebase code named inside sync.js
        for (const m of text.matchAll(/(?:url\(|['"])(https:\/\/(?:fonts\.gstatic\.com|www\.gstatic\.com\/firebasejs)[^)'"]+)/g)) {
          try { await keep(c, m[1], await fetch(m[1])); } catch (e) {}
        }
      } catch (e) {}
    }
  } catch (e) {}
}
