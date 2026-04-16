import { SignIn } from "~/entities/auth"

export const useAuthApi = () => {
  const BASE_URL = "/auth"
  const { $http } = useNuxtApp()

  const signIn = (payload: SignIn): AsyncResponseContainer<ISignIn> => {
    return $http.$post(`${BASE_URL}/sign-in`, payload)
  }

  return { signIn }
}
