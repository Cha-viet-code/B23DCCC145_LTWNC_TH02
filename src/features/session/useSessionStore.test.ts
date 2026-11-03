import { beforeEach, describe, expect, it } from 'vitest';
import { EXERCISES } from '../../data/exercises';
import { useSessionStore } from './useSessionStore';

beforeEach(() => {
  useSessionStore.setState({ queue: [], currentIndex: -1, isRunning: false, elapsed: 0 });
});

describe('Store buổi tập', () => {
  it('bắt đầu đúng bài và đặt lại elapsed', () => {
    useSessionStore.setState({ elapsed: 12 });
    useSessionStore.getState().startSession(EXERCISES.slice(0, 3), 1);
    const state = useSessionStore.getState();
    expect(state.queue[state.currentIndex]).toEqual(EXERCISES[1]);
    expect(state.elapsed).toBe(0);
    expect(state.isRunning).toBe(true);
  });
  it('tick ở giây cuối tự chuyển bài và đặt lại thời gian', () => {
    useSessionStore.getState().startSession(EXERCISES.slice(0, 2), 0);
    useSessionStore.setState({ elapsed: 29 });
    useSessionStore.getState().tick();
    expect(useSessionStore.getState()).toMatchObject({ currentIndex: 1, elapsed: 0, isRunning: true });
  });
  it('next ở bài cuối dừng đồng hồ', () => {
    useSessionStore.getState().startSession([EXERCISES[0]], 0);
    useSessionStore.getState().next();
    expect(useSessionStore.getState().isRunning).toBe(false);
    expect(useSessionStore.getState().currentIndex).toBe(0);
  });
  it('tick khi tạm dừng không tăng thời gian', () => {
    useSessionStore.getState().startSession([EXERCISES[0]], 0);
    useSessionStore.getState().toggleRun();
    useSessionStore.getState().tick();
    expect(useSessionStore.getState().elapsed).toBe(0);
  });
  it('Trước khi quá 3 giây chỉ đặt lại bài hiện tại', () => {
    useSessionStore.getState().startSession(EXERCISES.slice(0, 2), 1);
    useSessionStore.setState({ elapsed: 4 });
    useSessionStore.getState().prev();
    expect(useSessionStore.getState()).toMatchObject({ currentIndex: 1, elapsed: 0 });
  });
  it('Trước ở đúng 3 giây lùi bài và ở bài đầu vẫn giữ bài đầu', () => {
    useSessionStore.getState().startSession(EXERCISES.slice(0, 2), 1);
    useSessionStore.setState({ elapsed: 3 });
    useSessionStore.getState().prev();
    expect(useSessionStore.getState()).toMatchObject({ currentIndex: 0, elapsed: 0 });
    useSessionStore.getState().prev();
    expect(useSessionStore.getState().currentIndex).toBe(0);
  });
  it('thêm vào cuối và bỏ qua bài trùng', () => {
    useSessionStore.getState().addToSession(EXERCISES[0]);
    useSessionStore.getState().addToSession(EXERCISES[1]);
    useSessionStore.getState().addToSession(EXERCISES[0]);
    expect(useSessionStore.getState().queue).toEqual(EXERCISES.slice(0, 2));
    expect(useSessionStore.getState().currentIndex).toBe(-1);
    useSessionStore.getState().toggleRun();
    expect(useSessionStore.getState()).toMatchObject({ currentIndex: 0, isRunning: true });
  });
  it('hết bài cuối giữ thời gian ở cuối và dừng', () => {
    useSessionStore.getState().startSession([EXERCISES[0]], 0);
    useSessionStore.setState({ elapsed: 29 });
    useSessionStore.getState().tick();
    expect(useSessionStore.getState()).toMatchObject({ elapsed: 30, isRunning: false });
    useSessionStore.getState().toggleRun();
    expect(useSessionStore.getState()).toMatchObject({ elapsed: 0, isRunning: true });
  });
  it('buổi tập rỗng không thể chạy hoặc chuyển bài', () => {
    useSessionStore.getState().startSession([], 0);
    useSessionStore.getState().toggleRun();
    useSessionStore.getState().next();
    useSessionStore.getState().prev();
    useSessionStore.getState().tick();
    expect(useSessionStore.getState()).toMatchObject({ queue: [], currentIndex: -1, isRunning: false, elapsed: 0 });
  });
});
