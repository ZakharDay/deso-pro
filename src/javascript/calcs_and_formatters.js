function formatPrice(price, fraction) {
  // console.log(price, Number(price))

  return Number(price).toLocaleString(undefined, {
    maximumFractionDigits: fraction,
    minimumFractionDigits: fraction
  })
}

function hexNanosToNumber(hex) {
  return Number(hex) / 1000000000000000000
}

function hexNanosToOrderQuantity(hex) {
  return Number(hex) / 1000000000000000000 - 0.0001
}

const CalcsAndFormatters = {
  formatPrice,
  hexNanosToNumber,
  hexNanosToOrderQuantity
}

export { CalcsAndFormatters }
