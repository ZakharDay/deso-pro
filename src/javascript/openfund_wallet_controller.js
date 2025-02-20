import { Constants } from './constants'
import { Store } from './store'
import { CalcsAndFormatters } from './calcs_and_formatters'
import { DataModifiers } from './data_modifiers'

import { OpenfundApiUrls } from './openfund_api_urls'
import { OpenfundApiRequests } from './openfund_api_requests'
import { OpenfundWalletHtml } from './openfund_wallet_html'

function getThemeAndUpdateHtml() {
  const backgroundColor = window
    .getComputedStyle(document.body, null)
    .getPropertyValue('background-color')

  const commaIndex = backgroundColor.indexOf(',')

  const color = parseInt(backgroundColor.slice(4, commaIndex))

  if (color > 200) {
    document.body.classList.add('lightTheme')
  } else {
    document.body.classList.add('darkTheme')
  }
}

function getHolderKeyAndSetToStore() {
  const holderKey = OpenfundWalletHtml.getHolderPublicKey()
  Store.setHolderKey(holderKey)
}

function getExchangeRateAndSetToStore() {
  return new Promise((resolve) => {
    OpenfundApiRequests.getExchangeRate().then((data) => {
      Store.setExchangeRate(data)
      resolve()
    })
  })
}

function getFocusExchangeRateAndSetToStore() {
  return new Promise((resolve) => {
    OpenfundApiRequests.getFocusPriceInUsd().then((focusPriceInUsd) => {
      Store.setFocusPrice(focusPriceInUsd)
      resolve()
    })
  })
}

function getFocusInvestedAndShowOnPage() {
  const holderKey = Store.getHolderKey()
  const promises = []

  OpenfundWalletHtml.addWalletTokensSectionTopBar()

  const transferPromise = OpenfundApiRequests.getGqlDaoCoinTransfer(
    holderKey
  ).then(() => {
    const transactions = Store.getTransferTransactions()

    const processPromise =
      DataModifiers.processDaoCoinTranferTransactions(transactions)

    promises.push(processPromise)
  })

  const tradesPromise = OpenfundApiRequests.getGqlTradingRecentTrades(
    holderKey
  ).then(() => {
    const transactions = Store.getTradingTransactions()
    const processPromise = DataModifiers.processTradeTransactions(transactions)
    promises.push(processPromise)
  })

  promises.push(transferPromise, tradesPromise)

  Promise.all(promises).then(() => {
    OpenfundWalletHtml.updateWalletTokenSectionTopBar()
  })
}

function prepareMyTokensTable(container) {
  const myTokens = Store.getMyTokensData()

  const myTokensTable = container
    .querySelector('tbody')
    .getElementsByTagName('tr')

  for (let index = 0; index < myTokensTable.length; index++) {
    const tokenRow = myTokensTable[index]
    const tokenData = OpenfundWalletHtml.getTokenRowData(tokenRow)
    myTokens.push(tokenData)

    OpenfundWalletHtml.prepareMyTokenRow(tokenRow, tokenData)
    OpenfundWalletHtml.prepareMyTokenRowTokenCell(tokenRow)
    OpenfundWalletHtml.prepareMyTokerRowPriceCell(tokenRow)
    OpenfundWalletHtml.prepareMyTokenRowValueCell(tokenRow)
    OpenfundWalletHtml.prepareMyTokenActionBar(tokenRow)
  }

  Store.setMyTokensData(myTokens)
}

function getPriceChartDataAndUpdateUi() {
  Promise.all([
    OpenfundApiRequests.getHistoryData(OpenfundApiUrls.desoHistoryUrl, 'deso'),
    OpenfundApiRequests.getHistoryData(
      OpenfundApiUrls.focusHistoryUrl,
      'focus'
    ),
    OpenfundApiRequests.getHistoryData(
      OpenfundApiUrls.openfundHistoryUrl,
      'openfund'
    )
  ]).then(() => {
    OpenfundWalletHtml.addPriceChart()
    OpenfundWalletHtml.updatePriceChartButton()
  })
}

function getMyTokensDataAndUpdateTable() {
  const holderKey = Store.getHolderKey()
  const myTokens = Store.getMyTokensData()

  myTokens.forEach((tokenData) => {
    const tokenRow = OpenfundWalletHtml.getCurrentMyTokenRow(tokenData)
    const { publicKey } = tokenData

    OpenfundApiRequests.getIsHodlingPublicKey(holderKey, publicKey).then(
      (tokenHodlingData) => {
        tokenData.hodlingData = tokenHodlingData

        OpenfundWalletHtml.addUserProfileContextMenu(tokenRow, tokenData)

        OpenfundWalletController.getCoinPropertiesAndSetToStore(tokenData).then(
          () => {
            OpenfundWalletHtml.updateWalletTokenRowFee(tokenData)

            OpenfundWalletController.getMyTokenDataAndUpdateTokenRow(
              holderKey,
              publicKey,
              tokenData
            ).then(() => {
              OpenfundWalletController.getMyTokenPnlAndUpdateTokenRow(
                holderKey,
                publicKey,
                tokenData
              )
            })
          }
        )
      }
    )
  })
}

function getMyTokenDataAndUpdateTokenRow(holderKey, holdingKey, tokenData) {
  const transactorKey = holderKey
  const baseKey = holdingKey
  const tokenName = tokenData.username

  const tokenQuantity = CalcsAndFormatters.hexNanosToOrderQuantity(
    tokenData.hodlingData['BalanceEntry']['BalanceNanosUint256']
  )

  const promises = []

  // console.log(token.username, token)

  if (tokenName != 'focus') {
    promises.push(
      OpenfundApiRequests.getMarketOrderData(
        Constants.focusKey,
        baseKey,
        transactorKey,
        tokenQuantity,
        tokenName,
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
        const focusInPositionStored = Store.getFocusInPosition()
        const focusInPosition = trade['ExecutionReceiveAmount']

        Store.setFocusInPosition(
          focusInPositionStored + Number(focusInPosition)
        )

        promises.push(
          OpenfundWalletHtml.updateWalletMyTokenRow(tokenData, 'FOCUS', trade)
        )
      })
    )
  }

  promises.push(
    OpenfundApiRequests.getMarketOrderData(
      Constants.usdcKey,
      baseKey,
      transactorKey,
      tokenQuantity,
      tokenName,
      'USDC'
    ).then((trade) => {
      // console.log('TRADE', 'USDC', trade, token.username, token.quantity)

      promises.push(
        OpenfundWalletHtml.updateWalletMyTokenRow(tokenData, 'USDC', trade)
      )
    })
  )

  promises.push(
    OpenfundApiRequests.getMarketOrderData(
      Constants.desoProxyKey,
      baseKey,
      transactorKey,
      tokenQuantity,
      tokenName,
      'DESO'
    ).then((trade) => {
      // console.log('TRADE', 'DESO', trade, token.username, token.quantity)

      promises.push(
        OpenfundWalletHtml.updateWalletMyTokenRow(tokenData, 'DESO', trade)
      )
    })
  )

  return Promise.all(promises)
}

function getMyTokenPnlAndUpdateTokenRow(holderKey, holdingKey, tokenData) {
  OpenfundApiRequests.getGqlTokenTradingRecentTrades(
    holdingKey,
    holderKey
  ).then((trades) => {
    const quote = OpenfundWalletHtml.getCurrencyQuoteFromTokenRow(tokenData)
    const total = DataModifiers.processTokenRecentTrades(trades, quote)

    // console.log(tokenData, quote, total)

    OpenfundWalletHtml.updateWalletMyTokenRowPnl(tokenData, total, quote)
  })
}

function getCoinPropertiesAndSetToStore(tokenData) {
  return new Promise((resolve, reject) => {
    const tokensStoredData = Store.getMyTokensData()

    OpenfundApiRequests.getCoinProperties(tokenData.publicKey).then((data) => {
      tokensStoredData.forEach((token) => {
        if (token.username == data['Profile']['Username']) {
          token.coinProperties = data
        }
      })

      resolve()
    })
  })
}

const OpenfundWalletController = {
  getThemeAndUpdateHtml,
  getHolderKeyAndSetToStore,
  getExchangeRateAndSetToStore,
  getFocusExchangeRateAndSetToStore,
  getFocusInvestedAndShowOnPage,
  prepareMyTokensTable,
  getPriceChartDataAndUpdateUi,
  getMyTokensDataAndUpdateTable,
  getMyTokenDataAndUpdateTokenRow,
  getMyTokenPnlAndUpdateTokenRow,
  getCoinPropertiesAndSetToStore
}

export { OpenfundWalletController }
