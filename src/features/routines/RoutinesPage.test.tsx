import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { RoutineProvider } from './RoutineContext';
import RoutinesPage from './RoutinesPage';

function renderWithProviders() {
  return render(<MemoryRouter><RoutineProvider><RoutinesPage /></RoutineProvider></MemoryRouter>);
}
beforeEach(() => { localStorage.clear(); vi.spyOn(console, 'log').mockImplementation(() => {}); });
afterEach(() => vi.restoreAllMocks());

it('bấm Tạo khi tên trống hiện thông báo lỗi', async () => {
  const user = userEvent.setup();
  renderWithProviders();
  await user.click(screen.getByRole('button', { name: 'Tạo' }));
  expect(screen.getByRole('alert')).toHaveTextContent('Tên giáo án không được để trống');
});

it('nhập tên rồi Tạo thì giáo án xuất hiện trong danh sách và storage', async () => {
  const user = userEvent.setup();
  renderWithProviders();
  await user.type(screen.getByLabelText('Tên giáo án'), 'Ngày ngực');
  await user.click(screen.getByRole('button', { name: 'Tạo' }));
  expect(screen.getByRole('link', { name: 'Ngày ngực' })).toBeInTheDocument();
  expect(localStorage.getItem('workout-routines')).toContain('Ngày ngực');
});

it('từ chối tên trùng không phân biệt hoa thường và xóa được giáo án', async () => {
  const user = userEvent.setup();
  renderWithProviders();
  await user.type(screen.getByLabelText('Tên giáo án'), 'Ngày ngực');
  await user.click(screen.getByRole('button', { name: 'Tạo' }));
  await user.type(screen.getByLabelText('Tên giáo án'), 'ngày NGỰC');
  await user.click(screen.getByRole('button', { name: 'Tạo' }));
  expect(screen.getByRole('alert')).toHaveTextContent('Tên giáo án đã tồn tại');
  await user.click(screen.getByRole('button', { name: 'Xóa giáo án Ngày ngực' }));
  expect(screen.getByText('Bạn chưa có giáo án nào.')).toBeInTheDocument();
});
