const SELECTED_DOCTOR_STORAGE_KEY = 'phisio.selectedDoctorId';

type Listener = () => void;

let memorySelectedDoctorId: string | null = null;
const listeners = new Set<Listener>();

function getLocalStorage(): Storage | null {
  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null;
  }
}

function readSelectedDoctorId(): string | null {
  const storage = getLocalStorage();
  if (!storage) {
    return memorySelectedDoctorId;
  }

  try {
    return storage.getItem(SELECTED_DOCTOR_STORAGE_KEY);
  } catch {
    return memorySelectedDoctorId;
  }
}

function writeSelectedDoctorId(doctorId: string | null): void {
  memorySelectedDoctorId = doctorId;
  const storage = getLocalStorage();
  if (!storage) {
    return;
  }

  try {
    if (doctorId) {
      storage.setItem(SELECTED_DOCTOR_STORAGE_KEY, doctorId);
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
    return readSelectedDoctorId();
  },

  set(doctorId: string | null): void {
    writeSelectedDoctorId(doctorId);
    notify();
  },

  subscribe(listener: Listener): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
};
