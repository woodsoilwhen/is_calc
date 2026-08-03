# 电气计算器 (is_calc)

使用 **Vite + React** 重构的电气计算器，包含两个计算页面：

- **电流线径计算**：电流、线径、单相功率、三相功率之间互相换算
- **功率电阻计算**：功率与电阻互相换算（R = 290.4 / P）

页面切换记录在 localStorage，刷新后自动回到上次使用的页面。支持 PWA：
添加到主屏幕、离线缓存（service worker）。

## 开发

```bash
pnpm install
pnpm dev
```

## 构建

```bash
pnpm build      # 产物输出到 dist/
pnpm preview    # 本地预览构建产物
```

## 目录结构

```
├── index.html              # Vite 入口
├── src/
│   ├── App.jsx             # 应用外壳：导航 + 页面切换
│   ├── components/         # 导航栏、输入框组件
│   ├── pages/              # 两个计算页面
│   ├── calc/               # 纯计算逻辑（与原版公式一致）
│   └── hooks/              # 添加到主屏幕等逻辑
├── public/                 # 静态资源（字体、图标、manifest、service worker）
└── legacy/                 # 旧版原生 JS 页面，仅作参考
```

旧版实现（iframe + 原生 JS）完整保留在 `legacy/` 目录，计算逻辑已逐行移植，
并通过对拍测试验证结果一致。
