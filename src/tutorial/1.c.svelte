<script lang="ts">
    const src = '/vite.svg'

    import src2 from '../assets/svelte.svg'
</script>

<img {src} title="link is {src}" />
<img src={src2} />
