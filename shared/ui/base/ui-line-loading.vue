<script setup lang="ts">
interface Props {
  color?: "primary" | "secondary" | "success" | "warning" | "danger"
}

const props = withDefaults(defineProps<Props>(), { color: "primary" })
const loadingClass = computed(() => ({ ["ui-loading-" + props.color]: props.color }))
</script>

<template>
  <div class="ui-loading-bar-container" :class="loadingClass">
    <div class="ui-loading-bar" />
    <div class="ui-loading-next-bar" />
  </div>
</template>
