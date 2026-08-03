import { useEffect, useState } from 'react';

// 注册 service worker 并监听更新：
// 新版本安装（预缓存完成）后提示用户，点击后切换到新版本并刷新页面
export function useServiceWorkerUpdate() {
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    if (!('serviceWorker' in navigator)) return undefined;

    const showUpdate = () => {
      // 首次安装没有旧版控制器，不视为“更新”
      if (navigator.serviceWorker.controller) {
        setUpdateAvailable(true);
      }
    };

    const trackWorker = (worker) => {
      if (!worker) return;
      worker.addEventListener('statechange', () => {
        // installed 表示 install（含预缓存）已全部完成
        if (worker.state === 'installed') showUpdate();
      });
    };

    const register = () => {
      navigator.serviceWorker
        .register('./sw.js')
        .then((registration) => {
          trackWorker(registration.waiting);
          trackWorker(registration.installing);
          // 页面加载时新版本可能已处于 waiting（如 SWR 刷新后），直接提示
          if (registration.waiting && navigator.serviceWorker.controller) {
            setUpdateAvailable(true);
          }
          registration.addEventListener('updatefound', () =>
            trackWorker(registration.installing)
          );
        })
        .catch(() => {});
    };

    if (document.readyState === 'complete') {
      register();
    } else {
      window.addEventListener('load', register, { once: true });
    }

    return undefined;
  }, []);

  const applyUpdate = async () => {
    if (!('serviceWorker' in navigator)) {
      window.location.reload();
      return;
    }
    const registration = await navigator.serviceWorker.getRegistration();
    const waiting = registration?.waiting;
    if (!waiting) {
      // 没有等待中的新版本时直接刷新
      window.location.reload();
      return;
    }

    let reloaded = false;
    const onControllerChange = () => {
      if (reloaded) return;
      reloaded = true;
      navigator.serviceWorker.removeEventListener('controllerchange', onControllerChange);
      window.location.reload();
    };
    navigator.serviceWorker.addEventListener('controllerchange', onControllerChange);
    waiting.postMessage({ type: 'SKIP_WAITING' });

    // 兜底：若一定时间内未触发 controllerchange，直接刷新
    window.setTimeout(() => {
      if (reloaded) return;
      reloaded = true;
      navigator.serviceWorker.removeEventListener('controllerchange', onControllerChange);
      window.location.reload();
    }, 3000);
  };

  return { updateAvailable, applyUpdate };
}
