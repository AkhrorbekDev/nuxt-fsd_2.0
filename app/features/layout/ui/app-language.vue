<script setup lang="ts">
const { locale, locales } = useI18n()
const switchLocalePath = useSwitchLocalePath()
</script>

<template>
  <ui-dropdown :distance="16">
    <ui-icon-button
      variant="white"
      color="secondary"
      icon-class="text-xl"
      icon-name="solar:earth-bold-duotone"
      :label="$t('labels.language')"
    />

    <template #body>
      <nuxt-link v-for="{ code, name } in locales" :key="code" :to="switchLocalePath(code)">
        <ui-dropdown-item :label="name" :color="locale === code ? 'primary' : 'secondary'" />
      </nuxt-link>
    </template>
  </ui-dropdown>
</template>
