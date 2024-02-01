<script lang="ts">
    import { tick } from 'svelte'

    let text = `Select some text and hit the tab key to toggle uppercase`

    async function handleKeydown(event: KeyboardEvent) {
        if (event.which !== 9) return

        event.preventDefault()

        const { selectionStart, selectionEnd, value } =
            this as HTMLTextAreaElement

        const selection = value.slice(selectionStart, selectionEnd)

        const replacement = /[a-z]/.test(selection)
            ? selection.toUpperCase()
            : selection.toLowerCase()

        text =
            value.slice(0, selectionStart) +
            replacement +
            value.slice(selectionEnd)

        await tick()

        const that = this as HTMLTextAreaElement

        that.selectionStart = selectionStart
        that.selectionEnd = selectionEnd
    }
</script>

<textarea value={text} on:keydown={handleKeydown} />

<style>
    textarea {
        width: 100%;
        height: 200px;
    }
</style>
