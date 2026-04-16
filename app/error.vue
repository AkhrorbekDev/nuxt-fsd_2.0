<script setup lang="ts">
import { AppError } from "~/widgets/layout"

const error = useError()
const statusCode = computed(() => error.value?.statusCode || error.value?.status || 500)
const statusMessage = computed(() => error.value?.statusMessage || error.value?.statusText)
</script>

<template>
  <app-error v-if="error" :status-code="statusCode" :status-message="statusMessage" />
</template>
