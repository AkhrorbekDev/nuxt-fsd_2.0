import { modalStore, useModal } from "./use-modal"

describe("shared/composables/useModal", () => {
  beforeEach(() => {
    modalStore.value = new Map()
  })

  it("registers and retrieves modal handlers", () => {
    const modal = useModal()
    const value = { show: vi.fn(), hide: vi.fn() }

    modal.setModal("profile", value)

    expect(modal.getModal("profile")).toStrictEqual(value)
  })

  it("delegates show and hide to the registered modal instance", () => {
    const modal = useModal()
    const value = { show: vi.fn(), hide: vi.fn() }

    modal.setModal("profile-password", value)
    modal.show("profile-password")
    modal.hide("profile-password")

    expect(value.show).toHaveBeenCalledTimes(1)
    expect(value.hide).toHaveBeenCalledTimes(1)
  })

  it("removes modal instances from the store", () => {
    const modal = useModal()

    modal.setModal("profile", { show: vi.fn(), hide: vi.fn() })
    modal.removeModal("profile")

    expect(modal.getModal("profile")).toBeUndefined()
  })
})
