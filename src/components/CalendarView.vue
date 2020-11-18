<template>
  <div class="calendar-view">
    <div class="row justify-center items-center">
      <q-btn flat label="Poprzedni" @click="calendarPrev" />
      <q-separator vertical />
      <q-btn flat label="Następny" @click="calendarNext" />
    </div>
    <q-separator />
    <q-calendar
      interval-start="9"
      interval-count="8"
      v-model="date"
      :interval-height="intervalHeight+ 'px'"
      :view="view"
      :weekdays="weekdays"
      :locale="locale"
      hour24-format
      no-scroll
      v-on="$listeners"
      ref="calendar">
        <template #day-body="{ timestamp, timeStartPos, timeDurationHeight }">
          <template v-for="(event, index) in getEvents(timestamp.date)">
            <q-badge
              @click="goToVisit(event)"
              v-if="event.time"
              :color="event.color ? event.color : 'primary'"
              :key="index"
              class="my-event justify-center ellipsis"
              :class="{ 'cursor-pointer': linkToVisit }"
              :style="{ 'top': timeStartPos(event.time) + 'px', 'height': timeDurationHeight(event.duration) + 'px' }"
            >
              <q-icon v-if="event.icon" :name="event.icon" class="q-mr-xs"></q-icon><span class="ellipsis">{{ event.title || 'Termin zajęty' }}</span>
            </q-badge>
          </template>
        </template>
    </q-calendar>
  </div>
</template>
<script>
import QCalendar from '@quasar/quasar-ui-qcalendar'

export default {
  props: {
    events: {
      type: Array,
      default: () => ([])
    },
    linkToVisit: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      view: 'week',
      weekdays: [1, 2, 3, 4, 5],
      locale: 'pl-PL',
      intervalHeight: 50,
      date: null
    }
  },
  methods: {
    calendarNext () {
      this.$refs.calendar.next()
    },
    calendarPrev () {
      this.$refs.calendar.prev()
    },
    getEvents (dt) {
      const currentDate = QCalendar.parsed(dt)
      const events = []
      for (let i = 0; i < this.events.length; ++i) {
        let added = false
        if (this.events[i].date === dt) {
          if (this.events[i].time) {
            if (events.length > 0) {
              // check for overlapping times
              const startTime = QCalendar.parsed(this.events[i].date + ' ' + this.events[i].time)
              const endTime = QCalendar.addToDate(startTime, { minute: this.events[i].duration })
              for (let j = 0; j < events.length; ++j) {
                if (events[j].time) {
                  const startTime2 = QCalendar.parsed(events[j].date + ' ' + events[j].time)
                  const endTime2 = QCalendar.addToDate(startTime2, { minute: events[j].duration })
                  if (QCalendar.isBetweenDates(startTime, startTime2, endTime2) || QCalendar.isBetweenDates(endTime, startTime2, endTime2)) {
                    events[j].side = 'left'
                    this.events[i].side = 'right'
                    events.push(this.events[i])
                    added = true
                    break
                  }
                }
              }
            }
          }
          if (!added) {
            this.events[i].side = undefined
            events.push(this.events[i])
          }
        } else if (this.events[i].days) {
          // check for overlapping dates
          const startDate = QCalendar.parsed(this.events[i].date)
          const endDate = QCalendar.addToDate(startDate, { day: this.events[i].days })
          if (QCalendar.isBetweenDates(currentDate, startDate, endDate)) {
            events.push(this.events[i])
            added = true
          }
        }
      }
      return events
    },
    goToVisit (event) {
      if (this.linkToVisit) {
        this.$router.push(`/visit/${event._id}`)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.my-event {
  width: 100%;
  position: absolute;
  font-size: 12px;
}
</style>
