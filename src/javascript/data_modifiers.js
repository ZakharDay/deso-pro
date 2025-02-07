function processDataRecentTrades(trades, quote) {
  let totalInUsd = 0
  let totalInFocus = 0
  let totalInDeso = 0

  // console.log(trades, quote)

  trades.data.tradingRecentTrades.nodes.reverse().forEach((trade) => {
    const { tradeType, tradeValueUsd, tradeBuyQuantity, tradeSellQuantity } =
      trade

    console.log(trade, quote, tradeType, tradeBuyQuantity, tradeSellQuantity)

    if (tradeType == 'BUY') {
      totalInUsd -= tradeValueUsd

      if (quote == 'DESO') {
        totalInDeso -= tradeSellQuantity
      }

      if (quote == 'FOCUS') {
        totalInFocus -= tradeSellQuantity
      }
    }

    if (tradeType == 'SELL') {
      totalInUsd += tradeValueUsd

      if (quote == 'DESO') {
        totalInDeso += tradeSellQuantity
      }

      if (quote == 'FOCUS') {
        totalInFocus += tradeBuyQuantity
      }
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

    // tradeBuyQuantity: 933.9255554736633
    // tradePriceDeso: 0.007269181776039969
    // tradePriceFocus: 111.17574938841915
    // tradePriceUsd: 0.10147777759351798
    // tradeSellQuantity: 141519.4928561733
    // tradeType: 'BUY'
    // tradeValueDeso: 6.788874628027159
    // tradeValueFocus: 103829.87350278014
    // tradeValueUsd: 94.77268980725914
  })

  // trades.data.tradingRecentTrades.pageInfo.hasNextPage
  // trades.data.tradingRecentTrades.pageInfo.hasPreviousPage

  return { totalInUsd, totalInFocus, totalInDeso }
}

export { processDataRecentTrades }
