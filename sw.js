const V=new URL(self.location).searchParams.get('v')||'0',CACHE='kirana-shell-v'+V;
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(CACHE).then(c=>c.addAll(['./','./index.html'])).catch(()=>{}))});
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x.startsWith('kirana-shell-')&&x!==CACHE).map(x=>caches.delete(x)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET'||/googleapis\.com\/(google\.firestore|identitytoolkit)|firestore\.googleapis/.test(r.url))return;
 if(r.mode==='navigate')return e.respondWith(fetch(r).then(x=>{caches.open(CACHE).then(c=>c.put(r,x.clone()));return x}).catch(()=>caches.match(r).then(m=>m||caches.match('./index.html'))));
 e.respondWith(caches.match(r).then(m=>m||fetch(r).then(x=>{if(x.ok)caches.open(CACHE).then(c=>c.put(r,x.clone()));return x})))});
