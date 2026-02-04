<script setup lang="ts">
import UiInput from "./ui-input.vue"

interface Props {
  modelValue?: File[]
  accept?: string
  multiple?: boolean
  disabled?: boolean
}

interface Emits {
  (e: "change", files?: File[]): void
  (e: "update:modelValue", files?: File[]): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const fileName = ref<string>("")
const input = ref<HTMLInputElement>()

const onClick = () => input.value?.click()

const onClear = () => {
  if (input.value?.value) input.value.value = ""
  setState([])
}

const setState = (files: File[]) => {
  emits("update:modelValue", files)
  emits("change", files)
  setFileName(files)
}

const setFileName = (files: File[]) => {
  fileName.value = Array.from(files || [])
    .map((file) => file.name)
    .join(", ")
}

onMounted(() => {
  const element = document.createElement("input")
  element.type = "file"
  element.multiple = props.multiple || false
  element.accept = props.accept || ""

  element.onchange = () => {
    const files = Array.from(element.files || [])
    setState(files)
  }

  input.value = element
})

watch(
  () => props.modelValue,
  (value) => {
    if (!value?.length) setFileName([])
    else if (value[0] instanceof File) setFileName(value)
  },
  { immediate: true }
)
</script>

<template>
  <div class="ui-input-group">
    <div class="before w-9">
      <slot name="icon">
        <i class="le-file text-lg text-gray-400" />
      </slot>
    </div>

    <ui-input
      v-bind="$attrs"
      class="w-full !px-9"
      readonly
      clearable
      :class="{ 'cursor-pointer': !disabled }"
      :value="fileName"
      :disabled="disabled"
      @click="onClick"
      @keydown.enter.space="onClick"
    />

    <div v-if="fileName?.length" class="after w-9 cursor-pointer" @click="onClear">
      <i class="le-circle-x text-lg text-danger-500" />
    </div>
  </div>
</template>
