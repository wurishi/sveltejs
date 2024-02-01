<script lang="ts">
    import { createEventDispatcher } from 'svelte'

    let dispatch
    setTimeout(() => {
        dispatch = createEventDispatcher()
        console.log('time out finish')
    }, 1000)

    function handleMessage() {
        dispatch?.('message', { text: 'Hello2' })
    }
</script>

<button on:click={handleMessage}>Click 2</button>
