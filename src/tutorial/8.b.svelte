<script lang="ts">
    import { count } from './8.a_stores'
    import Incre from './8.a_incre.svelte'
    import Decre from './8.a_decre.svelte'
    import Reset from './8.a_reset.svelte'

    $: console.log($count)
</script>

<h1>The count is {$count}</h1>

<Incre />
<Decre />
<Reset />
