import {
  getHtmlHolderPublicKey,
  addHtmlWalletTokensSectionTopBar,
  updateHtmlWalletTokenSectionTopBar
} from './openfund_wallet_html'

import {
  getApiGqlDaoCoinTransfer,
  getApiGqlTradingRecentTrades
} from './openfund_api_requests'

import {
  getHolderKey,
  setHolderKey,
  getTransferTransactions,
  getTradingTransactions
} from './store'

import {
  processDataTradeTransactions,
  processDataDaoCoinTranferTransactions
} from './data_modifiers'

function getHolderKeyAndSetToStore() {
  const holderKey = getHtmlHolderPublicKey()
  setHolderKey(holderKey)
}

function getFocusInvestedAndShowOnPage() {
  const holderKey = getHolderKey()
  const promises = []

  addHtmlWalletTokensSectionTopBar()

  const transferPromise = getApiGqlDaoCoinTransfer(holderKey).then(() => {
    const transactions = getTransferTransactions()
    const processPromise = processDataDaoCoinTranferTransactions(transactions)
    promises.push(processPromise)
  })

  const tradesPromise = getApiGqlTradingRecentTrades(holderKey).then(() => {
    const transactions = getTradingTransactions()
    const processPromise = processDataTradeTransactions(transactions)
    promises.push(processPromise)
  })

  promises.push(transferPromise, tradesPromise)

  Promise.all(promises).then(() => {
    updateHtmlWalletTokenSectionTopBar()
  })
}

const OpenfundWalletController = {
  getHolderKeyAndSetToStore,
  getFocusInvestedAndShowOnPage
}

export { OpenfundWalletController }
