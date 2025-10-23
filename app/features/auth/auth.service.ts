import { useReCaptcha } from "vue-recaptcha-v3"
import { useAuthApi } from "~/features/auth"
import type { SignIn } from "~/entities/auth"

export const useAuthService = () => {
  const authApi = useAuthApi()
  const router = useRouter()
  const localePath = useLocalePath()
  const reCaptcha = useReCaptcha()

  const { $session } = useNuxtApp()

  const signIn = async (payload: Ref<SignIn>, loading: Ref<boolean>) => {
    if (loading.value) return

    const isLoaded = await reCaptcha?.recaptchaLoaded()
    if (isLoaded) payload.value.hash = await reCaptcha?.executeRecaptcha("login")!

    loading.value = true

    authApi
      .signIn(payload.value)
      .then(({ content }) => {
        if (!content.token) return
        localStorage.setItem("token", content.token)
        $session.profile.value = content.profile
        router.replace(localePath("/"))
      })
      .finally(() => (loading.value = false))
  }

  return { signIn }
}
