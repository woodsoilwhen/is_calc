var cacheName = "is_calc_v1.1"
var appShellFiles = [
  "/index.html",
  "/index.js",
  "/A2HS.js",
  "/is_calc.webmanifest",
  "/css/font-awwsome.css",
  "/css/index.css",
  "/fonts/fontawesome-webfont.eot",
  "/fonts/fontawesome-webfont.ttf",
  "/fonts/fontawesome-webfont.woff",
  "/fonts/fontawesome-webfont.woff2",
  "/fonts/fontawesome-webfont_1.eot",
  "/fonts/glyphicons-halflings-regular.eot",
  "/fonts/glyphicons-halflings-regular.ttf",
  "/fonts/glyphicons-halflings-regular.woff",
  "/fonts/glyphicons-halflings-regular.woff2",
  "/icon/icon192.png",
  "/images/bilibili.png",
  "/css/font-awesome.css",
  "/is_calc/index.html",
  "/is_calc/is_calc.css",
  "/is_calc/is_calc.js",
  "/pr_calc/index.html",
  "/pr_calc/pr_calc.css",
  "/pr_calc/pr_calc.js"
];

//安装
self.addEventListener('install',function (e) {
  console.log("[Service Worker] 安装");
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      console.log("[Service Worker] 全部缓存：应用脚本和内容");
      cache.addAll(appShellFiles);
    })
  );
});

// //响应请求
// // self.addEventListener('fetch',
// //   function (e) {
// //     e.respondWith(
// //       caches.match(e.request).then(
// //         function(r){
// //           console.log("[Service Worker] 响应资源 "+e.request.url);
// //           return r || fetch(e.request).then(
// //             function(response){
// //               return caches.open(cacheName).then(
// //                 function(cache){
// //                   console.log('[Service Worker] 缓存新资源: '+e.request.url);
// //                   cache.put(e.request,response.clone());
// //                   return response
// //                 }
// //               )
// //             }
// //           )
// //         }
// //       ),
// //     );
// //   }
// // );
// //缓存清理
// self.addEventListener("activate",
//   function (e) {
//     e.waitUntil(
//       caches.keys().then(
//         function (keyList) {
//           return Promise.all(keyList.map(
//             function (key) {
//               if (cacheName.indexOf(key) === -1) {
//                 return caches.delete(key);
//               }
//             }
//           ))
//         }
//       )
//     );
//   }
// )

self.addEventListener('fetch', (e) => {
  console.log(e.request.url);
  e.respondWith(
    caches.match(e.request).then((response) => response || fetch(e.request)),
  );
});
