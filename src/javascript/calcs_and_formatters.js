function formatPrice(price, fraction) {
  return Number(price).toLocaleString(undefined, {
    maximumFractionDigits: fraction,
    minimumFractionDigits: fraction
  })
}

export { formatPrice }
