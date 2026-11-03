import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { EXERCISES } from '../../data/exercises';
import { ExerciseRow } from './ExerciseRow';

it('hiển thị tên bài tập và thời lượng 0:30', () => {
  render(<ExerciseRow exercise={EXERCISES[0]} position={1} onStart={vi.fn()} />);
  expect(screen.getByText('Đẩy tạ đơn 1')).toBeInTheDocument();
  expect(screen.getByText('0:30')).toBeInTheDocument();
});
it('bấm Bắt đầu gọi hàm với đúng bài tập', async () => {
  const onStart = vi.fn();
  const user = userEvent.setup();
  render(<ExerciseRow exercise={EXERCISES[0]} position={1} onStart={onStart} />);
  await user.click(screen.getByRole('button', { name: 'Bắt đầu' }));
  expect(onStart).toHaveBeenCalledExactlyOnceWith(EXERCISES[0]);
});
