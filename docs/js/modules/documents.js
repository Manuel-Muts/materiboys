function getCurrentSchoolId() {
  const fromStorage = window.localStorage.getItem('active-school-id');
  const fromQuery = new URLSearchParams(window.location.search).get('schoolId');
  const fromWindow = window.__SCHOOL_ID__ || '';
  const schoolId = (fromQuery || fromWindow || fromStorage || 'materi-boys').toString().trim();
  return schoolId || 'materi-boys';
}

function getScopedStorageKey(baseKey) {
  return `${baseKey}:${getCurrentSchoolId()}`;
}

const DOCUMENTS_STORAGE_KEY = getScopedStorageKey('school-download-docs');
const FIREBASE_CONFIG = {
  apiKey: 'AIzaSyBIGqZLYcDg3CR5VamDwBhtOOfl2Y0NYeI',
  authDomain: 'timotech-films.firebaseapp.com',
  projectId: 'timotech-films',
  storageBucket: 'timotech-films.firebasestorage.app',
  messagingSenderId: '563809562931',
  appId: '1:563809562931:web:750ff7e819f2d57e9dce46'
};

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
    if (window.firebase.apps?.length) {
      return window.firebase.firestore(window.firebase.app());
    }

    const hasConfig = FIREBASE_CONFIG.apiKey && FIREBASE_CONFIG.authDomain && FIREBASE_CONFIG.projectId && FIREBASE_CONFIG.appId;
    if (!hasConfig) {
      return null;
    }

    window.firebase.initializeApp(FIREBASE_CONFIG);
    return window.firebase.firestore(window.firebase.app());
  } catch (error) {
    console.warn('Firebase initialization failed for document loader:', error);
    return null;
  }
}

export async function getDocumentRecord(storageKey) {
  const firebaseDb = getFirebaseDb();
  if (firebaseDb && navigator.onLine) {
    try {
      const snapshot = await firebaseDb.collection('schools').doc(getCurrentSchoolId()).collection('documents').get();
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
      const firestoreDocument = normalizeDocumentRecord(nextDocuments[storageKey], storageKey);
      if (firestoreDocument) {
        return firestoreDocument;
      }
    } catch (error) {
      console.warn('Failed to load document record from Firestore:', error);
    }
  }

  const storedDocuments = readStoredDocuments();
  return normalizeDocumentRecord(storedDocuments[storageKey], storageKey);
}
