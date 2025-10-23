import type { Ref } from "vue"

export const useInfinite = (el: Ref<HTMLElement>, load = async () => {}) => {
  const loading = ref<boolean>(false)
  const observer = ref<IntersectionObserver>()

  const infiniteScroll = useDebounceFn(async ([{ isIntersecting, target }]: IntersectionObserverEntry[]) => {
    if (!isIntersecting) return
    if (target instanceof HTMLElement) {
      loading.value = true
      const parent = target.offsetParent!
      const scrollTop = parent?.scrollTop!
      await load()
      await nextTick()
      parent.scrollTop = scrollTop
      loading.value = false
    }
  }, 300)

  const observe = async () => {
    await nextTick()
    observer.value?.observe(el.value)
  }

  const disconnect = () => observer.value?.disconnect()

  const restart = () => {
    loading.value = false
    disconnect()
  }

  onMounted(() => {
    observer.value = new IntersectionObserver(infiniteScroll, { root: null, rootMargin: "0px", threshold: 0.1 })
  })

  onBeforeUnmount(() => restart())

  return { loading, observe, disconnect, restart }
}
