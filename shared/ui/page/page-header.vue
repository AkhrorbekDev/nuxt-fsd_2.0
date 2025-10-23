<script setup lang="ts">
interface IProps {
  label: string
  description: string
}

defineProps<IProps>()
</script>

<template>
  <div class="page__header">
    <div class="app-container">
      <div class="page__header__content">
        <div>
          <h3 class="page__header-label">{{ label }}</h3>
          <p class="page__header-description">{{ description }}</p>
        </div>

        <div class="page__header-action">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page__header {
  @apply border-b bg-gray-50 py-4 dark:border-gray-800 dark:bg-gray-900;

  &__content {
    @apply flex flex-col items-start gap-3 lg:flex-row lg:gap-8;
  }

  &-label {
    @apply text-xl font-bold;
  }

  &-description {
    @apply text-sm text-gray-500 dark:text-gray-400;
  }

  &-action {
    @apply flex shrink-0 flex-wrap gap-3 sm:flex-row sm:items-center lg:ml-auto;
  }
}
</style>
