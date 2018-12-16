import { tripTemplate } from './template.js'

class TripCalculator extends window.HTMLElement {
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(tripTemplate.content.cloneNode(true))

    this.miles = this.shadowRoot.querySelector('form input[id="miles"]')
    this.consumption = this.shadowRoot.querySelector('form input[id="consumption"]')
    this.gasPrice = this.shadowRoot.querySelector('form input[id="gas-price"]')
    this.amountOfPersons = this.shadowRoot.querySelector('#amount-of-persons input')

    this.submitBtn = this.shadowRoot.querySelector('form input[type="submit"]')
  }

  connectedCallback () {
    this.checkForValues()
  }

  checkForValues () {
    this.submitBtn.addEventListener('click', (e) => {
      if (this.miles.value && this.consumption.value && this.gasPrice.value) {
        e.preventDefault()
        this.clearTravelCostArea()
        this.calculateCost()
      }
    })
  }

  calculateCost () {
    let travelCost = this.shadowRoot.querySelector('.travel-cost')
    let p = document.createElement('p')
    travelCost.appendChild(p)

    if (!this.amountOfPersons.value) {
      let cost = this.miles.value * this.consumption.value * this.gasPrice.value
      p.textContent = `Resan kostar ${Math.round(cost)} kronor.`
    } else {
      let cost = this.miles.value * this.consumption.value * this.gasPrice.value / this.amountOfPersons.value
      p.textContent = `Resan kostar ${Math.round(cost)} kronor.`
    }
  }

  clearTravelCostArea () {
    let travelCostDiv = this.shadowRoot.querySelector('.travel-cost')
    if (travelCostDiv) {
      while (travelCostDiv.hasChildNodes()) {
        travelCostDiv.removeChild(travelCostDiv.lastChild)
      }
    }
  }
}

window.customElements.define('trip-calculator', TripCalculator)

export {
  TripCalculator
}
