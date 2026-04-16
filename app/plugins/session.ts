export default defineNuxtPlugin(() => {
  const router = useRouter()
  const localePath = useLocalePath()

  const token = useLocalStorage("token", "", { writeDefaults: false })
  const loaded = useState<boolean>("loaded", () => ref(false)) // Profile is loaded
  const loading = useState<boolean>("loading", () => ref(false)) // Flag for loading
  const profile = useState<ISessionProfile | undefined>("profile", () => ref())

  const loggedIn = computed(() => token.value && profile.value?.id)

  watch(loggedIn, (value) => {
    if (!value) {
      token.value = ""
      profile.value = undefined
    }
  })

  const clear = () => {
    token.value = ""
    loading.value = false
    profile.value = undefined
    router.replace(localePath("/auth/sign-in"))
  }

  const session = {
    token,
    loaded,
    loading,
    profile,
    loggedIn,
    clear
  }

  return { provide: { session } }
})
