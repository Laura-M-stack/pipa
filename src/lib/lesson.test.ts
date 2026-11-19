import { describe, it, expect } from 'vitest';
import {
  HINT_AFTER,
  MAX_SUM,
  OPTION_COUNT,
  QUESTIONS_PER_LESSON,
  currentQuestion,
  makeLesson,
  makeQuestion,
  next,
  pick,
  rng,
  startSession,
  stars,
} from './lesson';

describe('makeQuestion', () => {
  it('keeps the sum within the limit and includes the answer exactly once', () => {
    const r = rng(7);
    for (let i = 0; i < 300; i++) {
      const q = makeQuestion(r);
      expect(q.a).toBeGreaterThanOrEqual(1);
      expect(q.b).toBeGreaterThanOrEqual(1);
      expect(q.answer).toBe(q.a + q.b);
      expect(q.answer).toBeLessThanOrEqual(MAX_SUM);
      expect(q.options.filter((o) => o === q.answer)).toHaveLength(1);
    }
  });

  it('offers distinct options inside the valid range', () => {
    const r = rng(11);
    for (let i = 0; i < 300; i++) {
      const q = makeQuestion(r);
      expect(new Set(q.options).size).toBe(q.options.length);
      expect(q.options.length).toBe(OPTION_COUNT);
      for (const o of q.options) {
        expect(o).toBeGreaterThanOrEqual(1);
        expect(o).toBeLessThanOrEqual(MAX_SUM);
      }
    }
  });
});

describe('makeLesson', () => {
  it('returns the requested number of questions', () => {
    expect(makeLesson(1)).toHaveLength(QUESTIONS_PER_LESSON);
    expect(makeLesson(1, 3)).toHaveLength(3);
  });

  it('is deterministic for a seed and varies between seeds', () => {
    expect(makeLesson(42)).toEqual(makeLesson(42));
    expect(JSON.stringify(makeLesson(1))).not.toBe(JSON.stringify(makeLesson(2)));
  });

  it('does not repeat a sum, even swapped', () => {
    for (let seed = 1; seed <= 60; seed++) {
      const keys = makeLesson(seed).map((q) => `${Math.min(q.a, q.b)}+${Math.max(q.a, q.b)}`);
      expect(new Set(keys).size).toBe(keys.length);
    }
  });
});

describe('session', () => {
  const wrongOf = (q: { answer: number; options: number[] }) => q.options.filter((o) => o !== q.answer);

  it('counts a first-try answer and waits for next()', () => {
    let s = startSession(makeLesson(3));
    const q = currentQuestion(s)!;
    s = pick(s, q.answer);
    expect(s.feedback).toBe('correct');
    expect(s.firstTry).toBe(1);
    expect(s.index).toBe(0);
    s = next(s);
    expect(s.index).toBe(1);
    expect(s.feedback).toBe('none');
  });

  it('does not count first try after a mistake, and discards the wrong option', () => {
    let s = startSession(makeLesson(3));
    const q = currentQuestion(s)!;
    const [bad] = wrongOf(q);
    s = pick(s, bad);
    expect(s.feedback).toBe('wrong');
    expect(s.discarded).toContain(bad);
    s = pick(s, q.answer);
    expect(s.firstTry).toBe(0);
  });

  it('removes the last wrong option as a hint after repeated mistakes', () => {
    let s = startSession(makeLesson(3));
    const q = currentQuestion(s)!;
    const wrong = wrongOf(q);
    for (let i = 0; i < HINT_AFTER; i++) s = pick(s, wrong[i]);
    expect(s.discarded.sort()).toEqual([...wrong].sort());
    expect(s.discarded).not.toContain(q.answer);
  });

  it('ignores repeated picks of a discarded option', () => {
    let s = startSession(makeLesson(3));
    const q = currentQuestion(s)!;
    const [bad] = wrongOf(q);
    s = pick(s, bad);
    const again = pick(s, bad);
    expect(again).toBe(s);
    expect(again.tries).toBe(1);
  });

  it('ignores values that are not options and picks after solving', () => {
    let s = startSession(makeLesson(3));
    const q = currentQuestion(s)!;
    expect(pick(s, 99)).toBe(s);
    s = pick(s, q.answer);
    expect(pick(s, wrongOf(q)[0])).toBe(s);
  });

  it('does not advance until the question is solved', () => {
    const s = startSession(makeLesson(3));
    expect(next(s)).toBe(s);
  });

  it('finishes after the last question and ignores further input', () => {
    let s = startSession(makeLesson(5));
    while (!s.done) {
      s = next(pick(s, currentQuestion(s)!.answer));
    }
    expect(s.firstTry).toBe(QUESTIONS_PER_LESSON);
    expect(next(s)).toBe(s);
    expect(pick(s, 1)).toBe(s);
  });

  it('handles an empty lesson as already finished', () => {
    expect(startSession([]).done).toBe(true);
  });
});

describe('stars', () => {
  it('gives 3 for a clean round, 2 for most, 1 otherwise', () => {
    expect(stars(5, 5)).toBe(3);
    expect(stars(3, 5)).toBe(2);
    expect(stars(4, 5)).toBe(2);
    expect(stars(2, 5)).toBe(1);
    expect(stars(0, 5)).toBe(1);
  });

  it('never returns less than 1 and tolerates an empty round', () => {
    expect(stars(0, 0)).toBe(1);
  });
});
