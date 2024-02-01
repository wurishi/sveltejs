<script lang="ts">
    let m = { x: 0, y: 0 }

    function handleMouseMove(event: MouseEvent) {
        m.x = event.clientX
        m.y = event.clientY
    }
</script>

<div on:mousemove="{(evt) => { m.x = evt.clientX }}">
    The mouse position is {m.x} - {m.y}
</div>

<style>
    div {
        width: 100%;
        padding: 50px;
        background-color: grey;
    }
</style>
