<script setup lang="ts" generic="T">
import type { InputHTMLAttributes, LabelHTMLAttributes } from "vue"

interface IProps {
  label?: string
  labelProps?: LabelHTMLAttributes
  inputProps?: InputHTMLAttributes & { "true-value"?: any; "false-value"?: any }
  labelClass?: string
  inputClass?: string
  value?: T
}

defineProps<IProps>()
const id = useId()
const model = defineModel<T>()
</script>

<template>
  <div class="flex w-full items-center gap-2 select-none">
    <input
      v-bind="inputProps"
      v-model="model"
      class="ui-checkbox form-checkbox shrink-0"
      type="checkbox"
      :id="id"
      :value="value"
      :class="inputClass"
    />

    <label
      v-bind="labelProps"
      class="w-full cursor-pointer text-sm leading-none font-medium"
      :for="id"
      :class="labelClass"
    >
      {{ label }}
    </label>
  </div>
</template>
