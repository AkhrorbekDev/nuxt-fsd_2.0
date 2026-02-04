<script setup lang="ts">
export interface IProps {
  tag?: string
  vertical?: boolean
}

const props = withDefaults(defineProps<IProps>(), { tag: "div" })

const groupClass = computed(() => (props.vertical ? "ui-button-group-vertical" : "ui-button-group"))
</script>

<template>
  <component v-bind="$attrs" :is="tag" :class="groupClass">
    <slot />
  </component>
</template>
