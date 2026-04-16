<script setup lang="ts">
import { UserList } from "~/features/user"
import { UserModal } from "~/widgets/user"

const { t } = useI18n()
useHead({ title: t("labels.users") })
</script>

<template>
  <section class="flex w-full flex-col gap-4">
    <page-header :label="$t('labels.users')" :description="$t('descriptions.users')" />
    <user-list />
    <user-modal />
  </section>
</template>
