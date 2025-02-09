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
  getFocusInPosition,
  setFocusInPosition,
  getTransferTransactions,
  setTransferTransactions,
  getTradingTransactions,
  setTradingTransactions,
  setUserCounter
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
  preloadHtmlCounterFont,
  addHtmlFocusUserCounter,
  showHtmlFocusUserCounterPopup
} from './javascript/focus_all_pages_html'

import {
  getApiIsHodlingPublicKey,
  getApiMarketOrderData,
  getApiGqlTradingRecentTrades,
  getApiGqlTokenTradingRecentTrades,
  getApiGqlDaoCoinTransfer,
  getApiGqlFocusUsersCount
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
  myTokensPanelIds,
  myTokensPanelSelector
} from './javascript/constants'

//
//
//
//
//
//

//
//
//
//
//
//

let pageObserver

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

  let table
  let currentPageDetector

  if (host == 'openfund.com' && urlPartFirstLetter == 'w') {
    const firstLettersAccepted = ['w']
    table = document.querySelector(myTokensPanelSelector)

    if (table) {
      currentPageDetector = table.querySelector('tbody tr')
    }

    if (firstLettersAccepted.includes(urlPartFirstLetter)) {
      if (document.head && document.body && currentPageDetector) {
        // console.log('DETECTOR LOADED')
        initOpenfundWalletPage(table)
      } else {
        // console.log('WILL REPEAT')
        setTimeout(() => {
          waitAsyncPageLoad()
        }, 100)
      }
    }
  }

  if (host == 'focus.xyz') {
    currentPageDetector = document.querySelector(
      'main > div > div:last-child > div:first-child > div > div > div:first-child > a'
    )

    if (document.head && document.body && currentPageDetector) {
      console.log('DETECTOR LOADED')
      initFocusAllPage(currentPageDetector)
    } else {
      console.log('WILL REPEAT')
      setTimeout(() => {
        waitAsyncPageLoad()
      }, 100)
    }
  }
}

function initOpenfundWalletPage(container) {
  OpenfundWalletController.getHolderKeyAndSetToStore()
  OpenfundWalletController.getFocusInvestedAndShowOnPage()

  const holderKey = getHolderKey()

  markHtmlWalletMyTokens(container).then((tokenRows) => {
    for (let index = 0; index < tokenRows.length; index++) {
      const tokenRow = tokenRows[index]
      const holdingKey = tokenRow.dataset.publicKey

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

              // console.log(trade)
              const focusInPositionStored = getFocusInPosition()
              const focusInPosition = trade['ExecutionReceiveAmount']

              setFocusInPosition(
                focusInPositionStored + Number(focusInPosition)
              )

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
            }
          )
        })
      })
    }
  })
}

function initFocusAllPage(container) {
  preloadHtmlCounterFont()

  getApiGqlFocusUsersCount().then((counter) => {
    setUserCounter(counter)
    addHtmlFocusUserCounter(container)
  })
}

observeUrlChange()
waitAsyncPageLoad()
