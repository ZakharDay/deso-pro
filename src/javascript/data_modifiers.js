import { Store } from './store'
import { Constants } from './constants'
import { CalcsAndFormatters } from './calcs_and_formatters'

function processJsonAndSave(response, token) {
  return new Promise((resolve, reject) => {
    response.json().then((data) => {
      // console.log('Success:', data)

      const priceHistory = []

      data.forEach((element) => {
        element.symbol = token
        element.timestamp = new Date(element.timestamp)

        if (element.time > 1738270800000) {
          priceHistory.push(element)
        }
      })

      Store.setPriceHistory(priceHistory, token)

      resolve()
    })
  })
}

function processDaoCoinTranferTransactions(transactions) {
  return new Promise((resolve, reject) => {
    transactions.forEach((node) => {
      if (node.transaction.txIndexMetadata.CreatorUsername == 'focus') {
        const currentTransfer = CalcsAndFormatters.hexNanosToNumber(
          node.transaction.txIndexMetadata.DAOCoinToTransferNanos
        )

        if (
          node.metadata == 'ReceiverPublicKey' &&
          node.transaction.account.username != 'focus_classic'
        ) {
          const storedFocusReceived = Store.getFocusReceived()
          Store.setFocusReceived(storedFocusReceived + currentTransfer)
        } else if (node.metadata == 'TransactorPublicKeyBase58Check') {
          const storedFocusTransfered = Store.getFocusTransfered()
          Store.setFocusTransfered(storedFocusTransfered + currentTransfer)
        }
      }
    })

    resolve()
  })
}

function processTradeTransactions(transactions) {
  return new Promise((resolve, reject) => {
    let totalInUsdc = 0
    let totalInDeso = 0

    let focusBought = 0
    let focusSold = 0

    transactions.sort((a, b) => {
      var dateA = new Date(a.tradeTimestamp)
      var dateB = new Date(b.tradeTimestamp)

      if (dateA < dateB) return -1
      if (dateA > dateB) return 1
      return 0
    })

    const uniqueTransactions = [
      ...new Map(
        transactions.map((item) => [item['txnHashHex'], item])
      ).values()
    ]

    uniqueTransactions.forEach((transaction) => {
      const { denominatedCoinPublicKey, tradeBuyQuantity, tradeSellQuantity } =
        transaction

      let token = transaction.tokenUsername
      let type = transaction.tradeType
      let quote = ''

      switch (denominatedCoinPublicKey) {
        case Constants.focusKey:
          quote = 'FOCUS'
          break
        case Constants.desoProxyKey:
        case Constants.desoKey:
          quote = 'DESO'
          break
        case Constants.usdcKey:
          quote = 'USDC'
          break
      }

      if (type == 'BUY' && quote == 'DESO') {
        if (token == 'focus') {
          focusBought += tradeBuyQuantity
        }

        totalInDeso -= tradeSellQuantity
      }

      if (type == 'BUY' && quote == 'USDC') {
        if (token == 'focus') {
          focusBought += tradeBuyQuantity
        }

        if (token == 'DESO') {
          totalInDeso += tradeBuyQuantity
        }

        totalInUsdc -= tradeSellQuantity
      }

      if (type == 'BUY' && quote == 'FOCUS') {
        focusSold += tradeSellQuantity
      }

      if (type == 'SELL' && quote == 'DESO') {
        if (token == 'focus') {
          focusSold += tradeSellQuantity
        }

        totalInDeso += tradeBuyQuantity
      }

      if (type == 'SELL' && quote == 'USDC') {
        if (token == 'DESO') {
          totalInDeso -= tradeSellQuantity
        }

        if (token == 'focus') {
          focusSold += tradeSellQuantity
        }

        totalInUsdc += tradeBuyQuantity
      }

      if (type == 'SELL' && quote == 'FOCUS') {
        focusBought += tradeBuyQuantity
      }
    })

    Store.setFocusBought(focusBought)
    Store.setFocusSold(focusSold)

    resolve()
  })
}

function processTokenRecentTrades(trades, quote) {
  const exchangeRate = Store.getExchangeRate()
  const focusPrice = Store.getFocusPrice()

  let totalInUsd = 0
  let totalInUsdInQuote = 0
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

    //
    //
    //

    if (trade.denominatedCoinPublicKey == Constants.focusKey) {
      if (tradeType == 'BUY') {
        totalInUsdInQuote -= tradeSellQuantity * focusPrice['MidPrice']
      }

      if (tradeType == 'SELL') {
        totalInUsdInQuote += tradeBuyQuantity * focusPrice['MidPrice']
      }
    }

    if (
      trade.denominatedCoinPublicKey == Constants.desoProxyKey ||
      trade.denominatedCoinPublicKey == Constants.desoKey
    ) {
      if (tradeType == 'SELL') {
        totalInUsdInQuote +=
          tradeBuyQuantity * (exchangeRate['USDCentsPerDeSoExchangeRate'] / 100)
      }

      if (tradeType == 'BUY') {
        totalInUsdInQuote -=
          tradeSellQuantity *
          (exchangeRate['USDCentsPerDeSoExchangeRate'] / 100)
      }
    }

    if (trade.denominatedCoinPublicKey == Constants.usdcKey) {
      if (tradeType == 'BUY') {
        totalInUsdInQuote -= tradeSellQuantity
      }

      if (tradeType == 'SELL') {
        totalInUsdInQuote += tradeBuyQuantity
      }
    }

    // console.log(trade)
  })

  // if (quote == 'DESO') {
  //   console.log(totalInDeso, exchangeRate['USDCentsPerDeSoExchangeRate'] / 100)

  //   totalInUsdInQuote =
  //     totalInDeso * (exchangeRate['USDCentsPerDeSoExchangeRate'] / 100)
  // } else if (quote == 'FOCUS') {
  //   totalInUsdInQuote = totalInFocus * focusPrice['MidPrice']
  //   // } else if (quote == 'USDC') {
  //   //   totalInUsdInQuote = totalInUsd
  // } else {
  //   totalInUsdInQuote = totalInUsd
  // }

  // if (
  //   (trades.data.tradingRecentTrades.nodes[0] &&
  //     trades.data.tradingRecentTrades.nodes[0].tokenUsername == 'focus') ||
  //   (trades.data.tradingRecentTrades.nodes[0] &&
  //     trades.data.tradingRecentTrades.nodes[0].tokenUsername == 'openfund')
  // ) {
  //   totalInUsdInQuote = totalInUsd
  // }

  return { totalInUsd, totalInUsdInQuote, totalInFocus, totalInDeso }
}

const DataModifiers = {
  processJsonAndSave,
  processDaoCoinTranferTransactions,
  processTokenRecentTrades,
  processTradeTransactions
}

export { DataModifiers }
