<script lang="ts">
    import { count } from './8.a_stores'

    function decrement() {
        count.update((c) => c - 1)
    }
</script>

<button on:click={decrement}>-</button>
