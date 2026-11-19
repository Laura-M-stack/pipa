import { describe, it, expect } from 'vitest';
import { loadBest, saveBest, type Store } from './progress';

function memory(initial?: string): Store & { value: string | null } {
  const m = {
    value: initial ?? null,
    getItem: () => m.value,
    setItem: (_k: string, v: string) => {
      m.value = v;
    },
  };
  return m;
}

const broken: Store = {
  getItem() {
    throw new Error('blocked');
  },
  setItem() {
    throw new Error('blocked');
  },
};

describe('progress', () => {
  it('starts at 0 and keeps the best result', () => {
    const s = memory();
    expect(loadBest(s)).toBe(0);
    expect(saveBest(2, s)).toBe(2);
    expect(saveBest(1, s)).toBe(2);
    expect(saveBest(3, s)).toBe(3);
    expect(loadBest(s)).toBe(3);
  });

  it('ignores corrupt or out-of-range stored values', () => {
    expect(loadBest(memory('abc'))).toBe(0);
    expect(loadBest(memory('7'))).toBe(0);
    expect(loadBest(memory('1.5'))).toBe(0);
    expect(loadBest(memory('-1'))).toBe(0);
  });

  it('rejects invalid values to save', () => {
    const s = memory();
    expect(saveBest(4, s)).toBe(0);
    expect(s.value).toBeNull();
  });

  it('works without storage or when storage throws', () => {
    expect(loadBest(null)).toBe(0);
    expect(saveBest(3, null)).toBe(0);
    expect(loadBest(broken)).toBe(0);
    expect(saveBest(3, broken)).toBe(0);
  });
});
