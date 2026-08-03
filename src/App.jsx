import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import CurrentCalc from './pages/CurrentCalc';
import PowerResistorCalc from './pages/PowerResistorCalc';
import { PAGES } from './constants';

const STORAGE_KEY = 'page';

// 读取上次访问的页面（兼容旧版 localStorage 的 iframe 键）
function getInitialPage() {
  const saved =
    window.localStorage.getItem(STORAGE_KEY) || window.localStorage.getItem('iframe');
  if (saved === PAGES.power || saved === '/pr_calc/') {
    return PAGES.power;
  }
  return PAGES.current;
}

export default function App() {
  const [page, setPage] = useState(getInitialPage);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, page);
  }, [page]);

  return (
    <div className="app">
      <Navbar page={page} onNavigate={setPage} />
      <main className="content">
        {page === PAGES.power ? <PowerResistorCalc /> : <CurrentCalc />}
      </main>
    </div>
  );
}
