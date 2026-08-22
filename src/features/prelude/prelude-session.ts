export const PRELUDE_SESSION_KEY = 'cy-portfolio:mythic-prelude-played';

export interface SessionStorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

export function shouldAutoPlayPrelude(
  storage: SessionStorageLike | null,
  reducedMotion: boolean,
): boolean {
  if (reducedMotion || !storage) return false;
  return storage.getItem(PRELUDE_SESSION_KEY) !== '1';
}

export function markPreludePlayed(storage: SessionStorageLike | null): void {
  storage?.setItem(PRELUDE_SESSION_KEY, '1');
}
