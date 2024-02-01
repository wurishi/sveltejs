<script lang="ts">
  import Component from './15.a_c.svelte'
  import Child from './15.a_sub.svelte'

  let lazy = false
</script>

<Component>
  <Child />
  <div>Lazy:</div>
  <hr />
  {#if lazy}
    <Child />
  {/if}
</Component>

<button on:click={() => (lazy = true)}>Show Lazy Child</button>
{#if lazy}
  <Child />
{/if}
