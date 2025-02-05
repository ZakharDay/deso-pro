import {
  isHodlingPublicKeyUrl,
  createDaoCoinLimitOrderWithFeeUrl
} from './openfund_api_urls'

function getApiIsHodlingPublicKey(holderKey, holdingKey) {
  return new Promise((resolve) => {
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
  return new Promise((resolve) => {
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
          // console.log(data)
          resolve(data)
        })
      })
      .catch((error) => {
        console.error('Error:', username, error)
      })
  })
}

export { getApiIsHodlingPublicKey, getApiMarketOrderData }
