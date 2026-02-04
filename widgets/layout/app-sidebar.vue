<script setup lang="ts">
import { breakpointsTailwind } from "@vueuse/core"
import { useLayoutStore } from "@@/entities/layout"

import type { SidebarItem } from "vue-sidebar-menu"
import type { SidebarMenuList } from "@@/entities/layout"

// Components
import Logo from "#shared/assets/svg/logo.svg"
import { SidebarMenu } from "vue-sidebar-menu"

const { t } = useI18n()
const store = useLayoutStore()
const localePath = useLocalePath()
const breakpoints = useBreakpoints(breakpointsTailwind)

const isLaptop = breakpoints.greaterOrEqual("lg")
const isCollapsed = ref(store.sidebarIsCollapsed || false)

const menu = computed<SidebarMenuList>(() => [
  {
    title: t("labels.home"),
    icon: { element: "icon", class: "text-xl", attributes: { name: "solar:home-2-bold-duotone" } },
    href: localePath("/")
  },
  {
    title: t("labels.users"),
    icon: { element: "icon", class: "text-xl", attributes: { name: "solar:user-circle-bold-duotone" } },
    href: localePath("/users")
  },
  {
    title: t("labels.roles"),
    icon: { element: "icon", class: "text-xl", attributes: { name: "solar:shield-up-bold-duotone" } },
    href: localePath("/roles")
  }
])

const onOverlayClick = () => (store.sidebarIsShown = false)

const onItemClick = (event: Event, item: SidebarItem) => {
  if (item.href) store.sidebarIsShown = false
}

const onMouseOver = () => {
  if (store.sidebarIsCollapsed) isCollapsed.value = false
}

const onMouseOut = () => {
  if (store.sidebarIsCollapsed) isCollapsed.value = true
}

watch(
  () => store.sidebarIsCollapsed,
  (value) => (isCollapsed.value = value || false)
)

watch(isLaptop, (value) => {
  if (store.sidebarIsCollapsed) {
    store.sidebarIsCollapsed = value
    isCollapsed.value = value
  }
})
</script>

<template>
  <div @mouseenter="onMouseOver" @mouseleave="onMouseOut">
    <transition name="app-sidebar-slide" mode="out-in">
      <sidebar-menu
        v-show="store.sidebarIsShown"
        class="app-sidebar lg:!flex"
        hide-toggle
        disable-hover
        width="256px"
        width-collapsed="64px"
        :menu="menu"
        :collapsed="isCollapsed"
        @item-click="onItemClick"
      >
        <template #header>
          <div class="app-sidebar-header">
            <nuxt-link-locale class="flex shrink-0 items-center gap-3" to="/">
              <logo class="ml-0.5 size-9" />

              <transition name="fade">
                <div v-if="!isCollapsed" class="grid h-9">
                  <h3 class="grow truncate text-xl leading-none font-bold uppercase">{{ $t("labels.app_name") }}</h3>

                  <p class="flex items-center gap-1 text-xs uppercase">
                    <span>{{ $t("labels.admin") }}</span>
                    <span v-if="$config.public.isDev" class="animate-pulse font-bold text-success-600">DEV</span>
                  </p>
                </div>
              </transition>
            </nuxt-link-locale>
          </div>
        </template>

        <template #dropdown-icon>
          <icon class="text-lg" name="lucide:chevron-right" />
        </template>
      </sidebar-menu>
    </transition>
  </div>

  <!-- Overlay -->
  <transition name="app-sidebar-overlay" mode="out-in">
    <div v-if="store.sidebarIsShown && !isLaptop" class="app-sidebar-overlay" @click="onOverlayClick" />
  </transition>
</template>
