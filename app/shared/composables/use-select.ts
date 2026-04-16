interface UseSelectProps<T> {
  api: Function
  map?: (data: T[]) => ISelect[]
  params: Ref<Record<string, any>>
  el: Ref<HTMLElement>
  model: Ref<number | number[] | string | string[] | undefined>
  autoSelect?: boolean
  fetchOnOpen?: boolean
}

export const useSelect = <T>({
  api,
  map,
  params,
  el,
  model,
  autoSelect = false,
  fetchOnOpen = false
}: UseSelectProps<T>) => {
  const options = ref<ISelect[]>([])

  const getOptions = async () => {
    loading.value = true
    try {
      const { content } = await api(cleanParams({ ...params.value, page: 0 }))
      options.value = map ? map(content) : content
      if (el.value) await observe()
      if (autoSelect) model.value = options.value.at(0)?.value!
    } finally {
      loading.value = false
    }
  }

  const getInfiniteOptions = async () => {
    if (params.value.total < params.value.size) {
      return disconnect()
    }
    const { content } = await api(cleanParams(params.value)).finally(() => (loading.value = false))
    if (!content?.length) return disconnect()
    options.value = options.value.concat(map ? map(content) : content)
    params.value.page++
  }

  const onSearch = useDebounceFn((value: string) => {
    params.value.keyword = value || undefined
    params.value.page = 1
    disconnect()
    getOptions()
  }, 600)

  const onOpen = () => {
    if (fetchOnOpen) {
      params.value.page = 1
      getOptions()
    }
  }

  const onClose = () => {
    if (fetchOnOpen) disconnect()
  }

  onMounted(() => {
    if (!fetchOnOpen) getOptions()
  })

  const { loading, observe, disconnect } = useInfinite(el, getInfiniteOptions)

  return {
    loading,
    options,
    onSearch,
    onOpen,
    onClose
  }
}
