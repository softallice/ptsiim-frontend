<template>
  <q-page class="q-page--contained" style="height: calc(100vh - 100px)" padding>
    <div class="column full-height">
      <div class="col">
        <message-list :messages="messages" :sender-id="$store.getters['user/id']"/>
      </div>
      <div class="col-auto" style="background: white">
        <q-input v-model="message" @keydown.enter="sendMessage" outlined type="textarea" label="Twoja wiadomość...">
          <template v-slot:after>
            <q-btn round dense flat icon="send"/>
          </template>
        </q-input>
      </div>
    </div>
  </q-page>
</template>
<script>
import io from 'socket.io-client'
import MessageList from 'src/components/MessageList.vue'

export default {
  components: {
    MessageList
  },
  data () {
    return {
      socket: null,
      messages: [],
      message: null
    }
  },
  mounted () {
    this.$store.commit('setPageTitle', 'Czat z użytkownikiem Jan Kowalski')
    this.$store.commit('setHeaderIcon', 'back')
    this.$store.dispatch('user/getUserData')
      .then(() => {
        this.connectSocket()
      })
  },
  methods: {
    connectSocket () {
      this.socket = io({
        query: {
          roomId: this.$route.params.id,
          userId: this.$store.getters['user/id']
        }
      })
      this.socket.on('messages', (messages) => {
        console.log('messages')
        this.messages = messages
      })

      this.socket.on('message', (message) => {
        this.messages.push(message)
      })
    },
    sendMessage (e) {
      e.preventDefault()
      this.socket.emit('message', {
        senderId: this.$store.getters['user/id'],
        content: this.message
      })
      this.message = null
    }
  },
  beforeDestroy () {
    this.$store.commit('setHeaderIcon', 'menu')
    this.socket.disconnect()
    this.socket = null
  }
}
</script>
