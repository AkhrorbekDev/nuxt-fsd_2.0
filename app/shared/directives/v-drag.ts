import type { Directive } from "vue"

interface TriggerStore {
  cursor: string
  top: string
  left: string
}

const getTrigger = (el: HTMLElement) => {
  const trigger = <HTMLElement>el.querySelector("[name='drag-trigger']") || el
  const store = {
    cursor: trigger.style.cursor,
    top: trigger.style.top,
    left: trigger.style.left
  }

  return { trigger, store }
}

const onResize = (el: HTMLElement, store: TriggerStore) => {
  el.style.top = store.top
  el.style.left = store.left
}

const onMouseDown = (e: MouseEvent, el: HTMLElement, trigger: HTMLElement, store: TriggerStore) => {
  const shiftX = e.pageX - el.offsetLeft
  const shiftY = e.pageY - el.offsetTop

  const moveAt = (pageX: number, pageY: number) => {
    const newX = pageX - shiftX
    const newY = pageY - shiftY

    const maxLeft = window.innerWidth - el.offsetWidth
    const maxTop = window.innerHeight - el.offsetHeight

    el.style.left = Math.min(Math.max(0, newX), maxLeft) + "px"
    el.style.top = Math.min(Math.max(0, newY), maxTop) + "px"
  }

  const onMouseMove = (event: MouseEvent) => moveAt(event.pageX, event.pageY)
  document.addEventListener("mousemove", onMouseMove)
  window.addEventListener("resize", () => onResize(el, store))

  const onMouseUp = () => {
    el.style.userSelect = "auto"
    trigger.style.cursor = store.cursor
    window.removeEventListener("mouseup", onMouseUp)
    document.removeEventListener("mousemove", onMouseMove)
  }

  el.style.position = "absolute"
  el.style.userSelect = "none"
  trigger.style.cursor = "grabbing"
  window.addEventListener("mouseup", onMouseUp)
}

export const vDrag: Directive = {
  beforeMount(el: HTMLElement) {
    const { trigger, store } = getTrigger(el)
    trigger.addEventListener("mousedown", (e) => onMouseDown(e, el, trigger, store))
  },

  beforeUnmount(el: HTMLElement) {
    const { trigger, store } = getTrigger(el)
    trigger.removeEventListener("mousedown", (e) => onMouseDown(e, el, trigger, store))
    window.removeEventListener("resize", () => onResize(el, store))
  }
}
