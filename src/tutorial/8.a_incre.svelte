<script lang="ts">
    import { count } from './8.a_stores'

    function increment() {
        count.update((c) => c + 1)
    }
</script>

<button on:click={increment}>+</button>
