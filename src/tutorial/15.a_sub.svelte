<script lang="ts">
  import { key } from './15.a_contextprovide'
  import { getContext } from 'svelte'

  const data = getContext(key)
</script>

<span>{JSON.stringify(data)}</span>
