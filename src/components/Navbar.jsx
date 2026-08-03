import { useState } from 'react';
import { PAGES } from '../constants';
import { useInstallPrompt } from '../hooks/useInstallPrompt';

export default function Navbar({ page, onNavigate }) {
  const [open, setOpen] = useState(false);
  const { canInstall, promptInstall } = useInstallPrompt();

  const go = (target) => {
    onNavigate(target);
    setOpen(false);
  };

  return (
    <nav className="navbar">
      <button
        type="button"
        className={`hamburger${open ? ' open' : ''}`}
        aria-label="菜单"
        onClick={() => setOpen((v) => !v)}
      >
        <i className="fa fa-bars" aria-hidden="true" />
      </button>
      <div className="shadow" />
      <ul className={open ? 'open' : ''}>
        <li className="logo">
          <img src="images/curta.png" alt="" />
          <span> </span>
        </li>
        <li>
          <a
            href="#"
            className={page === PAGES.power ? 'active' : ''}
            onClick={(e) => {
              e.preventDefault();
              go(PAGES.power);
            }}
          >
            <i className="fa fa-home" aria-hidden="true" />
            <span>功率电阻计算</span>
          </a>
        </li>
        <li>
          <a
            href="#"
            className={page === PAGES.current ? 'active' : ''}
            onClick={(e) => {
              e.preventDefault();
              go(PAGES.current);
            }}
          >
            <i className="fa fa-sitemap" aria-hidden="true" />
            <span>电流线径计算</span>
          </a>
        </li>
        {canInstall && (
          <li>
            <a
              href="#"
              className="add-button"
              onClick={(e) => {
                e.preventDefault();
                promptInstall();
              }}
            >
              <i className="fa fa-windows" aria-hidden="true" />
              <span>添加到主屏幕</span>
            </a>
          </li>
        )}
      </ul>
    </nav>
  );
}
