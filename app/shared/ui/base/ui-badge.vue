<script setup lang="ts">
export interface IProps {
  variant?: "solid" | "flat" | "white"
  color?: "primary" | "secondary" | "success" | "warning" | "danger" | "info"
  label?: string
  status?: string
  rounded?: boolean
  squared?: boolean
}

const props = withDefaults(defineProps<IProps>(), { variant: "solid", color: "primary" })

const { t, te } = useI18n()

const status = computed<Record<string, any>>(() => ({
  label: te(`${props.status}.label`) ? t(`${props.status}.label`) : null,
  color: te(`${props.status}.color`) ? t(`${props.status}.color`) : null,
  variant: te(`${props.status}.variant`) ? t(`${props.status}.variant`) : null
}))

const badgeClass = computed(() => ({
  "ui-badge": true,
  "ui-badge-rounded": props.rounded,
  "ui-badge-squared": props.squared,
  ["ui-badge-" + (status.value?.color ?? props.color)]: !!props.color,
  ["ui-badge-" + (status.value?.variant ?? props.variant)]: true
}))
</script>

<template>
  <div v-bind="$attrs" :class="badgeClass">
    <slot>
      {{ status?.label ?? label }}
    </slot>
  </div>
</template>
