const CACHE='day-by-day-v6';
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(['./','./index.html','./app.js','./styles.css','./dashboard.js','./dashboard-model.mjs','./goals.js','./backup.js','./backup-model.mjs','./goal-model.mjs','./manifest.webmanifest','./icon.svg']))));
self.addEventListener('fetch',event=>{if(event.request.method==='GET'&&new URL(event.request.url).origin===self.location.origin)event.respondWith(fetch(event.request).catch(()=>caches.match(event.request)));});

self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key))))));
