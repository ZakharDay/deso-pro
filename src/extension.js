import { getPublicKeys } from './javascript/openfund_wallet_html'

import {
  getApiIsHodlingPublicKey,
  getApiMarketOrderData
} from './javascript/openfund_api_requests'

const holderKey = 'BC1YLgeXsafJ8vYcXurRMLy5UcYGbLtjnoXZZWZLuXJqbDVQqXAE6mf'
const focusKey = 'BC1YLjEayZDjAPitJJX4Boy7LsEfN3sWAkYb3hgE9kGBirztsc2re1N'
// const desoKey = 'BC1YLgk64us61PUyJ7iTEkV4y2GqpHSi8ejWJRnZwsX6XRTZSfUKsop'
const desoProxyKey = 'BC1YLbnP7rndL92x7DbLp6bkUpCgKmgoHgz7xEbwhgHTps3ZrXA6LtQ'
const usdcKey = 'BC1YLiwTN3DbkU8VmD7F7wXcRR1tFX6jDEkLyruHD2WsH3URomimxLX'

// const openfundKey = 'BC1YLj3zNA7hRAqBVkvsTeqw7oi4H6ogKiAFL1VXhZy6pYeZcZ6TDRY'

let pageObserver
let publicKeys
let currentElement

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

      currentElement = document.getElementById(myTokensPanelId)
      publicKeys = getPublicKeys(currentElement)

      // console.log(publicKeys.length)

      publicKeys.forEach((holdingKey) => {
        getApiIsHodlingPublicKey(holderKey, holdingKey).then((data) => {
          // console.log(data.username)

          let transactorKey = holderKey
          let baseKey = holdingKey

          if (data.username != 'focus') {
            getApiMarketOrderData(
              focusKey,
              baseKey,
              transactorKey,
              data.quantity,
              data.username,
              'FOCUS'
            )
          }

          getApiMarketOrderData(
            usdcKey,
            baseKey,
            transactorKey,
            data.quantity,
            data.username,
            'USDC'
          )

          getApiMarketOrderData(
            desoProxyKey,
            baseKey,
            transactorKey,
            data.quantity,
            data.username,
            'DESO'
          )
        })
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
