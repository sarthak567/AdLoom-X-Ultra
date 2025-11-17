import { mockAppState, AppState } from '../data/mockData';

const STORAGE_KEY = 'adloom-x-ultra-app';

export function loadAppState(): AppState {
  if (typeof window === 'undefined') {
    return mockAppState;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(mockAppState));
      return mockAppState;
    }
    return JSON.parse(raw);
  } catch {
    return mockAppState;
  }
}

export function persistAppState(state: AppState) {
  if (typeof window === 'undefined') {
    return;
  }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

