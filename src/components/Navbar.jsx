import { useEffect, useState } from 'react';
import { PAGES } from '../constants';
import { useInstallPrompt } from '../hooks/useInstallPrompt';

const NAV_ITEMS = [
  { key: PAGES.power, icon: 'fa fa-home', label: '功率电阻计算' },
  { key: PAGES.current, icon: 'fa fa-sitemap', label: '电流线径计算' },
];

export default function Navbar({ page, onNavigate }) {
  const [open, setOpen] = useState(false);
  const { canInstall, promptInstall } = useInstallPrompt();

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const go = (target) => {
    onNavigate(target);
    setOpen(false);
  };

  return (
    <>
      <nav className="navbar" aria-label="主导航">
        <button
          type="button"
          className="hamburger"
          aria-label={open ? '关闭菜单' : '打开菜单'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <i className="fa fa-bars" aria-hidden="true" />
        </button>

        <div className="brand">
          <img src="images/curta.png" alt="" />
          <span>电气计算器</span>
        </div>

        <div className="nav-links">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.key}
              type="button"
              className={page === item.key ? 'active' : ''}
              aria-current={page === item.key ? 'page' : undefined}
              onClick={() => go(item.key)}
            >
              <i className={item.icon} aria-hidden="true" />
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        {canInstall && (
          <button type="button" className="btn btn-primary install-btn" onClick={promptInstall}>
            <i className="fa fa-download" aria-hidden="true" />
            <span>添加到主屏幕</span>
          </button>
        )}
      </nav>

      <div
        className={`drawer-backdrop${open ? ' open' : ''}`}
        aria-hidden="true"
        onClick={() => setOpen(false)}
      />

      <aside className={`drawer${open ? ' open' : ''}`} aria-label="站点菜单" aria-hidden={!open}>
        <div className="drawer-header">
          <img src="images/curta.png" alt="" />
          <div>
            <strong>电气计算器</strong>
            <small>电流 · 线径 · 功率</small>
          </div>
        </div>

        <div className="drawer-links">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.key}
              type="button"
              className={page === item.key ? 'active' : ''}
              aria-current={page === item.key ? 'page' : undefined}
              onClick={() => go(item.key)}
            >
              <i className={item.icon} aria-hidden="true" />
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        {canInstall && (
          <button type="button" className="btn btn-primary drawer-install" onClick={promptInstall}>
            <i className="fa fa-download" aria-hidden="true" />
            <span>添加到主屏幕</span>
          </button>
        )}
      </aside>
    </>
  );
}
