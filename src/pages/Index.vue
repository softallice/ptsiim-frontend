<template>
  <q-page class="q-page--contained" padding>
    <h4>Lista wizyt</h4>
    <visit-list :events="this.$store.state.events.events"/>
  </q-page>
</template>

<script>
import VisitList from 'components/VisitList'

export default {
  name: 'PageIndex',
  components: {
    VisitList
  },
  mounted () {
    this.$store.commit('setPageTitle', 'Strona główna')
    this.$store.dispatch('user/getUserData')
      .then(() => {
        this.$store.dispatch('events/getMyEvents')
      })
  }
}
</script>
