import { get, isEmpty } from "lodash-es"

export const capitalize = (str: string): string => (str ? str.charAt(0).toUpperCase() + str.slice(1) : "")
export const truncate = (str: string, max: number) => (str.length > max ? str.substring(0, max - 1).concat("...") : str)
export const padZero = (value: number) => (value < 10 ? `0${value}` : value)

export const splitAndTrim = (value: string, separator: string) => {
  if (!value) return []

  return value
    ?.trim()
    ?.split(separator)
    ?.map((value) => value?.trim())
}

export const fullName = (n: string, sn: string, separator = " ") => {
  const name: string = capitalize(n?.trim())
  const surname: string = capitalize(sn?.trim())

  return `${name}${separator}${surname}`.trim()
}

export const emptyValue = (value: string) => {
  return isEmpty(value) ? "N/A" : value
}

export const localeValue = (record: Record<string, any>, locale = "ru", key = "name") => {
  return get(record, `${key}_${locale}`)
}
