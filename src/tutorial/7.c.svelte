<script lang="ts">
    import { onMount, beforeUpdate } from 'svelte'

    let div: HTMLDivElement

    onMount(() => {
        console.log('onMount', div)
    })

    beforeUpdate(() => {
        console.log('beforeUpdate', div)
    })
</script>

<div bind:this={div} />
