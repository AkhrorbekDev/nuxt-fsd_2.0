<script setup lang="ts">
import type { RouteLocationRaw } from "vue-router"
import type { ButtonHTMLAttributes } from "vue"

export interface IProps extends /* @vue-ignore */ ButtonHTMLAttributes {
  variant?: "solid" | "ghost" | "flat" | "white"
  size?: "xs" | "sm" | "md" | "lg" | "xl"
  color?: "primary" | "secondary" | "success" | "warning" | "danger"
  rounded?: boolean
  squared?: boolean
  loading?: boolean
  disabled?: boolean
  label?: string
  href?: string
  iconName?: string
  iconClass?: string
  to?: RouteLocationRaw
}

const props = withDefaults(defineProps<IProps>(), {
  size: "md",
  color: "primary",
  variant: "solid"
})

const localePath = useLocalePath()

const buttonClass = computed(() => ({
  "ui-icon-button": true,
  "ui-button-rounded": props.rounded,
  "ui-button-squared": props.squared,
  "ui-button-disabled": props.disabled || props.loading,
  ["ui-icon-button-" + props.size]: true,
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
    v-tooltip.bottom="{ content: label, strategy: 'fixed' }"
    v-bind="{ ...$attrs, ...buttonAttrs }"
    :is="buttonAttrs.is"
    :class="buttonClass"
    :disabled="disabled || loading"
  >
    <slot v-if="loading" name="loading">
      <span class="ui-button-loading" />
    </slot>

    <slot>
      <icon v-if="iconName" :class="iconClass" :name="iconName" />
    </slot>
  </component>
</template>
