import type { ResearchRecord } from "./types";

export const localStorageKey = "gen-alpha-lab-records";

type StorageReader = Pick<Storage, "getItem"> & Partial<Pick<Storage, "removeItem">>;
type StorageWriter = Pick<Storage, "setItem">;
type StorageRemover = Pick<Storage, "removeItem">;

export function getBrowserStorage(): Storage | null {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export function readStoredRecords(storage: StorageReader | null): ResearchRecord[] {
  if (!storage) return [];

  try {
    const stored = storage.getItem(localStorageKey);
    if (!stored) return [];

    const parsed: unknown = JSON.parse(stored);
    if (Array.isArray(parsed)) return parsed as ResearchRecord[];

    removeStoredRecords(storage.removeItem ? { removeItem: storage.removeItem.bind(storage) } : null);
  } catch {
    return [];
  }

  return [];
}

export function writeStoredRecords(storage: StorageWriter | null, records: ResearchRecord[]): boolean {
  if (!storage) return false;

  try {
    storage.setItem(localStorageKey, JSON.stringify(records));
    return true;
  } catch {
    return false;
  }
}

export function removeStoredRecords(storage: StorageRemover | null): boolean {
  if (!storage) return false;

  try {
    storage.removeItem(localStorageKey);
    return true;
  } catch {
    return false;
  }
}
