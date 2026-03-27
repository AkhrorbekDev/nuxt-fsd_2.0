import { ref } from "vue"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { User, useUserStore } from "@entities/user"
import { useUserService } from "./user.service"

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

const { userApiMock } = vi.hoisted(() => ({
  userApiMock: {
    getUserList: vi.fn(),
    getUserById: vi.fn(),
    createUser: vi.fn(),
    updateUser: vi.fn(),
    deleteUser: vi.fn()
  }
}))

vi.mock("./user.api", () => ({
  useUserApi: () => userApiMock
}))

describe("features/user/useUserService", () => {
  beforeEach(() => {
    Object.values(userApiMock).forEach((mock) => mock.mockReset())
  })

  it("fetches the user list and updates the list store", async () => {
    const store = useUserStore()
    store.params.keyword = "  admin  "

    userApiMock.getUserList.mockResolvedValue({
      content: [{ id: 1, name: "John" }],
      pageable: { total: 17 }
    })

    vi.stubGlobal("useAlert", () => ({ confirmDelete: vi.fn() }))
    vi.stubGlobal("useModal", () => ({ hide: vi.fn() }))
    vi.stubGlobal("useI18n", () => ({ t: vi.fn((value: string) => value) }))
    vi.stubGlobal("useNuxtApp", () => ({ $toast: { success: vi.fn() } }))

    useUserService().getUserList()
    await flushPromises()

    expect(userApiMock.getUserList).toHaveBeenCalledWith(expect.objectContaining({ keyword: "admin" }))
    expect(store.items).toEqual([{ id: 1, name: "John" }])
    expect(store.params.total).toBe(17)
    expect(store.loading).toBe(false)
  })

  it("creates a user, closes the modal and refreshes the list", async () => {
    const hide = vi.fn()
    const success = vi.fn()
    const store = useUserStore()
    const dto = ref(new User())
    const loading = ref(false)

    dto.value.name = "Jane"

    userApiMock.createUser.mockResolvedValue({})
    userApiMock.getUserList.mockResolvedValue({ content: [], pageable: { total: 0 } })

    vi.stubGlobal("useAlert", () => ({ confirmDelete: vi.fn() }))
    vi.stubGlobal("useModal", () => ({ hide }))
    vi.stubGlobal("useI18n", () => ({ t: vi.fn((value: string) => value) }))
    vi.stubGlobal("useNuxtApp", () => ({ $toast: { success } }))

    useUserService().saveUser(dto, loading)
    await flushPromises()
    await flushPromises()

    expect(userApiMock.createUser).toHaveBeenCalledWith(dto.value)
    expect(hide).toHaveBeenCalledWith("user")
    expect(success).toHaveBeenCalledWith("messages.success.saved")
    expect(userApiMock.getUserList).toHaveBeenCalled()
    expect(store.loading).toBe(false)
    expect(loading.value).toBe(false)
  })

  it("deletes a user after confirmation", async () => {
    const success = vi.fn()
    const confirmDelete = vi.fn().mockResolvedValue(true)

    userApiMock.deleteUser.mockResolvedValue({})
    userApiMock.getUserList.mockResolvedValue({ content: [], pageable: { total: 0 } })

    vi.stubGlobal("useAlert", () => ({ confirmDelete }))
    vi.stubGlobal("useModal", () => ({ hide: vi.fn() }))
    vi.stubGlobal("useI18n", () => ({ t: vi.fn((value: string) => value) }))
    vi.stubGlobal("useNuxtApp", () => ({ $toast: { success } }))

    useUserService().deleteUser(5, "Jane")
    await flushPromises()
    await flushPromises()

    expect(confirmDelete).toHaveBeenCalledTimes(1)
    expect(userApiMock.deleteUser).toHaveBeenCalledWith(5)
    expect(success).toHaveBeenCalledWith("messages.info.entity_deleted")
  })
})
