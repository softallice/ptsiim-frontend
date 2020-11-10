<template>
  <q-page class="q-page--contained text-body1" padding>
    <div class="q-gutter-md">
      <q-card class="col-12">
        <q-card-section>
          <div class="text-h6">Pacjent</div>
        </q-card-section>
        <q-card-section>
          <span class="text-bold">Imię:</span> {{ visit.patient.firstName }}<br>
          <span class="text-bold">Nazwisko:</span> {{ visit.patient.lastName }}<br>
          <span class="text-bold">Data urodzenia:</span> {{ visit.patient.birthDt }}
        </q-card-section>
      </q-card>
      <q-card class="col-12">
        <q-card-section>
          <div class="text-h6">Lekarz</div>
        </q-card-section>
        <q-card-section>
          <span class="text-bold">Imię:</span> {{ visit.doctor.firstName }}<br>
          <span class="text-bold">Nazwisko:</span> {{ visit.doctor.lastName }}<br>
        </q-card-section>
      </q-card>
      <q-card class="col-12">
        <q-card-section>
          <div class="text-h6">Wizyta</div>
          <div class="q-gutter-sm absolute" style="top: 16px; right: 8px">
            <q-btn color="primary" @click="changeDateDialog = true" flat label="Zmień termin"/>
            <q-btn color="negative" flat label="Odwołaj"/>
          </div>
        </q-card-section>
        <q-card-section>
          <span class="text-bold">Zabieg:</span> {{ visit.type.name }}<br>
          <span class="text-bold">Data:</span> {{ visit.date }} {{ visit.time }}
        </q-card-section>
      </q-card>
      <q-card class="col-12">
        <q-card-section>
          <div class="text-h6">Opis <q-btn color="primary" class="absolute" style="top: 16px; right: 8px" flat label="Edytuj" @click="$refs.descriptionEdit.show()"/></div>
        </q-card-section>
        <q-card-section>
          <div class="cursor-input">{{ visit.description }}
            <q-popup-edit v-model="visit.description" ref="descriptionEdit" auto-save>
              <q-input type="textarea" v-model="visit.description"/>
            </q-popup-edit>
          </div>
        </q-card-section>
      </q-card>
      <q-card class="col-12">
        <q-card-section>
          <div class="text-h6">Zdjęcia</div>
        </q-card-section>
        <q-card-section>
          <div class="row items-center q-mb-md">
            <q-btn color="primary" label="Zrób zdjęcie" icon="photo" @click="showMediaCapture = true"/>
          </div>
          <div v-if="visit.media.length > 0" class="row q-gutter-sm">
            <q-intersection
              v-for="(pic, index) in visit.media"
              :key="index"
              transition="scale"
            >
              <q-img :src="pic.dataURL" class="picture-item">
                <q-icon class="absolute cursor-pointer" size="32px" name="close" color="white" style="top: 8px; right: 8px" @click="deletePicture(pic)"/>
              </q-img>
            </q-intersection>
          </div>
          <div v-else>
            Brak zdjęć
          </div>

        </q-card-section>
      </q-card>
    </div>
    <q-dialog
      v-model="changeDateDialog"
    >
      <q-card style="width: 700px; max-width: 80vw;">
        <q-card-section>
          <div class="text-h6">Wybierz nowy termin wizyty</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <calendar-view @click:time2="timeSelected" :events="[...events, visit]"/>
        </q-card-section>

        <q-card-actions align="right" class="bg-white">
          <q-btn flat color="primary" label="OK" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <div style="height: 200px"/>
    <media-capture
      v-if="showMediaCapture"
      type="picture"
      @close="mediaCaptureClosed"
      @snap="newMedia"
    />
    <q-page-sticky expand position="bottom">
      <q-toolbar class="bg-white text-black shadow-up-4">
        <q-space/>
        <q-btn color="primary" :label="saveButtonLabel" :disable="!modified" @click="modified = false"/>
      </q-toolbar>
    </q-page-sticky>
  </q-page>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import MediaCapture from 'components/MediaCapture'
import CalendarView from 'components/CalendarView'
import QCalendar from '@quasar/quasar-ui-qcalendar'

export default {
  // name: 'PageName',
  components: {
    MediaCapture,
    CalendarView
  },
  data () {
    return {
      visit: {
        title: 'Twoja wizyta',
        patient: {
          firstName: 'Stefan',
          lastName: 'Przykładowy',
          birthDt: '12.12.1994'
        },
        doctor: {
          firstName: 'Jan',
          lastName: 'Kowalski'
        },
        type: {
          name: 'Leczenie kanałowe'
        },
        date: '2020-11-10',
        time: '16:00',
        duration: 59,
        description: 'Stramsznie boli mnje zomb. Proszem coś z dym zropić',
        media: []
      },
      showMediaCapture: false,
      modified: false,
      changeDateDialog: false,
      events: [
        {
          title: 'Termin zajęty',
          date: '2020-11-09',
          time: '09:00',
          duration: 119,
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
      ]
    }
  },
  mounted () {
    this.$store.commit('setPageTitle', 'Szczegóły wizyty')
  },
  methods: {
    mediaCaptureClosed () {
      this.showMediaCapture = false
    },
    newMedia (data) {
      this.visit.media.push(data)
    },
    deletePicture (pic) {
      this.visit.media = this.visit.media.filter((p) => {
        return p !== pic
      })
    },
    timeSelected (event) {
      const date = event.scope.timestamp.date
      const time = event.scope.timestamp.time.split(':')[0] + ':00'
      const startTime = QCalendar.parsed(`${date} ${time}`)
      const jsDt = QCalendar.makeDateTime(startTime)
      const now = new Date(Date.now() + 30 * 60000)
      if (now >= jsDt) {
        this.$q.notify({
          type: 'negative',
          message: 'Musisz zająć termin co najmniej pół godziny przed'
        })
        return
      }
      const endTime = QCalendar.addToDate(startTime, { minute: this.visit.duration })
      const conflictingEvent = this.events.find(e => {
        const eStart = QCalendar.parsed(`${e.date} ${e.time}`)
        const eStop = QCalendar.addToDate(eStart, { minute: e.duration })
        return QCalendar.isBetweenDates(startTime, eStart, eStop, true)
      })
      if (!conflictingEvent) {
        this.visit.date = date
        this.visit.time = time
      } else {
        this.$q.notify({
          type: 'negative',
          message: 'Termin jest zajęty'
        })
      }
    }
  },
  computed: {
    ...mapGetters({
      isLoggedIn: 'user/isLoggedIn',
      userType: 'user/userType'
    }),
    saveButtonLabel () {
      return this.modified ? 'Zapisz' : 'Wszystkie zmiany zapisane'
    }
  },
  watch: {
    'visit.media' () {
      this.modified = true
    },
    'visit.description' () {
      this.modified = true
    },
    'visit.date' () {
      this.modified = true
    },
    'visit.time' () {
      this.modified = true
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
