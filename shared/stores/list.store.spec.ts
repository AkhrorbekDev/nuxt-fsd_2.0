import { createListParams, createListState, createListStore } from "./list.store"

describe("shared/stores/list.store", () => {
  it("creates list params with defaults", () => {
    const params = createListParams({ size: 25, keyword: "role" })

    expect(params.value).toEqual({
      page: 0,
      size: 25,
      total: 0,
      keyword: "role"
    })
  })

  it("creates a reusable list state", () => {
    const state = createListState<{ id: number }>()

    expect(state.loading.value).toBe(false)
    expect(state.items.value).toEqual([])
    expect(state.filteredItems.value).toEqual([])
  })

  it("creates a pinia store with list state and params", () => {
    const useTestStore = createListStore<{ id: number }, { keyword: string }>("test-list")
    const store = useTestStore()

    store.items = [{ id: 1 }]
    store.params.keyword = "users"

    expect(store.items).toEqual([{ id: 1 }])
    expect(store.params.page).toBe(0)
    expect(store.params.keyword).toBe("users")
  })
})
