const DB_NAME = 'phisio-push';
const DB_VERSION = 1;
const STORE_NAME = 'settings';
const LANGUAGE_KEY = 'language';
const DEFAULT_LANGUAGE = 'fa';

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () =>
      reject(request.error ?? new Error('Failed to open push language store.'));
  });
}

function withStore<T>(
  mode: IDBTransactionMode,
  operation: (store: IDBObjectStore) => IDBRequest<T>,
): Promise<T> {
  return openDatabase().then(
    (db) =>
      new Promise<T>((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, mode);
        const store = transaction.objectStore(STORE_NAME);
        const request = operation(store);

        request.onsuccess = () => resolve(request.result);
        request.onerror = () =>
          reject(request.error ?? new Error('Push language store operation failed.'));
        transaction.oncomplete = () => db.close();
        transaction.onerror = () =>
          reject(transaction.error ?? new Error('Push language store transaction failed.'));
      }),
  );
}

export async function setPushNotificationLanguage(language: string): Promise<void> {
  if (typeof indexedDB === 'undefined') {
    return;
  }

  const normalized = language.startsWith('fa') ? 'fa' : 'en';
  await withStore('readwrite', (store) => store.put(normalized, LANGUAGE_KEY));
}

export async function getPushNotificationLanguage(): Promise<string> {
  if (typeof indexedDB === 'undefined') {
    return DEFAULT_LANGUAGE;
  }

  try {
    const stored = await withStore<string | undefined>('readonly', (store) =>
      store.get(LANGUAGE_KEY),
    );
    return stored === 'en' || stored === 'fa' ? stored : DEFAULT_LANGUAGE;
  } catch {
    return DEFAULT_LANGUAGE;
  }
}
