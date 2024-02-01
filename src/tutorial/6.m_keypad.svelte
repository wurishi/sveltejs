<script lang="ts">
    import { createEventDispatcher } from 'svelte'

    export let value = ''

    const dispatch = createEventDispatcher()

    const select = (num: number) => () => (value += num)
    const clear = () => (value = '')
    const submit = () => dispatch('submit')

    const padArr = new Array(9).fill(0)
</script>

<div class="keypad">
    {#each padArr as pad, i (i)}
        <button on:click={select(i + 1)}>{i + 1}</button>
    {/each}

    <button disabled={!value} on:click={clear}>clear</button>
    <button on:click={select(0)}>0</button>
    <button disabled={!value} on:click={submit}>submit</button>
</div>

<style>
    .keypad {
        display: grid;
        grid-template-columns: repeat(3, 5em);
        grid-template-rows: repeat(4, 3em);
        grid-gap: 0.5em;
    }

    button {
        margin: 0;
    }
</style>
