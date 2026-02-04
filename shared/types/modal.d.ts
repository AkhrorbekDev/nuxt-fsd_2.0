type ModalId = number | string

interface IModalValue {
  show(args?: unknown): void
  hide(): void
}

interface IModal {}
