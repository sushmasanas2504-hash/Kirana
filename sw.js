// SuperMarket service worker — offline shell + cache of CDN libraries (fonts, Firebase SDK, PDF/QR libs)
const V=new URL(self.location).searchParams.get('v')||'0',CACHE='sm-shell-v'+V;
const CORE=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','./maskable-512.png','./apple-touch-icon.png','./favicon.png'];
const SKIP=/firestore\.googleapis|identitytoolkit|securetoken|firebaseinstallations|google\.firestore|googleapis\.com\/v1/;

self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(CACHE).then(c=>Promise.allSettled(CORE.map(u=>c.add(u)))))});
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>(x.startsWith('sm-shell-')||x.startsWith('kirana-shell-'))&&x!==CACHE).map(x=>caches.delete(x)))).then(()=>self.clients.claim())));

// Clone synchronously — cloning after the response is handed to the page throws "body already used".
const put=(r,x)=>{if(x&&(x.ok||x.type==='opaque')){const cp=x.clone();caches.open(CACHE).then(c=>c.put(r,cp)).catch(()=>{})}return x};

self.addEventListener('fetch',e=>{const r=e.request;
  if(r.method!=='GET'||!r.url.startsWith('http')||SKIP.test(r.url))return;
  if(r.mode==='navigate')return e.respondWith(fetch(r).then(x=>put(r,x)).catch(()=>caches.match(r).then(m=>m||caches.match('./index.html'))));
  e.respondWith(caches.match(r).then(m=>m||fetch(r).then(x=>put(r,x))));
});
