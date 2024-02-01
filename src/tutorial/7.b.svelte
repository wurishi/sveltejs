<script lang="ts">
    import Comp from './7.b_comp.svelte'

    let showComp = true

    function handleClick() {
        showComp = !showComp
    }

    let second
</script>

{#if showComp}
    <Comp bind:second />
{:else}
    <div>empty</div>
{/if}

{second}

<button on:click={handleClick}>toggle</button>
