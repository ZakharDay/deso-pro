function formatPrice(price, fraction) {
  // console.log(price, Number(price))

  return Number(price).toLocaleString(undefined, {
    maximumFractionDigits: fraction,
    minimumFractionDigits: fraction
  })
}

export { formatPrice }
