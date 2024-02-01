<script lang="ts">
    import Button from './5.f_button.svelte'

    function handleClick() {
        alert('button clicked')
    }
</script>

<Button on:click={handleClick} />
