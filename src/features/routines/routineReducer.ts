import type { Routine } from '../../types';

export type RoutineAction =
  | { type: 'create'; routine: Routine }
  | { type: 'rename'; id: string; name: string }
  | { type: 'remove'; id: string }
  | { type: 'addExercise'; id: string; exerciseId: string }
  | { type: 'removeExercise'; id: string; exerciseId: string };

export function routineReducer(state: Routine[], action: RoutineAction): Routine[] {
  switch (action.type) {
    case 'create': {
      const name = action.routine.name.trim();
      if (!name || state.some(item => item.id === action.routine.id ||
        item.name.toLocaleLowerCase('vi') === name.toLocaleLowerCase('vi'))) return state;
      return [...state, { ...action.routine, name, exerciseIds: [...new Set(action.routine.exerciseIds)] }];
    }
    case 'rename': {
      const name = action.name.trim();
      if (!name || state.some(item => item.id !== action.id &&
        item.name.toLocaleLowerCase('vi') === name.toLocaleLowerCase('vi'))) return state;
      return state.map(item => item.id === action.id ? { ...item, name } : item);
    }
    case 'remove':
      return state.filter(item => item.id !== action.id);
    case 'addExercise':
      return state.map(item => item.id === action.id && !item.exerciseIds.includes(action.exerciseId)
        ? { ...item, exerciseIds: [...item.exerciseIds, action.exerciseId] } : item);
    case 'removeExercise':
      return state.map(item => item.id === action.id
        ? { ...item, exerciseIds: item.exerciseIds.filter(id => id !== action.exerciseId) } : item);
  }
}
