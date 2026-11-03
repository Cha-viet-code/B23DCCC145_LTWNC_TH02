import { beforeEach, expect, it } from 'vitest';
import { useSavedStore } from './useSavedStore';

beforeEach(() => {
  localStorage.clear();
  useSavedStore.setState({ ids: [] });
});

it('toggle thêm bài và bấm lại thì bỏ lưu', () => {
  useSavedStore.getState().toggle('e1');
  expect(useSavedStore.getState().ids).toEqual(['e1']);
  useSavedStore.getState().toggle('e1');
  expect(useSavedStore.getState().ids).toEqual([]);
});

it('ghi đúng workout-saved và khôi phục sau khi nạp lại storage', async () => {
  useSavedStore.getState().toggle('e1');
  useSavedStore.getState().toggle('e3');
  const stored = localStorage.getItem('workout-saved');
  expect(stored).not.toBeNull();
  expect(JSON.parse(stored!).state.ids).toEqual(['e1', 'e3']);
  // Giả lập khởi tạo bộ nhớ trống, sau đó đọc lại dữ liệu persist.
  useSavedStore.setState({ ids: [] });
  localStorage.setItem('workout-saved', stored!);
  await useSavedStore.persist.rehydrate();
  expect(useSavedStore.getState().ids).toEqual(['e1', 'e3']);
});
