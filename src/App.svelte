<script lang="ts">
  import Mascot from './components/Mascot.svelte';
  import Lesson from './components/Lesson.svelte';

  const portfolio = 'https://laura-m-stack.github.io/laura-portfolio/';

  const steps = [
    { tone: 'lilac', title: 'Mira y cuenta', text: 'Cada pregunta muestra estrellas y bolitas para contar con los ojos y con el dedo.' },
    { tone: 'mint', title: 'Elige la respuesta', text: 'Tres opciones grandes. Si te equivocas, Pipa te deja intentar de nuevo, sin castigos.' },
    { tone: 'peach', title: 'Gana estrellas', text: 'Al terminar cinco preguntas, Pipa cuenta tus estrellas y te invita a jugar otra vez.' },
  ];

  const family = [
    'Sin anuncios ni compras dentro de la app.',
    'Sin cuentas para chicos ni chats con desconocidos.',
    'Lecciones de unos cinco minutos, para jugar sin pantallas eternas.',
    'El progreso se guarda solo en el dispositivo.',
  ];
</script>

<a class="skip" href="#leccion">Saltar a la lección</a>

<div class="demo" role="note">
  Sitio de demostración: Pipa es una app ficticia. Diseño y desarrollo:
  <a href={portfolio} target="_blank" rel="noopener noreferrer">Laura Moyano</a>
</div>

<header class="header">
  <div class="container header__inner">
    <a class="brand" href="#inicio" aria-label="Pipa, inicio">
      <span class="brand__mark" aria-hidden="true"><Mascot size={40} /></span>
      <span class="brand__name">Pipa</span>
    </a>
    <nav class="nav" aria-label="Principal">
      <a href="#como-funciona">Cómo funciona</a>
      <a href="#familias">Para familias</a>
    </nav>
    <a class="btn btn--primary btn--small" href="#leccion">Jugar</a>
  </div>
</header>

<main id="inicio">
  <section class="hero">
    <div class="container hero__inner">
      <div class="hero__copy">
        <p class="eyebrow">Matemática para chicos de 5 a 8 años</p>
        <h1 class="hero__title">Aprender a sumar es un juego.</h1>
        <p class="hero__lead">
          Pipa es una semillita curiosa que te acompaña con lecciones cortas, colores suaves y mucha paciencia.
        </p>
        <div class="hero__cta">
          <a class="btn btn--primary" href="#leccion">Probar una lección</a>
          <a class="btn btn--ghost" href="#familias">Para familias</a>
        </div>
      </div>
      <div class="hero__art" aria-hidden="true">
        <span class="blob blob--mint"></span>
        <span class="blob blob--peach"></span>
        <span class="blob blob--sun"></span>
        <div class="hero__stage clay"><Mascot size={260} /></div>
      </div>
    </div>
  </section>

  <section id="leccion" class="section section--lesson">
    <div class="container">
      <Lesson />
    </div>
  </section>

  <section id="como-funciona" class="section" aria-labelledby="como-title">
    <div class="container">
      <h2 id="como-title" class="section__title">Tres pasos, cinco minutos</h2>
      <ol class="steps">
        {#each steps as s, i (s.title)}
          <li class={`step clay step--${s.tone}`}>
            <span class="step__num" aria-hidden="true">{i + 1}</span>
            <h3 class="step__title">{s.title}</h3>
            <p>{s.text}</p>
          </li>
        {/each}
      </ol>
    </div>
  </section>

  <section id="familias" class="section" aria-labelledby="fam-title">
    <div class="container">
      <div class="family clay">
        <h2 id="fam-title" class="section__title">Para familias</h2>
        <p class="family__lead">Pensada para que los adultos puedan relajarse mientras los chicos juegan.</p>
        <ul class="family__list">
          {#each family as item (item)}
            <li>{item}</li>
          {/each}
        </ul>
      </div>
    </div>
  </section>
</main>

<footer class="footer">
  <div class="container footer__inner">
    <p class="footer__name">Pipa</p>
    <p class="footer__small">Sitio de demostración. Pipa es una app ficticia. Diseño y desarrollo: Laura Moyano.</p>
  </div>
</footer>
