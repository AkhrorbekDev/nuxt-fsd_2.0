import Swal from "sweetalert2/dist/sweetalert2.js"
import type { SweetAlertOptions, SweetAlertResult } from "sweetalert2"

const alertOptions: SweetAlertOptions = {
  customClass: {
    cancelButton: "ui-button ui-button-md ui-button-white ui-button-secondary w-full",
    confirmButton: "ui-button ui-button-md ui-button-solid ui-button-primary w-full"
  }
}

const alert = Swal.mixin(alertOptions)
const toast = alert?.mixin({
  toast: true,
  backdrop: false,
  position: "bottom-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true
})

const confirmDialog = (
  options: SweetAlertOptions,
  color: string = "secondary",
  opacity: string = "600"
): Promise<SweetAlertResult> => {
  // @ts-ignore
  const c = COLORS[color][opacity]

  return alert?.fire({
    icon: "question",
    iconColor: c,
    showCancelButton: true,
    customClass: {
      cancelButton: "ui-button ui-button-md ui-button-white ui-button-secondary w-full",
      confirmButton: `ui-button ui-button-md ui-button-solid ui-button-${color} w-full`
    },
    ...options
  })
}

const successDialog = (options: SweetAlertOptions): Promise<SweetAlertResult> => {
  return alert?.fire({
    icon: "success",
    showConfirmButton: false,
    timer: 1500,
    ...options
  })
}

const infoDialog = (options: SweetAlertOptions): Promise<SweetAlertResult> => {
  return alert?.fire({
    icon: "info",
    showConfirmButton: false,
    timer: 1500,
    ...options
  })
}

const warningDialog = (options: SweetAlertOptions): Promise<SweetAlertResult> => {
  return alert?.fire({
    icon: "warning",
    showConfirmButton: false,
    timer: 1500,
    ...options
  })
}

const errorDialog = (options: SweetAlertOptions): Promise<SweetAlertResult> => {
  return alert?.fire({
    icon: "error",
    showConfirmButton: false,
    timer: 1500,
    ...options
  })
}

const successToast = (message: string | any, options?: SweetAlertOptions): Promise<SweetAlertResult> => {
  return toast?.fire({
    title: message,
    icon: "success",
    ...options
  })
}

const errorToast = (message: string | any, options?: SweetAlertOptions): Promise<SweetAlertResult> => {
  return toast?.fire({
    title: message,
    icon: "error",
    ...options
  })
}

const showToast = (options: SweetAlertOptions): Promise<SweetAlertResult> => {
  return toast?.fire(options)
}

export const useAlert = () => {
  const { t } = useI18n()

  const confirmSignOut = () => {
    const options = {
      title: t("messages.confirm.sign_out"),
      confirmButtonText: t("actions.sign_out"),
      cancelButtonText: t("actions.cancel")
    }

    return new Promise((resolve) =>
      confirmDialog(options, "danger").then(({ isConfirmed }) => {
        if (isConfirmed) resolve(isConfirmed)
      })
    )
  }

  const confirmDeactivate = () => {
    const options = {
      title: t("messages.confirm.deactivate"),
      confirmButtonText: t("actions.deactivate"),
      cancelButtonText: t("actions.cancel")
    }

    return new Promise((resolve) =>
      confirmDialog(options, "danger").then(({ isConfirmed }) => {
        if (isConfirmed) resolve(isConfirmed)
      })
    )
  }

  const confirmDelete = () => {
    const options = {
      title: t("messages.confirm.delete"),
      confirmButtonText: t("actions.delete"),
      cancelButtonText: t("actions.cancel")
    }

    return new Promise((resolve) =>
      confirmDialog(options, "danger").then(({ isConfirmed }) => {
        if (isConfirmed) resolve(isConfirmed)
      })
    )
  }

  return {
    confirmDialog,
    successDialog,
    infoDialog,
    warningDialog,
    errorDialog,
    successToast,
    errorToast,
    showToast,
    confirmSignOut,
    confirmDeactivate,
    confirmDelete
  }
}
