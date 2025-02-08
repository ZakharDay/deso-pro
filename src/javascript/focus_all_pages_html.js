import { formatPrice } from './calcs_and_formatters'

import { getApiGqlFocusUsersCount } from './openfund_api_requests'

import { focusCounterPopupHtml } from './focus_counter_popup_html'

import { getUserCounter, setUserCounter } from './store'

function preloadHtmlCounterFont() {
  const font = new FontFace(
    'digital font',
    'https://zakharday.github.io/deso-pro-site/digital_7_mono.ttf'
  )

  font
    .load()
    .then((fetchedFont) => {
      document.fonts.add(fetchedFont)
    })
    .catch((error) => {
      console.log(error)
    })
}

function addHtmlFocusUserCounter(container) {
  const counter = getUserCounter()
  let counterElement = document.getElementById('focusUsersCounter')

  if (counterElement) {
    counterElement.innerText = `${formatPrice(counter, 0)} users`
  } else {
    counterElement = document.createElement('div')
    counterElement.id = 'focusUsersCounter'
    counterElement.style.marginTop = '8px'
    counterElement.classList.add('text-xs', 'text-muted')
    counterElement.innerText = `${formatPrice(counter, 0)} users`
    container.appendChild(counterElement)

    counterElement.addEventListener('click', (e) => {
      e.preventDefault()
      showHtmlFocusUserCounterPopup()
    })
  }
}

function showHtmlFocusUserCounterPopup() {
  const popup = document.createElement('div')
  popup.id = 'userCounterPopup'
  popup.style.position = 'fixed'
  popup.style.zIndex = '99999999999'
  popup.style.display = 'flex'
  popup.style.justifyContent = 'center'
  popup.style.alignItems = 'center'
  popup.style.top = '0'
  popup.style.left = '0'
  popup.style.width = '100vw'
  popup.style.height = '100vh'
  popup.style.backgroundColor = 'rgba(0,0,0,0.8)'
  popup.innerHTML = focusCounterPopupHtml

  document.body.appendChild(popup)
  updateHtmlFocusUserCouterPopup()

  const updateCounter = setInterval(() => {
    getApiGqlFocusUsersCount().then((counter) => {
      setUserCounter(counter)
      addHtmlFocusUserCounter()
      updateHtmlFocusUserCouterPopup()
    })
  }, 5000)

  popup.addEventListener('click', () => {
    popup.remove()
    clearInterval(updateCounter)
  })
}

function updateHtmlFocusUserCouterPopup() {
  const counter = getUserCounter()
  const popup = document.getElementById('userCounterPopup')
  const numberWrappers = popup.getElementsByClassName('number_wrapper')

  const digits = ('' + counter).split('').reverse()

  if (numberWrappers[5] && digits[0]) {
    numberWrappers[5].classList.remove(
      'empty',
      'number0',
      'number1',
      'number2',
      'number3',
      'number4',
      'number5',
      'number6',
      'number7',
      'number8',
      'number9'
    )

    numberWrappers[5].classList.add(`number${digits[0]}`)
  }

  if (numberWrappers[4] && digits[1]) {
    numberWrappers[4].classList.remove(
      'empty',
      'number0',
      'number1',
      'number2',
      'number3',
      'number4',
      'number5',
      'number6',
      'number7',
      'number8',
      'number9'
    )

    numberWrappers[4].classList.add(`number${digits[1]}`)
  }

  if (numberWrappers[3] && digits[2]) {
    numberWrappers[3].classList.remove(
      'empty',
      'number0',
      'number1',
      'number2',
      'number3',
      'number4',
      'number5',
      'number6',
      'number7',
      'number8',
      'number9'
    )

    numberWrappers[3].classList.add(`number${digits[2]}`)
  }

  if (numberWrappers[2] && digits[3]) {
    numberWrappers[2].classList.remove(
      'empty',
      'number0',
      'number1',
      'number2',
      'number3',
      'number4',
      'number5',
      'number6',
      'number7',
      'number8',
      'number9'
    )

    numberWrappers[2].classList.add(`number${digits[3]}`)
  }

  if (numberWrappers[1] && digits[4]) {
    numberWrappers[1].classList.remove(
      'empty',
      'number0',
      'number1',
      'number2',
      'number3',
      'number4',
      'number5',
      'number6',
      'number7',
      'number8',
      'number9'
    )

    numberWrappers[1].classList.add(`number${digits[4]}`)
  }

  if (numberWrappers[0] && digits[5]) {
    numberWrappers[0].classList.remove(
      'empty',
      'number0',
      'number1',
      'number2',
      'number3',
      'number4',
      'number5',
      'number6',
      'number7',
      'number8',
      'number9'
    )

    numberWrappers[0].classList.add(`number${digits[5]}`)
  }
}

export {
  addHtmlFocusUserCounter,
  showHtmlFocusUserCounterPopup,
  preloadHtmlCounterFont
}
