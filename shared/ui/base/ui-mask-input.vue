<script setup lang="ts">
import type { VNode } from "vue"
import { MaskInput, type MaskType, type MaskTokens } from "maska"

import UiInput from "./ui-input.vue"

interface IProps {
  mask: MaskType
  tokens?: MaskTokens
  unmasked?: boolean
  modelValue?: string
}

const props = withDefaults(defineProps<IProps>(), { unmasked: true })
const emits = defineEmits(["update:modelValue"])

const el = ref<HTMLInputElement>()
const input = ref<MaskInput>()
const maskedValue = ref<string>("")

const setValue = (value: string) => {
  el.value!.value = value
  maskedValue.value = value
  el.value?.dispatchEvent(new Event("input"))
}

const onMounted = (data: VNode) => {
  if (data.el) {
    el.value = <HTMLInputElement>data.el
    input.value = new MaskInput(<HTMLInputElement>data.el, {
      mask: props.mask,
      tokens: props.tokens,
      onMaska: ({ masked, unmasked }) => {
        if (props.unmasked) emits("update:modelValue", unmasked)
        else emits("update:modelValue", masked)

        data.el!.value = masked
        maskedValue.value = masked
      }
    })
  }

  if (props.modelValue) setValue(props.modelValue)
}

const onUnmounted = () => input.value?.destroy()

watch(
  () => props.modelValue,
  (value) => {
    if (!!value && el?.value && !el.value?.value) setValue(value)
  }
)
</script>

<template>
  <ui-input v-bind="$attrs" :model-value="maskedValue" @vue:mounted="onMounted" @vue:unmounted="onUnmounted" />
</template>
