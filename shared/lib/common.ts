import { clone, pickBy } from "lodash-es"

export const cleanParams = (params: Record<string, any>) => {
  const clonedParams = clone(params)

  for (const key in clonedParams) {
    const value = clonedParams[key]
    if (typeof value === "string") {
      const trimmedValue = value.trim()
      clonedParams[key] = trimmedValue.length > 0 ? trimmedValue : null
    }
  }

  return pickBy(clonedParams, (value) => value != undefined)
}

export const transformParams = (cleanedParams: Record<string, any>, transformations: Record<string, Function>) => {
  const transformedParams: Record<string, any> = {}

  for (const [key, transformFn] of Object.entries(transformations)) {
    transformedParams[key] = transformFn(cleanedParams[key], transformedParams)
  }

  return cleanedParams
}

export const disableKeys = (event: KeyboardEvent, keys: string[]) => {
  if (keys.includes(event.key)) event.preventDefault()
}


export const getLast = (arr: Array<any>) => {
  if (!arr || arr.length === 0 || !Array.isArray(arr)) return null
  return arr[arr.length - 1]
}

export const sessionLocale: RemovableRef<string | null | undefined> = useSessionStorage("locale", null)
