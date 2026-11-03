export type MuscleGroup = 'Ngực' | 'Lưng' | 'Chân' | 'Vai' | 'Tay';

export interface Exercise {
  id: string;
  name: string;
  trainer: string;
  group: MuscleGroup;
  duration: number; // giây
}

export interface Routine {
  id: string;
  name: string;
  exerciseIds: string[];
}
