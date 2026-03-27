import { cleanParams, disableKeys, getLast, transformParams } from "./common"

describe("shared/lib/common", () => {
  it("cleans params by trimming strings and dropping undefined values", () => {
    const params = {
      keyword: "  admin  ",
      empty: "   ",
      page: 0,
      enabled: false,
      omitted: undefined
    }

    expect(cleanParams(params)).toEqual({
      keyword: "admin",
      page: 0,
      enabled: false
    })
  })

  it("transforms params with the provided mapping", () => {
    const params = { keyword: "john", page: 2 }

    const transformed = transformParams(params, {
      search: (value: string | undefined) => value ?? params.keyword,
      offset: (_value: unknown, result: Record<string, unknown>) => params.page * 10 + Number(!!result.search)
    })

    expect(transformed).toEqual({
      search: "john",
      offset: 21
    })
  })

  it("prevents keys from the blocked list", () => {
    const preventDefault = vi.fn()

    disableKeys({ key: "Enter", preventDefault } as unknown as KeyboardEvent, ["Enter", "Escape"])

    expect(preventDefault).toHaveBeenCalledTimes(1)
  })

  it("returns the last item or null for invalid inputs", () => {
    expect(getLast([1, 2, 3])).toBe(3)
    expect(getLast([])).toBeNull()
    expect(getLast(null as never)).toBeNull()
  })
})
