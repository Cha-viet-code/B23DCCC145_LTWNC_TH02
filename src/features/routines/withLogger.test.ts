import { afterEach, expect, it, vi } from 'vitest';
import { withLogger } from './withLogger';

afterEach(() => { vi.unstubAllEnvs(); vi.restoreAllMocks(); });
it('logger trả kết quả reducer và chỉ ghi log trong DEV', () => {
  const log = vi.spyOn(console, 'log').mockImplementation(() => {});
  const reducer = withLogger((state: number, action: { type: string; value: number }) => state + action.value);
  vi.stubEnv('DEV', true);
  expect(reducer(1, { type: 'add', value: 2 })).toBe(3);
  expect(log).toHaveBeenCalledWith('add', { before: 1, after: 3 });
  log.mockClear();
  vi.stubEnv('DEV', false);
  expect(reducer(4, { type: 'add', value: 2 })).toBe(6);
  expect(log).not.toHaveBeenCalled();
});
