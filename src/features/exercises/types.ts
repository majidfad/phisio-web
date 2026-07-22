export const ExerciseMediaType = {
  UploadedVideo: 1,
  ExternalVideo: 2,
  Youtube: 3,
  Gif: 4,
  Animation: 5,
} as const;
export type ExerciseMediaType = (typeof ExerciseMediaType)[keyof typeof ExerciseMediaType];

export const ExerciseBodyRegion = {
  Neck: 1,
  Shoulder: 2,
  Elbow: 3,
  WristHand: 4,
  Back: 5,
  Hip: 6,
  Knee: 7,
  AnkleFoot: 8,
  FullBody: 9,
} as const;
export type ExerciseBodyRegion = (typeof ExerciseBodyRegion)[keyof typeof ExerciseBodyRegion];

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
  bodyRegion: ExerciseBodyRegion;
  equipment: ExerciseEquipment;
  difficulty: ExerciseDifficulty;
  instructions: string;
}

export interface ExerciseMetadata extends ExerciseMediaMetadata {
  title: string;
  description: string;
  videoUrl: string | null;
}

export const exerciseBodyRegionOptions = Object.values(ExerciseBodyRegion);
export const exerciseEquipmentOptions = Object.values(ExerciseEquipment);
export const exerciseDifficultyOptions = Object.values(ExerciseDifficulty);
