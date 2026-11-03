import { useCallback, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useParams } from 'react-router-dom';
import { EXERCISES } from '../../data/exercises';
import { formatDuration } from '../../utils/format';
import { useSessionStore } from '../session/useSessionStore';
import { useRoutineDispatch, useRoutines } from './RoutineContext';

const exerciseById = new Map(EXERCISES.map(exercise => [exercise.id, exercise]));

export default function RoutineDetailPage() {
  const { id } = useParams();
  const routines = useRoutines();
  const dispatch = useRoutineDispatch();
  const startSession = useSessionStore(state => state.startSession);
  const [renameError, setRenameError] = useState('');
  const routine = routines.find(item => item.id === id);
  const exercises = useMemo(() => routine?.exerciseIds.flatMap(exerciseId => {
    const exercise = exerciseById.get(exerciseId);
    return exercise ? [exercise] : [];
  }) ?? [], [routine]);
  const totalSeconds = useMemo(() => exercises.reduce((sum, exercise) => sum + exercise.duration, 0), [exercises]);
  const handleAll = useCallback(() => startSession(exercises, 0), [exercises, startSession]);

  const handleRename = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const name = String(new FormData(event.currentTarget).get('name') ?? '').trim();
    if (!name) { setRenameError('Tên giáo án không được để trống'); return; }
    if (routines.some(item => item.id !== id && item.name.toLocaleLowerCase('vi') === name.toLocaleLowerCase('vi'))) {
      setRenameError('Tên giáo án đã tồn tại'); return;
    }
    if (id) dispatch({ type: 'rename', id, name });
    setRenameError('');
  };

  if (!routine) return <section className="panel placeholder"><h1>Không tìm thấy giáo án</h1>
    <Link to="/routines">Về danh sách giáo án</Link></section>;

  return <>
    <header className="page-heading"><div><Link to="/routines">← Danh sách giáo án</Link>
      <h1>{routine.name}</h1><p className="muted">{exercises.length} bài tập</p></div>
      <button className="button-primary" onClick={handleAll} disabled={exercises.length === 0}>Tập tất cả</button>
    </header>
    <section className="panel routine-create">
      <form className="routine-form" onSubmit={handleRename} key={routine.id}>
        <div className="field"><label htmlFor="rename-routine">Đổi tên giáo án</label>
          <input id="rename-routine" name="name" defaultValue={routine.name} /></div>
        <button type="submit">Lưu tên</button>
        {renameError && <p role="alert" className="form-error">{renameError}</p>}
      </form>
    </section>
    <section className="panel" aria-label="Bài tập trong giáo án">
      <p className="routine-total">Tổng thời gian: {Math.floor(totalSeconds / 60)} phút {totalSeconds % 60} giây</p>
      {exercises.length === 0 ? <p className="empty-state">Giáo án chưa có bài tập. Hãy thêm bài từ Kho bài tập.</p> :
        <ul className="routine-exercises">{exercises.map(exercise => <li key={exercise.id}>
          <div><strong>{exercise.name}</strong><p className="muted">HLV {exercise.trainer} · {exercise.group}</p></div>
          <span>{formatDuration(exercise.duration)}</span>
          <button aria-label={`Bỏ ${exercise.name}`}
            onClick={() => dispatch({ type: 'removeExercise', id: routine.id, exerciseId: exercise.id })}>Bỏ</button>
        </li>)}</ul>}
    </section>
  </>;
}
