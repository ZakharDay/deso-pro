import {
  isHodlingPublicKeyUrl,
  createDaoCoinLimitOrderWithFeeUrl,
  focusGqlUrl
} from './openfund_api_urls'

function getApiIsHodlingPublicKey(holderKey, holdingKey) {
  return new Promise((resolve, reject) => {
    fetch(isHodlingPublicKeyUrl, {
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
          // console.log(
          //   'Success:',
          //   data,
          //   data['BalanceEntry']['ProfileEntryResponse']['Username'],
          //   data['BalanceEntry']['BalanceNanos'],
          //   data['BalanceEntry']['BalanceNanos'] / 1000000000,
          //   data['BalanceEntry']['BalanceNanosUint256'],
          //   Number(data['BalanceEntry']['BalanceNanosUint256']),
          //   'QUANTITY',
          //   Number(data['BalanceEntry']['BalanceNanosUint256']) /
          //     1000000000000000000,
          //   // data['BalanceEntry']['ProfileEntryResponse']['CoinEntry'],
          //   // data['BalanceEntry']['ProfileEntryResponse']['DAOCoinEntry'],
          //   Number(
          //     data['BalanceEntry']['ProfileEntryResponse']['DAOCoinEntry'][
          //       'CoinsInCirculationNanos'
          //     ]
          //   ),
          //   data['BalanceEntry']['ProfileEntryResponse']['DAOCoinEntry'][
          //     'NumberOfHolders'
          //   ],
          //   data['BalanceEntry']['ProfileEntryResponse']['CoinPriceDeSoNanos'],
          //   data['BalanceEntry']['ProfileEntryResponse'][
          //     'CoinPriceBitCloutNanos'
          //   ],
          //   data['BalanceEntry']['ProfileEntryResponse']['DESOBalanceNanos'],
          //   data['BalanceEntry']['ProfileEntryResponse'][
          //     'BestExchangeRateDESOPerDAOCoin'
          //   ],
          //   data['BalanceEntry']['HodlerDESOBalanceNanos']
          // )

          const username =
            data['BalanceEntry']['ProfileEntryResponse']['Username']

          const quantity =
            Number(data['BalanceEntry']['BalanceNanosUint256']) /
              1000000000000000000 -
            0.0001
          // 0.00000000001
          // 0.0000000000001

          // console.log(username, quantity, data)

          resolve({ username, quantity })
        })
      })
      .catch((error) => {
        console.error('Error:', error)
        reject()
      })
  })
}

function getApiMarketOrderData(
  quoteKey,
  baseKey,
  transactorKey,
  quantity,
  username,
  base
) {
  return new Promise((resolve, reject) => {
    // console.log('getApiMarketOrderData', username)

    fetch(createDaoCoinLimitOrderWithFeeUrl, {
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
          console.log(data)
          resolve(data)
        })
      })
      .catch((error) => {
        console.error('Error:', username, error)
        reject()
      })
  })
}

function getApiGqlTradingRecentTrades(tokenPublicKey, traderPublicKey) {
  return new Promise((resolve, reject) => {
    fetch(focusGqlUrl, {
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
          first: 20,
          offset: 0
        },
        query:
          'query TradingRecentTrades($first: Int, $orderBy: [TradingRecentTradesOrderBy!], $filter: TradingRecentTradeFilter, $offset: Int) {\n  tradingRecentTrades(\n    first: $first\n    orderBy: $orderBy\n    filter: $filter\n    offset: $offset\n  ) {\n    nodes {\n      denominatedCoinPublicKey\n      tradeTimestamp\n      tradeType\n      traderPublicKey\n      traderUsername\n      traderDisplayName\n      traderProfilePicUrl\n      tokenPublicKey\n      tokenUsername\n      tokenProfilePicUrl\n      tokenCategory\n      tradeValueUsd\n      tradeValueFocus\n      tradeValueDeso\n      tradePriceUsd\n      tradePriceFocus\n      tradePriceDeso\n      tokenMarketCapUsd\n      tokenMarketCapFocus\n      txnHashHex\n      tradeBuyCoinPublicKey\n      tradeSellCoinPublicKey\n      tradeBuyQuantity\n      tradeSellQuantity\n      __typename\n    }\n    pageInfo {\n      hasNextPage\n      hasPreviousPage\n      startCursor\n      endCursor\n      __typename\n    }\n    totalCount\n    __typename\n  }\n}'
      })
    })
      .then((response) => {
        response.json().then((data) => {
          console.log('Success:', data)
          resolve(data)
        })
      })
      .catch((error) => {
        console.error('Error:', error)
        reject()
      })
  })
}

export {
  getApiIsHodlingPublicKey,
  getApiMarketOrderData,
  getApiGqlTradingRecentTrades
}
