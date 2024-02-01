<script lang="ts">
    let numbers = [1, 2, 3, 4]
    let obj: Record<string, string> = {}

    function addNumber() {
        numbers.push(numbers.length + 1)
        numbers = numbers
    }

    function firstZero() {
        numbers[0] = 0
    }

    function addName() {
        obj.name = 'xxl'
    }

    function removeName() {
        delete obj.name
    }

    $: sum = numbers.reduce((t, n) => t + n, 0)
</script>

<p>{numbers.join(' + ')} = {sum}</p>

<button on:click={addNumber}> Add a number </button>
<button on:click={firstZero}>First zero</button>

<p>{JSON.stringify(obj)}</p>
<button on:click={addName}>Obj add name</button>
<button on:click={removeName}>Remove name</button>
