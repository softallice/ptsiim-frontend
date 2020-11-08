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
        :done="event.doctor !== null"
      >
        <q-input v-model="event.doctor" outlined label="Lekarz"/>
        <q-stepper-navigation>
          <q-btn color="primary" label="Dalej" @click="step = 2" :disable="event.doctor === null"/>
        </q-stepper-navigation>
      </q-step>
      <q-step
        :name="2"
        title="Wybierz usługę"
        icon="work"
        :done="event.type !== null"
      >
        <q-input v-model="event.type" outlined/>
        <q-stepper-navigation>
          <q-btn color="primary" label="Dalej" @click="step = 3" :disable="event.doctor === null"/>
        </q-stepper-navigation>
      </q-step>
      <q-step
        :name="3"
        title="Wybierz termin wizyty"
        icon="event"
        :done="event.date"
      >
        <div class="row justify-center items-center">
          <q-btn flat label="Poprzedni" @click="calendarPrev" />
          <q-separator vertical />
          <q-btn flat label="Następny" @click="calendarNext" />
        </div>
        <q-separator />
        <q-calendar
          interval-start="9"
          interval-count="8"
          interval-height="50px"
          v-model="event.date"
          :view="calendar.view"
          :weekdays="calendar.weekdays"
          :locale="calendar.locale"
          :format="calendar.format"
          hour24-format
          no-scroll
          ref="calendar"/>
      </q-step>
      <q-step
        :name="4"
        title="Wprowadź szczegóły"
        icon="info_outline"
        caption="Opcjonalne"
        :done="event.description"
      >
        <q-input type="textarea" outlined label="Opis"/>
      </q-step>
      <q-step
        :name="5"
        title="Dołącz zdjęcia"
        icon="camera"
        caption="Opcjonalne"
        :done="event.media.length"
      >
      </q-step>
    </q-stepper>
  </q-page>
</template>

<script>
export default {
  // name: 'PageName',
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
        doctor: null,
        date: null,
        description: null,
        type: null,
        media: []
      }
    }
  },
  methods: {
    calendarNext () {
      this.$refs.calendar.next()
    },
    calendarPrev () {
      this.$refs.calendar.prev()
    }
  }
}
</script>
