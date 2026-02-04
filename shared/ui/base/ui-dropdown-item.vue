<script setup lang="ts">
import type { ButtonHTMLAttributes } from "vue"

interface IProps extends /* @vue-ignore */ ButtonHTMLAttributes {
  color?: "primary" | "secondary" | "success" | "warning" | "danger"
  label?: string
  disabled?: boolean
  href?: string
  iconName?: string
  iconClass?: string
  to?: string | Record<string, any>
}

const props = withDefaults(defineProps<IProps>(), { color: "secondary" })
const localePath = useLocalePath()

const itemClass = computed(() => ({
  "ui-dropdown-item": true,
  "ui-dropdown-item-disabled": props.disabled,
  ["ui-dropdown-item-" + props.color]: true
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
      <icon v-if="iconName" :class="iconClass" :name="iconName" />
      <span>{{ label }}</span>
    </slot>
  </component>
</template>
