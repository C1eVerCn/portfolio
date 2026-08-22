import { describe, expect, it } from 'vitest';
import {
  markPreludePlayed,
  PRELUDE_SESSION_KEY,
  shouldAutoPlayPrelude,
} from './prelude-session';

const memoryStorage = () => {
  const values = new Map<string, string>();
  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => {
      values.set(key, value);
    },
  };
};

describe('prelude session policy', () => {
  it('plays once per session when motion is allowed', () => {
    const storage = memoryStorage();
    expect(shouldAutoPlayPrelude(storage, false)).toBe(true);
    markPreludePlayed(storage);
    expect(shouldAutoPlayPrelude(storage, false)).toBe(false);
  });

  it('does not autoplay for reduced motion or unavailable storage', () => {
    const storage = memoryStorage();
    expect(shouldAutoPlayPrelude(storage, true)).toBe(false);
    expect(shouldAutoPlayPrelude(null, false)).toBe(false);
  });

  it('marks the prelude as played with the session key', () => {
    const calls: Array<[string, string]> = [];
    const storage = {
      getItem: () => null,
      setItem: (key: string, value: string) => {
        calls.push([key, value]);
      },
    };

    markPreludePlayed(storage);

    expect(calls).toEqual([[PRELUDE_SESSION_KEY, '1']]);
  });
});
