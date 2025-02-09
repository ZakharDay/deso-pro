import { formatPrice, hexNanosToNumber } from './calcs_and_formatters'

import {
  getFocusBought,
  getFocusReceived,
  getFocusSold,
  getFocusTransfered,
  getFocusInPosition
} from './store'

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
    tokenPriceInQuoteCurrencyQuote.dataset.quote = quote

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

function updateHtmlWalletMyTokenRowPnl(tokenRow, total) {
  const totalValueInUsdCell = tokenRow.querySelector('#totalValueInUsdCell')
  const totalValueInUsd = tokenRow.querySelector('#totalValueInUsd')
  const totalInUsdFormated = formatPrice(total.totalInUsd, 2)
  totalValueInUsd.innerText = `${totalValueInUsd.innerText} (${totalInUsdFormated})`

  if (total.totalInUsd < 0) {
    totalValueInUsdCell.classList.remove('text-green-600', 'font-shadow-green')
    totalValueInUsdCell.classList.add('text-red-600')
  }

  // console.log(total)
}

function addHtmlWalletTokensSectionTopBar() {
  const tokensSectionTopBarContainer = document.querySelector(
    '#app-root > div > div:nth-child(2) > div > div:nth-child(3) > div:nth-child(2) > div > div:nth-child(2)'
  )

  const tokensSectionTopBar = document.createElement('div')
  tokensSectionTopBar.id = 'tokensSectionTopBar'
  tokensSectionTopBar.style.position = 'absolute'
  tokensSectionTopBar.style.right = '20px'

  tokensSectionTopBar.classList.add(
    'flex',
    'items-center',
    'gap-4',
    'font-mono',
    'text-right'
  )

  const tokensSectionTopBarNotice = document.createElement('div')
  tokensSectionTopBarNotice.id = 'tokensSectionTopBarNotice'
  tokensSectionTopBarNotice.classList.add('text-xs', 'text-muted')

  const tokensSectionTopBarTitle1 = document.createElement('div')
  tokensSectionTopBarTitle1.id = 'tokensSectionTopBarTitle1'
  tokensSectionTopBarTitle1.classList.add('text-sm')

  const tokensSectionTopBarTitle2 = document.createElement('div')
  tokensSectionTopBarTitle2.id = 'tokensSectionTopBarTitle2'
  tokensSectionTopBarTitle2.classList.add('text-sm')

  const tokensSectionTopBarTitle3 = document.createElement('div')
  tokensSectionTopBarTitle3.id = 'tokensSectionTopBarTitle3'
  tokensSectionTopBarTitle3.classList.add('text-sm')

  const tokensSectionTopBarTotal1 = document.createElement('div')
  tokensSectionTopBarTotal1.id = 'tokensSectionTopBarTotal1'
  tokensSectionTopBarTotal1.classList.add('text-sm')

  const tokensSectionTopBarTotal2 = document.createElement('div')
  tokensSectionTopBarTotal2.id = 'tokensSectionTopBarTotal2'
  tokensSectionTopBarTotal2.classList.add('text-sm')

  const tokensSectionTopBarTotal3 = document.createElement('div')
  tokensSectionTopBarTotal3.id = 'tokensSectionTopBarTotal3'
  tokensSectionTopBarTotal3.classList.add('text-sm')

  tokensSectionTopBarTotal3.innerText = 'Loading data...'

  tokensSectionTopBar.appendChild(tokensSectionTopBarNotice)
  tokensSectionTopBar.appendChild(tokensSectionTopBarTitle1)
  tokensSectionTopBar.appendChild(tokensSectionTopBarTotal1)
  tokensSectionTopBar.appendChild(tokensSectionTopBarTitle2)
  tokensSectionTopBar.appendChild(tokensSectionTopBarTotal2)
  tokensSectionTopBar.appendChild(tokensSectionTopBarTitle3)
  tokensSectionTopBar.appendChild(tokensSectionTopBarTotal3)

  tokensSectionTopBarContainer.style.position = 'relative'
  tokensSectionTopBarContainer.appendChild(tokensSectionTopBar)
}

function updateHtmlWalletTokenSectionTopBar() {
  const focusBought = getFocusBought()
  const focusSold = getFocusSold()
  const focusReceived = getFocusReceived()
  const focusTransfered = getFocusTransfered()
  const focusInPosition = getFocusInPosition()

  const focusInitial = focusReceived + focusBought
  const focusHeld = focusBought + focusReceived - focusSold - focusTransfered
  const focusInvested = focusHeld - focusInitial
  const focusUnreleasedPnl = focusInvested + focusInPosition

  const focusInvestedFormatted = formatPrice(focusInvested)
  const focusInPositionFormatted = formatPrice(focusInPosition)
  const focusUnreleasedPnlFormatted = formatPrice(focusUnreleasedPnl)

  // prettier-ignore
  const tokensSectionTopBarNotice = document.getElementById('tokensSectionTopBarNotice')
  // prettier-ignore
  const tokensSectionTopBarTitle1 = document.getElementById('tokensSectionTopBarTitle1')
  // prettier-ignore
  const tokensSectionTopBarTotal1 = document.getElementById('tokensSectionTopBarTotal1')
  // prettier-ignore
  const tokensSectionTopBarTitle2 = document.getElementById('tokensSectionTopBarTitle2')
  // prettier-ignore
  const tokensSectionTopBarTotal2 = document.getElementById('tokensSectionTopBarTotal2')
  // prettier-ignore
  const tokensSectionTopBarTitle3 = document.getElementById('tokensSectionTopBarTitle3')
  // prettier-ignore
  const tokensSectionTopBarTotal3 = document.getElementById('tokensSectionTopBarTotal3')

  tokensSectionTopBarNotice.innerText = 'Experimental'
  tokensSectionTopBarTitle1.innerText = 'Invested in tokens:'
  tokensSectionTopBarTotal1.innerText = `${focusInvestedFormatted} FOCUS`
  tokensSectionTopBarTitle2.innerText = 'Current position:'
  tokensSectionTopBarTotal2.innerText = `${focusInPositionFormatted} FOCUS`
  tokensSectionTopBarTitle3.innerText = 'Unreleased PNL:'
  tokensSectionTopBarTotal3.innerText = `${focusUnreleasedPnlFormatted} FOCUS`

  colorizeRedOrGreen(tokensSectionTopBarTotal1, focusInvested < 0)
  colorizeRedOrGreen(tokensSectionTopBarTotal2, focusInPosition < 0)
  colorizeRedOrGreen(tokensSectionTopBarTotal3, focusUnreleasedPnl < 0)
}

function colorizeRedOrGreen(element, statement) {
  if (statement) {
    element.classList.add('text-red-600')
    element.classList.remove('text-green-600', 'font-shadow-green')
  } else {
    element.classList.add('text-green-600', 'font-shadow-green')
    element.classList.remove('text-red-600')
  }
}

export {
  getHtmlHolderPublicKey,
  markHtmlWalletMyTokens,
  updateHtmlWalletMyTokenRow,
  updateHtmlWalletMyTokenRowPnl,
  addHtmlWalletTokensSectionTopBar,
  updateHtmlWalletTokenSectionTopBar
}
