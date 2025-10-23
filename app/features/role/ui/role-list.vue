<script setup lang="ts">
import { useRoleStore } from "~/entities/role"
import { useRoleService } from "~/features/role"

import { RoleListMenu } from "~/features/role"

const { t } = useI18n()

const modal = useModal()
const roleStore = useRoleStore()
const { getRoleList, filterRoleList, debouncedFilterRoleList } = useRoleService()
const { items, loading, params } = storeToRefs(roleStore)

const cols = computed<ITableCol<IRole>[]>(() => [
  {
    name: "idx",
    label: t("thead.sequence"),
    width: "40px",
    dataClass: "text-center"
  },
  {
    name: "name",
    label: t("labels.name")
  },
  {
    name: "description",
    label: t("labels.description")
  },
  {
    name: "created_at",
    label: t("labels.created_at"),
    formatter: (value) => value && formatDate(value, "DD.MM.YYYY HH:mm:ss")
  },
  {
    name: "updated_at",
    label: t("labels.updated_at"),
    formatter: (value) => value && formatDate(value, "DD.MM.YYYY HH:mm:ss")
  },
  {
    name: "actions",
    label: t("thead.actions"),
    labelClass: "justify-end",
    headClass: "right-0",
    dataClass: "right-0",
    fixed: true
  }
])

const showRoleModal = () => modal.show("role")

onMounted(() => getRoleList())
</script>

<template>
  <div class="grow">
    <!-- Header -->
    <div class="app-container mb-4">
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center">
        <ui-search-input
          v-model="params.keyword"
          class="w-full sm:w-auto"
          @input="debouncedFilterRoleList"
          @enter="filterRoleList"
        />

        <ui-button class="sm:ml-auto" :label="$t('actions.add')" @click="showRoleModal" />
      </div>
    </div>

    <!-- Table -->
    <div class="app-container">
      <ui-table no-wrap rounded striped :loading :cols :rows="items" :empty-text="$t('placeholders.data_not_found')">
        <template #idx="{ idx, sequence }">
          {{ sequence(idx, params.page, params.size) }}
        </template>

        <template #actions="{ row }">
          <role-list-menu :id="row?.id" :name="row?.name" />
        </template>
      </ui-table>
    </div>
  </div>

  <!-- Footer -->
  <ui-table-footer v-model:page="params.page" v-model:per-page="params.size" class="stuck" :total="params.total" />
</template>
