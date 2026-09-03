const SELECTED_DOCTOR_STORAGE_KEY = 'phisio.selectedDoctorId';

export type SelectedDoctorKey = `${string}:${string}`;

type Listener = () => void;

let memorySelectedDoctorKey: string | null = null;
const listeners = new Set<Listener>();

export function encodeSelectedDoctorKey(doctorId: string, clinicId: string): SelectedDoctorKey {
  return `${doctorId}:${clinicId}`;
}

export function decodeSelectedDoctorKey(
  key: string | null,
): { doctorId: string; clinicId: string } | null {
  if (!key) {
    return null;
  }

  const separatorIndex = key.indexOf(':');
  if (separatorIndex <= 0 || separatorIndex >= key.length - 1) {
    return null;
  }

  return {
    doctorId: key.slice(0, separatorIndex),
    clinicId: key.slice(separatorIndex + 1),
  };
}

function getLocalStorage(): Storage | null {
  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null;
  }
}

function readSelectedDoctorKey(): string | null {
  const storage = getLocalStorage();
  if (!storage) {
    return memorySelectedDoctorKey;
  }

  try {
    return storage.getItem(SELECTED_DOCTOR_STORAGE_KEY);
  } catch {
    return memorySelectedDoctorKey;
  }
}

function writeSelectedDoctorKey(key: string | null): void {
  memorySelectedDoctorKey = key;
  const storage = getLocalStorage();
  if (!storage) {
    return;
  }

  try {
    if (key) {
      storage.setItem(SELECTED_DOCTOR_STORAGE_KEY, key);
    } else {
      storage.removeItem(SELECTED_DOCTOR_STORAGE_KEY);
    }
  } catch {
    // Ignore storage failures; memory fallback still works.
  }
}

function notify(): void {
  listeners.forEach((listener) => listener());
}

export const selectedDoctorStore = {
  get(): string | null {
    return readSelectedDoctorKey();
  },

  set(key: string | null): void {
    writeSelectedDoctorKey(key);
    notify();
  },

  subscribe(listener: Listener): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
};
