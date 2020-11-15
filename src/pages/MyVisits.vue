<template>
  <q-page class="q-page--contained" padding>
    <h4>Twoje wizyty</h4>
    <calendar-view @click:time2="timeSelected" :events="events"/>
  </q-page>
</template>
<script>
import CalendarView from 'components/CalendarView'
import QCalendar from '@quasar/quasar-ui-qcalendar'
import axios from 'axios'

export default {
  // name: 'PageName',
  components: {
    CalendarView
  },
  data () {
    return {
      calendar: {
        view: 'week',
        weekdays: [1, 2, 3, 4, 5],
        locale: 'pl-PL',
        format: '24h'
      },
      //   event: {
      //     title: 'Twoja wizyta',
      //     doctor: null,
      //     date: null,
      //     time: null,
      //     duration: 59,
      //     description: null,
      //     type: null,
      //     media: []
      //   },
      events: []
    }
  },
  computed: {
    isDone () {
      if (this.event.doctor != null && this.event.type != null && this.event.date != null && this.event.time != null) {
        return true
      } else {
        return false
      }
    }
  },
  methods: {
    calendarNext () {
      this.$refs.calendar.next()
    },
    calendarPrev () {
      this.$refs.calendar.prev()
    },
    timeSelected (event) {
      console.log(event)
    },
    getVisits () {
      axios({
        method: 'get',
        url: '/api/visits/' + localStorage.getItem('userId')
      })
        .then(response => {
          console.log(response)
          response.data.forEach(event => {
            var startDate = new Date(event.startDate)
            var month = startDate.getUTCMonth() + 1
            var day = startDate.getUTCDate()
            var year = startDate.getUTCFullYear()
            var minutes = startDate.getMinutes()
            var hour = startDate.getHours()
            this.events.push({
              title: event.title,
              date: `${day}-${month}-${year}`,
              time: `${hour}-${minutes}`,
              duration: event.duration,
              color: 'grey-9',
              editable: false,
              doctor: event.doctorName
            })
          })
          console.log(this.events)
        })
        .catch(error => {
          console.log(error)
        })
    }
  }
}
</script>
<style lang="scss" scoped>
.picture-item {
  width: 128px;
  height: 128px;
}
</style>
