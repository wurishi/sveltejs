<script lang="ts">
    import Inner from './5.d_inner.svelte'
    import { createEventDispatcher } from 'svelte'

    const dispatch = createEventDispatcher()

    function forward(event: CustomEvent) {
        dispatch('message', event.detail)
    }
</script>

<p>Outer Start</p>
<Inner on:message={forward} />
<p>Outer End</p>
