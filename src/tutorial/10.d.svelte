<script lang="ts">
  let visible = true

  function fade(node, options?) {
    const { delay = 0, duration = 400 } = options
    const o = +getComputedStyle(node).opacity

    return {
      delay,
      duration,
      css: (t) => `opacity: ${t * o}`,
    }
  }
</script>

<label>
  <input type="checkbox" bind:checked={visible} />visible
</label>

{#if visible}
  <p transition:fade>transitions!</p>
{/if}
