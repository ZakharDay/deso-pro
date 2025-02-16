import { Store } from './store'
import { Constants } from './constants'
import { CalcsAndFormatters } from './calcs_and_formatters'

function injectCss() {
  const detector = document.querySelector('style#desopro')

  if (!detector) {
    const css = require(/* webpackMode: "eager" */ '../../dist/extension.css?raw')
    const style = document.createElement('style')
    style.id = 'desopro'

    if (style.styleSheet) {
      style.styleSheet.cssText = css
    } else {
      style.appendChild(document.createTextNode(css))
    }

    document.querySelector('head').appendChild(style)
  }
}

function getHolderPublicKey() {
  return document.querySelector('button.rounded-md').title
}

function getTokenRowData(tokenRow) {
  const profilePic = tokenRow.querySelector('td a img')
  const publicKey = /picture\/(.*?)\?/g.exec(profilePic.src)[1]

  const username = tokenRow
    .querySelector('td:first-child .text-muted-foreground')
    .innerText.substring(1)

  return { publicKey, username }
}

function getCurrentMyTokenRow(tokenData) {
  return document.getElementById(`myTokenRow_${tokenData.publicKey}`)
}

function prepareMainWalletPanel() {
  const mainWalletPanel = document.querySelector(Constants.mainWalletPanel)
  const priceChart = document.createElement('div')
  const coinButtons = document.createElement('div')
  const desoButton = document.createElement('div')
  const focusButton = document.createElement('div')
  const openfundButton = document.createElement('div')
  const userHeader = mainWalletPanel.firstChild
  const userWallet = mainWalletPanel.lastChild

  desoButton.innerText = 'DESO'
  focusButton.innerText = 'FOCUS'
  openfundButton.innerText = 'OPENFUND'

  mainWalletPanel.id = 'mainWalletPanel'
  coinButtons.id = 'coinButtons'
  desoButton.id = 'desoButton'
  focusButton.id = 'focusButton'
  openfundButton.id = 'openfundButton'
  userHeader.id = 'userHeader'
  userWallet.id = 'userWallet'
  priceChart.id = 'priceChart'

  coinButtons.appendChild(desoButton)
  coinButtons.appendChild(focusButton)
  coinButtons.appendChild(openfundButton)

  mainWalletPanel.appendChild(coinButtons)
  mainWalletPanel.appendChild(priceChart)

  desoButton.addEventListener('mouseover', (e) => {
    const svg = priceChart.querySelector('svg')
    const line = document.getElementById('desoLine')
    line.setAttribute('stroke', '#b1b1b1')
    svg.appendChild(line)
  })

  desoButton.addEventListener('mouseleave', (e) => {
    const line = document.getElementById('desoLine')
    line.setAttribute('stroke', '#424242')
  })

  focusButton.addEventListener('mouseover', (e) => {
    const svg = priceChart.querySelector('svg')
    const line = document.getElementById('focusLine')
    line.setAttribute('stroke', '#d25c33')
    svg.appendChild(line)
  })

  focusButton.addEventListener('mouseleave', (e) => {
    const line = document.getElementById('focusLine')
    line.setAttribute('stroke', '#663e30')
  })

  openfundButton.addEventListener('mouseover', (e) => {
    const svg = priceChart.querySelector('svg')
    const line = document.getElementById('openfundLine')
    line.setAttribute('stroke', '#1969c0')
    svg.appendChild(line)
  })

  openfundButton.addEventListener('mouseleave', (e) => {
    const line = document.getElementById('openfundLine')
    line.setAttribute('stroke', '#204166')
  })
}

function prepareMyTokenRow(tokenRow, tokenData) {
  tokenRow.id = `myTokenRow_${tokenData.publicKey}`
}

function prepareMyTokenRowTokenCell(tokenRow) {
  const userProfileContextMenu = document.createElement('div')
  userProfileContextMenu.classList.add('linksList')
  userProfileContextMenu.id = 'userProfileContextMenu'

  const tokenNameCell = document.createElement('div')
  tokenNameCell.id = 'tokenNameCell'

  tokenNameCell.innerHTML = tokenRow.querySelector('td:first-child a').innerHTML

  tokenRow.querySelector('td:first-child a').replaceWith(tokenNameCell)

  const tokenNameElement = tokenNameCell.querySelector('.text-muted-foreground')

  tokenNameElement.id = 'tokenNameElement'
  tokenNameElement.appendChild(userProfileContextMenu)

  const tokenFee = document.createElement('span')
  tokenFee.id = 'tokenFee'
  tokenFee.classList.add('text-muted')
  tokenFee.style.marginLeft = '10px'

  tokenNameCell.appendChild(tokenFee)
}

function prepareMyTokerRowPriceCell(tokenRow) {
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
}

function prepareMyTokenRowValueCell(tokenRow) {
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
}

function prepareMyTokenActionBar(tokenRow) {
  const actionBar = tokenRow.querySelector('td:last-child')
  actionBar.id = 'actionBar'

  const moveToHiddenButton = actionBar.querySelector('div > button:first-child')
  moveToHiddenButton.id = 'moveToHiddenButton'
  moveToHiddenButton.innerText = 'Hide'
}

function addUserProfileContextMenu(tokenRow, tokenData) {
  const networks = [
    'focus',
    'openfund',
    'deso',
    'diamond',
    'desocialworld',
    'bitclout',
    'nftz'
  ]

  const userProfileContextMenu = tokenRow.querySelector(
    '#userProfileContextMenu'
  )

  networks.forEach((network) => {
    addUserProfileContextMenuItem(tokenData, network, userProfileContextMenu)
  })
}

function addUserProfileContextMenuItem(tokenData, network, contextMenu) {
  const profileUrl = [
    Constants.networkUrls[network].url,
    tokenData.username
  ].join('')

  const profileLinkText = [Constants.networkUrls[network].text, 'Profile'].join(
    ' '
  )

  const profileLink = document.createElement('a')

  profileLink.href = profileUrl
  profileLink.target = '_blank'
  profileLink.innerText = profileLinkText
  profileLink.classList.add('linkItem')

  contextMenu.appendChild(profileLink)
}

//
// Refactoring
//

function updateWalletMyTokenRow(tokenData, quote, trade) {
  const tokenRow = document.querySelector(`#myTokenRow_${tokenData.publicKey}`)

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
    tokenPriceInUsd.innerText = CalcsAndFormatters.formatPrice(newTokenPrice, 6)
    tokenPriceInQuoteCurrencyQuote.innerText = quote
    tokenPriceInQuoteCurrencyQuote.dataset.quote = quote

    //
    //
    //

    tokenPriceInQuoteCurrencyAmount.innerText = CalcsAndFormatters.formatPrice(
      trade['ExecutionPriceInQuoteCurrency'],
      2
    )

    //
    //
    //

    totalValueInUsd.innerText = CalcsAndFormatters.formatPrice(newTotalValue, 2)
    totalValueInQuoteCurrecyQuote.innerText = quote

    //
    //
    //

    totalValueInQuoteCurrecyAmount.innerText = CalcsAndFormatters.formatPrice(
      trade['ExecutionReceiveAmount'],
      2
    )

    //
    //
    //
  }
}

function updateWalletTokenRowFee(tokenData) {
  const tokenRow = document.querySelector(`#myTokenRow_${tokenData.publicKey}`)
  const tokenFee = tokenRow.querySelector('#tokenFee')
  const fee = tokenData.coinProperties['TotalTradingFeeBasisPoints'] / 100

  // const fee = trade['ExecutionFeeAmountInQuoteCurrency']
  // const received = trade['ExecutionReceiveAmount']
  // const percent = fee / (received / 100)

  const tokenFeeText =
    fee == 0.0 ? 'no fee' : `${CalcsAndFormatters.formatPrice(fee, 1)}% fee`

  tokenFee.innerText = tokenFeeText
}

function updateWalletMyTokenRowPnl(tokenData, total, quote) {
  const tokenRow = document.querySelector(`#myTokenRow_${tokenData.publicKey}`)
  const totalValueInUsdCell = tokenRow.querySelector('#totalValueInUsdCell')
  const totalValueInUsd = tokenRow.querySelector('#totalValueInUsd')

  const totalValueInQuoteCurrecyAmount = tokenRow.querySelector(
    '#totalValueInQuoteCurrecyAmount'
  )

  const totalInUsdFormated = CalcsAndFormatters.formatPrice(
    total.totalInUsdInQuote,
    2
  )

  // const totalInUsdFormated = CalcsAndFormatters.formatQuantity(
  //   total.totalInUsdInQuote,
  //   2
  // )

  totalValueInUsd.innerText = `${totalValueInUsd.innerText} (${totalInUsdFormated})`

  if (total.totalInUsd < 0) {
    totalValueInUsdCell.classList.remove('text-green-600', 'font-shadow-green')
    totalValueInUsdCell.classList.add('text-red-600')
  }

  // let totalValueInQuoteCurrecyAmountFormatted = 0

  // if (quote == 'FOCUS') {
  //   totalValueInQuoteCurrecyAmountFormatted = CalcsAndFormatters.formatQuantity(
  //     total.totalInFocus,
  //     2
  //   )
  // }

  // if (quote == 'DESO') {
  //   totalValueInQuoteCurrecyAmountFormatted = CalcsAndFormatters.formatQuantity(
  //     total.totalInDeso,
  //     2
  //   )
  // }

  // if (quote == 'DESO') {
  //   totalValueInQuoteCurrecyAmountFormatted = CalcsAndFormatters.formatQuantity(
  //     total.totalInDeso,
  //     2
  //   )
  // }

  // totalValueInQuoteCurrecyAmount.innerText = `${totalValueInQuoteCurrecyAmount.innerText} (${totalValueInQuoteCurrecyAmountFormatted})`
}

function getCurrencyQuoteFromTokenRow(tokenData) {
  const tokenRow = document.querySelector(`#myTokenRow_${tokenData.publicKey}`)

  const tokenPriceInQuoteCurrencyQuote = tokenRow.querySelector(
    '#tokenPriceInQuoteCurrencyQuote'
  )

  return tokenPriceInQuoteCurrencyQuote.dataset.quote
}

function addWalletTokensSectionTopBar() {
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

function updateWalletTokenSectionTopBar() {
  const focusBought = Store.getFocusBought()
  const focusSold = Store.getFocusSold()
  const focusReceived = Store.getFocusReceived()
  const focusTransfered = Store.getFocusTransfered()
  const focusInPosition = Store.getFocusInPosition()

  const focusInitial = focusReceived + focusBought
  const focusHeld = focusBought + focusReceived - focusSold - focusTransfered
  const focusInvested = focusHeld - focusInitial
  const focusUnreleasedPnl = focusInvested + focusInPosition

  const focusInvestedFormatted = CalcsAndFormatters.formatPrice(focusInvested)
  const focusInPositionFormatted =
    CalcsAndFormatters.formatPrice(focusInPosition)
  const focusUnreleasedPnlFormatted =
    CalcsAndFormatters.formatPrice(focusUnreleasedPnl)

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

const OpenfundWalletHtml = {
  injectCss,
  getHolderPublicKey,
  getTokenRowData,
  getCurrentMyTokenRow,
  prepareMainWalletPanel,
  prepareMyTokenRow,
  prepareMyTokenRowTokenCell,
  prepareMyTokerRowPriceCell,
  prepareMyTokenRowValueCell,
  prepareMyTokenActionBar,
  addUserProfileContextMenu,
  getCurrencyQuoteFromTokenRow,
  updateWalletTokenRowFee,
  //
  //
  updateWalletMyTokenRow,
  updateWalletMyTokenRowPnl,
  addWalletTokensSectionTopBar,
  updateWalletTokenSectionTopBar
}

export { OpenfundWalletHtml }
