const DOCUMENTS_STORAGE_KEY = 'school-download-docs';

function normalizeDocumentRecord(record = {}, fallbackStorageKey = '') {
  if (!record || typeof record !== 'object') {
    return null;
  }

  const title = typeof record.title === 'string' && record.title.trim() ? record.title.trim() : '';
  const url = typeof record.url === 'string' && record.url.trim() ? record.url.trim() : '';
  if (!title && !url) {
    return null;
  }

  return {
    id: record.id || '',
    storageKey: record.storageKey || fallbackStorageKey,
    title,
    url,
    fileName: typeof record.fileName === 'string' ? record.fileName : '',
    mimeType: typeof record.mimeType === 'string' ? record.mimeType : '',
    storageType: typeof record.storageType === 'string' ? record.storageType : 'cloudinary'
  };
}

export function readStoredDocuments() {
  try {
    const value = window.localStorage.getItem(DOCUMENTS_STORAGE_KEY);
    if (!value) {
      return {};
    }

    const parsed = JSON.parse(value);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch (error) {
    return {};
  }
}

function writeStoredDocuments(documents) {
  window.localStorage.setItem(DOCUMENTS_STORAGE_KEY, JSON.stringify(documents));
}

function getFirebaseDb() {
  if (!window.firebase?.firestore || typeof window.firebase.firestore !== 'function') {
    return null;
  }

  try {
    return window.firebase.firestore();
  } catch (error) {
    return null;
  }
}

export async function getDocumentRecord(storageKey) {
  const storedDocuments = readStoredDocuments();
  const cachedDocument = normalizeDocumentRecord(storedDocuments[storageKey], storageKey);
  if (cachedDocument) {
    return cachedDocument;
  }

  const firebaseDb = getFirebaseDb();
  if (!firebaseDb) {
    return null;
  }

  try {
    const snapshot = await firebaseDb.collection('documents').get();
    const nextDocuments = {};
    snapshot.forEach((doc) => {
      const data = doc.data() || {};
      if (data.storageKey) {
        const normalized = normalizeDocumentRecord({ ...data, id: data.id || doc.id }, data.storageKey);
        if (normalized) {
          nextDocuments[data.storageKey] = normalized;
        }
      }
    });

    writeStoredDocuments(nextDocuments);
    return normalizeDocumentRecord(nextDocuments[storageKey], storageKey);
  } catch (error) {
    console.warn('Failed to load document record from Firestore:', error);
    return cachedDocument;
  }
}
