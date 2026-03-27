import { ref } from "vue"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { SignIn } from "@entities/auth"
import { useAuthService } from "./auth.service"

const { authApiMock, reCaptchaMock } = vi.hoisted(() => ({
  authApiMock: {
    signIn: vi.fn()
  },
  reCaptchaMock: {
    recaptchaLoaded: vi.fn(),
    executeRecaptcha: vi.fn()
  }
}))

vi.mock("./auth.api", () => ({
  useAuthApi: () => authApiMock
}))

vi.mock("vue-recaptcha-v3", () => ({
  useReCaptcha: () => reCaptchaMock
}))

describe("features/auth/useAuthService", () => {
  beforeEach(() => {
    authApiMock.signIn.mockReset()
    reCaptchaMock.recaptchaLoaded.mockReset()
    reCaptchaMock.executeRecaptcha.mockReset()
  })

  it("signs in, stores the token and redirects to the home page", async () => {
    const replace = vi.fn()
    const profile = ref<ISessionProfile | undefined>()
    const payload = ref(new SignIn())
    const loading = ref(false)

    reCaptchaMock.recaptchaLoaded.mockResolvedValue(true)
    reCaptchaMock.executeRecaptcha.mockResolvedValue("captcha-token")
    authApiMock.signIn.mockResolvedValue({
      content: {
        token: "token-123",
        profile: { id: 7, name: "John" }
      }
    })

    vi.stubGlobal("useRouter", () => ({ replace }))
    vi.stubGlobal("useLocalePath", () => (path: string) => `/uz${path}`)
    vi.stubGlobal("useNuxtApp", () => ({ $session: { profile } }))

    await useAuthService().signIn(payload, loading)
    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(payload.value.hash).toBe("captcha-token")
    expect(localStorage.getItem("token")).toBe("token-123")
    expect(profile.value).toEqual({ id: 7, name: "John" })
    expect(replace).toHaveBeenCalledWith("/uz/")
    expect(loading.value).toBe(false)
  })

  it("does nothing when loading is already in progress", async () => {
    const payload = ref(new SignIn())
    const loading = ref(true)

    vi.stubGlobal("useRouter", () => ({ replace: vi.fn() }))
    vi.stubGlobal("useLocalePath", () => (path: string) => path)
    vi.stubGlobal("useNuxtApp", () => ({ $session: { profile: ref() } }))

    await useAuthService().signIn(payload, loading)

    expect(authApiMock.signIn).not.toHaveBeenCalled()
  })
})
