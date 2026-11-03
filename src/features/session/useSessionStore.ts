import { create } from 'zustand';
import type { Exercise } from '../../types';

export interface SessionState {
  queue: Exercise[];
  currentIndex: number;
  isRunning: boolean;
  elapsed: number;
  startSession: (exercises: Exercise[], startIndex: number) => void;
  toggleRun: () => void;
  next: () => void;
  prev: () => void;
  addToSession: (exercise: Exercise) => void;
  tick: () => void;
}

export const useSessionStore = create<SessionState>()((set, get) => ({
  queue: [],
  currentIndex: -1,
  isRunning: false,
  elapsed: 0,

  startSession: (exercises, startIndex) => {
    if (exercises.length === 0) {
      set({ queue: [], currentIndex: -1, isRunning: false, elapsed: 0 });
      return;
    }
    const index = Math.min(Math.max(Math.trunc(startIndex), 0), exercises.length - 1);
    set({ queue: [...exercises], currentIndex: index, isRunning: true, elapsed: 0 });
  },

  toggleRun: () => {
    const { queue, currentIndex, isRunning, elapsed } = get();
    if (queue.length === 0) return;
    // Có thể thêm bài vào buổi tập trước khi bấm bắt đầu.
    if (currentIndex < 0) {
      set({ currentIndex: 0, isRunning: true, elapsed: 0 });
      return;
    }
    const finished = elapsed >= queue[currentIndex].duration;
    set({ isRunning: !isRunning, elapsed: finished ? 0 : elapsed });
  },

  next: () => {
    const { queue, currentIndex } = get();
    if (currentIndex < 0) return;
    if (currentIndex >= queue.length - 1) {
      set({ isRunning: false });
      return;
    }
    set({ currentIndex: currentIndex + 1, elapsed: 0 });
  },

  prev: () => {
    const { currentIndex, elapsed } = get();
    if (currentIndex < 0) return;
    if (elapsed > 3) {
      set({ elapsed: 0 });
      return;
    }
    set({ currentIndex: Math.max(0, currentIndex - 1), elapsed: 0 });
  },

  addToSession: (exercise) => {
    if (get().queue.some(item => item.id === exercise.id)) return;
    set(state => ({ queue: [...state.queue, exercise] }));
  },

  tick: () => {
    const { queue, currentIndex, isRunning, elapsed } = get();
    const exercise = queue[currentIndex];
    if (!isRunning || !exercise) return;
    const nextElapsed = Math.min(elapsed + 1, exercise.duration);
    set({ elapsed: nextElapsed });
    // Đọc action hiện tại bằng get(), không giữ state cũ trong interval.
    if (nextElapsed >= exercise.duration) get().next();
  },
}));
