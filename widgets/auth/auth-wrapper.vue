<script setup lang="ts">
import Logo from "#shared/assets/svg/logo.svg"
import { AppLanguage, AppThemeSwitcher } from "@features/layout"

interface IProps {
  heading: string
  description: string
}

defineProps<IProps>()
</script>

<template>
  <section class="auth__wrapper__section bg-radial">
    <div class="auth__wrapper__content">
      <div class="auth__wrapper__header">
        <logo class="auth__wrapper__header-logo" />

        <app-theme-switcher class="ml-auto" />
        <app-language />
      </div>

      <h1 class="auth__wrapper-heading">{{ heading }}</h1>
      <p class="auth__wrapper-description">{{ description }}</p>

      <slot />
      <div class="grow" />
    </div>
  </section>
</template>

<style scoped>
.auth__wrapper {
  &__section {
    @apply grid min-h-dvh place-items-center;
  }

  &__content {
    @apply z-10 mx-auto flex h-full w-full max-w-md flex-col p-4 sm:h-auto;
  }

  &__header {
    @apply mb-10 flex grow items-start gap-3;

    &-logo {
      @apply h-9;
    }
  }

  &-heading {
    @apply mb-2 text-2xl font-bold md:text-3xl;
  }

  &-description {
    @apply mb-6 text-sm text-gray-600 md:text-base dark:text-gray-400;
  }
}
</style>
