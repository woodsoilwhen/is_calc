//注册service worker让网站能够离线工作
if('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service_workers.js');
};

// Code to handle install prompt on desktop
let deferredPrompt;
const addBtn = document.querySelector('.add-button');
addBtn.style.display = 'none';

window.addEventListener('beforeinstallprompt', (e) => {
  // 防止 Chrome 67 及更早版本自动显示安装提示
  e.preventDefault();
  // 稍后再触发此事件
  deferredPrompt = e;
  // 更新 UI 以提醒用户可以将 App 安装到桌面
  addBtn.style.display = 'flex';

  addBtn.addEventListener('click', (e) => {
    // 隐藏显示 A2HS 按钮的界面
    // addBtn.style.display = 'none';
    // 显示安装提示
    deferredPrompt.prompt();
    // 等待用户反馈
    deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the A2HS prompt');
        } else {
          console.log('User dismissed the A2HS prompt');
        }
        deferredPrompt = null;
      });
  });
});