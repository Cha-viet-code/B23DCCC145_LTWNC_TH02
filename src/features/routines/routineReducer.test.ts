import { describe, expect, it } from 'vitest';
import type { Routine } from '../../types';
import { routineReducer } from './routineReducer';

const routine: Routine = { id: 'r1', name: 'Ngày ngực', exerciseIds: [] };
describe('Reducer giáo án', () => {
  it('tạo giáo án mới mà không sửa state cũ', () => {
    const state: Routine[] = [];
    expect(routineReducer(state, { type: 'create', routine })).toEqual([routine]);
    expect(state).toEqual([]);
  });
  it('không tạo tên trống hoặc tên trùng bất kể hoa thường', () => {
    expect(routineReducer([], { type: 'create', routine: { ...routine, name: '  ' } })).toEqual([]);
    expect(routineReducer([routine], { type: 'create', routine: { ...routine, id: 'r2', name: 'ngày NGỰC' } })).toEqual([routine]);
  });
  it('addExercise không thêm trùng và giữ nguyên bản cũ', () => {
    const state = [routine];
    const added = routineReducer(state, { type: 'addExercise', id: 'r1', exerciseId: 'e1' });
    expect(added[0].exerciseIds).toEqual(['e1']);
    expect(routineReducer(added, { type: 'addExercise', id: 'r1', exerciseId: 'e1' })).toEqual(added);
    expect(state[0].exerciseIds).toEqual([]);
  });
  it('removeExercise chỉ bỏ bài được chọn', () => {
    const state = [{ ...routine, exerciseIds: ['e1', 'e2'] }];
    expect(routineReducer(state, { type: 'removeExercise', id: 'r1', exerciseId: 'e1' })[0].exerciseIds).toEqual(['e2']);
    expect(state[0].exerciseIds).toEqual(['e1', 'e2']);
  });
  it('xóa giáo án không tồn tại thì state giữ nguyên về giá trị', () => {
    expect(routineReducer([routine], { type: 'remove', id: 'missing' })).toEqual([routine]);
  });
  it('xóa đúng giáo án được chọn', () => {
    expect(routineReducer([routine], { type: 'remove', id: 'r1' })).toEqual([]);
  });
  it('đổi tên giáo án và ngăn tên trùng hoặc tên trống', () => {
    const state = [routine, { id: 'r2', name: 'Ngày chân', exerciseIds: [] }];
    expect(routineReducer(state, { type: 'rename', id: 'r1', name: '  Ngày vai  ' })[0].name).toBe('Ngày vai');
    expect(routineReducer(state, { type: 'rename', id: 'r1', name: 'ngày CHÂN' })).toEqual(state);
    expect(routineReducer(state, { type: 'rename', id: 'r1', name: ' ' })).toEqual(state);
  });
});
