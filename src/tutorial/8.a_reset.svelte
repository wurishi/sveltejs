<script lang="ts">
    import { count } from './8.a_stores'

    function reset() {
        count.set(0)
    }
</script>

<button on:click={reset}>reset</button>
