import { OpenfundWalletController } from './javascript/openfund_wallet_controller'

import {
  getHolderKey,
  setHolderKey,
  getFocusReceived,
  setFocusReceived,
  getFocusTransfered,
  setFocusTransfered,
  getFocusSold,
  setFocusSold,
  getFocusBought,
  setFocusBought,
  getTransferTransactions,
  setTransferTransactions,
  getTradingTransactions,
  setTradingTransactions
} from './javascript/store'

import {
  getHtmlHolderPublicKey,
  markHtmlWalletMyTokens,
  updateHtmlWalletMyTokenRow,
  updateHtmlWalletMyTokenRowPnl,
  addHtmlWalletTokensSectionTopBar,
  updateHtmlWalletTokenSectionTopBar,
  showHtmlFocusInvested
} from './javascript/openfund_wallet_html'

import {
  getApiIsHodlingPublicKey,
  getApiMarketOrderData,
  getApiGqlTradingRecentTrades,
  getApiGqlTokenTradingRecentTrades,
  getApiGqlDaoCoinTransfer
} from './javascript/openfund_api_requests'

import {
  processDaoCoinTranferTransactions,
  processDataRecentTrades,
  processDataTradeTransactions,
  processDataTokenRecentTrades
} from './javascript/data_modifiers'

import {
  focusKey,
  desoProxyKey,
  usdcKey,
  desoKey,
  holdingsPanelId,
  myTokensPanelId
} from './javascript/constants'

let pageObserver
let transactions = []
let totalInUsd = 0.0
let totalInUsdc = 0.0
let totalInDeso = 0.0
let totalInFocus = 0.0

let newTotalInFocus = 0

function observeUrlChange() {
  let lastUrl = location.href

  new MutationObserver(() => {
    const url = location.href

    if (url !== lastUrl) {
      lastUrl = url
      onUrlChange()
    }
  }).observe(document, { subtree: true, childList: true })

  function onUrlChange() {
    waitAsyncPageLoad()

    if (pageObserver) {
      pageObserver.unobserve()
    }
  }
}

function waitAsyncPageLoad() {
  const { host, pathname } = window.location
  const urlPart = pathname.substr(1)
  const urlPartFirstLetter = urlPart.charAt(0)
  const urlPartSecondLetter = urlPart.charAt(1)
  const firstLettersAccepted = ['w', 'u', 'b', 'n', 's', 'b']

  let currentPageDetector

  if (host == 'openfund.com' && urlPartFirstLetter == 'w') {
    const table = document.getElementById(myTokensPanelId)

    if (table) {
      currentPageDetector = table.querySelector('tbody tr')
    }
  }

  if (firstLettersAccepted.includes(urlPartFirstLetter)) {
    if (document.head && document.body && currentPageDetector) {
      // console.log('DETECTOR LOADED')
      initOpenfundWalletPage(myTokensPanelId)
    } else {
      // console.log('WILL REPEAT')
      setTimeout(() => {
        waitAsyncPageLoad()
      }, 100)
    }
  }
}

function initOpenfundWalletPage(myTokensPanelId) {
  OpenfundWalletController.getHolderKeyAndSetToStore()
  OpenfundWalletController.getFocusInvestedAndShowOnPage()

  const container = document.getElementById(myTokensPanelId)
  const holderKey = getHolderKey()

  markHtmlWalletMyTokens(container).then((tokenRows) => {
    // const keys = [focusKey, desoProxyKey, usdcKey, desoKey]
    // const promises = []

    // keys.forEach((key) => {
    //   promises.push(
    //     getApiGqlTradingRecentTrades(key, holderKey).then((trades) => {
    //       // console.log(trades.data.tradingRecentTrades.nodes)

    //       trades.data.tradingRecentTrades.nodes.forEach((transaction) => {
    //         transactions.push(transaction)
    //       })
    //     })
    //   )
    // })
    // const transactions = getTradingTransactions()
    // const promises = []

    for (let index = 0; index < tokenRows.length; index++) {
      const tokenRow = tokenRows[index]
      const holdingKey = tokenRow.dataset.publicKey

      //
      // promises.push(
      //   getApiGqlTradingRecentTrades(holdingKey, holderKey).then((trades) => {
      //     // console.log(trades.data.tradingRecentTrades.nodes)

      //     trades.data.tradingRecentTrades.nodes.forEach((transaction) => {
      //       transactions.push(transaction)
      //     })
      //   })
      // )
      //
      //
      // getAllTransactions and store them for future
      //
      //
      //
      // transactions.push()

      getApiIsHodlingPublicKey(holderKey, holdingKey).then((token) => {
        const transactorKey = holderKey
        const baseKey = holdingKey
        const promises = []

        // console.log(token.username, token)

        if (token.username != 'focus') {
          promises.push(
            getApiMarketOrderData(
              focusKey,
              baseKey,
              transactorKey,
              token.quantity,
              token.username,
              'FOCUS'
            ).then((trade) => {
              // console.log(
              //   'TRADE',
              //   'FOCUS',
              //   trade,
              //   token.username,
              //   token.quantity
              // )

              promises.push(
                updateHtmlWalletMyTokenRow(tokenRow, token, 'FOCUS', trade)
              )
            })
          )
        }

        promises.push(
          getApiMarketOrderData(
            usdcKey,
            baseKey,
            transactorKey,
            token.quantity,
            token.username,
            'USDC'
          ).then((trade) => {
            // console.log('TRADE', 'USDC', trade, token.username, token.quantity)

            promises.push(
              updateHtmlWalletMyTokenRow(tokenRow, token, 'USDC', trade)
            )
          })
        )

        promises.push(
          getApiMarketOrderData(
            desoProxyKey,
            baseKey,
            transactorKey,
            token.quantity,
            token.username,
            'DESO'
          ).then((trade) => {
            // console.log('TRADE', 'DESO', trade, token.username, token.quantity)

            promises.push(
              updateHtmlWalletMyTokenRow(tokenRow, token, 'DESO', trade)
            )
          })
        )

        Promise.all(promises).then(() => {
          getApiGqlTokenTradingRecentTrades(holdingKey, holderKey).then(
            (trades) => {
              const tokenPriceInQuoteCurrencyQuote = tokenRow.querySelector(
                '#tokenPriceInQuoteCurrencyQuote'
              )

              const quote = tokenPriceInQuoteCurrencyQuote.dataset.quote
              const total = processDataTokenRecentTrades(trades, quote)

              updateHtmlWalletMyTokenRowPnl(tokenRow, total)

              // if (
              //   token.username != 'focus' &&
              //   token.username != 'FOCUS_reservations' &&
              //   token.username != 'focus_classic'
              // ) {
              //   collectTotal(total)
              // }

              // updateHtmlWalletTokenSectionTopBar({
              //   totalInUsd,
              //   totalInFocus
              // })

              // console.log(totalInUsd, totalInDeso, totalInFocus)
            }
          )
        })
      })
    }

    // Promise.all(promises).then(() => {
    //   // console.log(transactions)
    //   processDataTradeTransactions(transactions)
    // })
  })
}

// function collectTotal(total) {
//   Object.keys(total).forEach((key) => {
//     switch (key) {
//       case 'totalInUsd':
//         totalInUsd += total[key]
//         break
//       case 'totalInDeso':
//         totalInDeso += total[key]
//         break
//       case 'totalInFocus':
//         totalInFocus += total[key]
//         break
//     }
//   })
// }

observeUrlChange()
waitAsyncPageLoad()

// processDaoCoinTranferTransactions
