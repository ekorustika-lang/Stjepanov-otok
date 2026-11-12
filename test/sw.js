const C='stjepan-v15';
const FILES=['./','./index.html','./dzungla.html','./gusari.html','./vulkan.html','./otok.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','https://unpkg.com/three@0.160.0/build/three.module.js'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>Promise.all(FILES.map(f=>c.add(f).catch(()=>{})))));self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;
 e.respondWith(fetch(e.request).then(r=>{if(r&&(r.ok||r.type==='opaque')){const cp=r.clone();caches.open(C).then(c=>c.put(e.request,cp));}return r;})
 .catch(()=>caches.match(e.request,{ignoreSearch:true})));});
