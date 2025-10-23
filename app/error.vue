<script setup lang="ts">
import { AppError } from "~/widgets/layout"

const error = useError()
</script>

<template>
  <app-error v-if="error" v-bind="error" />
</template>
