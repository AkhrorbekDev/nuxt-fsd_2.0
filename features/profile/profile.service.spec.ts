import { ref } from "vue"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { Profile, ProfilePassword } from "@entities/profile"
import { useProfileService } from "./profile.service"

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

const { profileApiMock } = vi.hoisted(() => ({
  profileApiMock: {
    getProfile: vi.fn(),
    updateProfile: vi.fn(),
    changeProfilePassword: vi.fn()
  }
}))

vi.mock("./profile.api", () => ({
  useProfileApi: () => profileApiMock
}))

describe("features/profile/useProfileService", () => {
  beforeEach(() => {
    profileApiMock.getProfile.mockReset()
    profileApiMock.updateProfile.mockReset()
    profileApiMock.changeProfilePassword.mockReset()
  })

  it("loads the profile into the current session", async () => {
    const session = {
      profile: ref<ISessionProfile | undefined>(),
      loaded: ref(false),
      clear: vi.fn()
    }

    profileApiMock.getProfile.mockResolvedValue({
      content: { id: 9, name: "Ava" }
    })

    vi.stubGlobal("useModal", () => ({ hide: vi.fn() }))
    vi.stubGlobal("useNuxtApp", () => ({
      $session: session,
      $toast: { success: vi.fn() },
      $i18n: { t: vi.fn((value: string) => value) }
    }))

    await useProfileService().getProfile()

    expect(session.profile.value).toEqual({ id: 9, name: "Ava" })
    expect(session.loaded.value).toBe(true)
    expect(session.clear).not.toHaveBeenCalled()
  })

  it("clears the session on unauthorized profile fetch", async () => {
    const session = {
      profile: ref<ISessionProfile | undefined>(),
      loaded: ref(false),
      clear: vi.fn()
    }

    profileApiMock.getProfile.mockRejectedValue({ status: 401 })

    vi.stubGlobal("useModal", () => ({ hide: vi.fn() }))
    vi.stubGlobal("useNuxtApp", () => ({
      $session: session,
      $toast: { success: vi.fn() },
      $i18n: { t: vi.fn((value: string) => value) }
    }))

    await useProfileService().getProfile()

    expect(session.clear).toHaveBeenCalledTimes(1)
  })

  it("saves profile data and refreshes the session profile", async () => {
    const hide = vi.fn()
    const success = vi.fn()
    const session = {
      profile: ref<ISessionProfile | undefined>(),
      loaded: ref(false),
      clear: vi.fn()
    }
    const dto = ref(new Profile({ name: "Updated" }))
    const loading = ref(false)

    profileApiMock.updateProfile.mockResolvedValue({})
    profileApiMock.getProfile.mockResolvedValue({
      content: { id: 4, name: "Updated" }
    })

    vi.stubGlobal("useModal", () => ({ hide }))
    vi.stubGlobal("useNuxtApp", () => ({
      $session: session,
      $toast: { success },
      $i18n: { t: vi.fn((value: string) => value) }
    }))

    useProfileService().saveProfile(dto, loading)
    await flushPromises()
    await flushPromises()

    expect(profileApiMock.updateProfile).toHaveBeenCalledWith(dto.value)
    expect(hide).toHaveBeenCalledWith("profile")
    expect(success).toHaveBeenCalledWith("messages.success.saved")
    expect(session.profile.value).toEqual({ id: 4, name: "Updated" })
    expect(loading.value).toBe(false)
  })

  it("changes the profile password and closes the password modal", async () => {
    const hide = vi.fn()
    const success = vi.fn()
    const dto = ref(new ProfilePassword())
    const loading = ref(false)

    profileApiMock.changeProfilePassword.mockResolvedValue({})

    vi.stubGlobal("useModal", () => ({ hide }))
    vi.stubGlobal("useNuxtApp", () => ({
      $session: { profile: ref(), loaded: ref(false), clear: vi.fn() },
      $toast: { success },
      $i18n: { t: vi.fn((value: string) => value) }
    }))

    useProfileService().changeProfilePassword(dto, loading)
    await flushPromises()

    expect(profileApiMock.changeProfilePassword).toHaveBeenCalledWith(dto.value)
    expect(hide).toHaveBeenCalledWith("profile-password")
    expect(success).toHaveBeenCalledWith("messages.success.saved")
    expect(loading.value).toBe(false)
  })
})
