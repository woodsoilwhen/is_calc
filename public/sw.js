const cacheName = 'is_calc_v2.0.0';

// 安装
self.addEventListener('install', (e) => {
  console.log('[Service Worker] 安装');
  self.skipWaiting();
});

// 响应请求：缓存优先，未命中时请求网络并写入缓存
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then((cached) => {
      return (
        cached ||
        fetch(e.request).then((response) => {
          return caches.open(cacheName).then((cache) => {
            cache.put(e.request, response.clone());
            return response;
          });
        })
      );
    })
  );
});

// 缓存清理
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== cacheName) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});
