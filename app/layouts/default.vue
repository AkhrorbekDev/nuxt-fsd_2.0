<script lang="ts" setup>
import { AppHeader, AppSidebar, AppContent } from "~/widgets/layout"
import { ProfileModal, ProfilePasswordModal } from "~/features/profile"
</script>

<template>
  <div>
    <app-sidebar />

    <app-content>
      <template #header>
        <app-header />
      </template>

      <slot />
    </app-content>

    <profile-modal />
    <profile-password-modal />
  </div>
</template>
