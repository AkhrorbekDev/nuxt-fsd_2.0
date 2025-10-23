<script setup lang="ts">
interface IProps {
  label?: string
}

defineProps<IProps>()
</script>

<template>
  <div class="ui-card-header flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
    <h3 v-if="label" class="text-xl font-bold leading-9">{{ label }}</h3>
    <slot />
  </div>
</template>
