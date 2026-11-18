const V='mapas-v1',A=['./','./index.html','./manifest.json','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(A)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
/* Con internet: siempre la versión más nueva. Sin internet (o muy lento): la copia guardada. */
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET'||new URL(r.url).origin!==location.origin)return;
const net=fetch(r).then(res=>{if(res.ok){const cp=res.clone();caches.open(V).then(c=>c.put(r,cp))}return res});
e.respondWith(Promise.race([net.catch(()=>null),new Promise(ok=>setTimeout(()=>ok(null),3000))])
.then(res=>res||caches.match(r,{ignoreSearch:true}).then(m=>m||caches.match('./index.html')).then(m=>m||net)))});
