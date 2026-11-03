import { memo, useCallback, useLayoutEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useRoutineDispatch, useRoutines } from './RoutineContext';

// Form chỉ consume DispatchContext. Props validateName giữ nguyên tham chiếu.
export const RoutineCreateForm = memo(function RoutineCreateForm({ validateName }: {
  validateName: (name: string) => string;
}) {
  const dispatch = useRoutineDispatch();
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = name.trim();
    const message = validateName(trimmed);
    if (message) { setError(message); return; }
    dispatch({ type: 'create', routine: { id: crypto.randomUUID(), name: trimmed, exerciseIds: [] } });
    setName('');
    setError('');
  };

  return <form className="routine-form" onSubmit={handleSubmit} noValidate>
    <div className="field"><label htmlFor="routine-name">Tên giáo án</label>
      <input id="routine-name" value={name} placeholder="Ví dụ: Ngày ngực"
        onChange={event => { setName(event.target.value); setError(''); }}
        aria-invalid={Boolean(error)} aria-describedby={error ? 'routine-error' : undefined} />
    </div>
    <button className="button-primary" type="submit">Tạo</button>
    {error && <p id="routine-error" role="alert" className="form-error">{error}</p>}
  </form>;
});

export default function RoutinesPage() {
  const routines = useRoutines();
  const dispatch = useRoutineDispatch();
  // Đọc danh sách mới nhất khi submit nhưng không khiến Form subscribe state.
  const routinesRef = useRef(routines);
  useLayoutEffect(() => { routinesRef.current = routines; }, [routines]);
  const validateName = useCallback((name: string) => {
    if (!name) return 'Tên giáo án không được để trống';
    if (routinesRef.current.some(item => item.name.toLocaleLowerCase('vi') === name.toLocaleLowerCase('vi')))
      return 'Tên giáo án đã tồn tại';
    return '';
  }, []);

  return <>
    <header className="page-heading"><div><p className="eyebrow">LÊN KẾ HOẠCH LUYỆN TẬP</p>
      <h1>Giáo án</h1><p className="muted">Tạo giáo án và thêm các bài tập từ kho.</p></div></header>
    <section className="panel routine-create"><h2>Tạo giáo án mới</h2>
      <RoutineCreateForm validateName={validateName} />
    </section>
    <section className="routine-grid" aria-label="Danh sách giáo án">
      {routines.length === 0 ? <p className="muted">Bạn chưa có giáo án nào.</p> : routines.map(routine =>
        <article className="panel routine-card" key={routine.id}>
          <h2><Link to={`/routines/${encodeURIComponent(routine.id)}`}>{routine.name}</Link></h2>
          <p className="muted">{routine.exerciseIds.length} bài</p>
          <div className="routine-actions"><Link to={`/routines/${encodeURIComponent(routine.id)}`}>Xem chi tiết</Link>
            <button onClick={() => dispatch({ type: 'remove', id: routine.id })}
              aria-label={`Xóa giáo án ${routine.name}`}>Xóa</button></div>
        </article>)}
    </section>
  </>;
}
