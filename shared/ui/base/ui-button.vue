<script setup lang="ts">
import type { ButtonHTMLAttributes } from "vue"

export interface IProps extends /* @vue-ignore */ ButtonHTMLAttributes {
  variant?: "solid" | "ghost" | "flat" | "white"
  size?: "xs" | "sm" | "md" | "lg" | "xl"
  color?: "primary" | "secondary" | "success" | "warning" | "danger" | "info" | "lime" | "cyan" | "yellow" | string
  label?: string
  loadingLabel?: string
  rounded?: boolean
  squared?: boolean
  loading?: boolean
  disabled?: boolean
  href?: string
  iconName?: string
  iconClass?: string
  to?: string | Record<string, any>
}

const props = withDefaults(defineProps<IProps>(), {
  size: "md",
  color: "primary",
  variant: "solid",
  loadingLabel: "Loading..."
})

const localePath = useLocalePath()

const buttonClass = computed(() => ({
  "ui-button": true,
  "ui-button-rounded": props.rounded,
  "ui-button-squared": props.squared,
  "ui-button-disabled": props.disabled || props.loading,
  ["ui-button-" + props.size]: true,
  ["ui-button-" + props.color]: true,
  ["ui-button-" + props.variant]: true
}))

const buttonAttrs = computed(() => {
  if (props.to) return { is: "router-link", to: localePath(props.to) }
  else if (props.href) return { is: "a", href: props.href }
  else return { is: "button" }
})
</script>

<template>
  <component
    v-bind="{ ...$attrs, ...buttonAttrs }"
    :is="buttonAttrs.is"
    :class="buttonClass"
    :disabled="disabled || loading"
  >
    <slot v-if="loading" name="loading">
      <span class="ui-button-loading" />
      <span>{{ loadingLabel }}</span>
    </slot>

    <slot v-else>
      <icon v-if="iconName" :name="iconName" :class="iconClass" />
      <span>{{ label }}</span>
    </slot>
  </component>
</template>
