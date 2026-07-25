export const ExerciseMediaType = {
  UploadedVideo: 1,
  ExternalVideo: 2,
  Youtube: 3,
  Gif: 4,
  Animation: 5,
} as const;
export type ExerciseMediaType = (typeof ExerciseMediaType)[keyof typeof ExerciseMediaType];

export const ExerciseEquipment = {
  None: 1,
  Band: 2,
  Dumbbell: 3,
  Ball: 4,
  Machine: 5,
  Other: 6,
} as const;
export type ExerciseEquipment = (typeof ExerciseEquipment)[keyof typeof ExerciseEquipment];

export const ExerciseDifficulty = { Beginner: 1, Intermediate: 2, Advanced: 3 } as const;
export type ExerciseDifficulty = (typeof ExerciseDifficulty)[keyof typeof ExerciseDifficulty];

export const ExerciseSide = { None: 0, Left: 1, Right: 2, Both: 3 } as const;
export type ExerciseSide = (typeof ExerciseSide)[keyof typeof ExerciseSide];

export interface ExerciseMediaMetadata {
  mediaType: ExerciseMediaType;
  equipment: ExerciseEquipment;
  difficulty: ExerciseDifficulty;
  instructions: string;
}

export interface ExerciseMetadata extends ExerciseMediaMetadata {
  title: string;
  description: string;
  videoUrl: string | null;
}

export const exerciseEquipmentOptions = Object.values(ExerciseEquipment);
export const exerciseDifficultyOptions = Object.values(ExerciseDifficulty);
