export function longpress(node: HTMLElement, duration: number) {
  let timer

  const handleMousedown = () => {
    timer = setTimeout(() => {
      node.dispatchEvent(new CustomEvent('longpress'))
    }, duration)
  }

  const handleMouseup = () => {
    clearTimeout(timer)
  }

  node.addEventListener('mousedown', handleMousedown)
  node.addEventListener('mouseup', handleMouseup)

  return {
    destroy() {
      node.removeEventListener('mousedown', handleMousedown)
      node.removeEventListener('mouseup', handleMouseup)
    },
    update(newDuration) {
      duration = newDuration
    },
  }
}
