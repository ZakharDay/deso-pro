function getDaoCoinTransfer(offset) {
  return new Promise((resolve, reject) => {
    fetch('https://dev-graphql.focus.xyz/graphql', {
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
              in: ['BC1YLgeXsafJ8vYcXurRMLy5UcYGbLtjnoXZZWZLuXJqbDVQqXAE6mf']
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
          console.log('Success:', data)
          resolve(data)
        })
      })
      .catch((error) => {
        console.error('Error:', error)
      })
  })
}

export { getDaoCoinTransfer }
