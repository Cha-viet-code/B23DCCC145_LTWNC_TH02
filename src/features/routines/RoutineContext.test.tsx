import { fireEvent, render, renderHook, screen } from '@testing-library/react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { RoutineProvider, useRoutineDispatch, useRoutines } from './RoutineContext';

beforeEach(() => { localStorage.clear(); vi.spyOn(console, 'log').mockImplementation(() => {}); });
afterEach(() => vi.restoreAllMocks());

it('hai hook báo lỗi rõ ràng khi dùng ngoài Provider', () => {
  vi.spyOn(console, 'error').mockImplementation(() => {});
  expect(() => renderHook(() => useRoutines())).toThrow('useRoutines phải được dùng trong RoutineProvider');
  expect(() => renderHook(() => useRoutineDispatch())).toThrow('useRoutineDispatch phải được dùng trong RoutineProvider');
});

it('khôi phục giáo án từ localStorage và bỏ qua dữ liệu sai cấu trúc', () => {
  localStorage.setItem('workout-routines', JSON.stringify([
    { id: 'r1', name: 'Ngày ngực', exerciseIds: ['e1'] }, { id: 123 }, null,
  ]));
  const { result } = renderHook(() => useRoutines(), { wrapper: RoutineProvider });
  expect(result.current).toEqual([{ id: 'r1', name: 'Ngày ngực', exerciseIds: ['e1'] }]);
});

it('storage sai JSON thì khởi tạo danh sách rỗng', () => {
  localStorage.setItem('workout-routines', '{broken');
  const { result } = renderHook(() => useRoutines(), { wrapper: RoutineProvider });
  expect(result.current).toEqual([]);
});

it('component chỉ đọc dispatch không render lại khi danh sách thay đổi', () => {
  const renderDispatch = vi.fn();
  function CreateButton() {
    const dispatch = useRoutineDispatch();
    renderDispatch();
    return <button onClick={() => dispatch({ type: 'create', routine: { id: 'r1', name: 'Ngày ngực', exerciseIds: [] } })}>Thêm</button>;
  }
  function Count() { return <span>{useRoutines().length} giáo án</span>; }
  render(<RoutineProvider><CreateButton /><Count /></RoutineProvider>);
  renderDispatch.mockClear();
  fireEvent.click(screen.getByRole('button', { name: 'Thêm' }));
  expect(screen.getByText('1 giáo án')).toBeInTheDocument();
  expect(renderDispatch).not.toHaveBeenCalled();
});
