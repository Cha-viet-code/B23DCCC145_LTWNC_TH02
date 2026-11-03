import { act, renderHook } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import { useDebounce } from './useDebounce';

afterEach(() => vi.useRealTimers());
it('giữ giá trị cũ trước 300ms và cập nhật đúng sau 300ms', () => {
  vi.useFakeTimers();
  const { result, rerender } = renderHook(({ value }) => useDebounce(value, 300), {
    initialProps: { value: 'cũ' },
  });
  rerender({ value: 'mới' });
  act(() => vi.advanceTimersByTime(299));
  expect(result.current).toBe('cũ');
  act(() => vi.advanceTimersByTime(1));
  expect(result.current).toBe('mới');
});
