import { formatPrice } from './calcs_and_formatters'

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

      const tokenNameCell = tokenRow.querySelector('td:nth-child(1) a')
      tokenNameCell.id = 'tokenNameCell'

      const tokenFee = document.createElement('span')
      tokenFee.id = 'tokenFee'
      tokenFee.classList.add('text-muted')
      tokenFee.style.marginLeft = '10px'

      tokenNameCell.appendChild(tokenFee)

      const priceCell = tokenRow.querySelector('td:nth-child(3)')
      priceCell.id = 'priceCell'

      const tokenPriceInUsd = priceCell.querySelector(
        'div.ml-auto > div:first-child > *:first-child'
      )

      tokenPriceInUsd.id = 'tokenPriceInUsd'
      tokenPriceInUsd.innerText = '0'

      const tokenPriceInQuoteCurrency = priceCell.querySelector(
        'div.ml-auto > div:last-child'
      )

      tokenPriceInQuoteCurrency.id = 'tokenPriceInQuoteCurrency'
      tokenPriceInQuoteCurrency.innerHTML = ''
      tokenPriceInQuoteCurrency.style.justifyContent = 'flex-end'
      tokenPriceInQuoteCurrency.style.alignItems = 'baseline'
      tokenPriceInQuoteCurrency.style.gap = '4px'

      const tokenPriceInQuoteCurrencyAmount = document.createElement('span')
      tokenPriceInQuoteCurrencyAmount.id = 'tokenPriceInQuoteCurrencyAmount'
      tokenPriceInQuoteCurrencyAmount.innerText = '0'
      tokenPriceInQuoteCurrencyAmount.classList.add('text-sm', 'text-muted')

      const tokenPriceInQuoteCurrencyQuote = document.createElement('span')
      tokenPriceInQuoteCurrencyQuote.id = 'tokenPriceInQuoteCurrencyQuote'
      tokenPriceInQuoteCurrencyQuote.innerText = ''
      tokenPriceInQuoteCurrencyQuote.classList.add('text-xs', 'text-muted')

      tokenPriceInQuoteCurrency.appendChild(tokenPriceInQuoteCurrencyAmount)
      tokenPriceInQuoteCurrency.appendChild(tokenPriceInQuoteCurrencyQuote)

      const valueCell = tokenRow.querySelector('td:nth-child(6)')
      valueCell.id = 'valueCell'

      const totalValueInUsdCell = valueCell.querySelector(
        'div.ml-auto > div:first-child'
      )

      totalValueInUsdCell.id = 'totalValueInUsdCell'

      const totalValueInUsd = valueCell.querySelector(
        'div.ml-auto > div:first-child > *:first-child'
      )

      totalValueInUsd.id = 'totalValueInUsd'
      totalValueInUsd.innerText = '0'

      const totalValueInQuoteCurrecy = valueCell.querySelector(
        'div.ml-auto > div:last-child'
      )

      totalValueInQuoteCurrecy.id = 'totalValueInQuoteCurrecy'
      totalValueInQuoteCurrecy.innerHTML = ''
      totalValueInQuoteCurrecy.style.justifyContent = 'flex-end'
      totalValueInQuoteCurrecy.style.alignItems = 'baseline'
      totalValueInQuoteCurrecy.style.gap = '4px'

      const totalValueInQuoteCurrecyAmount = document.createElement('span')
      totalValueInQuoteCurrecyAmount.id = 'totalValueInQuoteCurrecyAmount'
      totalValueInQuoteCurrecyAmount.innerText = '0'
      totalValueInQuoteCurrecyAmount.classList.add('text-sm', 'text-muted')

      const totalValueInQuoteCurrecyQuote = document.createElement('span')
      totalValueInQuoteCurrecyQuote.id = 'totalValueInQuoteCurrecyQuote'
      totalValueInQuoteCurrecyQuote.innerText = ''
      totalValueInQuoteCurrecyQuote.classList.add('text-xs', 'text-muted')

      totalValueInQuoteCurrecy.appendChild(totalValueInQuoteCurrecyAmount)
      totalValueInQuoteCurrecy.appendChild(totalValueInQuoteCurrecyQuote)

      elements.push(tokenRow)
    }

    resolve(elements)
  })
}

function updateHtmlWalletMyTokenRow(tokenRow, token, quote, trade) {
  const fee = trade['ExecutionFeeAmountInQuoteCurrency']
  const received = trade['ExecutionReceiveAmount']
  const tokenFee = tokenRow.querySelector('#tokenFee')

  // console.log(token.username, quote, trade, fee, percent)

  const tokenPriceInUsd = tokenRow.querySelector('#tokenPriceInUsd')
  const tokenPrice = parseFloat(tokenPriceInUsd.innerText)
  const newTokenPrice = trade['ExecutionPriceInUsd']

  const tokenPriceInQuoteCurrencyAmount = tokenRow.querySelector(
    '#tokenPriceInQuoteCurrencyAmount'
  )

  const tokenPriceInQuoteCurrencyQuote = tokenRow.querySelector(
    '#tokenPriceInQuoteCurrencyQuote'
  )

  const totalValueInUsd = tokenRow.querySelector('#totalValueInUsd')
  const newTotalValue = trade['ExecutionReceiveAmountUsd']
  const totalValue = parseFloat(totalValueInUsd.innerText)

  const totalValueInQuoteCurrecyAmount = tokenRow.querySelector(
    '#totalValueInQuoteCurrecyAmount'
  )

  const totalValueInQuoteCurrecyQuote = tokenRow.querySelector(
    '#totalValueInQuoteCurrecyQuote'
  )

  if (newTokenPrice > tokenPrice || newTotalValue > totalValue) {
    const percent = fee / (received / 100)

    const tokenFeeText =
      percent == 0 ? 'no fee' : `${formatPrice(percent, 1)}% fee`

    tokenFee.innerText = tokenFeeText

    tokenPriceInUsd.innerText = formatPrice(newTokenPrice, 6)
    tokenPriceInQuoteCurrencyQuote.innerText = quote

    tokenPriceInQuoteCurrencyAmount.innerText = formatPrice(
      trade['ExecutionPriceInQuoteCurrency'],
      2
    )

    totalValueInUsd.innerText = formatPrice(newTotalValue, 2)
    totalValueInQuoteCurrecyQuote.innerText = quote

    totalValueInQuoteCurrecyAmount.innerText = formatPrice(
      trade['ExecutionReceiveAmount'],
      2
    )
  }
}

function updateHtmlWalletMyTokenRowPnl(tokenRow, totalInUsd) {
  const totalValueInUsdCell = tokenRow.querySelector('#totalValueInUsdCell')
  const totalValueInUsd = tokenRow.querySelector('#totalValueInUsd')
  const totalInUsdFormated = formatPrice(totalInUsd, 2)
  totalValueInUsd.innerText = `${totalValueInUsd.innerText} (${totalInUsdFormated})`

  if (totalInUsd < 0) {
    totalValueInUsdCell.classList.remove('text-green-600', 'font-shadow-green')
    totalValueInUsdCell.classList.add('text-red-600')
  }
}

export {
  getHtmlHolderPublicKey,
  markHtmlWalletMyTokens,
  updateHtmlWalletMyTokenRow,
  updateHtmlWalletMyTokenRowPnl
}
