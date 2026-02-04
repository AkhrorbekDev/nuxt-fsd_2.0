interface IContent {
  en: string
  ru: string
  uz: string
}

interface IResult {
  code: string
  description: string
}

interface IPagination {
  total: number
  prev: number
  next: number
  current: number
}

interface IResponse<T> {
  content: T
  errors?: string[]
  pageable?: IPagination
}

type ResponseContainer<T = any> = IResponse<T>
type AsyncResponseContainer<T = any> = Promise<IResponse<T>>

interface PaginationParams {
  keyword: string
  page: number
  size: number
  total: number
}
