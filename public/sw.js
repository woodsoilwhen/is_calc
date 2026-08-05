const cacheName = 'is_calc_v2.2.0';
const NAV_FALLBACK = './index.html';

// 从入口 HTML 中提取同源相对资源引用（assets、css、图标、manifest 等），生成预缓存清单
async function collectPrecacheUrls(html) {
  const urls = new Set(['./', './index.html']);
  const re = /(?:src|href)="([^"]+)"/g;
  let m;
  while ((m = re.exec(html))) {
    const url = m[1];
    // 仅收集同源相对引用，跳过外链 / data: / 锚点等
    if (
      url &&
      !url.startsWith('http://') &&
      !url.startsWith('https://') &&
      !url.startsWith('//') &&
      !url.startsWith('data:') &&
      !url.startsWith('#') &&
      !url.startsWith('mailto:')
    ) {
      urls.add(url);
    }
  }
  return [...urls];
}

// 从 CSS 文本中提取 url(...) 引用的同源资源（字体、图片等），补全预缓存清单
async function collectCssUrls(cssUrls) {
  const urls = new Set();
  for (const cssUrl of cssUrls) {
    const res = await fetch(cssUrl, { cache: 'reload' }).catch(() => null);
    if (!res || !res.ok) continue;
    const text = await res.text();
    const re = /url\(\s*(['"]?)([^'")]+)\1\s*\)/g;
    let m;
    while ((m = re.exec(text))) {
      const raw = m[2].trim();
      // 仅收集同源资源，跳过 data: / 锚点 / 外链等
      if (
        !raw ||
        raw.startsWith('data:') ||
        raw.startsWith('#') ||
        raw.startsWith('http://') ||
        raw.startsWith('https://') ||
        raw.startsWith('//')
      ) {
        continue;
      }
      try {
        // 相对路径以 CSS 所在 URL 为基准解析
        urls.add(new URL(raw, new URL(cssUrl, self.location)).href);
      } catch {
        // 忽略无法解析的 URL
      }
    }
  }
  return [...urls];
}

// 安装：预缓存入口页面及其引用的全部构建产物（含 CSS 内字体等），
// 确保新版本切换后离线/弱网也能完整加载，不依赖运行时网络
self.addEventListener('install', (e) => {
  e.waitUntil(
    (async () => {
      const cache = await caches.open(cacheName);
      // 以最新入口 HTML 为准解析资源清单（install 期间不经由任何 SW 拦截，直接走网络）
      // reload 强制绕过 HTTP 缓存，避免 304 复用旧 HTML 导致提取到旧版 assets
      const res = await fetch('./index.html', { cache: 'reload' }).catch(() => null);
      const html = res && res.ok ? await res.text() : '';
      const urls = new Set(html ? await collectPrecacheUrls(html) : ['./', './index.html']);
      // 再解析 CSS 内 url() 引用的资源（字体、图片等），确保离线首屏完整呈现
      const cssUrls = [...urls].filter((u) => /\.css($|\?)/.test(u));
      if (cssUrls.length) {
        for (const u of await collectCssUrls(cssUrls)) urls.add(u);
      }
      // 单个资源失败不阻塞安装（尽力而为），避免非关键资源 404 导致更新永远无法激活
      await Promise.all([...urls].map((url) => cache.add(url).catch(() => {})));
    })()
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

  // 页面导航：缓存优先 + 后台更新（stale-while-revalidate），断网且无缓存时回退到入口页
  if (request.mode === 'navigate' || request.destination === 'document') {
    e.respondWith(
      caches.match(request).then((cached) => {
        if (cached) {
          // 先返回缓存，同时后台刷新
          fetch(request)
            .then((response) => {
              if (response.ok) {
                const copy = response.clone();
                caches
                  .open(cacheName)
                  .then((cache) => cache.put(request, copy))
                  .catch(() => {});
              }
            })
            .catch(() => {});
          return cached;
        }
        // 无缓存：请求网络，失败时回退到已预缓存的入口页
        return fetch(request)
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
          .catch(() =>
            caches
              .match(NAV_FALLBACK)
              .then((fallback) => fallback || caches.match('./'))
          );
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
