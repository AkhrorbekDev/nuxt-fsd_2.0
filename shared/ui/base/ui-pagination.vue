<script setup lang="ts">
import { breakpointsMasterCss } from "@vueuse/core"

export interface IProps {
  total: number
  perPage?: number
  eachSide?: number
  firstPage?: number
}

const props = withDefaults(defineProps<IProps>(), {
  modelValue: 0,
  total: 0,
  perPage: 10,
  firstPage: 0
})

const model = defineModel<number>({ default: 0 })

const breakpoints = useBreakpoints(breakpointsMasterCss)
const isMobile = breakpoints.smallerOrEqual("2xs")

const defaultEachSide = computed(() => {
  if (props.eachSide) return props.eachSide
  else return isMobile.value ? 1 : 2
})

const pageCount = computed(() => Math.ceil(props.total / props.perPage))
const lastPage = computed(() => pageCount.value - 1)
const size = computed(() => defaultEachSide.value * 2 + 1)
const notEnoughPages = computed(() => pageCount.value < size.value)

const start = computed(() => {
  if (model.value < defaultEachSide.value) return 0
  if (model.value >= pageCount.value - defaultEachSide.value) return pageCount.value - size.value
  return model.value - defaultEachSide.value
})

const isCurrentPage = (page: number) => model.value === (notEnoughPages.value ? page : page + start.value)

const loadPage = (page: number) => {
  if (page >= props.firstPage && page <= lastPage.value) model.value = page
}
</script>

<template>
  <div v-if="lastPage > firstPage" class="ui-pagination">
    <button
      class="ui-pagination-button ui-pagination-link"
      :disabled="model === firstPage"
      @click="loadPage(firstPage)"
    >
      <icon class="text-xl" name="lucide:chevrons-left" />
    </button>

    <button class="ui-pagination-button grid" :disabled="model === firstPage" @click="loadPage(model - 1)">
      <icon class="text-xl" name="lucide:chevron-left" />
    </button>

    <template v-if="notEnoughPages">
      <template v-for="(n, i) in pageCount" :key="n + i">
        <button
          class="ui-pagination-button ui-pagination-page"
          :class="{ active: isCurrentPage(i) }"
          @click="loadPage(i)"
        >
          {{ n }}
        </button>
      </template>
    </template>

    <template v-else>
      <template v-for="(n, i) in size" :key="n + i">
        <button class="ui-pagination-button" :class="{ active: isCurrentPage(i) }" @click="loadPage(start + i)">
          {{ start + n }}
        </button>
      </template>
    </template>

    <button class="ui-pagination-button grid" :disabled="model === lastPage" @click="loadPage(model + 1)">
      <icon class="text-xl" name="lucide:chevron-right" />
    </button>

    <button class="ui-pagination-button ui-pagination-link" :disabled="model === lastPage" @click="loadPage(lastPage)">
      <icon class="text-xl" name="lucide:chevrons-right" />
    </button>
  </div>
</template>
