<script lang="ts">
    let count = 0

    function handleClick() {
        count += 1
    }

    $: console.log(`the count is ${count}`)

    $: {
        const doubleCount = count * 2
        console.log(`the doubleCount is ${doubleCount}`)
    }

    $: if (count >= 10) {
        alert('count is dangerously high!')
        count = 9
    }
</script>

<button on:click={handleClick}>
    Clicked {count}
</button>
