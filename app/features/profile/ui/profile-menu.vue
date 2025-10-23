<script setup lang="ts">
import { breakpointsTailwind } from "@vueuse/core"
import { ProfileAvatar } from "~/features/profile"

const modal = useModal()
const { sm } = useBreakpoints(breakpointsTailwind)
const { $session } = useNuxtApp()
const { confirmSignOut } = useAlert()
const { profile } = $session

const showProfileModal = () => modal.show("profile")
const showProfilePasswordModal = () => modal.show("profile-password")

const onSignOut = () => confirmSignOut().then(() => $session.clear())
</script>

<template>
  <ui-dropdown :distance="16">
    <div class="flex cursor-pointer items-center gap-2">
      <profile-avatar />

      <div v-if="sm" class="max-w-64 text-xs">
        <p class="truncate font-bold">{{ fullName(profile?.name!, profile?.surname!) }}</p>
        <p class="truncate text-gray-600 dark:text-gray-400">{{ profile?.email }}</p>
      </div>
    </div>

    <template #body>
      <ui-dropdown-item
        icon-name="solar:user-circle-bold-duotone"
        icon-class="text-xl"
        :label="$t('labels.profile')"
        @click="showProfileModal"
      />

      <ui-dropdown-item
        icon-name="solar:lock-password-bold-duotone"
        icon-class="text-xl"
        :label="$t('actions.change_password')"
        @click="showProfilePasswordModal"
      />

      <hr class="dark:border-gray-800" />

      <ui-dropdown-item
        color="danger"
        icon-name="solar:round-arrow-left-bold"
        icon-class="text-xl"
        :label="$t('actions.sign_out')"
        @click="onSignOut"
      />
    </template>
  </ui-dropdown>
</template>
