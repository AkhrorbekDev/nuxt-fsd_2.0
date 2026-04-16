<script setup lang="ts">
import { RoleList, RoleModal } from "~/features/role"

const { t } = useI18n()
useHead({ title: t("labels.roles") })
</script>

<template>
  <section class="flex w-full flex-col gap-4">
    <page-header :label="$t('labels.roles')" :description="$t('descriptions.roles')" />
    <role-list />
    <role-modal />
  </section>
</template>
