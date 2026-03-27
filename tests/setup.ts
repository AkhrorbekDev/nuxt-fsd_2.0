import { createPinia, defineStore, setActivePinia } from "pinia"
import { computed, nextTick, reactive, ref, shallowRef, watch } from "vue"
import { afterEach, beforeEach, vi } from "vitest"

const stateMap = new Map<string, unknown>()

Object.assign(globalThis, {
  computed,
  defineStore,
  nextTick,
  reactive,
  ref,
  shallowRef,
  watch,
  onBeforeMount: vi.fn(),
  onBeforeUnmount: vi.fn(),
  onMounted: vi.fn((callback?: () => unknown) => callback?.()),
  useId: vi.fn(() => "test-id")
})

vi.stubGlobal(
  "useSessionStorage",
  vi.fn((_key: string, initialValue: unknown) => ref(initialValue))
)
vi.stubGlobal(
  "useLocalStorage",
  vi.fn((_key: string, initialValue: unknown) => ref(initialValue))
)
vi.stubGlobal(
  "useState",
  vi.fn((key: string, init?: () => unknown) => {
    if (!stateMap.has(key)) stateMap.set(key, init ? init() : ref())
    return stateMap.get(key)
  })
)

const common = await import("../shared/lib/common")
const listStore = await import("../shared/stores/list.store")

Object.assign(globalThis, common, listStore)

beforeEach(() => {
  stateMap.clear()
  setActivePinia(createPinia())
  localStorage.clear()
  sessionStorage.clear()
})

afterEach(() => {
  vi.clearAllMocks()
})
