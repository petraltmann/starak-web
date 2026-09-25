/* Service worker pro Pobyt Starák – umožňuje instalaci PWA a offline režim. */
var CACHE = 'starak-v1';
self.addEventListener('install', function(e){ self.skipWaiting(); });
self.addEventListener('activate', function(e){ e.waitUntil(self.clients.claim()); });
self.addEventListener('fetch', function(e){
  var url = new URL(e.request.url);
  // Zpracuj jen vlastní (same-origin) GET požadavky; cizí (gviz) nech projít.
  if (e.request.method !== 'GET' || url.origin !== self.location.origin) return;
  e.respondWith(
    fetch(e.request).then(function(r){
      var copy = r.clone();
      caches.open(CACHE).then(function(c){ c.put(e.request, copy); }).catch(function(){});
      return r;
    }).catch(function(){ return caches.match(e.request); })
  );
});
