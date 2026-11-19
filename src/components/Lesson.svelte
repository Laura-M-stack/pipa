<script lang="ts">
  import { tick } from 'svelte';
  import {
    HINT_AFTER,
    currentQuestion,
    makeLesson,
    next,
    pick,
    startSession,
    stars,
    type Session,
  } from '../lib/lesson';
  import { loadBest, saveBest } from '../lib/progress';
  import Mascot from './Mascot.svelte';
  import Items from './Items.svelte';
  import Stars from './Stars.svelte';

  const newSession = () => startSession(makeLesson(Math.floor(Math.random() * 2 ** 31)));

  let session = $state<Session>(newSession());
  let best = $state(loadBest());

  const q = $derived(currentQuestion(session));
  const total = $derived(session.questions.length);
  const earned = $derived(session.done ? stars(session.firstTry, total) : 0);
  const mood = $derived(session.done || session.feedback === 'correct' ? 'cheer' : session.feedback === 'wrong' ? 'think' : 'happy');

  const message = $derived.by(() => {
    if (!q) return '';
    if (session.feedback === 'correct') return `Muy bien. ${q.a} + ${q.b} es ${q.answer}.`;
    if (session.feedback === 'wrong') {
      return session.tries >= HINT_AFTER ? 'Casi. Te ayudo: saqué una opción.' : 'Casi. Prueba otra vez.';
    }
    return 'Cuenta las estrellas y las bolitas. ¿Cuántas hay en total?';
  });

  let heading = $state<HTMLElement>();
  let nextButton = $state<HTMLButtonElement>();
  let resultHeading = $state<HTMLElement>();

  async function choose(value: number) {
    session = pick(session, value);
    if (session.feedback === 'correct') {
      await tick();
      nextButton?.focus();
    }
  }

  async function advance() {
    session = next(session);
    if (session.done) {
      best = saveBest(stars(session.firstTry, total));
      await tick();
      resultHeading?.focus();
    } else {
      await tick();
      heading?.focus();
    }
  }

  async function again() {
    session = newSession();
    await tick();
    heading?.focus();
  }

  const tones = ['lilac', 'mint', 'peach'];
</script>

<section class="lesson clay" aria-labelledby="lesson-title">
  <div class="lesson__top">
    <h2 id="lesson-title" class="lesson__title">Cuenta con Pipa</h2>
    {#if !session.done}
      <p class="lesson__count">Pregunta {session.index + 1} de {total}</p>
      <ol class="dots" aria-hidden="true">
        {#each session.questions as _, i (i)}
          <li class="dot" class:dot--done={i < session.index} class:dot--now={i === session.index}></li>
        {/each}
      </ol>
    {/if}
  </div>

  {#if session.done}
    <div class="result">
      <Mascot mood="cheer" size={180} />
      <h3 class="result__title" tabindex="-1" bind:this={resultHeading}>¡Lo lograste!</h3>
      <Stars count={earned} size={56} />
      <p class="result__text">
        Respondiste {session.firstTry} de {total} a la primera.
        {#if best > 0}Tu mejor resultado en este dispositivo: {best} {best === 1 ? 'estrella' : 'estrellas'}.{/if}
      </p>
      <button type="button" class="btn btn--primary" onclick={again}>Jugar otra vez</button>
    </div>
  {:else if q}
    <div class="lesson__body">
      <Mascot {mood} size={150} class="lesson__mascot" />
      <div class="lesson__play">
        <h3 class="question" tabindex="-1" bind:this={heading} aria-label={`${q.a} más ${q.b}`}>
          <span aria-hidden="true">{q.a} + {q.b} = ?</span>
        </h3>
        <Items a={q.a} b={q.b} />
        <div class="options" role="group" aria-label="Respuestas posibles">
          {#each q.options as o, i (o)}
            <button
              type="button"
              class={`clay option option--${tones[i % tones.length]}`}
              class:option--right={session.feedback === 'correct' && o === q.answer}
              disabled={session.discarded.includes(o) || session.feedback === 'correct'}
              onclick={() => choose(o)}
            >
              {o}
            </button>
          {/each}
        </div>
        <p class="feedback" class:feedback--ok={session.feedback === 'correct'} role="status" aria-live="polite">{message}</p>
        <div class="lesson__actions">
          {#if session.feedback === 'correct'}
            <button type="button" class="btn btn--primary" bind:this={nextButton} onclick={advance}>
              {session.index + 1 === total ? 'Ver mis estrellas' : 'Siguiente'}
            </button>
          {/if}
        </div>
      </div>
    </div>
  {/if}
</section>
