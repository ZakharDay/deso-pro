function processDataRecentTrades(trades) {
  let totalInUsd = 0
  let totalInQuote = 0

  trades.data.tradingRecentTrades.nodes.reverse().forEach((trade) => {
    // console.log(trade)

    const { tradeType, tradeValueUsd } = trade

    if (tradeType == 'BUY') {
      totalInUsd -= tradeValueUsd
    }

    if (tradeType == 'SELL') {
      totalInUsd += tradeValueUsd
    }

    // tradeBuyQuantity: 88580.39921466979
    // tradePriceDeso: 0.04489487343417741
    // tradePriceFocus: 764.162547004051
    // tradePriceUsd: 0.6357114078279521
    // tradeSellQuantity: 100
    // tradeType: 'SELL'
    // tradeValueDeso: 4.489487343417741
    // tradeValueFocus: 76416.25470040512
    // tradeValueUsd: 63.57114078279521
  })

  // trades.data.tradingRecentTrades.pageInfo.hasNextPage
  // trades.data.tradingRecentTrades.pageInfo.hasPreviousPage

  return totalInUsd
}

export { processDataRecentTrades }
