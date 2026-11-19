<script lang="ts">
  let { count, total = 3, size = 44 }: { count: number; total?: number; size?: number } = $props();
</script>

<span class="stars" role="img" aria-label={`${count} de ${total} estrellas`}>
  {#each Array.from({ length: total }, (_, i) => i) as i (i)}
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" class:star--on={i < count} class="star">
      <path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.2 6.1 20.6l1.3-6.6L2.5 9.4l6.6-.8z" />
    </svg>
  {/each}
</span>
