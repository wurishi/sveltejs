<script lang="ts">
    import { time } from './8.c_store'

    let timeStr = ''

    let toggle = false
    let unsubscribe

    function timeToggle() {
        toggle = !toggle
        if (toggle) {
            unsubscribe = time.subscribe((timeValue) => {
                timeStr = timeValue && timeValue.toTimeString()
            })
        } else {
            unsubscribe && unsubscribe()
            unsubscribe = undefined
        }
    }
</script>

<button on:click={timeToggle}>toggle</button>
<h1>The time is {timeStr}</h1>
