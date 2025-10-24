<script setup lang="ts">
const props = defineProps<{ statusCode: number; statusMessage?: string }>()
const { t } = useI18n()

const errorMessage = computed(() => {
  const messages: Record<number, string> = {
    404: t("placeholders.page_not_found"),
    500: t("placeholders.server_error")
  }

  return messages[props.statusCode] || props.statusMessage || t("placeholders.server_error")
})
</script>

<template>
  <section class="bg-radial ui-animation-fade grid min-h-dvh place-items-center">
    <div class="z-10 grid min-h-dvh w-full content-center justify-center gap-6 p-4 text-center">
      <h1 class="max-w-4xl text-4xl font-bold md:text-6xl">{{ errorMessage }}</h1>
    </div>
  </section>
</template>
