import {
  focusKey,
  desoProxyKey,
  usdcKey,
  desoKey,
  holdingsPanelId,
  myTokensPanelId
} from './constants'

function processDataRecentTrades(trades, quote) {
  let totalInUsd = 0
  let totalInFocus = 0
  let totalInDeso = 0

  // console.log(trades, quote)

  trades.data.tradingRecentTrades.nodes.reverse().forEach((trade) => {
    const { tradeType, tradeValueUsd, tradeBuyQuantity, tradeSellQuantity } =
      trade

    // console.log(trade, quote, tradeType, tradeBuyQuantity, tradeSellQuantity)

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

function processDataTradeTransactions(transactions) {
  let totalInUsd = 0.0
  let totalInUsdc = 0.0
  let totalInDeso = 0.0
  let totalInFocus = 0.0

  transactions.sort((a, b) => {
    var dateA = new Date(a.tradeTimestamp)
    var dateB = new Date(b.tradeTimestamp)

    if (dateA < dateB) return -1
    if (dateA > dateB) return 1
    return 0
  })

  // let uniqueTransactions = [
  //   ...new Set(transactions.map((item) => item.txnHashHex))
  // ]

  const uniqueTransactions = [
    ...new Map(transactions.map((item) => [item['txnHashHex'], item])).values()
  ]

  // console.log('transactions', uniqueTransactions)

  uniqueTransactions.forEach((transaction) => {
    // console.log(transaction)

    const {
      denominatedCoinPublicKey,
      tradeBuyQuantity,
      tradeSellQuantity,
      tradeValueFocus
    } = transaction

    let token = transaction.tokenUsername
    let type = transaction.tradeType
    let quote = ''

    if (denominatedCoinPublicKey == focusKey) {
      quote = 'FOCUS'
    }

    if (denominatedCoinPublicKey == desoProxyKey) {
      quote = 'DESO'
    }

    if (denominatedCoinPublicKey == desoKey) {
      quote = 'DESO'
    }

    if (denominatedCoinPublicKey == usdcKey) {
      quote = 'USDC'
    }

    if (type == 'BUY' && quote == 'DESO') {
      if (token == 'focus') {
        // TOKEN
        totalInFocus += tradeBuyQuantity
      }

      // DESO
      totalInDeso -= tradeSellQuantity
    }

    if (type == 'BUY' && quote == 'USDC') {
      if (token == 'focus') {
        // TOKEN
        totalInFocus += tradeBuyQuantity
      }

      if (token == 'DESO') {
        totalInDeso += tradeBuyQuantity
      }

      // DESO
      totalInUsdc -= tradeSellQuantity
    }

    if (type == 'BUY' && quote == 'FOCUS') {
      // totalInFocus -= tradeBuyQuantity
      totalInFocus -= tradeSellQuantity
    }

    //
    //
    //
    if (type == 'SELL' && quote == 'DESO') {
      if (token == 'focus') {
        console.log('NEVER')
        totalInFocus -= tradeSellQuantity
      }

      totalInDeso += tradeBuyQuantity
    }

    if (type == 'SELL' && quote == 'USDC') {
      if (token == 'DESO') {
        console.log('NEVER')

        totalInDeso -= tradeSellQuantity
      }

      if (token == 'focus') {
        totalInFocus -= tradeSellQuantity
      }

      totalInUsdc += tradeBuyQuantity
    }

    if (type == 'SELL' && quote == 'FOCUS') {
      totalInFocus += tradeBuyQuantity
      // totalInFocus += tradeValueFocus
    }

    // console.log(`${token} ${type} with/for ${quote}`, transaction)

    if (token == 'focus' || quote == 'FOCUS') {
      let operator
      let parameter
      let sum

      if (type == 'BUY' && quote != 'FOCUS') {
        operator = '+'
        parameter = 'tradeBuyQuantity'
        sum = tradeBuyQuantity
      }

      if (type == 'BUY' && quote == 'FOCUS') {
        operator = '-'
        parameter = 'tradeBuyQuantity'
        sum = tradeSellQuantity
      }

      if (type == 'SELL' && quote != 'FOCUS') {
        operator = '-'
        parameter = 'tradeBuyQuantity'
        sum = tradeSellQuantity
      }

      if (type == 'SELL' && quote == 'FOCUS') {
        operator = '+'
        parameter = 'tradeBuyQuantity'
        sum = tradeBuyQuantity
      }

      console.log(type, token, quote, operator, parameter, sum, transaction)
    }
  })

  console.log(
    'USDC: ',
    totalInUsdc,
    'DESO: ',
    totalInDeso,
    'FOCUS: ',
    totalInFocus
  )

  // denominatedCoinPublicKey: 'BC1YLjEayZDjAPitJJX4Boy7LsEfN3sWAkYb3hgE9kGBirztsc2re1N'
  // tokenCategory: 'MEME'
  // tokenMarketCapFocus: 5218640.0710390285
  // tokenMarketCapUsd: 4913.751462168715
  // tokenProfilePicUrl: 'https://images.deso.org/4675b93cffcbdf2002db74f23b9f061896de54849872fee1cfaa92d4fd4a0c8a.webp'
  // tokenPublicKey: 'BC1YLgJ2JXDUJDiN4FRm7U4FkWKLe7jMGVRdU93PzGoWBLZio3L6bJV'
  // tokenUsername: 'turts'
  // tradeBuyCoinPublicKey: 'BC1YLgJ2JXDUJDiN4FRm7U4FkWKLe7jMGVRdU93PzGoWBLZio3L6bJV'
  // tradeBuyQuantity: 3833.14993402884
  // tradePriceDeso: 0.0017988827092308445
  // tradePriceFocus: 26.708787783736444
  // tradePriceUsd: 0.02514838027504721
  // tradeSellCoinPublicKey: 'BC1YLjEayZDjAPitJJX4Boy7LsEfN3sWAkYb3hgE9kGBirztsc2re1N'
  // tradeSellQuantity: 127644.0359930062
  // tradeTimestamp: '2025-02-05T01:59:01.088482'
  // tradeType: 'BUY'
  // tradeValueDeso: 6.895387138213833
  // tradeValueFocus: 102378.78813121963
  // tradeValueUsd: 96.39751219222939
}

export { processDataRecentTrades, processDataTradeTransactions }
