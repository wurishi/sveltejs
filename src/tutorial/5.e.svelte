<script lang="ts">
    import Outer from './5.e_outer.svelte'

    function handleMessage(event: CustomEvent<{ text: string }>) {
        alert(event.detail.text)
    }
</script>

<Outer on:message={handleMessage} />
