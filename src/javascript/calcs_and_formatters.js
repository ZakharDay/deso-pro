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

export { formatPrice, hexNanosToNumber }
