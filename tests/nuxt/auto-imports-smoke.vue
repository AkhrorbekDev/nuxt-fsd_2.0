<script setup lang="ts">
useHead({ title: "Auto imports smoke" })

const { t } = useI18n()
const modal = useModal()
const rule = useRule()

const title = computed(() => t("labels.home"))

void modal
void rule
</script>

<template>
  <section class="p-4">
    <page-header :label="title" :description="title" />
    <ui-button :label="title" />
  </section>
</template>
