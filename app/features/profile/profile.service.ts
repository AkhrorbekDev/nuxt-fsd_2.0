import { useProfileApi } from "~/features/profile"
import { Profile, ProfilePassword } from "~/entities/profile"

export const useProfileService = () => {
  const profileApi = useProfileApi()

  const modal = useModal()
  const { $session, $toast, $i18n } = useNuxtApp()

  const getProfile = async () => {
    try {
      const { content } = await profileApi.getProfile()
      $session.profile.value = content
      $session.loaded.value = true
    } catch (error: any) {
      const statusList = [401, 403]
      if (statusList.includes(error?.status) || error?.result?.code === "internal_server") $session.clear()
    }
  }

  const saveProfile = (dto: Ref<Profile>, loading: Ref<boolean>) => {
    loading.value = true
    profileApi
      .updateProfile(dto.value)
      .then(() => {
        modal.hide("profile")
        $toast.success($i18n.t("messages.success.saved"))
        getProfile()
      })
      .finally(() => (loading.value = false))
  }

  const changeProfilePassword = (dto: Ref<ProfilePassword>, loading: Ref<boolean>) => {
    loading.value = true
    profileApi
      .changeProfilePassword(dto.value)
      .then(() => {
        modal.hide("profile-password")
        $toast.success($i18n.t("messages.success.saved"))
      })
      .finally(() => (loading.value = false))
  }

  return { getProfile, saveProfile, changeProfilePassword }
}
