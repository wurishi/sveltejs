<script lang="ts">
  import RedThing from './16.b_red.svelte'
  import GreenThing from './16.b_green.svelte'
  import BlueThing from './16.b_blue.svelte'

  const options = [
    { color: 'red', component: RedThing },
    { color: 'green', component: GreenThing },
    { color: 'blue', component: BlueThing },
  ]

  let selected = options[0]
</script>

<select bind:value={selected}>
  {#each options as option (option.color)}
    <option value={option}>{option.color}</option>
  {/each}
</select>

<!-- {#if selected.color === 'red'}
  <RedThing />
{:else if selected.color === 'green'}
  <GreenThing />
{:else if selected.color === 'blue'}
  <BlueThing />
{/if} -->

<svelte:component this={selected.component} />
