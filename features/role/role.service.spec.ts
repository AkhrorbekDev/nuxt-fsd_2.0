import { ref } from "vue"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { Role, useRoleStore } from "@entities/role"
import { useRoleService } from "./role.service"

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

const { roleApiMock } = vi.hoisted(() => ({
  roleApiMock: {
    getRoleList: vi.fn(),
    getRoleById: vi.fn(),
    createRole: vi.fn(),
    updateRole: vi.fn(),
    deleteRole: vi.fn()
  }
}))

vi.mock("./role.api", () => ({
  useRoleApi: () => roleApiMock
}))

describe("features/role/useRoleService", () => {
  beforeEach(() => {
    Object.values(roleApiMock).forEach((mock) => mock.mockReset())
  })

  it("fetches the role list and updates the role store", async () => {
    const store = useRoleStore()
    store.params.keyword = "  manager  "

    roleApiMock.getRoleList.mockResolvedValue({
      content: [{ id: 2, name: "Manager" }],
      pageable: { total: 3 }
    })

    vi.stubGlobal("useAlert", () => ({ confirmDelete: vi.fn() }))
    vi.stubGlobal("useModal", () => ({ hide: vi.fn() }))
    vi.stubGlobal("useI18n", () => ({ t: vi.fn((value: string) => value) }))
    vi.stubGlobal("useNuxtApp", () => ({ $toast: { success: vi.fn() } }))

    useRoleService().getRoleList()
    await flushPromises()

    expect(roleApiMock.getRoleList).toHaveBeenCalledWith(expect.objectContaining({ keyword: "manager" }))
    expect(store.items).toEqual([{ id: 2, name: "Manager" }])
    expect(store.params.total).toBe(3)
  })

  it("updates a role and refreshes the list", async () => {
    const hide = vi.fn()
    const success = vi.fn()
    const dto = ref(new Role())
    const loading = ref(false)

    dto.value.id = 4
    dto.value.name = "Supervisor"

    roleApiMock.updateRole.mockResolvedValue({})
    roleApiMock.getRoleList.mockResolvedValue({ content: [], pageable: { total: 0 } })

    vi.stubGlobal("useAlert", () => ({ confirmDelete: vi.fn() }))
    vi.stubGlobal("useModal", () => ({ hide }))
    vi.stubGlobal("useI18n", () => ({ t: vi.fn((value: string) => value) }))
    vi.stubGlobal("useNuxtApp", () => ({ $toast: { success } }))

    useRoleService().saveRole(dto, loading)
    await flushPromises()
    await flushPromises()

    expect(roleApiMock.updateRole).toHaveBeenCalledWith(dto.value)
    expect(hide).toHaveBeenCalledWith("role")
    expect(success).toHaveBeenCalledWith("messages.success.saved")
    expect(roleApiMock.getRoleList).toHaveBeenCalled()
    expect(loading.value).toBe(false)
  })
})
