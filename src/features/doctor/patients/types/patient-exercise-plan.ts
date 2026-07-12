export interface DoctorPatientExerciseDto {
  userExerciseId: string;
  exerciseId: string;
  exerciseName: string;
  videoUrl: string | null;
  assignedAt: string;
  scheduledDate: string;
}

export interface AssignPatientExercisesRequest {
  exerciseIds: string[];
  scheduledDates: string[];
}

export interface AssignPatientExercisesResultDto {
  assignedCount: number;
}
