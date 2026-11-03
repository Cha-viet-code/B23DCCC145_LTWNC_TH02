import { useCallback, useMemo } from 'react';
import { EXERCISES } from '../../data/exercises';
import type { Exercise } from '../../types';
import { ExerciseRow } from '../library/ExerciseRow';
import { useSessionStore } from '../session/useSessionStore';
import { useSavedStore } from './useSavedStore';

export default function SavedPage() {
  const ids = useSavedStore(state => state.ids);
  const toggle = useSavedStore(state => state.toggle);
  const startSession = useSessionStore(state => state.startSession);
  const addToSession = useSessionStore(state => state.addToSession);
  const exercises = useMemo(() => {
    const savedIds = new Set(ids);
    return EXERCISES.filter(exercise => savedIds.has(exercise.id));
  }, [ids]);

  const handleStart = useCallback((exercise: Exercise) => {
    startSession(exercises, exercises.findIndex(item => item.id === exercise.id));
  }, [exercises, startSession]);
  const handleAll = useCallback(() => startSession(exercises, 0), [exercises, startSession]);
  const handleSaved = useCallback((exercise: Exercise) => toggle(exercise.id), [toggle]);
  const handleAdd = useCallback((exercise: Exercise) => addToSession(exercise), [addToSession]);

  return <>
    <header className="page-heading">
      <div><p className="eyebrow">BỘ SƯU TẬP CỦA BẠN</p><h1>Bài tập đã lưu</h1>
        <p className="muted">Những bài tập yêu thích, sẵn sàng cho buổi tập tiếp theo.</p></div>
      <button className="button-primary" onClick={handleAll} disabled={exercises.length === 0}>Tập tất cả</button>
    </header>
    <section className="panel" aria-label="Danh sách bài tập đã lưu">
      <div className="results-heading">Đã lưu {exercises.length} bài tập</div>
      {exercises.length === 0 ? <p className="empty-state">Bạn chưa lưu bài tập nào</p> :
        <div className="list-scroll"><div className="list-table saved-table">
          {exercises.map((exercise, index) => <ExerciseRow key={exercise.id}
            exercise={exercise} position={index + 1} isSaved onStart={handleStart}
            onToggleSaved={handleSaved} onAddToSession={handleAdd} />)}
        </div></div>}
    </section>
  </>;
}
