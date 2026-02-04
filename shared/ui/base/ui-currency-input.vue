<script setup lang="ts">
const model = defineModel<number>({ default: 0 })

const formattedValue = ref("")

const onInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  const cleaned = target?.value?.replace(/[^\d.]/g, "")
  const parsed = parseFloat(cleaned) || 0
  model.value = parsed
  formattedValue.value = currencyFormatter.format(parsed)
}

watch(
  () => model.value,
  (value) => (formattedValue.value = currencyFormatter.format(value)),
  { immediate: true }
)
</script>

<template>
  <ui-input v-bind="$attrs" type="text" :model-value="formattedValue" @input="onInput" />
</template>
