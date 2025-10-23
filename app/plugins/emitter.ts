import mitt from "mitt"
import type { Handler } from "mitt"

export default defineNuxtPlugin(() => {
  const mitter = mitt<IMitt>()

  const listen = <Key extends keyof IMitt>(type: Key, handler: Handler<IMitt[Key]>) => {
    onMounted(() => mitter.on(type, handler))
    onBeforeUnmount(() => mitter.off(type, handler))
  }

  return {
    provide: {
      listen,
      mitt: mitter.emit,
      mitter
    }
  }
})
