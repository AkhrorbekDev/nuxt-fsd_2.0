<script setup lang="ts">
import UiInput from "./ui-input.vue"

interface IProps {
  iconName?: string
  iconClass?: string
  placeholder?: string
}

withDefaults(defineProps<IProps>(), {
  iconName: "iconamoon:search-duotone",
  iconClass: "text-lg text-gray-400"
})

const model = defineModel<string>()
const emit = defineEmits(["enter"])
const id = useId()

const canClear = computed(() => !!model.value)

const onClear = () => {
  model.value = ""
  emit("enter")
}
</script>

<template>
  <div class="ui-input-group">
    <label v-if="iconName" class="before w-9" :for="id">
      <icon :class="iconClass" :name="iconName" />
    </label>

    <button v-show="canClear" class="after w-9" @click="onClear">
      <icon class="text-lg text-gray-400" name="lucide:x" />
    </button>

    <ui-input
      v-model="model"
      v-bind="$attrs"
      autocomplete="off"
      :id="id"
      :placeholder="placeholder || $t('placeholders.search')"
      @keydown.enter="$emit('enter')"
    />
  </div>
</template>
