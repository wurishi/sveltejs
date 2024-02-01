<script lang="ts">
  import Hoverable from './14.e_hoverable.svelte'
</script>

<Hoverable let:hovering>
  <div class:active={hovering}>
    {#if hovering}
      <p>I am being hovered upon.</p>
    {:else}
      <p>Hover over me!</p>
    {/if}
  </div>
  <div slot="footer" let:footerID>FooterID: {footerID}</div>
</Hoverable>

<style>
  div {
    padding: 1em;
    margin: 0 0 1em 0;
    background-color: #eee;
  }

  .active {
    background-color: #ff3e00;
    color: white;
  }
</style>
