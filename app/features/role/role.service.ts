import { debounce } from "lodash-es"
import { useRoleApi } from "~/features/role"
import { useRoleStore } from "~/entities/role"

import { Role } from "~/entities/role"

export const useRoleService = () => {
  const roleApi = useRoleApi()
  const roleStore = useRoleStore()

  const alert = useAlert()
  const modal = useModal()
  const { t } = useI18n()
  const { $toast } = useNuxtApp()

  const getRoleList = () => {
    roleStore.loading = true

    roleApi
      .getRoleList(cleanParams(roleStore.params))
      .then(({ content, pageable }) => {
        roleStore.items = content
        roleStore.params.total = pageable?.total ?? 0
      })
      .finally(() => (roleStore.loading = false))
  }

  const filterRoleList = () => {
    roleStore.params.page = 0
    getRoleList()
  }

  const debouncedFilterRoleList = debounce(filterRoleList, 600)

  const getRole = (id: number, dto: Ref<Role>, loading: Ref<boolean>) => {
    loading.value = true
    roleApi
      .getRoleById(id)
      .then(({ content }) => (dto.value = content))
      .finally(() => (loading.value = false))
  }

  const saveRole = (dto: Ref<Role>, loading: Ref<boolean>) => {
    loading.value = true
    const action = dto.value.id ? roleApi.updateRole : roleApi.createRole

    action(dto.value)
      .then(() => {
        modal.hide("role")
        $toast.success(t("messages.success.saved"))
        getRoleList()
      })
      .finally(() => (loading.value = false))
  }

  const deleteRole = (id: number, name: string) => {
    alert.confirmDelete().then((isConfirmed) => {
      if (isConfirmed) {
        roleStore.loading = true
        roleApi
          .deleteRole(id)
          .then(() => {
            $toast.success(t("messages.info.entity_deleted", { name }))
            getRoleList()
          })
          .finally(() => (roleStore.loading = false))
      }
    })
  }

  return {
    getRoleList,
    filterRoleList,
    debouncedFilterRoleList,
    getRole,
    saveRole,
    deleteRole
  }
}
