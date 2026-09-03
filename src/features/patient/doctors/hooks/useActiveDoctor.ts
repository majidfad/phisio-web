import { useEffect } from 'react';
import { useSyncExternalStore } from 'react';

import { DoctorPatientStatusCode } from '../types/patient-doctor';
import type { PatientLinkedDoctorDto } from '../types/patient-doctor';
import {
  decodeSelectedDoctorKey,
  encodeSelectedDoctorKey,
  selectedDoctorStore,
} from '../store/selected-doctor-store';

import { useMyDoctors } from './usePatientDoctors';

export function useSelectedDoctorKey(): string | null {
  return useSyncExternalStore(selectedDoctorStore.subscribe, selectedDoctorStore.get, () => null);
}

export function useSetSelectedDoctorKey() {
  return (doctorId: string | null, clinicId: string | null) => {
    if (!doctorId || !clinicId) {
      selectedDoctorStore.set(null);
      return;
    }

    selectedDoctorStore.set(encodeSelectedDoctorKey(doctorId, clinicId));
  };
}

export function useApprovedDoctors() {
  const query = useMyDoctors();
  const approved =
    query.data?.filter((doctor) => doctor.status === DoctorPatientStatusCode.Approved) ?? [];

  return { ...query, approved };
}

function resolveActiveDoctor(
  approved: PatientLinkedDoctorDto[],
  selectedKey: string | null,
): PatientLinkedDoctorDto | null {
  const parsed = decodeSelectedDoctorKey(selectedKey);
  if (parsed) {
    const matched = approved.find(
      (doctor) => doctor.doctorId === parsed.doctorId && doctor.clinicId === parsed.clinicId,
    );
    if (matched) {
      return matched;
    }
  }

  if (selectedKey && !selectedKey.includes(':')) {
    const legacyMatch = approved.find((doctor) => doctor.doctorId === selectedKey);
    if (legacyMatch) {
      return legacyMatch;
    }
  }

  return approved[0] ?? null;
}

export function useActiveDoctor(): {
  activeDoctor: PatientLinkedDoctorDto | null;
  approvedDoctors: PatientLinkedDoctorDto[];
  pendingDoctors: PatientLinkedDoctorDto[];
  selectedDoctorId: string | null;
  selectedClinicId: string | null;
  setSelectedDoctor: (doctorId: string | null, clinicId: string | null) => void;
  isLoading: boolean;
} {
  const { data, approved, isLoading } = useApprovedDoctors();
  const selectedKey = useSelectedDoctorKey();
  const setSelectedDoctor = useSetSelectedDoctorKey();

  const pending = data?.filter((doctor) => doctor.status === DoctorPatientStatusCode.Pending) ?? [];

  const activeDoctor = resolveActiveDoctor(approved, selectedKey);

  useEffect(() => {
    if (activeDoctor) {
      const expectedKey = encodeSelectedDoctorKey(activeDoctor.doctorId, activeDoctor.clinicId);
      if (selectedKey !== expectedKey) {
        selectedDoctorStore.set(expectedKey);
      }
      return;
    }

    if (selectedKey) {
      selectedDoctorStore.set(null);
    }
  }, [activeDoctor, selectedKey]);

  return {
    activeDoctor,
    approvedDoctors: approved,
    pendingDoctors: pending,
    selectedDoctorId: activeDoctor?.doctorId ?? null,
    selectedClinicId: activeDoctor?.clinicId ?? null,
    setSelectedDoctor,
    isLoading,
  };
}

/** @deprecated Use setSelectedDoctor(doctorId, clinicId) */
export function useSetSelectedDoctorId() {
  const setSelectedDoctor = useSetSelectedDoctorKey();
  return (doctorId: string | null) => {
    if (!doctorId) {
      setSelectedDoctor(null, null);
    }
  };
}

/** @deprecated Use useSelectedDoctorKey */
export function useSelectedDoctorId(): string | null {
  const selectedKey = useSelectedDoctorKey();
  return decodeSelectedDoctorKey(selectedKey)?.doctorId ?? selectedKey;
}
