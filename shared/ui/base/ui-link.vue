<script setup lang="ts">
interface IProps {
  href?: string
  label?: string
  disabled?: boolean
  to?: string | Record<string, any>
  color?: "primary" | "secondary" | "success" | "warning" | "danger" | "default" | string
}

const props = withDefaults(defineProps<IProps>(), { color: "primary" })

const localePath = useLocalePath()

const linkClass = computed(() => ({
  "ui-link": true,
  "ui-link-disabled": props.disabled,
  ["ui-link-" + props.color]: true
}))

const linkAttrs = computed(() => {
  if (props.to) return { is: "router-link", to: localePath(props.to) }
  else if (props.href) return { is: "a", href: props.href }
  else return { is: "span" }
})
</script>

<template>
  <component v-bind="{ ...linkAttrs, ...$attrs }" :is="linkAttrs.is" :class="linkClass" :disabled="disabled">
    <slot>{{ label }}</slot>
  </component>
</template>
