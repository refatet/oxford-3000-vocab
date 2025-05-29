import { UserProfile, WordStatus } from '../types';
import { getCurrentISOString } from '../utils/date.utils';

export class IndexedDBService {
  private static instance: IndexedDBService;
  private db: IDBDatabase | null = null;
  private readonly dbName = 'PopOxfordVocabDB';
  private readonly dbVersion = 1;

  private constructor() {}

  static getInstance(): IndexedDBService {
    if (!IndexedDBService.instance) {
      IndexedDBService.instance = new IndexedDBService();
    }
    return IndexedDBService.instance;
  }

  /**
   * Initialize database and create object stores
   */
  async initializeDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => {
        reject(new Error('Failed to open database'));
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Create userProfile object store
        if (!db.objectStoreNames.contains('userProfile')) {
          db.createObjectStore('userProfile', { keyPath: 'userId' });
        }

        // Create wordStatus object store with indexes
        if (!db.objectStoreNames.contains('wordStatus')) {
          const wordStatusStore = db.createObjectStore('wordStatus', {
            keyPath: 'oxfordId',
          });
          
          wordStatusStore.createIndex('leitnerBox_idx', 'leitnerBox', { unique: false });
          wordStatusStore.createIndex('nextReviewDate_idx', 'nextReviewDate', { unique: false });
          wordStatusStore.createIndex('level_idx', 'level', { unique: false });
          wordStatusStore.createIndex('isMastered_idx', 'isMastered', { unique: false });
        }

        // Create leitnerSchedule object store (optional)
        if (!db.objectStoreNames.contains('leitnerSchedule')) {
          db.createObjectStore('leitnerSchedule', { keyPath: 'reviewDate' });
        }

        // Create dbInfo object store
        if (!db.objectStoreNames.contains('dbInfo')) {
          const dbInfoStore = db.createObjectStore('dbInfo', { keyPath: 'key' });
          // Add initial metadata
          dbInfoStore.add({
            key: 'db_metadata',
            current_schema_version: 1,
            last_migration_status: 'success',
          });
        }
      };
    });
  }

  /**
   * Save user profile to IndexedDB
   */
  async saveUserProfile(profile: Omit<UserProfile, 'createdAt' | 'lastUpdatedAt'>): Promise<void> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    const transaction = this.db.transaction(['userProfile'], 'readwrite');
    const store = transaction.objectStore('userProfile');

    const now = getCurrentISOString();
    const profileWithTimestamps: UserProfile = {
      ...profile,
      createdAt: now,
      lastUpdatedAt: now,
    };

    return new Promise((resolve, reject) => {
      const request = store.put(profileWithTimestamps);

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        reject(new Error('Failed to save user profile'));
      };
    });
  }

  /**
   * Get user profile from IndexedDB
   */
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    const transaction = this.db.transaction(['userProfile'], 'readonly');
    const store = transaction.objectStore('userProfile');

    return new Promise((resolve, reject) => {
      const request = store.get(userId);

      request.onsuccess = () => {
        resolve(request.result || null);
      };

      request.onerror = () => {
        reject(new Error('Failed to get user profile'));
      };
    });
  }

  /**
   * Save word status to IndexedDB
   */
  async saveWordStatus(wordStatus: Omit<WordStatus, 'createdAt' | 'lastUpdatedAt'>): Promise<void> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    const transaction = this.db.transaction(['wordStatus'], 'readwrite');
    const store = transaction.objectStore('wordStatus');

    const now = getCurrentISOString();
    const wordStatusWithTimestamps: WordStatus = {
      ...wordStatus,
      createdAt: now,
      lastUpdatedAt: now,
    };

    return new Promise((resolve, reject) => {
      const request = store.put(wordStatusWithTimestamps);

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        reject(new Error('Failed to save word status'));
      };
    });
  }

  /**
   * Get word status from IndexedDB
   */
  async getWordStatus(oxfordId: string): Promise<WordStatus | null> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    const transaction = this.db.transaction(['wordStatus'], 'readonly');
    const store = transaction.objectStore('wordStatus');

    return new Promise((resolve, reject) => {
      const request = store.get(oxfordId);

      request.onsuccess = () => {
        resolve(request.result || null);
      };

      request.onerror = () => {
        reject(new Error('Failed to get word status'));
      };
    });
  }

  /**
   * Close database connection
   */
  closeDB(): void {
    if (this.db) {
      this.db.close();
      this.db = null;
    }
  }
}
