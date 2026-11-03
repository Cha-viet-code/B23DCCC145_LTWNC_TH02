const BUILD_TAG = "wk-5182";
import { lazy, Suspense } from 'react';
import { NavLink, Route, Routes } from 'react-router-dom';
import LibraryPage from './features/library/LibraryPage';
import { SessionBar } from './features/session/SessionBar';
import { RoutineProvider } from './features/routines/RoutineContext';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';

const SavedPage = lazy(() => import('./features/saved/SavedPage'));
const RoutinesPage = lazy(() => import('./features/routines/RoutinesPage'));
const RoutineDetailPage = lazy(() => import('./features/routines/RoutineDetailPage'));

function AppLayout() {
  const { theme, toggleTheme } = useTheme();
  return (
    <div data-build-tag={BUILD_TAG}>
      <header className="topbar"><div className="topbar-inner">
        <NavLink to="/" className="brand"><span className="brand-mark" aria-hidden="true">W</span>
          <span>Workout<span className="brand-accent">Timer</span></span></NavLink>
        <nav aria-label="Điều hướng chính">
          <NavLink to="/" end>Kho bài tập</NavLink>
          <NavLink to="/saved">Đã lưu</NavLink><NavLink to="/routines">Giáo án</NavLink>
        </nav>
        <button className="theme-toggle" onClick={toggleTheme}>
          {theme === 'light' ? 'Giao diện tối' : 'Giao diện sáng'}</button>
      </div></header>
      <main className="container"><Suspense fallback={<p>Đang tải trang...</p>}><Routes>
        <Route path="/" element={<LibraryPage />} />
        <Route path="/saved" element={<SavedPage />} />
        <Route path="/routines" element={<RoutinesPage />} />
        <Route path="/routines/:id" element={<RoutineDetailPage />} />
        <Route path="*" element={<section className="panel placeholder"><h1>Không tìm thấy trang</h1></section>} />
      </Routes></Suspense></main>
      <SessionBar />
    </div>
  );
}

export default function App() {
  return <ThemeProvider><RoutineProvider><AppLayout /></RoutineProvider></ThemeProvider>;
}
