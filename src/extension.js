import './extension.scss'

import * as d3 from 'd3'
import * as Plot from '@observablehq/plot'
import Chart from 'chart.js/auto'

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
  OpenfundWalletController.getHolderKeyAndSetToStore()
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

//
//
//
//
//
//

let desoData = []
let focusData = []
let openfundData = []
let chartData = []

const desoHistoryUrl =
  'https://focus.xyz/api/v0/tokens/candlesticks/history?symbol=BC1YLbnP7rndL92x7DbLp6bkUpCgKmgoHgz7xEbwhgHTps3ZrXA6LtQ&to=1739609026000&resolution=3H&countback=329&quoteSymbol=BC1YLiwTN3DbkU8VmD7F7wXcRR1tFX6jDEkLyruHD2WsH3URomimxLX'

const focusHistoryUrl =
  'https://focus.xyz/api/v0/tokens/candlesticks/history?symbol=BC1YLjEayZDjAPitJJX4Boy7LsEfN3sWAkYb3hgE9kGBirztsc2re1N&to=1739608745000&resolution=3H&countback=330&quoteSymbol=BC1YLbnP7rndL92x7DbLp6bkUpCgKmgoHgz7xEbwhgHTps3ZrXA6LtQ'

const openfundHistoryUrl =
  'https://focus.xyz/api/v0/tokens/candlesticks/history?symbol=BC1YLj3zNA7hRAqBVkvsTeqw7oi4H6ogKiAFL1VXhZy6pYeZcZ6TDRY&to=1739608976000&resolution=3H&countback=329&quoteSymbol=BC1YLbnP7rndL92x7DbLp6bkUpCgKmgoHgz7xEbwhgHTps3ZrXA6LtQ'

function fetchKlineData(url, token) {
  return new Promise((resolve, reject) => {
    fetch(url)
      .then((response) => {
        // console.log('RESPONSE', response)

        parseJsonAndSave(response, token).then(() => {
          resolve()
        })
      })
      .catch((error) => {
        console.error('Error:', error)
      })
  })
}

function parseJsonAndSave(response, token) {
  return new Promise((resolve, reject) => {
    response.json().then((data) => {
      // console.log('Success:', data)

      data.forEach((element) => {
        element.symbol = token
        element.timestamp = new Date(element.timestamp)

        if (element.time > 1738270800000) {
          if (token == 'DESO') {
            desoData.push(element)
          }

          if (token == 'FOCUS') {
            focusData.push(element)
          }

          if (token == 'OPENFUND') {
            openfundData.push(element)
          }
        }
      })

      resolve()
    })
  })
}

Promise.all([
  fetchKlineData(desoHistoryUrl, 'DESO'),
  fetchKlineData(focusHistoryUrl, 'FOCUS'),
  fetchKlineData(openfundHistoryUrl, 'OPENFUND')
]).then(() => {
  console.log('RENDER', chartData)

  // const plot = Plot.lineY(chartData, {
  //   x: 'timestamp',
  //   y: 'close',
  //   z: 'symbol'
  // }).plot({
  //   y: { grid: true }
  // })

  // const formatTime = d3.utcFormat('%B')
  // formatTime(new Date()) // "May 31, 2023"

  // const x0 = [desoData[0].timestamp, desoData[desoData.length - 1].timestamp]

  // desoData.map((i, index) => {
  //   if (index == 0 || index == desoData.length - 1) {
  //     return i.timestamp
  //   }
  // })

  // const x1 = d3.scaleUtc(x0, [0, 10])

  // const x1 = d3.scaleUtc().domain([new Date(x0[0]), new Date(x0[1])])

  // const x2 = desoData.map((i, index) => {
  //   return i.timestamp
  // })

  // console.log(x0)

  // console.log(x1.ticks(10))
  // console.log(x1.tickFormat('d'))

  // const timeScale = d3
  //   .scaleUtc()
  //   .domain([
  //     new Date(desoData[0].timestamp),
  //     new Date(desoData[desoData.length - 1].timestamp)
  //   ])
  const timeScale = d3
    .scaleUtc()
    .domain([desoData[0].timestamp, desoData[desoData.length - 1].timestamp])

  console.log(timeScale.ticks(d3.utcDay))

  console.log(timeScale.ticks(10).map(timeScale.tickFormat()))

  const v1 = (d) => d.close
  const v2 = (d) => d.close
  const v3 = (d) => d.close

  const xx1 = (d) => d.timestamp

  const y2 = d3.scaleLinear(d3.extent(focusData, v2), [0, d3.max(desoData, v1)])

  const y3 = d3.scaleLinear(d3.extent(openfundData, v3), [
    0,
    d3.max(desoData, v1)
  ])

  // const tokensData = [...focusData, ...openfundData]

  // const t1 = d3.scaleLinear(d3.extent(tokensData, v2), [
  //   0,
  //   d3.max(desoData, v1)
  // ])

  // console.log(focusData)

  const plot = Plot.plot({
    width: 1200,
    height: 500,
    // y: { grid: true },
    // x: {
    //   tickFormat: d3.timeFormat('%b')
    //   // ticks: x1.ticks(10, '%B')
    // },
    y: { axis: 'left', label: 'DESO Price', grid: true },
    // color: { type: 'ordinal', scheme: 'set2', legend: true },
    marks: [
      // Plot.axisX(x1.ticks(d3.utcMonth, 1), {
      // Plot.axisX(timeScale.ticks(d3.utcDay), {
      // Plot.axisX(timeScale.ticks(), {
      //   color: 'white',
      //   anchor: 'bottom',
      //   label: 'Months',
      //   x: timeScale,
      //   tickFormat: timeScale.tickFormat()
      // }),
      Plot.axisY(y2.ticks(8), {
        color: '#F19170',
        anchor: 'right',
        label: 'FOCUS Price',
        labelAnchor: 'top',
        labelOffset: '-100',
        // tickPadding: -30,
        // labelAnchor: { top: 20, right: 20, bottom: 50, left: 70 },
        // labelOffset: `${(637, 20)}`,
        // labelOffset: { top: 20, right: 20, bottom: 50, left: 70 },
        // marginTop: -100,
        y: y2,
        tickFormat: y2.tickFormat(),
        fontSize: 6,
        fontWeight: 'bold'
      }),
      Plot.axisY(y3.ticks(8), {
        color: '#51A5FF',
        anchor: 'right',
        label: 'OPENFUND Price',
        y: y3,
        tickFormat: y3.tickFormat(),
        fontSize: 8,
        fontWeight: 'bold'
      }),
      // Plot.ruleX([0]),
      Plot.ruleY([0]),
      Plot.lineY(desoData, { x: 'timestamp', y: 'close', stroke: '#C6C6C6' }),
      // Plot.lineY(desoData, { x: 'timestamp', y: v1 })
      Plot.lineY(
        focusData,
        Plot.mapY((D) => D.map(y2), {
          x: 'timestamp',
          y: v2,
          stroke: '#F19170'
        })
      ),
      Plot.lineY(
        openfundData,
        Plot.mapY((D) => D.map(y3), {
          x: 'timestamp',
          y: v3,
          stroke: '#51A5FF'
        })
      )
      // Plot.axisY({ anchor: 'left', label: 'left-top', labelAnchor: 'top' }),
      // Plot.axisY({
      //   anchor: 'left',
      //   label: 'left-center',
      //   labelAnchor: 'center'
      // }),
      // Plot.axisY({
      //   anchor: 'left',
      //   label: 'left-bottom',
      //   labelAnchor: 'bottom'
      // }),
      // Plot.axisY({ anchor: 'right', label: 'right-top', labelAnchor: 'top' }),
      // Plot.axisY({
      //   anchor: 'right',
      //   label: 'right-center',
      //   labelAnchor: 'center'
      // }),
      // Plot.axisY({
      //   anchor: 'right',
      //   label: 'right-bottom',
      //   labelAnchor: 'bottom'
      // }),

      // Plot.lineY(desoData, {
      //   x: 'timestamp',
      //   y: 'close',
      //   // z: 'symbol',
      //   // fill: 'joined',
      //   // order: 'joined',
      //   // title: (d) => `${d.state}\nJoined ${d.joined}`,
      //   stroke: 'red'
      //   // strokeOpacity: 0.3,
      //   // offset: 'expand',
      //   // curve: 'monotone-x'
      // }),
      // Plot.lineY(focusData, {
      //   // filter: (d) => d.date < new Date(2020, 0, 1),
      //   x: 'timestamp',
      //   y: 'close',
      //   z: 'symbol',
      //   stroke: 'orange'
      //   // fill: 'joined',
      //   // order: 'joined',
      //   // text: 'state',
      //   // textAnchor: 'start',
      //   // dy: -100
      //   // fill: '#000',
      //   // offset: 'expand'
      // }),
      // Plot.lineY(openfundData, {
      //   // filter: (d) => d.date < new Date(2020, 0, 1),
      //   x: 'timestamp',
      //   y: 'close',
      //   // z: 'symbol',
      //   stroke: 'blue'
      //   // dy: -100

      //   // fill: 'joined',
      //   // order: 'joined',
      //   // text: 'state',
      //   // textAnchor: 'start',
      //   // dx: -17,
      //   // fill: '#000',
      //   // offset: 'expand'
      // })
    ]
  })

  const div = document.createElement('div')
  div.style.width = '1200px'
  document.body.prepend(div)
  // plot.width = '1200px'
  // plot.height = '500px'
  plot.style.width = '1200px'
  plot.style.height = '500px'
  div.append(plot)

  //
  //
  //
  //

  const config = {
    type: 'line',
    data: data,
    options: {
      responsive: true,
      interaction: {
        mode: 'index',
        intersect: false
      },
      stacked: false,
      plugins: {
        title: {
          display: true,
          text: 'Chart.js Line Chart - Multi Axis'
        }
      },
      scales: {
        y: {
          type: 'linear',
          display: true,
          position: 'left'
        },
        y1: {
          type: 'linear',
          display: true,
          position: 'right',

          // grid line settings
          grid: {
            drawOnChartArea: false // only want the grid lines for one axis to show up
          }
        }
      }
    }
  }

  // //
  // //
  // //
  // //

  const DATA_COUNT = 7
  // const NUMBER_CFG = { count: DATA_COUNT, min: -100, max: 100 }

  // const labels = Utils.months({ count: 7 })
  const labels = ['1', '2', '3']
  const data = {
    labels: labels,
    datasets: [
      desoData,
      focusData,
      openfundData
      // {
      //   label: 'Dataset 1',
      //   data: desoData,
      //   borderColor: Utils.CHART_COLORS.red,
      //   backgroundColor: Utils.transparentize(Utils.CHART_COLORS.red, 0.5),
      //   yAxisID: 'y'
      // },
      // {
      //   label: 'Dataset 2',
      //   data: Utils.numbers(NUMBER_CFG),
      //   borderColor: Utils.CHART_COLORS.blue,
      //   backgroundColor: Utils.transparentize(Utils.CHART_COLORS.blue, 0.5),
      //   yAxisID: 'y1'
      // }
    ]
  }

  //
  //
  //
  //
  //
  //

  // const config = {
  //   type: 'line',
  //   data: {},
  //   options: {},
  //   plugins: []
  // }

  // console.log(Chart)

  //
  //
  //
  //
  //
  //
  //
  //
  //

  const canvas = document.createElement('canvas')
  canvas.id = myChart
  document.body.appendChild(canvas)

  canvas.width = 400
  canvas.height = 400

  canvas.style.width = '400px'
  canvas.style.height = '400px'

  const ctx = canvas.getContext('2d')
  ctx.canvas.width = 400
  ctx.canvas.height = 400

  const myChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['January', 'February', 'March', 'April', 'May', 'June'],
      datasets: [
        {
          label: 'Sales',
          data: [30, 45, 60, 35, 50, 40],
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 2,
          fill: false
        }
      ]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  })
})
