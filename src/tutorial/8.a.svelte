<script lang="ts">
    import { onDestroy } from 'svelte'
    import { count } from './8.a_stores'
    import Incre from './8.a_incre.svelte'
    import Decre from './8.a_decre.svelte'
    import Reset from './8.a_reset.svelte'

    let count_value: number

    const unsubscribe = count.subscribe((value) => {
        count_value = value
    })

    onDestroy(unsubscribe)
</script>

<h1>The count is {count_value}</h1>

<Incre />
<Decre />
<Reset />
