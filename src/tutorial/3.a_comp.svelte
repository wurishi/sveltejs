<script lang="ts">
    export let answer

    $: console.log('所有传递过来的属性：', $$props)
</script>

<p>The answer is {answer}</p>
