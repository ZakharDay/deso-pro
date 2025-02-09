let holderKey = ''
let focusReceived = 0
let focusTransfered = 0
let focusSold = 0
let focusBought = 0
let focusInPosition = 0
let transferTransactions = []
let tradingTransactions = []
let userCounter = 0

function resetStore() {
  holderKey = ''
  focusReceived = 0
  focusTransfered = 0
  focusSold = 0
  focusBought = 0
  focusInPosition = 0
  transferTransactions = []
  tradingTransactions = []
  userCounter = 0
}

function getHolderKey() {
  return holderKey
}

function setHolderKey(key) {
  holderKey = key
}

function getFocusReceived() {
  return focusReceived
}

function setFocusReceived(quantity) {
  focusReceived = quantity
}

function getFocusTransfered() {
  return focusTransfered
}

function setFocusTransfered(quantity) {
  focusTransfered = quantity
}

function getFocusSold() {
  return focusSold
}

function setFocusSold(quantity) {
  focusSold = quantity
}

function getFocusBought() {
  return focusBought
}

function setFocusBought(quantity) {
  focusBought = quantity
}

function getFocusInPosition() {
  return focusInPosition
}

function setFocusInPosition(quantity) {
  focusInPosition = quantity
}

function getTransferTransactions() {
  return transferTransactions
}

function setTransferTransactions(transactions) {
  transferTransactions = transactions
}

function getTradingTransactions() {
  return tradingTransactions
}

function setTradingTransactions(transactions) {
  tradingTransactions = transactions
}

function getUserCounter() {
  return userCounter
}

function setUserCounter(counter) {
  userCounter = counter
}

export {
  resetStore,
  getHolderKey,
  setHolderKey,
  getFocusReceived,
  setFocusReceived,
  getFocusTransfered,
  setFocusTransfered,
  getFocusSold,
  setFocusSold,
  getFocusBought,
  setFocusBought,
  getFocusInPosition,
  setFocusInPosition,
  getTransferTransactions,
  setTransferTransactions,
  getTradingTransactions,
  setTradingTransactions,
  getUserCounter,
  setUserCounter
}
