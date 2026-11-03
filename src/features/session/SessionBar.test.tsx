import { act, fireEvent, render, screen } from '@testing-library/react';
import { Profiler } from 'react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { EXERCISES } from '../../data/exercises';
import LibraryPage from '../library/LibraryPage';
import { SessionBar } from './SessionBar';
import { useSessionStore } from './useSessionStore';

beforeEach(() => {
  vi.useFakeTimers();
  useSessionStore.setState({ queue: [], currentIndex: -1, isRunning: false, elapsed: 0 });
});
afterEach(() => vi.useRealTimers());

it('hiển thị trạng thái chưa tập và vô hiệu hóa điều khiển khi buổi tập rỗng', () => {
  render(<SessionBar />);
  expect(screen.getByText('Chưa bắt đầu buổi tập')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Bắt đầu' })).toBeDisabled();
  expect(screen.getByRole('progressbar', { name: 'Tiến trình bài tập' })).toHaveAttribute('value', '0');
});

it('đếm mỗi giây, tạm dừng và tiếp tục đúng thời gian', () => {
  render(<SessionBar />);
  act(() => useSessionStore.getState().startSession(EXERCISES.slice(0, 3), 1));
  expect(screen.getByText('Còn lại: 1:07')).toBeInTheDocument();
  act(() => vi.advanceTimersByTime(5000));
  expect(screen.getByText('Còn lại: 1:02')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Tạm dừng' }));
  act(() => vi.advanceTimersByTime(3000));
  expect(screen.getByText('Còn lại: 1:02')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Bắt đầu' }));
  act(() => vi.advanceTimersByTime(1000));
  expect(screen.getByText('Còn lại: 1:01')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Sau' }));
  expect(screen.getByText('Còn lại: 1:44')).toBeInTheDocument();
});

it('hết thời lượng tự chuyển bài và hết buổi tập thì dọn interval', () => {
  render(<SessionBar />);
  act(() => useSessionStore.getState().startSession(EXERCISES.slice(0, 2), 0));
  act(() => vi.advanceTimersByTime(30000));
  expect(screen.getByText('Đang tập: Kéo tạ đơn 1 – HLV Phương Anh')).toBeInTheDocument();
  expect(screen.getByText('Còn lại: 1:07')).toBeInTheDocument();
  act(() => vi.advanceTimersByTime(67000));
  expect(screen.getByText('Còn lại: 0:00')).toBeInTheDocument();
  expect(useSessionStore.getState().isRunning).toBe(false);
  expect(vi.getTimerCount()).toBe(0);
});

it('unmount thanh đồng hồ sẽ dọn interval', () => {
  const { unmount } = render(<SessionBar />);
  act(() => useSessionStore.getState().startSession([EXERCISES[0]], 0));
  unmount();
  const elapsed = useSessionStore.getState().elapsed;
  act(() => vi.advanceTimersByTime(5000));
  expect(useSessionStore.getState().elapsed).toBe(elapsed);
  expect(vi.getTimerCount()).toBe(0);
});

it('danh sách kho bài tập không render lại theo mỗi tick', () => {
  const onRender = vi.fn();
  render(<><Profiler id="library" onRender={onRender}><LibraryPage /></Profiler><SessionBar /></>);
  // Hoàn tất debounce khởi tạo trước khi đo các tick của đồng hồ.
  act(() => vi.advanceTimersByTime(300));
  act(() => useSessionStore.getState().startSession(EXERCISES.slice(0, 2), 0));
  onRender.mockClear();
  act(() => vi.advanceTimersByTime(5000));
  expect(screen.getByText('Còn lại: 0:25')).toBeInTheDocument();
  expect(onRender).not.toHaveBeenCalled();
});
