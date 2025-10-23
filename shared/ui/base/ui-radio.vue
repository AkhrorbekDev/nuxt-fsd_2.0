<script setup lang="ts" generic="T">
import type { LabelHTMLAttributes } from "vue"

interface IProps {
  label?: string
  labelProps?: LabelHTMLAttributes
  value?: T
}

defineProps<IProps>()
const id = useId()
const model = defineModel<T>()
</script>

<template>
  <div class="flex w-full select-none items-center gap-2">
    <input v-model="model" class="ui-radio form-radio shrink-0" type="radio" :id="id" :value="value" />
    <label v-bind="labelProps" class="w-full cursor-pointer text-sm font-medium" :for="id">{{ label }}</label>
  </div>
</template>
