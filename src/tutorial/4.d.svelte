<script lang="ts">
    const cats = [
        { id: '1', name: 'Keyboard Cat' },
        { id: '2', name: 'Maru' },
    ]
</script>

<ul>
    {#each cats as cat, index}
        <li>
            {index} : {cat.name}
        </li>
    {/each}
</ul>
