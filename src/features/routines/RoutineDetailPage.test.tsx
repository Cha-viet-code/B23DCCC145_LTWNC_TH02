import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { RoutineProvider } from './RoutineContext';
import RoutineDetailPage from './RoutineDetailPage';
import { useSessionStore } from '../session/useSessionStore';
import LibraryPage from '../library/LibraryPage';

beforeEach(() => {
  localStorage.clear();
  useSessionStore.setState({ queue: [], currentIndex: -1, isRunning: false, elapsed: 0 });
  vi.spyOn(console, 'log').mockImplementation(() => {});
});
afterEach(() => vi.restoreAllMocks());
function renderDetail(id = 'r1') {
  return render(<MemoryRouter initialEntries={[`/routines/${id}`]}><RoutineProvider><Routes>
    <Route path="/routines/:id" element={<RoutineDetailPage />} />
  </Routes></RoutineProvider></MemoryRouter>);
}

it('hiển thị 1 phút 37 giây, Tập tất cả đúng thứ tự và Bỏ cập nhật tổng thời gian', () => {
  localStorage.setItem('workout-routines', JSON.stringify([{ id: 'r1', name: 'Ngày ngực', exerciseIds: ['e1', 'e2'] }]));
  renderDetail();
  expect(screen.getByText('Tổng thời gian: 1 phút 37 giây')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Tập tất cả' }));
  expect(useSessionStore.getState().queue.map(item => item.id)).toEqual(['e1', 'e2']);
  expect(useSessionStore.getState()).toMatchObject({ currentIndex: 0, isRunning: true });
  fireEvent.click(screen.getByRole('button', { name: 'Bỏ Đẩy tạ đơn 1' }));
  expect(screen.getByText('Tổng thời gian: 1 phút 7 giây')).toBeInTheDocument();
});

it('hiển thị không tìm thấy khi id không tồn tại', () => {
  renderDetail('missing');
  expect(screen.getByRole('heading', { name: 'Không tìm thấy giáo án' })).toBeInTheDocument();
});

it('đổi tên giáo án qua form và từ chối tên trống', () => {
  localStorage.setItem('workout-routines', JSON.stringify([{ id: 'r1', name: 'Ngày ngực', exerciseIds: [] }]));
  renderDetail();
  fireEvent.change(screen.getByLabelText('Đổi tên giáo án'), { target: { value: 'Ngày vai' } });
  fireEvent.click(screen.getByRole('button', { name: 'Lưu tên' }));
  expect(screen.getByRole('heading', { name: 'Ngày vai' })).toBeInTheDocument();
  fireEvent.change(screen.getByLabelText('Đổi tên giáo án'), { target: { value: ' ' } });
  fireEvent.click(screen.getByRole('button', { name: 'Lưu tên' }));
  expect(screen.getByRole('alert')).toHaveTextContent('Tên giáo án không được để trống');
});

it('thêm e1 e2 rồi e1 từ kho chỉ lưu 2 bài trong giáo án', () => {
  localStorage.setItem('workout-routines', JSON.stringify([{ id: 'r1', name: 'Ngày ngực', exerciseIds: [] }]));
  render(<RoutineProvider><LibraryPage /></RoutineProvider>);
  const buttons = screen.getAllByRole('button', { name: '+ Giáo án' });
  fireEvent.click(buttons[0]); fireEvent.click(buttons[1]); fireEvent.click(buttons[0]);
  const stored: { exerciseIds: string[] }[] = JSON.parse(localStorage.getItem('workout-routines') ?? '[]');
  expect(stored[0].exerciseIds).toEqual(['e1', 'e2']);
});
