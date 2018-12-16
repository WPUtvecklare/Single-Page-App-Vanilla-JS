import { tripTemplate } from './template.js'

class TripCalculator extends window.HTMLElement {
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(tripTemplate.content.cloneNode(true))

    this.miles = this.shadowRoot.querySelector('form input[id="miles"]')
    this.consumption = this.shadowRoot.querySelector('form input[id="consumption"]')
    this.gasPrice = this.shadowRoot.querySelector('form input[id="gas-price"]')

    this.submitBtn = this.shadowRoot.querySelector('form input[type="submit"]')
  }

  connectedCallback () {
    this.checkForValues()
  }

  checkForValues () {
    this.submitBtn.addEventListener('click', (e) => {
      if (this.miles.value && this.consumption.value && this.gasPrice.value) {
        e.preventDefault()
        this.calculateCost()
      }
    })
  }

  calculateCost () {
    console.log(`Resan kostar ${this.miles.value * this.consumption.value * this.gasPrice.value} kronor.`)
  }
}

window.customElements.define('trip-calculator', TripCalculator)

export {
  TripCalculator
}
