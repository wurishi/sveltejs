<script lang="ts">
    let checked = false
</script>

<label>
    <input type="checkbox" bind:checked />
    Yes or No ?
</label>

{#if checked}
    You selected yes!!!
{/if}
