import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, expect, it } from 'vitest';
import App from '../../App';
import SavedPage from './SavedPage';
import { useSavedStore } from './useSavedStore';
import { useSessionStore } from '../session/useSessionStore';

beforeEach(() => {
  localStorage.clear();
  useSavedStore.setState({ ids: [] });
  useSessionStore.setState({ queue: [], currentIndex: -1, isRunning: false, elapsed: 0 });
});

it('thông báo khi chưa lưu bài và khóa Tập tất cả', () => {
  render(<SavedPage />);
  expect(screen.getByText('Bạn chưa lưu bài tập nào')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Tập tất cả' })).toBeDisabled();
});

it('Tập tất cả dùng đúng bài đã lưu và Bỏ lưu cập nhật danh sách', () => {
  useSavedStore.setState({ ids: ['e1', 'e3'] });
  render(<SavedPage />);
  expect(screen.getByText('Đẩy tạ đơn 1')).toBeInTheDocument();
  expect(screen.getByText('Gập tạ đơn 1')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Tập tất cả' }));
  expect(useSessionStore.getState().queue.map(e => e.id)).toEqual(['e1', 'e3']);
  expect(useSessionStore.getState()).toMatchObject({ currentIndex: 0, isRunning: true });
  fireEvent.click(screen.getAllByRole('button', { name: 'Bỏ lưu' })[0]);
  expect(screen.queryByText('Đẩy tạ đơn 1')).not.toBeInTheDocument();
});

it('lưu từ kho bài tập và đổi trang vẫn giữ đồng hồ buổi tập', async () => {
  const { container } = render(<MemoryRouter><App /></MemoryRouter>);
  const row = container.querySelector('[data-exercise-id="e1"]');
  expect(row).not.toBeNull();
  fireEvent.click(within(row as HTMLElement).getByRole('button', { name: 'Lưu bài tập' }));
  expect(within(row as HTMLElement).getByRole('button', { name: 'Bỏ lưu' })).toHaveTextContent('★');
  fireEvent.click(within(row as HTMLElement).getByRole('button', { name: '+ Buổi tập' }));
  expect(useSessionStore.getState().queue).toHaveLength(1);
  fireEvent.click(within(row as HTMLElement).getByRole('button', { name: 'Bắt đầu' }));
  fireEvent.click(screen.getByRole('link', { name: 'Đã lưu' }));
  expect(await screen.findByRole('heading', { name: 'Bài tập đã lưu' })).toBeInTheDocument();
  expect(screen.getByText('Đang tập: Đẩy tạ đơn 1 – HLV Minh Khang')).toBeInTheDocument();
  expect(screen.getByText('Buổi tập: 10000 bài')).toBeInTheDocument();
  act(() => useSessionStore.getState().toggleRun());
});
