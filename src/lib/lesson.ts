/**
 * Lesson logic for the "Cuenta con Pipa" demo: addition up to 10, five questions per round.
 * Everything here is pure and deterministic given a seed, so it is easy to test and the UI
 * stays a thin layer on top.
 */

export const QUESTIONS_PER_LESSON = 5;
export const MAX_SUM = 10;
export const OPTION_COUNT = 3;
/** After this many wrong tries on one question, one wrong option is taken away as a hint. */
export const HINT_AFTER = 2;

export type Question = {
  a: number;
  b: number;
  answer: number;
  /** Always contains `answer` exactly once, in shuffled order. */
  options: number[];
};

/** Small seedable PRNG (mulberry32). Returns numbers in [0, 1). */
export function rng(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function int(next: () => number, min: number, max: number): number {
  return min + Math.floor(next() * (max - min + 1));
}

function shuffle<T>(items: T[], next: () => number): T[] {
  const out = items.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(next() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export function makeQuestion(next: () => number): Question {
  const a = int(next, 1, MAX_SUM - 1);
  const b = int(next, 1, MAX_SUM - a);
  const answer = a + b;

  // Wrong options stay close to the answer (off by 1 or 2) so the child has to actually count.
  const pool: number[] = [];
  for (const d of [-2, -1, 1, 2]) {
    const v = answer + d;
    if (v >= 1 && v <= MAX_SUM) pool.push(v);
  }
  const wrong = shuffle(pool, next).slice(0, OPTION_COUNT - 1);
  return { a, b, answer, options: shuffle([answer, ...wrong], next) };
}

/** Builds a lesson with no repeated sums, so consecutive questions never feel the same. */
export function makeLesson(seed: number, count = QUESTIONS_PER_LESSON): Question[] {
  const next = rng(seed);
  const seen = new Set<string>();
  const out: Question[] = [];
  let guard = 0;
  while (out.length < count && guard++ < 500) {
    const q = makeQuestion(next);
    const key = `${Math.min(q.a, q.b)}+${Math.max(q.a, q.b)}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(q);
  }
  return out;
}

export type Feedback = 'none' | 'correct' | 'wrong';

export type Session = {
  questions: Question[];
  index: number;
  /** Wrong tries on the current question. */
  tries: number;
  /** Options already discarded on the current question (wrong picks and hints). */
  discarded: number[];
  /** Questions answered right on the first try. */
  firstTry: number;
  feedback: Feedback;
  done: boolean;
};

export function startSession(questions: Question[]): Session {
  return {
    questions,
    index: 0,
    tries: 0,
    discarded: [],
    firstTry: 0,
    feedback: 'none',
    done: questions.length === 0,
  };
}

export function currentQuestion(s: Session): Question | undefined {
  return s.questions[s.index];
}

/** Applies the child's pick. Ignores picks after the lesson ends or for options already discarded. */
export function pick(s: Session, value: number): Session {
  const q = currentQuestion(s);
  if (s.done || !q || s.feedback === 'correct' || s.discarded.includes(value)) return s;
  if (!q.options.includes(value)) return s;

  if (value === q.answer) {
    return { ...s, feedback: 'correct', firstTry: s.firstTry + (s.tries === 0 ? 1 : 0) };
  }

  const tries = s.tries + 1;
  let discarded = [...s.discarded, value];
  if (tries >= HINT_AFTER) {
    const spare = q.options.find((o) => o !== q.answer && !discarded.includes(o));
    if (spare !== undefined) discarded = [...discarded, spare];
  }
  return { ...s, tries, discarded, feedback: 'wrong' };
}

/** Moves on after a correct answer. Does nothing until the question is solved. */
export function next(s: Session): Session {
  if (s.done || s.feedback !== 'correct') return s;
  const index = s.index + 1;
  return {
    ...s,
    index,
    tries: 0,
    discarded: [],
    feedback: 'none',
    done: index >= s.questions.length,
  };
}

/** 3 stars for a clean round, 2 for most, 1 for finishing, never 0: finishing always counts. */
export function stars(firstTry: number, total: number): 1 | 2 | 3 {
  if (total <= 0) return 1;
  if (firstTry === total) return 3;
  if (firstTry / total >= 0.6) return 2;
  return 1;
}
