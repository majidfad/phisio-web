import { useEffect } from 'react';
import { useSyncExternalStore } from 'react';

import { DoctorPatientStatusCode } from '../types/patient-doctor';
import type { PatientLinkedDoctorDto } from '../types/patient-doctor';
import { selectedDoctorStore } from '../store/selected-doctor-store';

import { useMyDoctors } from './usePatientDoctors';

export function useSelectedDoctorId(): string | null {
  return useSyncExternalStore(selectedDoctorStore.subscribe, selectedDoctorStore.get, () => null);
}

export function useSetSelectedDoctorId() {
  return (doctorId: string | null) => selectedDoctorStore.set(doctorId);
}

export function useApprovedDoctors() {
  const query = useMyDoctors();
  const approved =
    query.data?.filter((doctor) => doctor.status === DoctorPatientStatusCode.Approved) ?? [];

  return { ...query, approved };
}

export function useActiveDoctor(): {
  activeDoctor: PatientLinkedDoctorDto | null;
  approvedDoctors: PatientLinkedDoctorDto[];
  pendingDoctors: PatientLinkedDoctorDto[];
  selectedDoctorId: string | null;
  setSelectedDoctorId: (doctorId: string | null) => void;
  isLoading: boolean;
} {
  const { data, approved, isLoading } = useApprovedDoctors();
  const selectedDoctorId = useSelectedDoctorId();
  const setSelectedDoctorId = useSetSelectedDoctorId();

  const pending =
    data?.filter((doctor) => doctor.status === DoctorPatientStatusCode.Pending) ?? [];

  const activeDoctor =
    approved.find((doctor) => doctor.doctorId === selectedDoctorId) ?? approved[0] ?? null;

  useEffect(() => {
    if (activeDoctor && selectedDoctorId !== activeDoctor.doctorId) {
      selectedDoctorStore.set(activeDoctor.doctorId);
      return;
    }

    if (!activeDoctor && selectedDoctorId) {
      selectedDoctorStore.set(null);
    }
  }, [activeDoctor, selectedDoctorId]);

  return {
    activeDoctor,
    approvedDoctors: approved,
    pendingDoctors: pending,
    selectedDoctorId: activeDoctor?.doctorId ?? null,
    setSelectedDoctorId,
    isLoading,
  };
}
