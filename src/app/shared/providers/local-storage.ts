import { InjectionToken } from '@angular/core';

// Create injection token for localStorage
export const LOCAL_STORAGE = new InjectionToken<Storage>('localStorage', {
  providedIn: 'root',
  factory: () => {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage;
    }
    // Mock localStorage for SSR
    return {
      getItem: () => null,
      setItem: () => {
        // Empty implementation
      },
      removeItem: () => {
        // Empty implementation
      },
      clear: () => {
        // Empty implementation
      },
      length: 0,
      key: () => null,
    } as Storage;
  },
});
