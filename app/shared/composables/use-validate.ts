import { get } from "lodash-es"
import { useVuelidate } from "@vuelidate/core"

import type { MaybeRef, Ref } from "vue"
import type { ValidationArgs } from "@vuelidate/core"

type Form<T> = { [key in keyof T]: any }

export function useValidate<T extends Form<V>, V extends ValidationArgs>(form: MaybeRef<T>, rules: Ref<V>) {
  const vuelidate = useVuelidate(rules, form)

  const hasError = (key: Paths<T>) => {
    const value = get(vuelidate.value, key)
    const invalid = value?.$error
    const hint = value?.$errors[0]?.$message
    return { invalid, hint }
  }

  return { vuelidate, hasError }
}
