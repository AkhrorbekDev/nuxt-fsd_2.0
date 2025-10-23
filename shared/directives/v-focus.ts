import type { Directive } from "vue"

export const vFocus: Directive = {
  mounted(el: HTMLElement) {
    setTimeout(() => el.querySelector("input")?.focus(), 100)
  }
}
