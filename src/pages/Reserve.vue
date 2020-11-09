<template>
  <q-page class="q-page--contained" padding>
    <h4>Rezerwacja wizyty</h4>
    <p class="text-body1">
      Wypełnij poniższy formularz, aby zarezerwować wizytę
    </p>
    <q-stepper
      v-model="step"
      vertical
      header-nav
      color="primary"
      animated
    >
      <q-step
        :name="1"
        title="Wybierz lekarza"
        icon="person"
        :done="event.doctor != null"
      >
        <q-select :options="doctors" v-model="event.doctor" outlined label="Lekarz"/>
        <q-stepper-navigation>
          <q-btn color="primary" label="Dalej" @click="step = 2" :disable="event.doctor === null"/>
        </q-stepper-navigation>
      </q-step>
      <q-step
        :name="2"
        title="Wybierz usługę"
        icon="work"
        :done="event.type != null"
      >
        <q-select v-if="event.doctor" :options="event.doctor.offer" v-model="event.type" outlined>
          <template v-slot:option="scope">
            <q-item
              v-bind="scope.itemProps"
              v-on="scope.itemEvents"
            >
              <q-item-section>
                <q-item-label>{{ scope.opt.label }} ({{ scope.opt.price | priceFilter }})</q-item-label>
              </q-item-section>
            </q-item>
          </template>
        </q-select>
        <q-stepper-navigation>
          <q-btn color="primary" label="Dalej" @click="step = 3" :disable="event.doctor === null"/>
          <q-btn color="primary" outline label="Wstecz" @click="step = 1"/>
        </q-stepper-navigation>
      </q-step>
      <q-step
        :name="3"
        title="Wybierz termin wizyty"
        icon="event"
        :done="event.date != null"
      >
        <calendar-view @click:time2="timeSelected" :events="[...events, event]"/>
        <q-stepper-navigation>
          <q-btn color="primary" label="Dalej" @click="step = 4" :disable="event.doctor === null"/>
          <q-btn color="primary" outline label="Wstecz" @click="step = 2"/>
        </q-stepper-navigation>
      </q-step>
      <q-step
        :name="4"
        title="Wprowadź szczegóły"
        icon="info_outline"
        caption="Opcjonalne"
        :done="event.description != null"
      >
        <q-input type="textarea" outlined label="Opis"/>
        <q-stepper-navigation>
          <q-btn color="primary" label="Dalej" @click="step = 5" :disable="event.doctor === null"/>
          <q-btn color="primary" outline label="Wstecz" @click="step = 3"/>
        </q-stepper-navigation>
      </q-step>
      <q-step
        :name="5"
        title="Dołącz zdjęcia"
        icon="camera"
        caption="Opcjonalne"
        :done="event.media.length != 0"
      >
        <q-stepper-navigation>
          <q-btn color="primary" label="Dalej" :disable="event.doctor === null"/>
          <q-btn color="primary" outline label="Wstecz" @click="step = 4"/>
        </q-stepper-navigation>
      </q-step>
    </q-stepper>
  </q-page>
</template>

<script>
import CalendarView from 'components/CalendarView'
import QCalendar from '@quasar/quasar-ui-qcalendar'

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
      step: 1,
      event: {
        title: 'Twoja wizyta',
        doctor: null,
        date: null,
        time: null,
        duration: 59,
        description: null,
        type: null,
        media: []
      },
      events: [
        {
          title: 'Termin zajęty',
          date: '2020-11-09',
          time: '09:00',
          duration: '119',
          color: 'grey-9',
          editable: false
        },
        {
          title: 'Termin zajęty',
          date: '2020-11-09',
          time: '12:00',
          duration: 59,
          color: 'grey-9',
          editable: false
        }
      ],
      doctors: [
        {
          label: 'Jan Kowalski',
          value: 'id1',
          offer: [
            {
              label: 'Leczenie kanałowe',
              price: [500, 1000]
            },
            {
              label: 'Wyrywanie zęba',
              price: 100
            }
          ]
        },
        {
          label: 'Adam Bengalski',
          value: 'id2',
          offer: [
            {
              label: 'Kanałowe leczenie',
              price: [500, 1000]
            },
            {
              label: 'Zęba wyrwanie',
              price: 100
            }
          ]
        }
      ]
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
      const date = event.scope.timestamp.date
      const time = event.scope.timestamp.time.split(':')[0] + ':00'
      const startTime = QCalendar.parsed(`${date} ${time}`)
      const endTime = QCalendar.addToDate(startTime, { minute: this.event.duration })
      const conflictingEvent = this.events.find(e => {
        const eStart = QCalendar.parsed(`${e.date} ${e.time}`)
        const eStop = QCalendar.addToDate(eStart, { minute: e.duration })
        console.log(startTime, endTime, eStart, eStop)
        return QCalendar.isBetweenDates(startTime, eStart, eStop, true)
      })
      if (!conflictingEvent) {
        this.event.date = date
        this.event.time = time
      }
    }
  },
  filters: {
    priceFilter (value) {
      if (Array.isArray(value)) {
        return `${value[0]} - ${value[1]} zł`
      } else {
        return `${value} zł`
      }
    }
  }
}
</script>
