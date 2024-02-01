<script lang="ts">
  import { setContext } from 'svelte'
  import { key, data } from './15.a_contextprovide'

  setContext(key, data)
</script>

<span>Set Context</span>
<div><slot /></div>
