<template>
  <q-page class="q-page--contained" padding>
    <h4>Historia leczenia pacjenta</h4>
    <q-separator/>
    <event-list :events="events"/>
  </q-page>
</template>
<script>
import eventService from 'src/services/event.service'
import EventList from 'src/components/EventList.vue'

export default {
  components: {
    EventList
  },
  data () {
    return {
      events: []
    }
  },
  methods: {
    getVisits () {
      eventService.getUserEvents(this.$route.params.userId, this.$store.getters['user/accessToken'])
        .then(events => {
          this.events = events
        })
    }
  },
  mounted () {
    this.$store.commit('setPageTitle', 'Historia leczenia pacjenta')
    this.getVisits()
  }
}
</script>
