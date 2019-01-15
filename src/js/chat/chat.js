import { welcomeTemplate, chatTemplate } from './template.js'

class Chat extends window.HTMLElement {
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(welcomeTemplate.content.cloneNode(true))
    this.socket = null
    this.chatArea = this.shadowRoot.querySelector('.chat')
    this.username = this.shadowRoot.querySelector('.welcome #username')
    this.channel = this.shadowRoot.querySelector('.welcome #channel')
  }

  connectedCallback () {
    this.startChat()
    this.getUsername()
  }

  startChat () {
    const startChatBtn = this.shadowRoot.querySelector('.welcome .start-chat')

    startChatBtn.addEventListener('click', (e) => {
      if (this.username.value) {
        this.clearWelcomeArea()
        this.chatArea.appendChild(chatTemplate.content.cloneNode(true))
        this.setUsername()
        this.connect()
        this.listenToEnterBtn()
      }
      startChatBtn.removeEventListener('click', (e))
    })
  }

  async connect () {
    if (this.socket && this.socket.readyState === 1) {
      return this.socket
    }

    this.socket = await new window.WebSocket('ws://vhost3.lnu.se:20080/socket/')

    this.socket.addEventListener('error', e => {
      this.chatOffline()
    })

    this.socket.addEventListener('message', e => {
      const message = JSON.parse(e.data)
      if (message.type === 'message' && message.username !== 'MyFancyUsername') {
        if (message.channel === this.channel.value) {
          this.printMessage(message)
          const audio = new Audio('./music/new-message.mp3')
          audio.play()
        }
      }
    })
  }

  async sendMessage (text) {
    const data = {
      type: 'message',
      data: text,
      username: this.username.value || 'Pro',
      channel: this.channel.value || '',
      key: 'eDBE76deU7L0H9mEBgxUKVR0VCnq0XBd'
    }

    const connection = await this.connect()
    connection.send(JSON.stringify(data))
  }

  printMessage (message) {
    let template = this.shadowRoot.querySelectorAll('template')[0]
      .content.firstElementChild.cloneNode(true)

    if (this.username.value !== message.username) {
      // Not my message, target the last div
      template = this.shadowRoot.querySelectorAll('template')[0]
        .content.lastElementChild.cloneNode(true)
    }

    template.querySelectorAll('.author')[0].textContent = message.username + ':'
    template.querySelectorAll('.text')[0].textContent = message.data
    template.querySelectorAll('.time')[0].textContent = `Sent: ${new Date().toLocaleString('sv-se')}`

    // Check if textarea is clicked, reveal timestamp in that case
    template.querySelectorAll('.text')[0].addEventListener('click', (e) => {
      template.querySelectorAll('.time')[0].classList.toggle('visible')
    })

    const messagesDiv = this.shadowRoot.querySelector('.messages')
    messagesDiv.appendChild(template)

    // Scroll down to latest sent message
    const divHeight = messagesDiv.scrollHeight
    messagesDiv.scrollTop = divHeight
  }

  clearWelcomeArea () {
    const welcomeArea = this.shadowRoot.querySelector('.welcome')

    if (welcomeArea) {
      while (welcomeArea.hasChildNodes()) {
        welcomeArea.removeChild(welcomeArea.lastChild)
      }
      welcomeArea.parentNode.removeChild(welcomeArea)
    }
  }

  listenToEnterBtn () {
    const messageBox = this.shadowRoot.querySelector('.message-area')
    messageBox.focus()
    messageBox.addEventListener('keypress', (e) => {
      if (e.keyCode === 13) {
        e.preventDefault()
        this.sendMessage(messageBox.textContent)
        messageBox.textContent = ''
      }
    })
  }

  setUsername () {
    if (this.username.value !== null) {
      window.localStorage.setItem('username', JSON.stringify(this.username.value))
    }
  }

  getUsername () {
    if (window.localStorage.getItem('username') !== null) {
      this.username.value = JSON.parse(window.localStorage.getItem('username'))
    }
  }

  chatOffline () {
    const messageBox = this.shadowRoot.querySelector('.message-area')
    messageBox.classList.toggle('offline')

    const data = {
      username: 'Server',
      data: 'Could not connect. Please check your internet connection.'
    }
    this.printMessage(data)
  }
}

window.customElements.define('chat-app', Chat)

export {
  Chat
}
