import {
  getHtmlHolderPublicKey,
  markHtmlWalletMyTokens,
  updateHtmlWalletMyTokenRow
} from './javascript/openfund_wallet_html'

import {
  getApiIsHodlingPublicKey,
  getApiMarketOrderData
} from './javascript/openfund_api_requests'

const focusKey = 'BC1YLjEayZDjAPitJJX4Boy7LsEfN3sWAkYb3hgE9kGBirztsc2re1N'
const desoProxyKey = 'BC1YLbnP7rndL92x7DbLp6bkUpCgKmgoHgz7xEbwhgHTps3ZrXA6LtQ'
const usdcKey = 'BC1YLiwTN3DbkU8VmD7F7wXcRR1tFX6jDEkLyruHD2WsH3URomimxLX'
// const desoKey = 'BC1YLgk64us61PUyJ7iTEkV4y2GqpHSi8ejWJRnZwsX6XRTZSfUKsop'

let pageObserver
let holderKey

function observeUrlChange() {
  let lastUrl = location.href

  new MutationObserver(() => {
    const url = location.href

    if (url !== lastUrl) {
      lastUrl = url
      onUrlChange()
    }
  }).observe(document, { subtree: true, childList: true })

  function onUrlChange() {
    waitAsyncPageLoad()

    if (pageObserver) {
      pageObserver.unobserve()
    }
  }
}

function waitAsyncPageLoad() {
  const { host, pathname } = window.location
  const urlPart = pathname.substr(1)
  const urlPartFirstLetter = urlPart.charAt(0)
  const urlPartSecondLetter = urlPart.charAt(1)
  const firstLettersAccepted = ['w', 'u', 'b', 'n', 's', 'b']

  const holdingsPanelId = 'headlessui-tabs-panel-:rp:'
  const myTokensPanelId = 'headlessui-tabs-panel-:r11:'

  let currentPageDetector

  if (host == 'openfund.com' && urlPartFirstLetter == 'w') {
    const table = document.getElementById(myTokensPanelId)

    if (table) {
      currentPageDetector = table.querySelector('tbody tr')
    }
  }

  if (firstLettersAccepted.includes(urlPartFirstLetter)) {
    if (document.head && document.body && currentPageDetector) {
      // console.log('DETECTOR LOADED')

      const container = document.getElementById(myTokensPanelId)
      holderKey = getHtmlHolderPublicKey()

      markHtmlWalletMyTokens(container).then((tokenRows) => {
        for (let index = 0; index < tokenRows.length; index++) {
          const tokenRow = tokenRows[index]
          const holdingKey = tokenRow.dataset.publicKey

          getApiIsHodlingPublicKey(holderKey, holdingKey).then((token) => {
            const transactorKey = holderKey
            const baseKey = holdingKey

            if (token.username != 'focus') {
              getApiMarketOrderData(
                focusKey,
                baseKey,
                transactorKey,
                token.quantity,
                token.username,
                'FOCUS'
              ).then((trade) => {
                updateHtmlWalletMyTokenRow(tokenRow, token, 'FOCUS', trade)
              })
            }

            getApiMarketOrderData(
              usdcKey,
              baseKey,
              transactorKey,
              token.quantity,
              token.username,
              'USDC'
            ).then((trade) => {
              updateHtmlWalletMyTokenRow(tokenRow, token, 'USDC', trade)
            })

            getApiMarketOrderData(
              desoProxyKey,
              baseKey,
              transactorKey,
              token.quantity,
              token.username,
              'DESO'
            ).then((trade) => {
              updateHtmlWalletMyTokenRow(tokenRow, token, 'DESO', trade)
            })
          })
        }
      })
    } else {
      // console.log('WILL REPEAT')

      setTimeout(() => {
        waitAsyncPageLoad()
      }, 100)
    }
  }
}

observeUrlChange()
waitAsyncPageLoad()
