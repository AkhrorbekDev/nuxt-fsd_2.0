<script setup lang="ts" generic="T">
import { get, isEqual } from "lodash-es"
import type { RouteLocationRaw } from "vue-router"
import UiLineLoading from "./ui-line-loading.vue"

interface ITableProps<T> {
  cols: ITableCol<T>[]
  rows?: T[]
  rowLink?: (row: T, idx: number) => string | RouteLocationRaw
  rowClass?: (row: T, idx: number) => string
  minRows?: number
  emptyText?: string
  headClass?: string
  bodyClass?: string
  maxHeight?: string
  minHeight?: string
  selectMode?: "single" | "multiple"
  selected?: T[] | T | T[keyof T][]
  selectBy?: keyof T
  hover?: boolean
  noWrap?: boolean
  rounded?: boolean
  striped?: boolean
  loading?: boolean
  gridline?: boolean
  skeleton?: boolean
  clickable?: boolean
  loadingBackground?: boolean
  containerClass?: string
}

interface ITableEmits<T> {
  (e: "update:selected", value: T[] | T): void

  (e: "update:modelValue", state: ITableState): void

  (e: "row-mounted", row: T, el: HTMLElement): void

  (e: "sorting", field: string, order: "asc" | "desc"): void

  (e: "select", value: T | T[keyof T], row: T): void

  (e: "deselect", value: T | T[keyof T], row: T): void

  (e: "row-clicked", row: T, idx: number, event: MouseEvent): void

  (e: "row-mouseover", row: T, idx: number, event: MouseEvent): void

  (e: "row-mouseout", row: T, idx: number, event: MouseEvent): void

  (e: "header-clicked", col: ITableCol<T>, idx: number, event: MouseEvent): void

  (e: "cell-clicked", col: ITableCol<T>, row: T, idx: number, event: MouseEvent): void
}

const props = withDefaults(defineProps<ITableProps<T>>(), { minRows: 0, hover: true, loadingBackground: true })
const emits = defineEmits<ITableEmits<T>>()

const slots = useSlots()

// Refs
const uid = useId()
const sortField = ref("")
const selectedRecords = ref()
const lastSelectedIdx = ref<number>()
const sortOrder = ref<"asc" | "desc">("asc")
const tableCols = ref<ITableCol<T>[]>([])
const tableRows = shallowRef<T[]>([])
const container = ref<HTMLElement>()
const renderedRows = ref<Map<number, HTMLElement>>(new Map())

// Computed
const displayEmptyRow = computed(() => !tableRows.value?.length && props.emptyText?.length)
const countVisibleCols = computed(() => tableCols.value?.filter((col) => col?.visible).length)
const isMultipleSelect = computed(() => props.selectMode === "multiple")

const tableClass = computed(() => ({
  "ui-table": true,
  "ui-table-hover": props.hover,
  "ui-table-nowrap": props.noWrap,
  "ui-table-linked": props.rowLink,
  "ui-table-rounded": props.rounded,
  "ui-table-striped": props.striped,
  "ui-table-gridline": props.gridline,
  "ui-table-clickable": props.clickable
}))

const selectedModel = computed({
  get() {
    if (props.selected) return props.selected
    return selectedRecords.value
  },
  set(value) {
    emits("update:selected", value)
    selectedRecords.value = value
  }
})

const isAllSelected = computed(() => {
  if (isMultipleSelect.value) {
    if (tableRows.value?.length === selectedModel.value?.length) {
      if (props.selectBy) return true
      return tableRows.value?.every((row, idx) => isEqual(row, selectedModel.value?.at(idx)))
    }
  }

  return false
})

const lessThanMinRows = computed(() => {
  if (tableRows.value === null || tableRows.value?.length === 0) return true
  return tableRows.value.length < props.minRows
})

const blankRows = computed(() => {
  if (tableRows.value === null || tableRows.value?.length === 0) return props.minRows
  if (tableRows.value.length >= props.minRows) return 0
  return props.minRows - tableRows.value?.length
})

// Methods
const sequence = (idx: number, page: number, size: number) => idx + 1 + page * size
const hasFormatter = <T,>(col: ITableCol<T>) => typeof col?.formatter === "function"

const callFormatter = <T,>(col: ITableCol<T>, row: T) => {
  if (!hasFormatter(col)) return
  if (typeof col.formatter === "function") return col.formatter(get(row, col.name), row)
}

const selectAll = (event: Event) => {
  const value = props.selectBy ? tableRows.value?.map((row) => row[props.selectBy!]) : tableRows.value
  if ((<HTMLInputElement>event.target).checked) selectedModel.value = value
  else selectedModel.value = []
}

const normalizeCols = () => {
  if (!props.cols?.length) return
  tableCols.value = []
  props.cols.forEach((col, idx) => tableCols.value.push(newCol(col, idx)))
}

const newCol = (col: ITableCol<T>, idx: number) => {
  const defaultValue = {
    name: "",
    headClass: "",
    dataClass: "",
    sortField: null,
    formatter: null,
    withoutLink: false,
    visible: true,
    width: null,
    index: idx
  }

  return Object.assign({}, defaultValue, col)
}

const setRows = (rows: T[]) => {
  if (Array.isArray(rows)) tableRows.value = rows
}

const getRowClass = (row: T, idx: number) => {
  if (typeof props.rowClass === "function") return props.rowClass(row, idx)
  return props.rowClass
}

const getColLabel = (col: ITableCol<T>) => (typeof col.label === "undefined" ? col.name?.replace(".", " ") : col.label)

const getValue = (row: T) => (props?.selectBy ? row[props.selectBy] : row)

const isColSlot = (name: string) => typeof slots[name] !== "undefined"

const renderNormalCol = (col: ITableCol<T>, row: T) => {
  return hasFormatter(col) ? callFormatter(col, row) : get(row, col.name, "")
}

const sortBy = (col: ITableCol<T>) => {
  if (col.sortField?.length) {
    if (sortField.value === col.sortField) sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc"
    else {
      sortField.value = col.sortField
      sortOrder.value = "asc"
    }

    emits("sorting", sortField.value, sortOrder.value)
  }
}

const rangeSelect = (row: T, idx: number) => {
  if (lastSelectedIdx.value !== -1) {
    const start = Math.min(lastSelectedIdx.value!, idx) + 1
    const end = Math.max(lastSelectedIdx.value!, idx)

    for (let i = start; i <= end; i++) {
      const value = getValue(tableRows.value?.at(i)!)
      selectedModel.value?.push(value)
    }
  }
}

// Events
const onHeaderClicked = (col: ITableCol<T>, idx: number, event: MouseEvent) => {
  sortBy(col)
  emits("header-clicked", col, idx, event)
}

const onCellClicked = (col: ITableCol<T>, row: T, idx: number, event: MouseEvent) => {
  emits("cell-clicked", col, row, idx, event)
}

const onRowClicked = (row: T, idx: number, event: MouseEvent) => {
  emits("row-clicked", row, idx, event)
}

const onRowMounted = (row: any, el: any) => {
  renderedRows.value.set(row?.id, el)
  emits("row-mounted", row, el)
}

const onRowMouseover = (row: T, idx: number, event: MouseEvent) => {
  emits("row-mouseover", row, idx, event)
}

const onRowMouseout = (row: T, idx: number, event: MouseEvent) => {
  emits("row-mouseout", row, idx, event)
}

const onNavigate = (event: MouseEvent, navigate: Function) => {
  if (props.clickable) event.preventDefault()
  else navigate(event)
}

const onChange = (row: T, rowIdx: number, event: Event) => {
  const checked = (<HTMLInputElement>event.target).checked

  if (checked) {
    lastSelectedIdx.value = rowIdx
    emits("select", getValue(row), row)
  } else emits("deselect", getValue(row), row)
}

// Watch
watch(
  () => props.cols,
  () => normalizeCols(),
  { immediate: true, deep: true }
)

watch(
  () => props.rows,
  (value) => value && setRows(value),
  { immediate: true }
)

onBeforeMount(() => {
  if (isMultipleSelect.value) selectedRecords.value = []
  else selectedRecords.value = null
})

onMounted(async () => {
  await nextTick()

  const state = reactive({
    container,
    rows: renderedRows
  })

  emits("update:modelValue", state)
})
</script>

<template>
  <div class="relative overflow-hidden dark:border-gray-800" :class="{ 'border': gridline, 'rounded-lg': rounded }">
    <div class="ui-table-container" ref="container" :class="containerClass" :style="{ maxHeight, minHeight }">
      <table :class="tableClass">
        <!-- Header -->
        <thead class="ui-table-head" :class="[headClass, { 'sticky top-0 z-20': maxHeight }]">
          <tr>
            <!-- Select all -->
            <template v-if="selectMode">
              <th v-if="tableRows?.length" class="ui-table-select-col">
                <input
                  v-if="isMultipleSelect"
                  class="ui-checkbox form-checkbox"
                  type="checkbox"
                  :name="uid"
                  :checked="isAllSelected"
                  @click.stop
                  @change="selectAll"
                />
              </th>
            </template>

            <!-- Table cols -->
            <template v-for="(col, idx) in tableCols">
              <template v-if="col.visible">
                <th
                  :key="idx"
                  :class="[col.headClass, { sortable: col.sortField, sticky: col?.fixed }]"
                  @click="onHeaderClicked(col, idx, $event)"
                >
                  <div class="ui-table-head-col" :class="[col.labelClass, { 'justify-between': col.sortField }]">
                    {{ getColLabel(col) }}

                    <!-- Sort icons -->
                    <icon
                      v-if="col.sortField && sortField !== col.sortField"
                      class="font-normal"
                      name="lucide:arrow-up-down"
                    />

                    <template v-if="sortField === col.sortField">
                      <icon v-if="sortOrder === 'desc'" class="font-normal" name="lucide:arrow-down-wide-narrow" />
                      <icon v-if="sortOrder === 'asc'" class="font-normal" name="lucide:arrow-up-narrow-wide" />
                    </template>
                  </div>
                </th>
              </template>
            </template>
          </tr>
        </thead>

        <!-- Body -->
        <tbody v-cloak class="ui-table-body" :class="bodyClass">
          <!-- Table rows -->
          <template v-for="(row, rowIdx) in tableRows" :key="rowIdx">
            <tr
              class="ui-table-row group"
              :aria-rowindex="rowIdx"
              :class="getRowClass(row, rowIdx)"
              :ref="(el) => onRowMounted(row, el)"
              @click="onRowClicked(row, rowIdx, $event)"
              @mouseover="onRowMouseover(row, rowIdx, $event)"
              @mouseout="onRowMouseout(row, rowIdx, $event)"
            >
              <!-- Select input -->
              <template v-if="selectMode">
                <td class="ui-table-select-col">
                  <input
                    v-if="isMultipleSelect"
                    v-model="selectedModel"
                    class="ui-checkbox form-checkbox"
                    type="checkbox"
                    :name="uid"
                    :value="getValue(row)"
                    @click.shift.exact="rangeSelect(row, rowIdx)"
                    @change="onChange(row, rowIdx, $event)"
                  />

                  <input
                    v-else
                    v-model="selectedModel"
                    class="ui-radio form-radio"
                    type="radio"
                    :name="uid"
                    :value="getValue(row)"
                    @click.stop
                    @change="onChange(row, rowIdx, $event)"
                  />
                </td>
              </template>

              <!-- Table cols -->
              <template v-for="(col, idx) in tableCols" :key="idx">
                <template v-if="col?.visible">
                  <!-- Slot cols -->
                  <template v-if="isColSlot(col.name)">
                    <td
                      :class="[
                        col.dataClass,
                        { 'ui-table-without-link': col?.withoutLink, 'ui-table-fixed-col': col?.fixed }
                      ]"
                      :style="{ width: col.width }"
                    >
                      <nuxt-link-locale
                        v-if="rowLink && !col?.withoutLink"
                        v-slot="{ href, navigate }"
                        custom
                        :to="rowLink(row, rowIdx)"
                      >
                        <a :href="href" @click="onNavigate($event, navigate)">
                          <slot :name="col.name" :col="col" :row="row" :idx="rowIdx" :sequence="sequence" />
                        </a>
                      </nuxt-link-locale>

                      <slot v-else :name="col.name" :col="col" :row="row" :idx="rowIdx" :sequence="sequence" />
                    </td>
                  </template>

                  <!-- Default cols -->
                  <template v-else>
                    <td
                      v-if="rowLink && !col?.withoutLink"
                      :class="[col.dataClass, { 'ui-table-fixed-col': col?.fixed }]"
                      :style="{ width: col.width }"
                      @click="onCellClicked(col, row, rowIdx, $event)"
                    >
                      <nuxt-link-locale v-slot="{ href, navigate }" custom :to="rowLink(row, rowIdx)">
                        <a v-html="renderNormalCol(col, row)" :href="href" @click="onNavigate($event, navigate)" />
                      </nuxt-link-locale>
                    </td>

                    <td
                      v-else
                      v-html="renderNormalCol(col, row)"
                      :class="[
                        col.dataClass,
                        { 'ui-table-without-link': col?.withoutLink, 'ui-table-fixed-col': col?.fixed }
                      ]"
                      :style="{ width: col.width }"
                      @click="onCellClicked(col, row, rowIdx, $event)"
                    />
                  </template>
                </template>
              </template>
            </tr>
          </template>

          <!-- Empty row -->
          <template v-if="displayEmptyRow">
            <tr>
              <td class="ui-table-empty-row" :colspan="countVisibleCols">
                <icon class="mx-auto mb-2 text-4xl" name="lucide:inbox" />
                <p>{{ emptyText }}</p>
              </td>
            </tr>
          </template>

          <!-- Blank rows -->
          <template v-if="lessThanMinRows">
            <tr v-for="i in blankRows" :key="i" :class="{ 'animate-pulse': skeleton }">
              <td v-if="tableRows?.length && selectMode" class="ui-table-select-col">
                <div :class="{ 'ui-table-skeleton': skeleton }">&nbsp;</div>
              </td>

              <template v-for="(col, idx) in tableCols">
                <td
                  v-if="col?.visible"
                  class="ui-table-blank-row"
                  :key="idx"
                  :class="col.dataClass"
                  :style="{ width: col.width }"
                >
                  <div :class="{ 'ui-table-skeleton': skeleton }">&nbsp;</div>
                </td>
              </template>
            </tr>
          </template>

          <!-- Footer -->
          <slot name="footer" />
        </tbody>
      </table>
    </div>

    <transition name="fade" mode="out-in">
      <div v-if="loading" class="ui-table-loading-background" :class="{ 'bottom-0': loadingBackground }">
        <ui-line-loading />
      </div>
    </transition>
  </div>
</template>
