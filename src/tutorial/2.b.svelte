<script lang="ts">
    let count = 0

    function handleClick() {
        count += 1
    }

    $: timeStr = count === 1 ? 'time' : 'times'
</script>

<button on:click={handleClick}>
    Clicked {count} {timeStr}
</button>
