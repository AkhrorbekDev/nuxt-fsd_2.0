<script setup lang="ts">
import { AppError } from "@widgets/layout"

const error = useError()
const statusCode = computed(() => error.value?.statusCode ?? 500)
const statusMessage = computed(() => error.value?.statusMessage)
</script>

<template>
  <app-error :status-code="statusCode" :status-message="statusMessage" />
</template>
