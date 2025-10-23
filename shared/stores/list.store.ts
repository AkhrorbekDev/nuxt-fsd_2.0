export const createListParams = <T = IStoreListParams>(params: T) => {
  return ref({
    page: 0,
    size: 10,
    total: 0,
    keyword: "",
    ...params
  })
}

export const createListState = <T>() => {
  const loading = ref(false)

  const items = ref<T[]>([])
  const filteredItems = ref<T[]>([])

  return { loading, items, filteredItems }
}

export const createListStore = <T, P = IStoreListParams>(entity: string) => {
  return defineStore(entity, () => {
    const state = createListState<T>()
    const params = createListParams<P>({} as P)

    return { ...state, params }
  })
}
