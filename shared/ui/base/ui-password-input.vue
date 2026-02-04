<script setup lang="ts">
import UiInput from "./ui-input.vue"

defineOptions({ inheritAttrs: false })

const shown = ref(false)
const type = computed(() => (shown.value ? "text" : "password"))
const iconName = computed(() => (shown.value ? "iconamoon:eye-off-duotone" : "iconamoon:eye-duotone"))
</script>

<template>
  <div class="relative">
    <ui-input v-bind="$attrs" class="w-full !pr-9" :type="type" />

    <div
      class="absolute bottom-0 right-0 top-0 grid w-9 cursor-pointer place-items-center text-gray-400"
      @click="shown = !shown"
    >
      <icon class="text-xl" :name="iconName" />
    </div>
  </div>
</template>
