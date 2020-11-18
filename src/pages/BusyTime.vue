<template>
  <q-page class="q-page--contained" padding>
    <h5>Czas zajętości</h5>
    <p class="text-body1">Wypełnij poniższy formularz, aby określić okres, w jakim jesteś zajęty i ma być pokazywany jako czas niedostępny do wyboru terminu wizyty.</p>
    <div class="row q-col-gutter-md">
      <q-input class="col-12 col-md-6" outlined v-model="startDate" label="Początek">
        <template v-slot:prepend>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy transition-show="scale" transition-hide="scale">
              <q-date v-model="startDate" mask="DD.MM.YYYY HH:mm">
                <div class="row items-center justify-end">
                  <q-btn v-close-popup label="Close" color="primary" flat />
                </div>
              </q-date>
            </q-popup-proxy>
          </q-icon>
        </template>

        <template v-slot:append>
          <q-icon name="access_time" class="cursor-pointer">
            <q-popup-proxy transition-show="scale" transition-hide="scale">
              <q-time v-model="startDate" mask="DD.MM.YYYY HH:mm" format24h>
                <div class="row items-center justify-end">
                  <q-btn v-close-popup label="Close" color="primary" flat />
                </div>
              </q-time>
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
      <q-input class="col-12 col-md-6" outlined v-model="endDate" label="Koniec">
        <template v-slot:prepend>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy transition-show="scale" transition-hide="scale">
              <q-date v-model="endDate" mask="DD.MM.YYYY HH:mm">
                <div class="row items-center justify-end">
                  <q-btn v-close-popup label="Close" color="primary" flat />
                </div>
              </q-date>
            </q-popup-proxy>
          </q-icon>
        </template>

        <template v-slot:append>
          <q-icon name="access_time" class="cursor-pointer">
            <q-popup-proxy transition-show="scale" transition-hide="scale">
              <q-time v-model="endDate" mask="DD.MM.YYYY HH:mm" format24h>
                <div class="row items-center justify-end">
                  <q-btn v-close-popup label="Close" color="primary" flat />
                </div>
              </q-time>
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
      <div class="col-12">
        <q-btn color="primary" label="Zapisz" @click="save"/>
      </div>
    </div>

  </q-page>
</template>
<script>
import { date } from 'quasar'
import eventService from 'src/services/event.service'
export default {
  data () {
    return {
      startDate: new Date(),
      endDate: new Date(Date.now() + 60 * 60 * 1000),
      mask: 'DD.MM.YYYY HH:mm'
    }
  },
  methods: {
    save () {
      const startDate = date.extractDate(this.startDate, this.mask)
      const endDate = date.extractDate(this.endDate, this.mask)
      const duration = Math.abs(date.getDateDiff(endDate, startDate, 'minutes')) - 1
      eventService.createEvent({
        creator: this.$store.getters['user/id'],
        isMedical: false,
        title: 'Czas zajęty',
        startDate: startDate,
        duration: duration,
        doctor: this.$store.getters['user/id']
      }, this.$store.getters['user/accessToken'])
        .then(res => {
          this.$q.notify({
            type: 'positive',
            message: 'Zapisano wydarzenie'
          })
          this.$router.push('/')
        })
        .catch(error => {
          console.error(error)
          this.$q.notify({
            type: 'negative',
            message: 'Wystąpił błąd'
          })
        })
    }
  },
  mounted () {
    this.$store.commit('setPageTitle', 'Termin zajętości')
    const nowTime = Date.now()
    const plusHour = nowTime + 60 * 60 * 1000
    const s = new Date(nowTime)
    const e = new Date(plusHour)
    this.startDate = date.formatDate(s, this.mask)
    this.endDate = date.formatDate(e, this.mask)
  }
}
</script>
