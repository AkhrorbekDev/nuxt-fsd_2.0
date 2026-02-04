<script setup lang="ts">
import type { ButtonHTMLAttributes } from "vue"

interface IProps extends /* @vue-ignore */ ButtonHTMLAttributes {
  label?: string
  active?: boolean
  disabled?: boolean
  href?: string
  iconName?: string
  iconClass?: string
  activeIconClass?: string
  to?: string | Record<string, any>
}

const props = defineProps<IProps>()
const localePath = useLocalePath()

const itemClass = computed(() => ({
  "ui-tab": true,
  "ui-tab-active": props.active,
  "ui-tab-disabled": props.disabled
}))

const itemAttrs = computed(() => {
  if (props.to) return { is: "router-link", to: localePath(props.to) }
  else if (props.href) return { is: "a", href: props.href }
  else return { is: "button" }
})
</script>

<template>
  <component v-bind="{ ...$attrs, ...itemAttrs }" :is="itemAttrs.is" :class="itemClass" :disabled="disabled">
    <slot>
      <icon v-if="iconName" :name="iconName" :class="[iconClass, active && activeIconClass]" />
      <span>{{ label }}</span>
    </slot>
  </component>
</template>
