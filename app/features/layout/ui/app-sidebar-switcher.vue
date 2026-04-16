<script setup lang="ts">
import { breakpointsTailwind } from "@vueuse/core"
import { useLayoutStore } from "~/entities/layout"

const store = useLayoutStore()
const breakpoints = useBreakpoints(breakpointsTailwind)
const isDesktop = breakpoints.greaterOrEqual("lg")

const toggle = () => {
  if (isDesktop.value) store.sidebarIsCollapsed = !store.sidebarIsCollapsed
  else store.sidebarIsShown = !store.sidebarIsShown
}
</script>

<template>
  <ui-icon-button
    variant="white"
    color="secondary"
    icon-class="text-xl"
    icon-name="solar:sidebar-minimalistic-bold-duotone"
    :label="$t('actions.toggle_sidebar')"
    @click="toggle"
  />
</template>
