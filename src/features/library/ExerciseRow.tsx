import { memo, useCallback } from 'react';
import type { CSSProperties } from 'react';
import type { Exercise } from '../../types';
import { formatDuration } from '../../utils/format';

export interface ExerciseRowProps {
  exercise: Exercise;
  position: number;
  style?: CSSProperties;
  onStart: (exercise: Exercise) => void;
  onToggleSaved?: (exercise: Exercise) => void;
  onAddToSession?: (exercise: Exercise) => void;
  isSaved?: boolean;
  onAddToRoutine?: (exercise: Exercise) => void;
  canAddToRoutine?: boolean;
}

export const ExerciseRow = memo(function ExerciseRow({
  exercise, position, style, onStart, onToggleSaved, onAddToSession, isSaved = false,
  onAddToRoutine, canAddToRoutine = false,
}: ExerciseRowProps) {
  const handleStart = useCallback(() => onStart(exercise), [onStart, exercise]);
  const handleSaved = useCallback(() => onToggleSaved?.(exercise), [onToggleSaved, exercise]);
  const handleAdd = useCallback(() => onAddToSession?.(exercise), [onAddToSession, exercise]);

  const handleRoutine = useCallback(() => onAddToRoutine?.(exercise), [onAddToRoutine, exercise]);

  return (
    <div className="exercise-row" style={style} data-exercise-id={exercise.id}>
      <span className="row-number">{position}</span>
      <strong className="exercise-name" title={exercise.name}>{exercise.name}</strong>
      <span className="trainer">{exercise.trainer}</span>
      <span className="muscle"><span className="badge">{exercise.group}</span></span>
      <span className="duration">{formatDuration(exercise.duration)}</span>
      <div className="row-actions">
        <button className="button-primary button-small" onClick={handleStart}>Bắt đầu</button>
        <button className="button-small star-button" onClick={handleSaved}
          disabled={!onToggleSaved} aria-label={isSaved ? 'Bỏ lưu' : 'Lưu bài tập'}
          aria-pressed={isSaved}>{isSaved ? '★' : '☆'}</button>
        <button className="button-small" onClick={handleAdd} disabled={!onAddToSession}>+ Buổi tập</button>
        {onAddToRoutine && <button className="button-small" onClick={handleRoutine}
          disabled={!canAddToRoutine}>+ Giáo án</button>}
      </div>
    </div>
  );
});
