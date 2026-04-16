<script setup lang="ts">
const { $session } = useNuxtApp()
const { profile } = $session
</script>

<template>
  <ui-avatar v-bind="$attrs" class="cursor-pointer" :label="fullName(profile?.name!, profile?.surname!)" />
</template>
