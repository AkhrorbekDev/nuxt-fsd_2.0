import { useProfileService } from "~/features/profile"

export default defineNuxtRouteMiddleware(async () => {
  const { getProfile } = useProfileService()
  const { $session } = useNuxtApp()

  const hasToken = !!$session.token.value

  const promise = new Promise((resolve) => setTimeout(resolve, 2500))

  if (!$session.loaded.value) {
    await promise
    $session.loaded.value = true
  }

  if (hasToken && !$session.profile.value) await getProfile()
  // if (unauthorized) return navigateTo(localePath("/auth/sign-in"))
})
