interface ITableCol<T> {
  name: Extract<keyof T, string> | string
  label?: string
  headClass?: string
  dataClass?: string
  labelClass?: string
  sortField?: string
  formatter?: (value: any, row: T) => any
  withoutLink?: boolean
  visible?: boolean
  fixed?: boolean
  width?: string
  index?: number
}

interface ITableState {
  container: HTMLElement | undefined
  rows: Map<number, HTMLElement>
}
