<script setup lang="ts">
import { breakpointsTailwind } from "@vueuse/core"
import { Dropdown } from "floating-vue"
import type { Placement, TriggerEvent } from "floating-vue"

export interface IProps {
  bodyStyle?: Record<string, any>
  placement?: Placement
  trigger?: TriggerEvent
  autoHide?: boolean
  isOpen?: boolean
  distance?: number
  bodyClass?: string
  boundary?: string
  container?: string
  hideOnClick?: boolean
  minWidth?: boolean
}

export interface IEmits {
  (e: "show"): void
  (e: "hide"): void
}

const props = withDefaults(defineProps<IProps>(), {
  autoHide: true,
  hideOnClick: true,
  distance: 8,
  bodyClass: "ui-dropdown-body",
  placement: "bottom-end",
  trigger: "click"
})

const emit = defineEmits<IEmits>()

const breakpoints = useBreakpoints(breakpointsTailwind)
const isMobile = breakpoints.smallerOrEqual("sm")

const triggers = (triggers: TriggerEvent[]): TriggerEvent[] => {
  if (props.hideOnClick) return [...triggers, "click"]
  return triggers
}
</script>

<template>
  <dropdown
    v-bind="$attrs"
    class="ui-dropdown"
    no-auto-focus
    compute-transform-origin
    :popper-class="['ui-dropdown', { 'w-min': minWidth }]"
    :auto-hide="autoHide"
    :shown="isOpen"
    :distance="distance"
    :container="container"
    :boundary="boundary"
    :placement="placement"
    :triggers="[trigger]"
    :positioning-disabled="isMobile"
    :popper-hide-triggers="triggers"
    @apply-show="emit('show')"
    @apply-hide="emit('hide')"
  >
    <template #default="attrs">
      <slot v-bind="attrs" />
    </template>

    <template #popper="attrs">
      <div :class="bodyClass" :style="bodyStyle">
        <slot v-bind="attrs" name="body" />
      </div>
    </template>
  </dropdown>
</template>
