<script setup lang="ts">
import { AuthWrapper } from "~/widgets/auth"
import { AuthSignInForm } from "~/features/auth"

const { t } = useI18n()
useHead({ title: t("actions.sign_in") })
definePageMeta({ layout: "blank", public: true })
</script>

<template>
  <auth-wrapper :heading="$t('actions.sign_in')" :description="$t('descriptions.sign_in')">
    <auth-sign-in-form />
  </auth-wrapper>
</template>
