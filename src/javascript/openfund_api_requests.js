import { Store } from './store'
import { Constants } from './constants'
import { OpenfundApiUrls } from './openfund_api_urls'
import { DataModifiers } from './data_modifiers'

function getIsHodlingPublicKey(holderKey, holdingKey) {
  return new Promise((resolve, reject) => {
    fetch(OpenfundApiUrls.isHodlingPublicKeyUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        PublicKeyBase58Check: holderKey,
        IsHodlingPublicKeyBase58Check: holdingKey,
        IsDAOCoin: true
      })
    })
      .then((response) => {
        response.json().then((data) => {
          resolve(data)
        })
      })
      .catch((error) => {
        console.error('Error:', error)
        reject()
      })
  })
}

function getHistoryData(url, token) {
  return new Promise((resolve, reject) => {
    fetch(url)
      .then((response) => {
        // console.log('RESPONSE', response)

        DataModifiers.processJsonAndSave(response, token).then(() => {
          resolve()
        })
      })
      .catch((error) => {
        console.error('Error:', error)
        reject()
      })
  })
}

function getExchangeRate() {
  return new Promise((resolve, reject) => {
    fetch(OpenfundApiUrls.getExchangeRate)
      .then((response) => {
        response.json().then((data) => {
          // console.log('Success:', data)
          resolve(data)
        })
      })
      .catch((error) => {
        console.error('Error:', error)
        reject()
      })
  })
}

function getFocusPriceInUsd() {
  return new Promise((resolve, reject) => {
    fetch(OpenfundApiUrls.getQuoteCurrencyPriceInUsd, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        QuoteCurrencyPublicKeyBase58Check: Constants.focusKey
      })
    })
      .then((response) => {
        response.json().then((data) => {
          // console.log('Success:', data)
          resolve(data)
        })
      })
      .catch((error) => {
        console.error('Error:', error)
        reject()
      })
  })
}

function getCoinProperties(publicKey) {
  return new Promise((resolve, reject) => {
    fetch(OpenfundApiUrls.getCoinProperties, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        BaseCurrencyPublicKey: publicKey
      })
    })
      .then((response) => {
        response.json().then((data) => {
          // console.log('Success:', data)
          resolve(data)
        })
      })
      .catch((error) => {
        console.error('Error:', error)
        reject()
      })
  })
}

function getMarketOrderData(
  quoteKey,
  baseKey,
  transactorKey,
  quantity,
  username,
  base
) {
  return new Promise((resolve, reject) => {
    // console.log('getApiMarketOrderData', username)

    fetch(OpenfundApiUrls.createDaoCoinLimitOrderWithFeeUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        OperationType: 'ASK',
        QuoteCurrencyPublicKeyBase58Check: quoteKey,
        BaseCurrencyPublicKeyBase58Check: baseKey,
        Quantity: `${quantity}`,
        FillType: 'IMMEDIATE_OR_CANCEL',
        QuantityCurrencyType: 'base',
        Price: '0.000000000',
        PriceCurrencyType: 'quote',
        TransactorPublicKeyBase58Check: transactorKey,
        MinFeeRateNanosPerKB: 0,
        TransactionFees: null,
        OptionalPrecedingTransactions: null
      })
    })
      .then((response) => {
        response.json().then((data) => {
          // console.log(data)
          resolve(data)
        })
      })
      .catch((error) => {
        console.error('Error:', username, error)
        reject()
      })
  })
}

// For Token
function getGqlTokenTradingRecentTrades(tokenPublicKey, traderPublicKey) {
  return new Promise((resolve, reject) => {
    fetch(OpenfundApiUrls.focusGqlUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        operationName: 'TradingRecentTrades',
        variables: {
          orderBy: 'TRADE_TIMESTAMP_DESC',
          filter: {
            tokenPublicKey: {
              equalTo: tokenPublicKey
            },
            traderPublicKey: {
              equalTo: traderPublicKey
            }
          },
          first: 100,
          offset: 0
        },
        query:
          'query TradingRecentTrades($first: Int, $orderBy: [TradingRecentTradesOrderBy!], $filter: TradingRecentTradeFilter, $offset: Int) {\n  tradingRecentTrades(\n    first: $first\n    orderBy: $orderBy\n    filter: $filter\n    offset: $offset\n  ) {\n    nodes {\n      denominatedCoinPublicKey\n      tradeTimestamp\n      tradeType\n      traderPublicKey\n      traderUsername\n      traderDisplayName\n      traderProfilePicUrl\n      tokenPublicKey\n      tokenUsername\n      tokenProfilePicUrl\n      tokenCategory\n      tradeValueUsd\n      tradeValueFocus\n      tradeValueDeso\n      tradePriceUsd\n      tradePriceFocus\n      tradePriceDeso\n      tokenMarketCapUsd\n      tokenMarketCapFocus\n      txnHashHex\n      tradeBuyCoinPublicKey\n      tradeSellCoinPublicKey\n      tradeBuyQuantity\n      tradeSellQuantity\n      __typename\n    }\n    pageInfo {\n      hasNextPage\n      hasPreviousPage\n      startCursor\n      endCursor\n      __typename\n    }\n    totalCount\n    __typename\n  }\n}'
      })
    })
      .then((response) => {
        response.json().then((data) => {
          // console.log('Success:', data)
          resolve(data)
        })
      })
      .catch((error) => {
        console.error('Error:', error)
        reject()
      })
  })
}

//
//
//
//
//

function getGqlTradingRecentTrades(publicKey, offset = 0) {
  return new Promise((resolve, reject) => {
    fetch(OpenfundApiUrls.focusGqlUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        operationName: 'TradingRecentTrades',
        variables: {
          orderBy: 'TRADE_TIMESTAMP_DESC',
          filter: {
            traderPublicKey: {
              equalTo: publicKey
            }
          },
          first: 100,
          offset: offset
        },
        query:
          'query TradingRecentTrades($first: Int, $orderBy: [TradingRecentTradesOrderBy!], $filter: TradingRecentTradeFilter, $offset: Int) {\n  tradingRecentTrades(\n    first: $first\n    orderBy: $orderBy\n    filter: $filter\n    offset: $offset\n  ) {\n    nodes {\n      denominatedCoinPublicKey\n      tradeTimestamp\n      tradeType\n      traderPublicKey\n      traderUsername\n      traderDisplayName\n      traderProfilePicUrl\n      tokenPublicKey\n      tokenUsername\n      tokenProfilePicUrl\n      tokenCategory\n      tradeValueUsd\n      tradeValueFocus\n      tradeValueDeso\n      tradePriceUsd\n      tradePriceFocus\n      tradePriceDeso\n      tokenMarketCapUsd\n      tokenMarketCapFocus\n      txnHashHex\n      tradeBuyCoinPublicKey\n      tradeSellCoinPublicKey\n      tradeBuyQuantity\n      tradeSellQuantity\n      __typename\n    }\n    pageInfo {\n      hasNextPage\n      hasPreviousPage\n      startCursor\n      endCursor\n      __typename\n    }\n    totalCount\n    __typename\n  }\n}'
      })
    })
      .then((response) => {
        response.json().then((data) => {
          // console.log('Success:', data)

          const storedTradingTransactions = Store.getTradingTransactions()
          storedTradingTransactions.push(...data.data.tradingRecentTrades.nodes)
          Store.setTradingTransactions(storedTradingTransactions)

          if (data.data.tradingRecentTrades.pageInfo.hasNextPage) {
            getGqlTradingRecentTrades(publicKey, offset + 100).then(() => {
              resolve()
            })
          } else {
            resolve()
          }
        })
      })
      .catch((error) => {
        console.error('Error:', error)
        reject()
      })
  })
}

function getGqlDaoCoinTransfer(publicKey, offset = 0) {
  return new Promise((resolve, reject) => {
    fetch(OpenfundApiUrls.focusGqlUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        operationName: 'AffectedPublicKeys',
        variables: {
          first: 100,
          orderBy: ['TIMESTAMP_DESC'],
          offset: offset,
          filter: {
            transaction: {
              blockHeight: {
                isNull: false
              },
              txnType: {
                in: [25]
              }
            },
            publicKey: {
              in: [publicKey]
            },
            isDuplicate: {
              equalTo: false
            }
          },
          withTotal: false
        },
        query:
          'query AffectedPublicKeys($filter: AffectedPublicKeyFilter, $orderBy: [AffectedPublicKeysOrderBy!], $first: Int, $offset: Int, $withTotal: Boolean!) {\n  affectedPublicKeys(\n    filter: $filter\n    orderBy: $orderBy\n    first: $first\n    offset: $offset\n  ) {\n    nodes {\n      metadata\n      transaction {\n        ...CoreTransactionFields\n        block {\n          ...CoreBlockFields\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    pageInfo {\n      hasPreviousPage\n      hasNextPage\n      __typename\n    }\n    totalCount @include(if: $withTotal)\n    __typename\n  }\n}\n\nfragment CoreAccountFields on Account {\n  publicKey\n  pkid\n  username\n  __typename\n}\n\nfragment CoreTransactionFields on Transaction {\n  transactionHash\n  blockHash\n  version\n  inputs\n  outputs\n  feeNanos\n  nonceExpirationBlockHeight\n  noncePartialId\n  txnMeta\n  txnMetaBytes\n  txIndexMetadata\n  txIndexBasicTransferMetadata\n  transactionId\n  txnType\n  publicKey\n  extraData\n  signature\n  txnBytes\n  indexInBlock\n  wrapperTransactionHash\n  indexInWrapperTransaction\n  account {\n    ...CoreAccountFields\n    __typename\n  }\n  affectedPublicKeys {\n    nodes {\n      publicKey\n      __typename\n    }\n    __typename\n  }\n  wrapperTransaction {\n    transactionHash\n    blockHash\n    version\n    inputs\n    outputs\n    feeNanos\n    nonceExpirationBlockHeight\n    noncePartialId\n    txnMeta\n    txnMetaBytes\n    txIndexMetadata\n    txIndexBasicTransferMetadata\n    transactionId\n    txnType\n    publicKey\n    extraData\n    signature\n    txnBytes\n    indexInBlock\n    wrapperTransactionHash\n    indexInWrapperTransaction\n    __typename\n  }\n  innerTransactions {\n    nodes {\n      transactionHash\n      blockHash\n      version\n      inputs\n      outputs\n      feeNanos\n      nonceExpirationBlockHeight\n      noncePartialId\n      txnMeta\n      txnMetaBytes\n      txIndexMetadata\n      txIndexBasicTransferMetadata\n      transactionId\n      txnType\n      publicKey\n      extraData\n      signature\n      txnBytes\n      indexInBlock\n      indexInWrapperTransaction\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment CoreBlockFields on Block {\n  blockHash\n  height\n  timestamp\n  __typename\n}'
      })
    })
      .then((response) => {
        response.json().then((data) => {
          // console.log('Success:', data)

          const storedTransferTransactions = Store.getTransferTransactions()
          storedTransferTransactions.push(...data.data.affectedPublicKeys.nodes)
          Store.setTransferTransactions(storedTransferTransactions)

          if (data.data.affectedPublicKeys.pageInfo.hasNextPage) {
            getGqlDaoCoinTransfer(publicKey, offset + 100).then(() => {
              resolve()
            })
          } else {
            resolve()
          }
        })
      })
      .catch((error) => {
        console.error('Error:', error)
        reject()
      })
  })
}

function getGqlFocusUsersCount() {
  return new Promise((resolve, reject) => {
    fetch(OpenfundApiUrls.focusGqlUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query:
          'query UserAssociations($condition: UserAssociationCondition) {\n  userAssociations(condition: $condition) {\n    totalCount\n  }\n}',
        variables: {
          condition: {
            associationType: 'NEW_USER_REFERRAL',
            appPkid: 'BC1YLjEayZDjAPitJJX4Boy7LsEfN3sWAkYb3hgE9kGBirztsc2re1N'
          }
        },
        operationName: 'UserAssociations'
      })
    })
      .then((response) => {
        response.json().then((data) => {
          // console.log('Success:', data.data.userAssociations.totalCount, data)
          resolve(data.data.userAssociations.totalCount)
        })
      })
      .catch((error) => {
        console.error('Error:', error)
        reject()
      })
  })
}

const OpenfundApiRequests = {
  getIsHodlingPublicKey,
  getHistoryData,
  getExchangeRate,
  getFocusPriceInUsd,
  getCoinProperties,
  getMarketOrderData,
  getGqlTradingRecentTrades,
  getGqlTokenTradingRecentTrades,
  getGqlDaoCoinTransfer,
  getGqlFocusUsersCount
}

export { OpenfundApiRequests }
