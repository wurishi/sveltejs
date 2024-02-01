<script lang="ts">
    let scoops = 1
    let flavours = ['Mint choc chip']

    $: flavourStr = flavours.length === 1 ? flavours[0] : flavours.join(', ')
</script>

<h2>Sizes</h2>

{#each ['One scoop', 'Two scoops', 'Three scoops'] as scoop, i (scoop)}
    <label>
        <input type="radio" bind:group={scoops} value={i + 1} />
        {scoop}
    </label>
{/each}

<h2>Flavours</h2>

{#each ['Cookies and cream', 'Mint choc chip', 'Raspberry ripple'] as flavour (flavour)}
    <label>
        <input type="checkbox" bind:group={flavours} value={flavour} />
        {flavour}
    </label>
{/each}

<p>
    You ordered {scoops}
    {scoops === 1 ? 'scoop' : 'scoops'}
    of {flavourStr}
</p>
