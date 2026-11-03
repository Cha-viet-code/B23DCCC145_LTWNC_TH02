import { createContext, useContext, useEffect, useReducer } from 'react';
import type { Dispatch, PropsWithChildren } from 'react';
import type { Routine } from '../../types';
import { routineReducer } from './routineReducer';
import type { RoutineAction } from './routineReducer';
import { withLogger } from './withLogger';

export const RoutineStateContext = createContext<Routine[] | undefined>(undefined);
export const RoutineDispatchContext = createContext<Dispatch<RoutineAction> | undefined>(undefined);
const loggedReducer = withLogger(routineReducer);

function isRoutine(value: unknown): value is Routine {
  if (typeof value !== 'object' || value === null) return false;
  return 'id' in value && typeof value.id === 'string' &&
    'name' in value && typeof value.name === 'string' &&
    'exerciseIds' in value && Array.isArray(value.exerciseIds) &&
    value.exerciseIds.every((id: unknown) => typeof id === 'string');
}

function readRoutines(): Routine[] {
  try {
    const stored: unknown = JSON.parse(localStorage.getItem('workout-routines') ?? '[]');
    return Array.isArray(stored) ? stored.filter(isRoutine) : [];
  } catch {
    return [];
  }
}

export function RoutineProvider({ children }: PropsWithChildren) {
  const [routines, dispatch] = useReducer(loggedReducer, undefined, readRoutines);
  useEffect(() => {
    localStorage.setItem('workout-routines', JSON.stringify(routines));
  }, [routines]);

  // State và dispatch có Context riêng. dispatch do useReducer cung cấp luôn ổn định.
  return <RoutineDispatchContext.Provider value={dispatch}>
    <RoutineStateContext.Provider value={routines}>{children}</RoutineStateContext.Provider>
  </RoutineDispatchContext.Provider>;
}

export function useRoutines(): Routine[] {
  const value = useContext(RoutineStateContext);
  if (value === undefined) throw new Error('useRoutines phải được dùng trong RoutineProvider');
  return value;
}

export function useRoutineDispatch(): Dispatch<RoutineAction> {
  const value = useContext(RoutineDispatchContext);
  if (value === undefined) throw new Error('useRoutineDispatch phải được dùng trong RoutineProvider');
  return value;
}
