import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private isLocalStorageAvailable(): boolean {
    try {
      const testKey = '__storage_test__';
      window.localStorage.setItem(testKey, 'test');
      window.localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }

  saveState<T>(key: string, state: T): boolean {
    if (!this.isLocalStorageAvailable()) return false;
    try {
      const serialized = JSON.stringify(state);
      window.localStorage.setItem(key, serialized);
      return true;
    } catch {
      return false;
    }
  }

  loadState<T>(key: string): T | null {
    if (!this.isLocalStorageAvailable()) return null;
    try {
      const serialized = window.localStorage.getItem(key);
      if (serialized === null) return null;
      return JSON.parse(serialized) as T;
    } catch {
      return null;
    }
  }

  clearState(key: string): boolean {
    if (!this.isLocalStorageAvailable()) return false;
    try {
      window.localStorage.removeItem(key);
      return true;
    } catch {
      return false;
    }
  }
}
