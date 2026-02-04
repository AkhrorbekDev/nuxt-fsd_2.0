<script setup lang="ts" generic="T">
import UiSelect from "@vueform/multiselect"

interface IProps {
  total: number
  range?: number
  modelValue?: number
  allLabel?: string
}

const props = withDefaults(defineProps<IProps>(), { range: 10, allLabel: "All" })

const model = defineModel<T>()

const options = computed(() => {
  const options = []

  for (let index = props.range; index < (props.total > 100 ? 101 : props.total); index += props.range) {
    options.push({ label: index, value: index })
  }

  props.total <= 100 && options.push({ label: props.allLabel, value: props.total })

  return options
})
</script>

<template>
  <ui-select
    v-model="model"
    class="sm:!w-28"
    append-to-body
    :options="options"
    :can-clear="false"
    :can-deselect="false"
  />
</template>
