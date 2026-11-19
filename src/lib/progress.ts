/**
 * Remembers the best star count on this device. Nothing leaves the browser and no account is
 * needed. Storage can be missing or throw (private mode, blocked cookies), so every access is
 * guarded and the app works the same without it.
 */

const KEY = 'pipa:best-stars';

export type Store = Pick<Storage, 'getItem' | 'setItem'>;

function defaultStore(): Store | null {
  try {
    return typeof localStorage === 'undefined' ? null : localStorage;
  } catch {
    return null;
  }
}

export function loadBest(store: Store | null = defaultStore()): number {
  if (!store) return 0;
  try {
    const n = Number(store.getItem(KEY));
    return Number.isInteger(n) && n >= 1 && n <= 3 ? n : 0;
  } catch {
    return 0;
  }
}

/** Saves `value` only if it beats the stored one. Returns the best value after the call. */
export function saveBest(value: number, store: Store | null = defaultStore()): number {
  const best = loadBest(store);
  if (!store || value <= best || value > 3) return best;
  try {
    store.setItem(KEY, String(value));
    return value;
  } catch {
    return best;
  }
}
