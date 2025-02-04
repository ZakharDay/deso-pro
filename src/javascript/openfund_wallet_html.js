function getHtmlHolderPublicKey() {
  return document.querySelector('button.rounded-md').title
}

function markHtmlWalletMyTokens(container) {
  return new Promise((resolve) => {
    const elements = []

    const myTokensTable = container
      .querySelector('tbody')
      .getElementsByTagName('tr')

    for (let index = 0; index < myTokensTable.length; index++) {
      const tokenRow = myTokensTable[index]
      const profilePic = tokenRow.querySelector('td a img')
      const publicKey = /picture\/(.*?)\?/g.exec(profilePic.src)[1]
      tokenRow.dataset.publicKey = publicKey

      const priceCell = tokenRow.querySelector('td:nth-child(3)')
      priceCell.id = 'priceCell'

      // prettier-ignore
      const tokenPrice = priceCell.querySelector('div.ml-auto div:first-child *:first-child')
      tokenPrice.id = 'tokenPrice'
      tokenPrice.innerText = '0'

      const valueCell = tokenRow.querySelector('td:nth-child(6)')
      valueCell.id = 'valueCell'

      // prettier-ignore
      const totalValue = valueCell.querySelector('div.ml-auto div:first-child *:first-child')
      totalValue.id = 'totalValue'
      totalValue.innerText = '0'

      elements.push(tokenRow)
    }

    resolve(elements)
  })
}

function updateHtmlWalletMyTokenRow(tokenRow, token, quote, trade) {
  const tokenPriceElement = tokenRow.querySelector('#tokenPrice')
  let tokenPrice = parseFloat(tokenPriceElement.innerText)

  const totalValueElement = tokenRow.querySelector('#totalValue')
  let totalValue = parseFloat(totalValueElement.innerText)

  const newTokenPrice = trade['ExecutionPriceInUsd']

  if (newTokenPrice > tokenPrice) {
    tokenPriceElement.innerText = Number(newTokenPrice).toFixed(6)
  }

  const newTotalValue = trade['ExecutionReceiveAmountUsd']

  if (newTotalValue > totalValue) {
    totalValueElement.innerText = Number(newTotalValue).toFixed(2)
  }
}

export {
  getHtmlHolderPublicKey,
  markHtmlWalletMyTokens,
  updateHtmlWalletMyTokenRow
}
