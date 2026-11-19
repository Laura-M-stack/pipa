<script lang="ts">
  /** Draws `a` + `b` as two groups of shapes so a child can count them. Purely decorative. */
  let { a, b }: { a: number; b: number } = $props();

  const range = (n: number) => Array.from({ length: n }, (_, i) => i);
</script>

<div class="items" aria-hidden="true">
  <div class="items__group">
    {#each range(a) as i (i)}
      <svg class="item item--star" viewBox="0 0 24 24"><path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.2 6.1 20.6l1.3-6.6L2.5 9.4l6.6-.8z" /></svg>
    {/each}
  </div>
  <span class="items__plus">+</span>
  <div class="items__group">
    {#each range(b) as i (i)}
      <svg class="item item--dot" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9.5" /></svg>
    {/each}
  </div>
</div>
