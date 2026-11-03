import { describe, expect, it } from 'vitest';
import { formatDuration } from './format';

describe('formatDuration', () => {
  it('hiển thị 0 giây thành 0:00', () => expect(formatDuration(0)).toBe('0:00'));
  it('hiển thị 67 giây thành 1:07', () => expect(formatDuration(67)).toBe('1:07'));
  it('hiển thị 120 giây thành 2:00', () => expect(formatDuration(120)).toBe('2:00'));
});
