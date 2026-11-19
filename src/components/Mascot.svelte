<script lang="ts">
  type Mood = 'happy' | 'cheer' | 'think';
  let { mood = 'happy', size = 220, class: className = '' }: { mood?: Mood; size?: number; class?: string } = $props();

  const mouths: Record<Mood, string> = {
    happy: 'M82 128q18 14 36 0',
    cheer: 'M78 122q22 28 44 0z',
    think: 'M86 134q14-6 28 0',
  };
</script>

<svg
  class={`mascot mascot--${mood} ${className}`}
  width={size}
  height={size}
  viewBox="0 0 200 200"
  role="img"
  aria-label="Pipa, una semillita lila con una hoja verde"
>
  <defs>
    <radialGradient id="pipa-body" cx="35%" cy="30%" r="80%">
      <stop offset="0" stop-color="#d9ccff" />
      <stop offset="0.6" stop-color="#b9a2ff" />
      <stop offset="1" stop-color="#9a80f2" />
    </radialGradient>
  </defs>
  <ellipse cx="100" cy="184" rx="52" ry="8" fill="#5e40a0" opacity="0.14" />
  <path
    d="M100 176c-44 0-70-30-70-68 0-42 30-70 70-70s70 28 70 70c0 38-26 68-70 68z"
    fill="url(#pipa-body)"
  />
  <path d="M62 62c10-14 26-20 40-18" fill="none" stroke="#fff" stroke-width="9" stroke-linecap="round" opacity="0.55" />
  <g class="mascot__leaf">
    <path d="M100 40c0-22 12-34 34-36-2 22-14 34-34 36z" fill="#5fd3a4" />
    <path d="M100 40c8-10 16-18 28-28" fill="none" stroke="#2f9c74" stroke-width="3" stroke-linecap="round" />
  </g>
  <ellipse cx="62" cy="116" rx="12" ry="8" fill="#ffb59a" opacity="0.8" />
  <ellipse cx="138" cy="116" rx="12" ry="8" fill="#ffb59a" opacity="0.8" />
  <g class="mascot__eyes">
    <circle cx="76" cy="98" r="13" fill="#fff" />
    <circle cx="124" cy="98" r="13" fill="#fff" />
    <circle cx="79" cy="100" r="7" fill="#2d1b4e" />
    <circle cx="127" cy="100" r="7" fill="#2d1b4e" />
    <circle cx="81" cy="97" r="2.4" fill="#fff" />
    <circle cx="129" cy="97" r="2.4" fill="#fff" />
  </g>
  <path
    d={mouths[mood]}
    fill={mood === 'cheer' ? '#7a2e55' : 'none'}
    stroke="#2d1b4e"
    stroke-width="5"
    stroke-linecap="round"
    stroke-linejoin="round"
  />
</svg>
