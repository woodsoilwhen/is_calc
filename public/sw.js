const cacheName = 'is_calc_v2.2.0';
const NAV_FALLBACK = './index.html';

// 安装：预缓存新版入口页面，确保“缓存完成”后再提示用户更新
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(cacheName).then((cache) =>
      Promise.all(
        ['./', './index.html'].map((url) => cache.add(url).catch(() => {}))
      )
    )
  );
});

// 激活：清理旧版本缓存并接管页面
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((keyList) =>
        Promise.all(
          keyList.filter((key) => key !== cacheName).map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

// 页面通知新 SW 接管（用户点击“立即更新”后触发）
self.addEventListener('message', (e) => {
  if (e.data && e.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('fetch', (e) => {
  const request = e.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return; // 仅处理同源请求

  // 页面导航：缓存优先 + 后台更新（stale-while-revalidate）
  if (request.mode === 'navigate' || request.destination === 'document') {
    e.respondWith(
      caches.match(request).then((cached) => {
        const network = fetch(request)
          .then((response) => {
            if (response.ok) {
              const copy = response.clone();
              caches
                .open(cacheName)
                .then((cache) => cache.put(request, copy))
                .catch(() => {});
            }
            return response;
          })
          .catch(() => cached);
        return cached || network;
      })
    );
    return;
  }

  // 带内容哈希的构建产物：内容不可变，缓存优先
  if (url.pathname.includes('/assets/')) {
    e.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request).then((response) => {
            const copy = response.clone();
            caches
              .open(cacheName)
              .then((cache) => cache.put(request, copy))
              .catch(() => {});
            return response;
          })
      )
    );
    return;
  }

  // 其余同源静态资源（字体、manifest、图标等）：先用缓存，后台更新
  e.respondWith(
    caches.match(request).then((cached) => {
      const network = fetch(request)
        .then((response) => {
          if (response && response.ok) {
            const copy = response.clone();
            caches
              .open(cacheName)
              .then((cache) => cache.put(request, copy))
              .catch(() => {});
          }
          return response;
        })
        .catch(() => cached);
      return cached || network;
    })
  );
});
