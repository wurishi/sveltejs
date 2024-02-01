<script lang="ts">
    let html = `<p>Write some text!</p>`
</script>

<pre>{html}</pre>

<div contenteditable="true" bind:textContent={html} />

<div contenteditable="true" bind:innerHTML={html} />
