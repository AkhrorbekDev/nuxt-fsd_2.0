<script setup lang="ts">
import { useRoleApi } from "~/features/role"

import UiSelect from "@vueform/multiselect"

interface IProps {
  autoSelect?: boolean
  fetchOnOpen?: boolean
}

const props = defineProps<IProps>()
const model = defineModel<number | number[] | string | string[]>()

const roleApi = useRoleApi()
const el = ref()

const params = ref<Record<string, any>>({
  keyword: "",
  page: 1,
  size: 100
})

const map = (value: IRole[]): ISelect[] => value?.map(({ id, name }) => ({ value: id, label: name }))

const { loading, onOpen, onClose, onSearch, options } = useSelect<IRole>({
  el,
  map,
  model,
  params,
  autoSelect: props.autoSelect,
  fetchOnOpen: props.fetchOnOpen,
  api: roleApi.getRoleList
})
</script>

<template>
  <ui-select
    v-model="model"
    v-bind="$attrs"
    autocomplete="off"
    searchable
    :options="options"
    :loading="loading"
    :filter-results="false"
    @open="onOpen"
    @close="onClose"
    @search-change="onSearch"
  >
    <template #afterlist>
      <span ref="el"></span>
    </template>
  </ui-select>
</template>
