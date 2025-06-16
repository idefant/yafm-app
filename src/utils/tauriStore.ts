import { load, Store } from '@tauri-apps/plugin-store';
import { useMemo } from 'react';

let storeInstance: Store;

export const initTauriStore = async () => {
  storeInstance = await load('store.json', { autoSave: false });
};

export const getTauriStore = (): Store => {
  if (!storeInstance) {
    throw new Error('Store not initialized. Call initStore() first.');
  }
  return storeInstance;
};

export function useTauriStore(): Store {
  return useMemo(() => getTauriStore(), []);
}
