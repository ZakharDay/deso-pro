import './extension.scss'

// import * as d3 from 'd3'
// import * as Plot from '@observablehq/plot'
// import Chart from 'chart.js/auto'

import { Constants } from './javascript/constants'
import { Store } from './javascript/store'
import { CalcsAndFormatters } from './javascript/calcs_and_formatters'
import { DataModifiers } from './javascript/data_modifiers'

import { OpenfundWalletController } from './javascript/openfund_wallet_controller'
import { OpenfundApiRequests } from './javascript/openfund_api_requests'
import { OpenfundWalletHtml } from './javascript/openfund_wallet_html'
import { FocusAllPagesHtml } from './javascript/focus_all_pages_html'

let pageObserver

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

  let table
  let currentPageDetector

  if (host == 'openfund.com' && urlPartFirstLetter == 'w') {
    const firstLettersAccepted = ['w']
    table = document.querySelector(Constants.myTokensPanelSelector)

    if (table) {
      currentPageDetector = table.querySelector('tbody tr')
    }

    if (firstLettersAccepted.includes(urlPartFirstLetter)) {
      if (document.head && document.body && currentPageDetector) {
        // console.log('DETECTOR LOADED')
        initOpenfundWalletPage(table)
      } else {
        // console.log('WILL REPEAT')
        setTimeout(() => {
          waitAsyncPageLoad()
        }, 100)
      }
    }
  }

  if (host == 'focus.xyz') {
    currentPageDetector = document.querySelector(Constants.focusLogoSelector)

    if (document.head && document.body && currentPageDetector) {
      // console.log('DETECTOR LOADED')
      initFocusAllPage(currentPageDetector)
    } else {
      // console.log('WILL REPEAT')
      setTimeout(() => {
        waitAsyncPageLoad()
      }, 100)
    }
  }
}

function initOpenfundWalletPage(container) {
  Store.resetStore()

  OpenfundWalletHtml.injectCss()
  OpenfundWalletHtml.prepareMainWalletPanel()

  OpenfundWalletController.getHolderKeyAndSetToStore()
  OpenfundWalletController.getPriceChartDataAndUpdateUi()
  OpenfundWalletController.prepareMyTokensTable(container)

  Promise.all([
    OpenfundWalletController.getExchangeRateAndSetToStore(),
    OpenfundWalletController.getFocusExchangeRateAndSetToStore()
  ]).then(() => {
    OpenfundWalletController.getFocusInvestedAndShowOnPage()
    OpenfundWalletController.getMyTokensDataAndUpdateTable()
  })
}

function initFocusAllPage(container) {
  FocusAllPagesHtml.preloadCounterFont()

  OpenfundApiRequests.getGqlFocusUsersCount().then((counter) => {
    Store.setUserCounter(counter)
    FocusAllPagesHtml.addFocusUserCounter(container)
  })
}

observeUrlChange()
waitAsyncPageLoad()
