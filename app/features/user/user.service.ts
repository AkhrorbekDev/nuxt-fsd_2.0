import { debounce } from "lodash-es"
import { useUserApi } from "~/features/user"
import { useUserStore } from "~/entities/user"

import { User } from "~/entities/user"

export const useUserService = () => {
  const userApi = useUserApi()
  const userStore = useUserStore()

  const alert = useAlert()
  const modal = useModal()
  const { t } = useI18n()
  const { $toast } = useNuxtApp()

  const getUserList = () => {
    userStore.loading = true

    userApi
      .getUserList(cleanParams(userStore.params))
      .then(({ content, pageable }) => {
        userStore.items = content
        userStore.params.total = pageable?.total ?? 0
      })
      .finally(() => (userStore.loading = false))
  }

  const filterUserList = () => {
    userStore.params.page = 0
    getUserList()
  }

  const debouncedFilterUserList = debounce(filterUserList, 600)

  const getUser = (id: number, dto: Ref<User>, loading: Ref<boolean>) => {
    loading.value = true
    userApi
      .getUserById(id)
      .then(({ content }) => (dto.value = content))
      .finally(() => (loading.value = false))
  }

  const saveUser = (dto: Ref<User>, loading: Ref<boolean>) => {
    loading.value = true
    const action = dto.value.id ? userApi.updateUser : userApi.createUser

    action(dto.value)
      .then(() => {
        modal.hide("user")
        $toast.success(t("messages.success.saved"))
        getUserList()
      })
      .finally(() => (loading.value = false))
  }

  const deleteUser = (id: number, name: string) => {
    alert.confirmDelete().then((isConfirmed) => {
      if (isConfirmed) {
        userStore.loading = true
        userApi
          .deleteUser(id)
          .then(() => {
            $toast.success(t("messages.info.entity_deleted", { name }))
            getUserList()
          })
          .finally(() => (userStore.loading = false))
      }
    })
  }

  return {
    getUserList,
    filterUserList,
    debouncedFilterUserList,
    getUser,
    saveUser,
    deleteUser
  }
}
