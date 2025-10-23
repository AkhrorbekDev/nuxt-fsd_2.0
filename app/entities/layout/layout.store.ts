export const useLayoutStore = defineStore("layout", () => {
  const sidebarIsShown = ref(false)
  const sidebarIsCollapsed = useSessionStorage("sidebar-is-collapsed", false)
  const contentLgMargin = computed(() => (sidebarIsCollapsed.value ? "lg:ml-16" : "lg:ml-64"))

  return { sidebarIsShown, sidebarIsCollapsed, contentLgMargin }
})
