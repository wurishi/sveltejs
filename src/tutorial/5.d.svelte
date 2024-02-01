<script lang="ts">
    import Inner from './5.d_inner.svelte'
    import Inner2 from './5.d_inner2.svelte'

    function handleMessage(event: CustomEvent<{ text: string }>) {
        alert(event.detail.text)
    }
</script>

<Inner on:message={handleMessage} />

<Inner2 on:message={handleMessage} />
