<script lang="ts">
    async function getRandomNumber() {
        return new Promise<number>((resolve, reject) => {
            setTimeout(() => {
                resolve(Math.random())
            }, 1000)
        })
    }

    let promise = getRandomNumber()

    function handleClick() {
        promise = getRandomNumber()
    }
</script>

<button on:click={handleClick}>generate random number</button>

{#await promise}
    <p>...waiting</p>
{:then number}
    <p>The number is {number}</p>
{:catch error}
    <p style="color: red;">{error.message}</p>
{/await}

{#await promise then num}
    <p>The number is {num}</p>
{/await}
