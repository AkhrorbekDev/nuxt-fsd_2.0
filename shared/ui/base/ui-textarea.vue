<script setup lang="ts" generic="T extends string">
import type { TextareaHTMLAttributes } from "vue"

interface IProps extends /* @vue-ignore */ TextareaHTMLAttributes {
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl"
  color?: "primary" | "secondary" | "success" | "warning" | "danger"
  resize?: boolean
  squared?: boolean
  disabled?: boolean
}

const props = withDefaults(defineProps<IProps>(), { size: "md", color: "primary" })

const model = defineModel<T>()

const textareaClass = computed(() => [
  {
    "ui-input": true,
    "form-textarea -mb-1": true,
    "resize-none": !props.resize,
    "ui-input-squared": props.squared,
    "ui-input-disabled": props.disabled,
    ["ui-textarea-" + props.size]: true,
    ["ui-input-" + props.color]: true
  }
])
</script>

<template>
  <textarea v-model="model" v-bind="$attrs" :class="textareaClass" :disabled="disabled" />
</template>
