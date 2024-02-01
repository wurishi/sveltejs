<script lang="ts">
    let time = 0
    let duration
    let paused = true

    let showControls = true
    let showControlsTimeout

    function handleMousemove(e: MouseEvent) {
        clearTimeout(showControlsTimeout)
        showControlsTimeout = setTimeout(() => (showControls = false), 2500)
        showControls = true

        if (!(e.buttons & 1)) return
        if (!duration) return

        const { left, right } = this.getBoundingClientRect()
        time = (duration * (e.clientX - left)) / (right - left)
    }

    function handleMousedown(e: MouseEvent) {
        function handleMouseup() {
            const video = e.target as HTMLVideoElement
            if (paused) video?.play()
            else video?.pause()
            cancel()
        }

        function cancel() {
            e.target.removeEventListener('mouseup', handleMouseup)
        }

        e.target.addEventListener('mouseup', handleMouseup)

        setTimeout(cancel, 200)
    }

    function format(seconds: any) {
        if (isNaN(seconds)) return '...'

        const minutes = Math.floor(seconds / 60)
        seconds = Math.floor(seconds % 60)
        if (seconds < 10) seconds = '0' + seconds

        return `${minutes}:${seconds}`
    }
</script>

<h1>Caminandes: Llamigos</h1>
<p>
    From <a href="https://cloud.blender.org/open-projects"
        >Blender Open Projects</a
    >. CC-BY
</p>

<div>
    <!-- svelte-ignore a11y-media-has-caption -->
    <video
        poster="/vite.svg"
        src="/video.ogm"
        on:mousemove={handleMousemove}
        on:mousedown={handleMousedown}
        bind:currentTime={time}
        bind:duration
        bind:paused
    />

    <div class="controls" style="opacity: {duration && showControls ? 1 : 0}">
        <progress value={time / duration || 0} />

        <div class="info">
            <span class="time">{format(time)}</span>
            <span
                >click anywhere to {paused ? 'play' : 'pause'} / drag to seek</span
            >
            <span class="time">{format(duration)}</span>
        </div>
    </div>
</div>

<style>
    div {
        position: relative;
    }

    .controls {
        position: absolute;
        top: 0;
        width: 100%;
        transition: opacity 1s;
    }

    .info {
        display: flex;
        width: 100%;
        justify-content: space-between;
    }

    span {
        padding: 0.2em 0.5em;
        color: white;
        text-shadow: 0 0 8px black;
        font-size: 1.4em;
        opacity: 0.7;
    }

    .time {
        width: 3em;
    }

    .time:last-child {
        text-align: right;
    }

    progress {
        display: block;
        width: 100%;
        height: 10px;
        -webkit-appearance: none;
        appearance: none;
    }

    progress::-webkit-progress-bar {
        background-color: rgba(0, 0, 0, 0.2);
    }

    progress::-webkit-progress-value {
        background-color: rgba(255, 255, 255, 0.6);
    }

    video {
        width: 100%;
    }
</style>
