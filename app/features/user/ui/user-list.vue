<script setup lang="ts">
import { useUserStore } from "~/entities/user"
import { useUserService } from "~/features/user"

import { UserListMenu } from "~/features/user"

const { t } = useI18n()
const { masked } = useMask()

const modal = useModal()
const userStore = useUserStore()
const { getUserList, filterUserList, debouncedFilterUserList } = useUserService()
const { items, loading, params } = storeToRefs(userStore)

const cols = computed<ITableCol<IUser>[]>(() => [
  {
    name: "idx",
    label: t("thead.sequence"),
    width: "40px",
    dataClass: "text-center"
  },
  {
    name: "name",
    label: t("labels.first_name")
  },
  {
    name: "surname",
    label: t("labels.last_name")
  },
  {
    name: "email",
    label: t("labels.email")
  },
  {
    name: "phone",
    label: t("labels.phone"),
    formatter: (value) => value && masked(value, "+998 (##) ###-##-##")
  },
  {
    name: "role",
    label: t("labels.role")
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

const showUserModal = () => modal.show("user")

onMounted(() => getUserList())
</script>

<template>
  <div class="grow">
    <!-- Header -->
    <div class="app-container mb-4">
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center">
        <ui-search-input
          v-model="params.keyword"
          class="w-full sm:w-auto"
          @input="debouncedFilterUserList"
          @enter="filterUserList"
        />

        <ui-button class="sm:ml-auto" :label="$t('actions.add')" @click="showUserModal" />
      </div>
    </div>

    <!-- Table -->
    <div class="app-container">
      <ui-table no-wrap rounded striped :loading :cols :rows="items" :empty-text="$t('placeholders.data_not_found')">
        <template #idx="{ idx, sequence }">
          {{ sequence(idx, params.page, params.size) }}
        </template>

        <template #actions="{ row }">
          <user-list-menu :id="row?.id" :name="row?.name" />
        </template>
      </ui-table>
    </div>
  </div>

  <!-- Footer -->
  <ui-table-footer v-model:page="params.page" v-model:per-page="params.size" class="stuck" :total="params.total" />
</template>
