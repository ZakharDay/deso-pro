const focusKey = 'BC1YLjEayZDjAPitJJX4Boy7LsEfN3sWAkYb3hgE9kGBirztsc2re1N'
const desoProxyKey = 'BC1YLbnP7rndL92x7DbLp6bkUpCgKmgoHgz7xEbwhgHTps3ZrXA6LtQ'
const usdcKey = 'BC1YLiwTN3DbkU8VmD7F7wXcRR1tFX6jDEkLyruHD2WsH3URomimxLX'
const desoKey = 'BC1YLgk64us61PUyJ7iTEkV4y2GqpHSi8ejWJRnZwsX6XRTZSfUKsop'

const holdingsPanelId = 'headlessui-tabs-panel-:rp:'

const mainWalletPanel =
  '#app-root > div > div:nth-child(2) > div > div:nth-child(2)'

const myTokensPanelSelector =
  '#app-root > div > div:last-child > div > div:last-child > div:last-child > div > div:last-child > div > div > div > table'

const focusLogoSelector =
  'main > div > div:last-child > div:first-child > div > div > div:first-child > a'

const networkUrls = {
  focus: {
    text: 'Focus',
    url: 'https://focus.xyz/'
  },
  openfund: {
    text: 'Openfund',
    url: 'https://openfund.com/d/'
  },
  deso: {
    text: 'DeSo',
    url: 'https://explorer.deso.com/u/'
  },
  diamond: {
    text: 'Diamond',
    url: 'https://diamondapp.com/u/'
  },
  desocialworld: {
    text: 'DeSocialWorld',
    url: 'https://desocialworld.com/u/'
  },
  bitclout: {
    text: 'BitClout',
    url: 'https://bitclout.com/u/'
  },
  nftz: {
    text: 'NFTz',
    url: 'https://nftz.me/u/'
  }
}

const Constants = {
  focusKey,
  desoProxyKey,
  usdcKey,
  desoKey,
  mainWalletPanel,
  holdingsPanelId,
  myTokensPanelSelector,
  focusLogoSelector,
  networkUrls
}

export { Constants }
