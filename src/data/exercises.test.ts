import { describe, expect, it } from 'vitest';
import { generateExercises } from './exercises';

const exercises = generateExercises(10000);
describe('generateExercises', () => {
  it('sinh đủ 10000 bài tập', () => expect(exercises).toHaveLength(10000));
  it('không có id trùng lặp', () => expect(new Set(exercises.map(e => e.id)).size).toBe(10000));
  it('mọi thời lượng nằm trong 30 đến 120 giây', () => {
    expect(exercises.every(e => e.duration >= 30 && e.duration <= 120)).toBe(true);
  });
});
