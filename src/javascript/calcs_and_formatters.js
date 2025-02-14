function formatPrice(price, fraction) {
  // console.log(price, Number(price))

  return Number(price).toLocaleString(undefined, {
    maximumFractionDigits: fraction,
    minimumFractionDigits: fraction
  })
}

function formatQuantity(num, digits) {
  let negative = false

  if (num < 0) {
    negative = true
    num = -num
  }

  const lookup = [
    { value: 1, symbol: '' },
    { value: 1e3, symbol: 'k' },
    { value: 1e6, symbol: 'M' },
    { value: 1e9, symbol: 'G' },
    { value: 1e12, symbol: 'T' },
    { value: 1e15, symbol: 'P' },
    { value: 1e18, symbol: 'E' }
  ]

  const regexp = /\.0+$|(?<=\.[0-9]*[1-9])0+$/
  const item = lookup.findLast((item) => num >= item.value)

  let finalNumber = item
    ? (num / item.value).toFixed(digits).replace(regexp, '').concat(item.symbol)
    : '0'

  if (negative) {
    finalNumber = `-${finalNumber}`
  }

  return finalNumber
}

function hexNanosToNumber(hex) {
  return Number(hex) / 1000000000000000000
}

function hexNanosToOrderQuantity(hex) {
  return Number(hex) / 1000000000000000000 - 0.0001
}

const CalcsAndFormatters = {
  formatPrice,
  formatQuantity,
  hexNanosToNumber,
  hexNanosToOrderQuantity
}

export { CalcsAndFormatters }
