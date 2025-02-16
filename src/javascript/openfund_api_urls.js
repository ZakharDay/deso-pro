const desoHistoryUrl =
  'https://focus.xyz/api/v0/tokens/candlesticks/history?symbol=BC1YLbnP7rndL92x7DbLp6bkUpCgKmgoHgz7xEbwhgHTps3ZrXA6LtQ&to=1739609026000&resolution=3H&countback=329&quoteSymbol=BC1YLiwTN3DbkU8VmD7F7wXcRR1tFX6jDEkLyruHD2WsH3URomimxLX'

const focusHistoryUrl =
  'https://focus.xyz/api/v0/tokens/candlesticks/history?symbol=BC1YLjEayZDjAPitJJX4Boy7LsEfN3sWAkYb3hgE9kGBirztsc2re1N&to=1739608745000&resolution=3H&countback=330&quoteSymbol=BC1YLbnP7rndL92x7DbLp6bkUpCgKmgoHgz7xEbwhgHTps3ZrXA6LtQ'

const openfundHistoryUrl =
  'https://focus.xyz/api/v0/tokens/candlesticks/history?symbol=BC1YLj3zNA7hRAqBVkvsTeqw7oi4H6ogKiAFL1VXhZy6pYeZcZ6TDRY&to=1739608976000&resolution=3H&countback=329&quoteSymbol=BC1YLbnP7rndL92x7DbLp6bkUpCgKmgoHgz7xEbwhgHTps3ZrXA6LtQ'

const isHodlingPublicKeyUrl =
  'https://blockproducer.deso.org/api/v0/is-hodling-public-key'

const getExchangeRate =
  'https://blockproducer.deso.org/api/v0/get-exchange-rate'

const getQuoteCurrencyPriceInUsd =
  'https://blockproducer.deso.org/api/v0/get-quote-currency-price-in-usd'

const getCoinProperties = 'https://amm.deso.com/api/v0/get-coin-properties'

const createDaoCoinLimitOrderWithFeeUrl =
  'https://blockproducer.deso.org/api/v0/create-dao-coin-limit-order-with-fee'

const focusGqlUrl = 'https://dev-graphql.focus.xyz/graphql'

const OpenfundApiUrls = {
  desoHistoryUrl,
  focusHistoryUrl,
  openfundHistoryUrl,
  isHodlingPublicKeyUrl,
  getExchangeRate,
  getQuoteCurrencyPriceInUsd,
  getCoinProperties,
  createDaoCoinLimitOrderWithFeeUrl,
  focusGqlUrl
}

export { OpenfundApiUrls }
