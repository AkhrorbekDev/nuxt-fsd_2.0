export const currencyFormatter = new Intl.NumberFormat("ru", {
  style: "decimal",
  maximumFractionDigits: 0
})

export const formatCurrency = (amount: number = 0, currency: string) => {
  return currencyFormatter
    .format(amount / 100)
    .concat(" ")
    .concat(currency)
}
