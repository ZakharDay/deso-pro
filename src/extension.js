import { getPublicKeys } from './javascript/openfund_wallet_html'

import {
  getApiIsHodlingPublicKey,
  getApiMarketOrderData
} from './javascript/openfund_api_requests'

const holderKey = 'BC1YLgeXsafJ8vYcXurRMLy5UcYGbLtjnoXZZWZLuXJqbDVQqXAE6mf'
const focusKey = 'BC1YLjEayZDjAPitJJX4Boy7LsEfN3sWAkYb3hgE9kGBirztsc2re1N'
const desoKey = 'BC1YLgk64us61PUyJ7iTEkV4y2GqpHSi8ejWJRnZwsX6XRTZSfUKsop'
const usdcKey = 'BC1YLiwTN3DbkU8VmD7F7wXcRR1tFX6jDEkLyruHD2WsH3URomimxLX'
const proxyKey = 'BC1YLbnP7rndL92x7DbLp6bkUpCgKmgoHgz7xEbwhgHTps3ZrXA6LtQ'

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
      console.log('DETECTOR LOADED')

      currentElement = document.getElementById(myTokensPanelId)
      publicKeys = getPublicKeys(currentElement)

      publicKeys.forEach((holdingKey) => {
        getApiIsHodlingPublicKey(holderKey, holdingKey).then((data) => {
          // console.log(data)

          let transactorKey = holderKey
          let baseKey = holdingKey
          // let quoteKey = holdingKey

          // if (quoteKey == focusKey || quoteKey == openfundKey) {
          //   baseKey = desoKey
          // } else {
          //   baseKey = focusKey
          // }

          // getApiMarketOrderData(
          //   quoteKey,
          //   desoKey,
          //   transactorKey,
          //   data.quantity,
          //   data.username,
          //   'DESO'
          // )

          // quoteKey, baseKey, transactorKey, quantity, username, base

          getApiMarketOrderData(
            focusKey,
            baseKey,
            transactorKey,
            data.quantity,
            data.username,
            'FOCUS'
          )

          getApiMarketOrderData(
            usdcKey,
            baseKey,
            transactorKey,
            data.quantity,
            data.username,
            'USDC'
          )

          getApiMarketOrderData(
            proxyKey,
            baseKey,
            transactorKey,
            data.quantity,
            data.username,
            // 'PROXY'
            'DESO'
          )
        })
      })
    } else {
      console.log('WILL REPEAT')

      setTimeout(() => {
        waitAsyncPageLoad()
      }, 100)
    }
  }

  // console.log(host, pathname, urlPart, urlPartFirstLetter, urlPartSecondLetter)

  // const mainDetector = document.querySelector('.global__center__inner')
  // const profileDetector = document.querySelector('.creator-profile__top-bar')

  // document.addEventListener('click', () => {
  //   initModalCatcher()
  // })

  // if (firstLettersAccepted.includes(urlPartFirstLetter)) {
  //   if (document.head && document.body && mainDetector) {
  //     injectHtmlCss()
  //     markHtmlBody(urlPartFirstLetter)

  //     if (urlPartFirstLetter === 'w' && mainDetector) {
  //       initWalletPage()
  //       initSidebar()
  //     } else if (urlPartFirstLetter === 'u' && profileDetector) {
  //       const urlLastPart = urlPart.substr(urlPart.lastIndexOf('/') + 1)

  //       if (urlLastPart != 'buy' && urlLastPart != 'sell') {
  //         initProfilePage()
  //       }
  //     } else if (
  //       urlPartFirstLetter === 'b' &&
  //       urlPartSecondLetter === 'r' &&
  //       mainDetector
  //     ) {
  //       initBrowsePage()
  //     } else if (
  //       urlPartFirstLetter === 'n' ||
  //       urlPartFirstLetter === 's' ||
  //       urlPartFirstLetter === 'b'
  //     ) {
  //       getApiBitCloutPrice().then((bitCloutPrice) => {
  //         setStoreBitCloutPrice(bitCloutPrice)
  //         addHtmlBitCloutPrice()
  //       })
  //     } else {
  //       markHtmlBody('')

  //       setTimeout(() => {
  //         waitAsyncPageLoad()
  //       }, 100)
  //     }
  //   } else {
  //     setTimeout(() => {
  //       waitAsyncPageLoad()
  //     }, 100)
  //   }
  // }
}

observeUrlChange()
waitAsyncPageLoad()
