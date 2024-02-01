<script lang="ts">
    import { onDestroy } from 'svelte'
    export let second = 0

    const interval = setInterval(() => {
        second += 1
    }, 1000)

    onDestroy(() => {
        interval && clearInterval(interval)
    })
</script>
