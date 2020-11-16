<template>
  <q-page class="q-page--contained" style="height: calc(100vh - 100px)" padding>
    <div class="column full-height">
      <div class="col">
        <message-list/>
      </div>
      <div class="col-auto" style="background: white">
        <q-input autogrow outlined type="textarea" label="Twoja wiadomość...">
          <template v-slot:after>
            <q-btn round dense flat icon="send"/>
          </template>
        </q-input>
      </div>
    </div>
  </q-page>
</template>
<script>
import MessageList from 'src/components/MessageList.vue'

export default {
  components: {
    MessageList
  },
  mounted () {
    this.$store.commit('setPageTitle', 'Czat z użytkownikiem Jan Kowalski')
    this.$store.commit('setHeaderIcon', 'back')
  },
  beforeDestroy () {
    this.$store.commit('setHeaderIcon', 'menu')
  }
}
</script>
