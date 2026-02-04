<script setup lang="ts">
export interface IProps {
  label: string
  chars?: number
  size?: string
  fontSize?: string
  src?: string
  color?: string
  bgColor?: string
  rounded?: boolean
  squared?: boolean
}

const props = withDefaults(defineProps<IProps>(), { chars: 2, size: "size-9", fontSize: "text-base" })

const isLoaded = ref(false)

const textClass = computed(() => [props.fontSize, props.color, { "text-white": !props.color }])
const avatarStyle = computed(() => ({ backgroundColor: props.bgColor ?? stringToColor(props.label) }))

const avatarClass = computed(() => [
  "ui-avatar",
  props.size,
  props.bgColor,
  { "ui-avatar-rounded": props.rounded, "ui-avatar-squared": props.squared }
])

const acronym = computed(() => {
  if (!props.label) return "!"

  let acronym = ""
  const chars = Math.abs(props.chars)
  const value = props.label.trim().split(" ")
  const size = chars <= value.length ? chars : value.length

  for (let i = 0; i < size; i++) acronym += value[i]?.charAt(0)?.toUpperCase()

  return acronym
})

const stringToColor = (value: string, s = 20, l = 40) => {
  if (!value?.length) return "#000000"

  let hash = 0
  for (let i = 0; i < value.length; i++) hash = value.charCodeAt(i) + ((hash << 5) - hash)
  return `hsl(${hash % 360}, ${s}%, ${l}%)`
}
</script>

<template>
  <div v-bind="$attrs" :class="avatarClass" :style="avatarStyle">
    <img v-if="src && isLoaded" :src="src" :alt="label" @load="isLoaded = true" />
    <span v-else :class="textClass">{{ acronym }}</span>
  </div>
</template>
