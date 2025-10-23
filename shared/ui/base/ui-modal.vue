<script setup lang="ts">
interface Props {
  id: string | number
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "full"
  label?: string
  description?: string
  appendTo?: string
  loading?: boolean
  closable?: boolean
  overflow?: boolean
  closeOnEsc?: boolean
  closeOnBackdrop?: boolean
}

interface Emits {
  (e: "before-show", args?: any): void
  (e: "show", args?: any): void
  (e: "shown", args?: any): void
  (e: "before-hide"): void
  (e: "hide"): void
  (e: "hidden"): void
  (e: "close"): void
  (e: "submit"): void
}

const props = withDefaults(defineProps<Props>(), {
  size: "sm",
  closable: true,
  overflow: true,
  closeOnEsc: true,
  closeOnBackdrop: false
})

const emits = defineEmits<Emits>()

const modal = useModal()
const visible = ref<boolean>(false)
const backdrop = ref<HTMLElement>()
const args = ref()

const modalClass = computed(() => ({
  "ui-modal": true,
  ["ui-modal-" + props.size]: props.size
}))

const enableDocumentSettings = () => document.body.classList.add("!overflow-hidden")
const disableDocumentSettings = () => document.body.classList.remove("!overflow-hidden")

const onKeyDown = (event: KeyboardEvent) => {
  if (props.closable && props.closeOnEsc && event.code === "Escape") onClose()
  if (event.code === "Enter") emits("submit")
}

const onBackdropClick = (event: Event) => {
  if (props.closable && props.closeOnBackdrop && backdrop.value === event.target) onClose()
}

const bindDocumentKeydownListener = () => window.document.addEventListener("keydown", onKeyDown)
const unbindDocumentKeydownListener = () => window.document.removeEventListener("keydown", onKeyDown)

const appendContainer = () => {
  if (props.appendTo && backdrop.value) {
    if (props.appendTo === "body") document.body.appendChild(backdrop.value)
    else document.getElementById(props.appendTo)?.appendChild(backdrop.value)
  }
}

const removeContainer = () => {
  if (props.appendTo && backdrop.value) {
    if (props.appendTo === "body") document.body.removeChild(backdrop.value)
    else document.getElementById(props.appendTo)?.removeChild(backdrop.value)
  }
}

const onBeforeEnter = () => {
  bindDocumentKeydownListener()
  appendContainer()
  emits("before-show", args.value)
}

const onEnter = () => emits("show", args.value)

const onAfterEnter = () => {
  enableDocumentSettings()
  emits("shown", args.value)
}

const onBeforeLeave = () => {
  disableDocumentSettings()
  emits("before-hide")
}

const onLeave = () => emits("hide")

const onAfterLeave = () => {
  unbindDocumentKeydownListener()
  removeContainer()
  emits("hidden")
  args.value = undefined
}

const show = (props?: unknown) => {
  args.value = props
  visible.value = true
}

const hide = () => (visible.value = false)

const onClose = () => {
  emits("close")
  hide()
}

onMounted(() => {
  if (props.id) modal.setModal(props.id, { show, hide })
})

onBeforeUnmount(() => {
  disableDocumentSettings()
  if (props.id) modal.removeModal(props.id)
})
</script>

<template>
  <transition name="ui-modal-backdrop">
    <div v-show="visible" class="ui-modal-backdrop" ref="backdrop" @click="onBackdropClick">
      <transition
        name="ui-modal"
        @before-enter="onBeforeEnter"
        @enter="onEnter"
        @after-enter="onAfterEnter"
        @before-leave="onBeforeLeave"
        @leave="onLeave"
        @after-leave="onAfterLeave"
      >
        <div v-if="visible" v-drag :class="modalClass">
          <div class="ui-modal-content">
            <slot name="header" :hide="onClose">
              <div class="ui-modal-header" name="drag-trigger">
                <div>
                  <h3 class="ui-modal-header-title">{{ label }}</h3>
                  <p class="ui-modal-header-description">{{ description }}</p>
                </div>

                <slot name="header-action">
                  <ui-icon-button
                    variant="white"
                    color="secondary"
                    icon-class="text-xl"
                    icon-name="lucide:x"
                    @mousedown.stop.prevent
                    @click="onClose"
                  />
                </slot>
              </div>
            </slot>

            <div :class="loading ? 'overflow-hidden' : overflow ? 'relative overflow-y-auto' : ''">
              <slot />

              <div v-if="loading" class="ui-modal-loading">
                <ui-line-loading />
              </div>
            </div>

            <slot name="footer" :hide="onClose" />
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>
