<script lang="ts">
  let hovering: boolean
  let footerID = 'ABCDE'

  function enter() {
    hovering = true
  }

  function leave() {
    hovering = false
  }
</script>

<div on:mouseenter={enter} on:mouseleave={leave}>
  <slot {hovering} />
</div>
{#if $$slots.footer}
  <div>
    This is footer: <slot name="footer" {footerID} />
  </div>
{/if}
