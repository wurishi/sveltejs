<script lang="ts" context="module">
  let current: HTMLAudioElement

  const elements = new Set<HTMLAudioElement>()

  export function stopAll() {
    elements.forEach((element) => {
      element.pause()
    })
  }
</script>

<script lang="ts">
  import { onMount } from 'svelte'

  export let src: string
  export let title: string
  export let composer: string
  export let performer: string

  let audio: HTMLAudioElement
  let paused = true

  function stopOthers() {
    if (current && current !== audio) {
      current.pause()
    }
    current = audio
  }

  onMount(() => {
    elements.add(audio)
    return () => elements.delete(audio)
  })
</script>

<article class:playing={!paused}>
  <h2>{title}</h2>
  <p>
    <strong>{composer}</strong> / performed by {performer}
  </p>
  <audio bind:this={audio} bind:paused on:play={stopOthers} controls {src} />
</article>

<style>
  article {
    margin: 0 0 1em 0;
    max-width: 800px;
  }
  h2,
  p {
    margin: 0 0 0.3em 0;
  }
  audio {
    width: 100%;
    margin: 0.5em 0 1em 0;
  }
  .playing {
    color: #ff3e00;
  }
</style>
