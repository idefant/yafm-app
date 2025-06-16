import { load, Store } from '@tauri-apps/plugin-store';
import { useMemo } from 'react';

let storeInstance: Store;

export const initStore = async () => {
  storeInstance = await load('store.json', { autoSave: false });
};

export const getStore = (): Store => {
  if (!storeInstance) {
    throw new Error('Store not initialized. Call initStore() first.');
  }
  return storeInstance;
};

export function useStore(): Store {
  return useMemo(() => getStore(), []);
}
