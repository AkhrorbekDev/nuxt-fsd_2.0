<script setup lang="ts">
interface IProps {
  label?: string
  labelFor?: string
  hint?: string | any
  required?: boolean
  invalid?: boolean
}

defineProps<IProps>()
const id = useId()
</script>

<template>
  <div class="ui-form-group" :class="{ invalid }">
    <div class="flex items-center justify-between">
      <label class="ui-form-label" :for="labelFor || id">
        {{ label }}
        <span v-if="required" class="text-danger-600">*</span>
      </label>

      <slot name="corner" :id="id"></slot>
    </div>

    <slot :id="id"></slot>

    <small class="ui-form-hint">{{ hint }}</small>

    <slot name="bottom" />
  </div>
</template>
