<script setup lang="ts">
import { ProfileMenu } from "~/features/profile"
import { AppLanguage, AppSidebarSwitcher, AppThemeSwitcher } from "~/features/layout"
</script>

<template>
  <header class="app-header">
    <div class="app-header-container">
      <app-sidebar-switcher />

      <slot />

      <div class="app-header-right">
        <app-language placement="bottom-start" />
        <app-theme-switcher />

        <span class="hidden h-9 w-px bg-gray-200 dark:bg-gray-800 sm:block" />

        <profile-menu />
      </div>
    </div>
  </header>
</template>
