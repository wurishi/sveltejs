<script lang="ts">
  import { name, greeting } from './8.f_store'
</script>

<h1>{$greeting}</h1>
<input bind:value={$name} />

<button on:click={() => ($name += '!')}>Add exclamation mark!</button>
