import { useEffect } from 'react';
import { CountdownBar } from './CountdownBar';
import { useSessionStore } from './useSessionStore';

export function SessionBar() {
  const exercise = useSessionStore(state => state.queue[state.currentIndex]);
  const count = useSessionStore(state => state.queue.length);
  const isRunning = useSessionStore(state => state.isRunning);
  const tick = useSessionStore(state => state.tick);
  const prev = useSessionStore(state => state.prev);
  const next = useSessionStore(state => state.next);
  const toggleRun = useSessionStore(state => state.toggleRun);

  useEffect(() => {
    if (!isRunning) return;
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [isRunning, tick]);

  return <section className="session-bar" aria-label="Đồng hồ buổi tập">
    <div className="session-inner">
      <div className="session-info">
        <p className="session-title">{exercise
          ? `Đang tập: ${exercise.name} – HLV ${exercise.trainer}`
          : 'Chưa bắt đầu buổi tập'}</p>
        <p className="muted session-count">Buổi tập: {count} bài</p>
      </div>
      <CountdownBar />
      <div className="session-controls">
        <button onClick={prev} disabled={!exercise}>Trước</button>
        <button className="button-primary" onClick={toggleRun} disabled={count === 0}>
          {isRunning ? 'Tạm dừng' : 'Bắt đầu'}</button>
        <button onClick={next} disabled={!exercise}>Sau</button>
      </div>
    </div>
  </section>;
}
