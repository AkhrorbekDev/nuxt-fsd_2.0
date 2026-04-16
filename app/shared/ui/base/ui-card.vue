<script setup lang="ts">
export interface IProps {
  tag?: string
  squared?: boolean
  borderless?: boolean
}

const props = withDefaults(defineProps<IProps>(), { tag: "div" })

const cardClass = computed(() => ({
  "ui-card": true,
  "ui-card-squared": props.squared,
  "ui-card-borderless": props.borderless
}))
</script>

<template>
  <component :is="tag" :class="cardClass">
    <slot />
  </component>
</template>
