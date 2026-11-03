import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ChangeEvent } from 'react';
import { FixedSizeList } from 'react-window';
import type { ListChildComponentProps } from 'react-window';
import { EXERCISES, GROUPS } from '../../data/exercises';
import { useDebounce } from '../../hooks/useDebounce';
import type { Exercise, MuscleGroup } from '../../types';
import { ExerciseRow } from './ExerciseRow';

type GroupFilter = 'all' | MuscleGroup;
type SortOrder = 'default' | 'name' | 'duration';

interface RowData {
  exercises: Exercise[];
  onStart: (exercise: Exercise) => void;
}

// Khai báo bên ngoài để component dòng không bị tạo lại khi gõ tìm kiếm.
function VirtualRow({ index, style, data }: ListChildComponentProps<RowData>) {
  return <ExerciseRow exercise={data.exercises[index]} position={index + 1}
    style={style} onStart={data.onStart} />;
}

function itemKey(index: number, data: RowData): string {
  return data.exercises[index].id;
}

// Đầu vào chưa debounce thay đổi sẽ không làm danh sách con render lại.
const ExerciseList = memo(function ExerciseList({ data }: { data: RowData }) {
  const listRef = useRef<FixedSizeList<RowData>>(null);
  useEffect(() => {
    listRef.current?.scrollTo(0);
  }, [data.exercises]);
  return (
    <div className="list-scroll">
      <div className="list-table">
        <div className="list-heading" aria-hidden="true">
          <span>#</span><span>Bài tập</span><span>Huấn luyện viên</span>
          <span>Nhóm cơ</span><span>Thời lượng</span><span>Thao tác</span>
        </div>
        <FixedSizeList<RowData> ref={listRef} height={560} itemSize={56} width="100%"
          itemCount={data.exercises.length} itemData={data} itemKey={itemKey} overscanCount={2}>
          {VirtualRow}
        </FixedSizeList>
      </div>
    </div>
  );
});

export default function LibraryPage() {
  const [keyword, setKeyword] = useState('');
  const [group, setGroup] = useState<GroupFilter>('all');
  const [sort, setSort] = useState<SortOrder>('default');
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const debouncedKeyword = useDebounce(keyword, 300);

  const handleKeywordShift = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setKeyword(event.target.value);
  }, []);

  const filteredExercises = useMemo(() => {
    const query = debouncedKeyword.trim().toLocaleLowerCase('vi');
    const result = EXERCISES.filter((exercise) =>
      (group === 'all' || exercise.group === group) &&
      (exercise.name.toLocaleLowerCase('vi').includes(query) ||
        exercise.trainer.toLocaleLowerCase('vi').includes(query)),
    );
    if (sort === 'name') return [...result].sort((a, b) => a.name.localeCompare(b.name, 'vi'));
    if (sort === 'duration') return [...result].sort((a, b) => a.duration - b.duration);
    return result;
  }, [debouncedKeyword, group, sort]);

  // Điểm nối với startSession của Zustand trong Phần 2.
  const handleStart = useCallback((exercise: Exercise) => setSelectedExercise(exercise), []);
  const rowData = useMemo<RowData>(() => ({
    exercises: filteredExercises, onStart: handleStart,
  }), [filteredExercises, handleStart]);

  return (
    <>
      <header className="page-heading">
        <div><p className="eyebrow">KHÁM PHÁ & LUYỆN TẬP</p><h1>Kho bài tập</h1>
          <p className="muted">Chọn bài tập phù hợp. Xây dựng buổi tập của riêng bạn.</p></div>
        <span className="stat-chip">10.000 bài tập · 5 nhóm cơ</span>
      </header>
      <section className="panel" aria-label="Kho bài tập">
        <div className="filters">
          <div className="field search-field"><label htmlFor="keyword">Tìm kiếm</label>
            <input id="keyword" type="search" placeholder="Tên bài tập hoặc huấn luyện viên..."
              value={keyword} onChange={handleKeywordShift} /></div>
          <div className="field"><label htmlFor="group">Nhóm cơ</label>
            <select id="group" value={group}
              onChange={(event) => setGroup(event.target.value as GroupFilter)}>
              <option value="all">Tất cả</option>
              {GROUPS.map((name) => <option key={name} value={name}>{name}</option>)}
            </select></div>
          <div className="field"><label htmlFor="sort">Sắp xếp</label>
            <select id="sort" value={sort}
              onChange={(event) => setSort(event.target.value as SortOrder)}>
              <option value="default">Mặc định</option><option value="name">Tên A–Z</option>
              <option value="duration">Thời lượng tăng dần</option>
            </select></div>
        </div>
        <div className="results-heading"><p role="status">Tìm thấy {filteredExercises.length} bài tập</p></div>
        {filteredExercises.length === 0 ? <div className="empty-state">Không tìm thấy bài tập nào</div>
          : <ExerciseList data={rowData} />}
      </section>
      {selectedExercise && <p className="selection-notice" role="status">Bài tập đã chọn: {selectedExercise.name}</p>}
    </>
  );
}
