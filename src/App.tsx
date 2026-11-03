const BUILD_TAG = "wk-5182";
import { NavLink, Route, Routes } from 'react-router-dom';
import LibraryPage from './features/library/LibraryPage';
import SavedPage from './features/saved/SavedPage';
import { SessionBar } from './features/session/SessionBar';

function PendingPage({ title }: { title: string }) {
  return <section className="panel placeholder"><h1>{title}</h1>
    <p className="muted">Trang này sẽ được hoàn thiện ở phần tiếp theo.</p></section>;
}

export default function App() {
  return (
    <div data-build-tag={BUILD_TAG}>
      <header className="topbar"><div className="topbar-inner">
        <NavLink to="/" className="brand"><span className="brand-mark" aria-hidden="true">W</span>
          <span>Workout<span className="brand-accent">Timer</span></span></NavLink>
        <nav aria-label="Điều hướng chính">
          <NavLink to="/" end>Kho bài tập</NavLink>
          <NavLink to="/saved">Đã lưu</NavLink><NavLink to="/routines">Giáo án</NavLink>
        </nav>
        <span className="course-tag">BẤM GIỜ TẬP LUYỆN</span>
      </div></header>
      <main className="container"><Routes>
        <Route path="/" element={<LibraryPage />} />
        <Route path="/saved" element={<SavedPage />} />
        <Route path="/routines" element={<PendingPage title="Giáo án" />} />
        <Route path="/routines/:id" element={<PendingPage title="Chi tiết giáo án" />} />
        <Route path="*" element={<PendingPage title="Không tìm thấy trang" />} />
      </Routes></main>
      <SessionBar />
    </div>
  );
}
