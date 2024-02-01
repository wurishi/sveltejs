<script lang="ts">
    import Component from './4.e_comp.svelte'

    let list = [
        { id: 1, color: '#0d0887' },
        { id: 2, color: '#6a00a8' },
        { id: 3, color: '#b12a90' },
        { id: 4, color: '#e16462' },
        { id: 5, color: '#fca636' },
    ]

    function handleClick() {
        list = list.slice(1)
    }
</script>

<button on:click={handleClick}>Remove first thing</button>

{#each list as item (item.id)}
    <Component current={item.color} />
{/each}
