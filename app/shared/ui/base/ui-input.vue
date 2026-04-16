<script setup lang="ts" generic="T">
import type { InputHTMLAttributes, InputTypeHTMLAttribute } from "vue"

interface IProps extends /* @vue-ignore */ InputHTMLAttributes {
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl"
  color?: "primary" | "secondary" | "success" | "warning" | "danger"
  pilled?: boolean
  squared?: boolean
  disabled?: boolean
  autocomplete?: string
  type?: InputTypeHTMLAttribute
}

const props = withDefaults(defineProps<IProps>(), {
  size: "md",
  type: "text",
  color: "primary",
  autocomplete: "off"
})

const model = defineModel<T>()

const inputClass = computed(() => ({
  "ui-input": true,
  "ui-input-pilled": props.pilled,
  "ui-input-squared": props.squared,
  "ui-input-disabled": props.disabled,
  ["ui-input-" + props.size]: true,
  ["ui-input-" + props.color]: true
}))
</script>

<template>
  <input v-bind="$attrs" v-model="model" :autocomplete :class="inputClass" :type="type" />
</template>
