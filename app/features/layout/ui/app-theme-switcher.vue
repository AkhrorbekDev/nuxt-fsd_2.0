<script setup lang="ts">
const { t } = useI18n()
const toggle = useToggle(isDark)
const iconName = computed(() => (isDark.value ? "solar:sun-2-bold-duotone" : "solar:moon-stars-bold-duotone"))
const label = computed(() => (isDark.value ? t("labels.light_theme") : t("labels.dark_theme")))
</script>

<template>
  <ui-icon-button v-bind="$attrs" variant="white" color="secondary" :label="label" @click="toggle()">
    <icon class="text-xl" :name="iconName" />
  </ui-icon-button>
</template>
