<script lang="ts">
    import Component from './3.a_comp.svelte'

    const props = {
        name: 'hello',
        answer: 99
    }
</script>

<Component {...props} />