import { formatDuration } from '../../utils/format';
import { useSessionStore } from './useSessionStore';

export function CountdownBar() {
  // Chỉ component này subscribe elapsed. Phần còn lại không cập nhật mỗi giây.
  const elapsed = useSessionStore(state => state.elapsed);
  const duration = useSessionStore(state => state.queue[state.currentIndex]?.duration ?? 0);
  const remaining = Math.max(0, duration - elapsed);
  const progress = duration === 0 ? 0 : Math.min(100, elapsed / duration * 100);

  return <div className="countdown">
    <span className="remaining">Còn lại: {formatDuration(remaining)}</span>
    <progress aria-label="Tiến trình bài tập" max={100} value={progress} />
  </div>;
}
