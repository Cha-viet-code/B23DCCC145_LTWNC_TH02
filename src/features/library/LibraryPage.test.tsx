import { RoutineProvider } from '../routines/RoutineContext';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import LibraryPage from './LibraryPage';
import { useSessionStore } from '../session/useSessionStore';

afterEach(() => vi.useRealTimers());

it('ảo hóa 10000 bài tập và lọc đúng sau thời gian debounce', () => {
  vi.useFakeTimers();
  const { container } = render(<RoutineProvider><LibraryPage /></RoutineProvider>);
  expect(screen.getByText('Tìm thấy 10000 bài tập')).toBeInTheDocument();
  expect(container.querySelectorAll('[data-exercise-id]').length).toBeLessThanOrEqual(15);
  fireEvent.change(screen.getByLabelText('Tìm kiếm'), { target: { value: 'đẩy' } });
  act(() => vi.advanceTimersByTime(299));
  expect(screen.getByText('Tìm thấy 10000 bài tập')).toBeInTheDocument();
  act(() => vi.advanceTimersByTime(1));
  expect(screen.getByText('Tìm thấy 1250 bài tập')).toBeInTheDocument();
  fireEvent.change(screen.getByLabelText('Nhóm cơ'), { target: { value: 'Vai' } });
  expect(screen.getByText('Tìm thấy 250 bài tập')).toBeInTheDocument();
});

it('tìm theo huấn luyện viên và thông báo khi không có kết quả', () => {
  vi.useFakeTimers();
  render(<RoutineProvider><LibraryPage /></RoutineProvider>);
  fireEvent.change(screen.getByLabelText('Tìm kiếm'), { target: { value: 'đức anh' } });
  act(() => vi.advanceTimersByTime(300));
  expect(screen.getByText('Tìm thấy 1000 bài tập')).toBeInTheDocument();
  fireEvent.change(screen.getByLabelText('Tìm kiếm'), { target: { value: 'xyz' } });
  act(() => vi.advanceTimersByTime(300));
  expect(screen.getByText('Không tìm thấy bài tập nào')).toBeInTheDocument();
});

it('sắp xếp tên tiếng Việt và thời lượng mà không sửa dữ liệu gốc', () => {
  const { container } = render(<RoutineProvider><LibraryPage /></RoutineProvider>);
  fireEvent.change(screen.getByLabelText('Sắp xếp'), { target: { value: 'name' } });
  expect(container.querySelector('.exercise-name')).toHaveTextContent('Bật chậm 1');
  fireEvent.change(screen.getByLabelText('Sắp xếp'), { target: { value: 'duration' } });
  expect(container.querySelector('.duration')).toHaveTextContent('0:30');
  fireEvent.change(screen.getByLabelText('Sắp xếp'), { target: { value: 'default' } });
  expect(container.querySelector('.exercise-name')).toHaveTextContent('Đẩy tạ đơn 1');
});

it('bắt đầu từ danh sách đã lọc và giữ bài tiếp theo đúng bộ lọc', () => {
  vi.useFakeTimers();
  useSessionStore.setState({ queue: [], currentIndex: -1, isRunning: false, elapsed: 0 });
  const { container } = render(<RoutineProvider><LibraryPage /></RoutineProvider>);
  fireEvent.change(screen.getByLabelText('Tìm kiếm'), { target: { value: 'đẩy' } });
  act(() => vi.advanceTimersByTime(300));
  fireEvent.click(screen.getAllByRole('button', { name: 'Bắt đầu' })[0]);
  expect(useSessionStore.getState().queue).toHaveLength(1250);
  expect(useSessionStore.getState().queue.every(e => e.name.startsWith('Đẩy'))).toBe(true);
  useSessionStore.getState().next();
  const state = useSessionStore.getState();
  expect(state.queue[state.currentIndex].name).toContain('Đẩy');
  expect(container.querySelectorAll('[data-exercise-id]').length).toBeLessThanOrEqual(15);
});
