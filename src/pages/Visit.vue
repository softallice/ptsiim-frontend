<template>
  <q-page class="q-page--contained text-body1" padding>
    <q-inner-loading :showing="loading">
      <q-spinner
        color="primary"
        size="3em"
      />
    </q-inner-loading>
    <div v-if="!loading" class="q-gutter-md">
      <q-card class="col-12">
        <q-card-section>
          <div class="text-h6">Pacjent</div>
          <div class="q-gutter-sm absolute" style="top: 16px; right: 8px">
            <q-btn v-if="userType === 'doctor'" color="primary" :to="`/visits/${visit.creator._id}`" flat label="Zobacz historię leczenia"/>
          </div>
        </q-card-section>
        <q-card-section>
          <span class="text-bold">Imię:</span> {{ visit.creator.firstName }}<br>
          <span class="text-bold">Nazwisko:</span> {{ visit.creator.lastName }}<br>
          <span class="text-bold">Data urodzenia:</span> {{ visit.creator.birthDt | date }}
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
          <div v-if="editable" class="q-gutter-sm absolute" style="top: 16px; right: 8px">
            <q-btn color="primary" @click="changeDateDialog = true" flat label="Zmień termin"/>
            <q-btn color="negative" flat label="Odwołaj"/>
          </div>
        </q-card-section>
        <q-card-section>
          <span class="text-bold">Zabieg:</span> {{ visit.service.name }} ({{ visit.service.price }} zł)<br>
          <span class="text-bold">Data:</span> {{ visit.startDate | dateTime }}
        </q-card-section>
      </q-card>
      <q-card class="col-12">
        <q-card-section>
          <div class="text-h6">Opis <q-btn v-if="userType === 'patient' && editable" color="primary" class="absolute" style="top: 16px; right: 8px" flat label="Edytuj" @click="$refs.descriptionEdit.show()"/></div>
        </q-card-section>
        <q-card-section>
          <div class="cursor-input">{{ visit.description }}
            <q-popup-edit :disable="userType === 'doctor' || !editable" v-model="visit.description" ref="descriptionEdit" auto-save>
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
          <div v-if="userType === 'patient' && editable" class="row items-center q-mb-md">
            <q-btn color="primary" label="Zrób zdjęcie" icon="photo" @click="showMediaCapture = true"/>
          </div>
          <div v-if="media.length > 0" class="row q-gutter-sm">
            <q-intersection
              v-for="(pic, index) in media"
              :key="index"
              transition="scale"
            >
              <q-img @click="showImgPreview = true; previewId = pic._id" :src="`http://localhost:3000/api/media/${pic._id}`" class="picture-item">
                <q-icon v-if="userType === 'patient'" class="absolute cursor-pointer" size="32px" name="close" color="white" style="top: 8px; right: 8px" @click="deletePicture(pic)"/>
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
          <calendar-view @click:time2="timeSelected" :events="[...events, visit]" :model-date="visit.date"/>
        </q-card-section>

        <q-card-actions align="right" class="bg-white">
          <q-btn flat color="primary" label="OK" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="showImgPreview">
      <q-card style="width: 90vw">
        <q-img :src="`http://localhost:3000/api/media/${previewId}`" />
        <q-card-actions>
          <q-btn flat color="primary" label="Zamknij" @click="showImgPreview = false"/>
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
        <q-btn color="primary" label="Otwórz czat" @click="openChat"/>
        <q-space/>
        <q-btn color="primary" :label="saveButtonLabel" :disable="!modified" @click="saveChanges"/>
      </q-toolbar>
    </q-page-sticky>
  </q-page>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import MediaCapture from 'components/MediaCapture'
import CalendarView from 'components/CalendarView'
import QCalendar from '@quasar/quasar-ui-qcalendar'
import eventService from 'src/services/event.service'
import chatService from 'src/services/chat.service'
import { date, format } from 'quasar'
import mediaService from 'src/services/media.service'

const { formatDate } = date

export default {
  // name: 'PageName',
  components: {
    MediaCapture,
    CalendarView
  },
  data () {
    return {
      visit: {
        title: null,
        creator: {
          _id: null,
          firstName: null,
          lastName: null,
          birthDt: null
        },
        doctor: {
          _id: null,
          firstName: null,
          lastName: null
        },
        date: null,
        time: null,
        duration: 59,
        description: null,
        media: []
      },
      showMediaCapture: false,
      modified: false,
      changeDateDialog: false,
      events: [],
      loading: true,
      media: [],
      showImgPreview: false,
      previewId: null
    }
  },
  mounted () {
    this.$store.commit('setPageTitle', 'Szczegóły wizyty')
    eventService.getEvent(this.$route.params.id)
      .then(event => {
        this.visit = { ...event, media: [] }
        this.$nextTick(() => {
          this.modified = false
        })
        this.visit.color = 'green-9'
        this.loading = false
      })
    this.loadMedia()
  },
  methods: {
    mediaCaptureClosed () {
      this.showMediaCapture = false
    },
    loadMedia () {
      mediaService.getEventMedia(this.$route.params.id)
        .then(media => {
          console.log(media)
          this.media = media
        })
    },
    newMedia (data) {
      mediaService.uploadMedia(this.$route.params.id, data.blob)
        .then(() => {
          this.loadMedia()
          this.$q.notify({
            type: 'positive',
            message: 'Poprawnie wysłano plik'
          })
        })
        .catch(error => {
          console.error(error)
          this.$q.notify({
            type: 'negative',
            message: 'Błąd podczas wysyłania zdjęcia'
          })
        })
    },
    deletePicture (pic) {
      this.media = this.media.filter((p) => {
        return p !== pic
      })
      mediaService.deleteMedia(pic._id)
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
    },
    openChat () {
      chatService.getRoomByUsers(this.visit.creator._id, this.visit.doctor._id)
        .then(res => {
          const { _id } = res.data
          this.$router.push(`/chat/${_id}`)
        })
        .catch(error => {
          console.error(error)
          chatService.createRoom(this.visit.creator._id, this.visit.doctor._id)
            .then(res => {
              const { _id } = res.data
              this.$router.push(`/chat/${_id}`)
            })
        })
    },
    saveChanges () {
      eventService.patchEvent(this.visit._id, this.visit, this.$store.getters['user/accessToken'])
        .then(() => {
          this.$q.notify({
            type: 'positive',
            message: 'Zapisano zmiany'
          })
          this.modified = false
        })
        .catch(error => {
          console.error(error)
          this.$q.notify({
            type: 'negative',
            message: 'Błąd podczas zapisywania'
          })
        })
    }
  },
  computed: {
    ...mapGetters({
      isLoggedIn: 'user/isLoggedIn',
      userType: 'user/userType'
    }),
    saveButtonLabel () {
      if (this.modified) {
        return 'Zapisz'
      } else {
        return 'Wszystkie zmiany zapisane'
      }
    },
    editable () {
      return this.visit.startDate > new Date()
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
      this.visit.startDate = new Date(this.visit.date)
      this.visit.startDate.setHours(this.visit.time.split(':')[0])
      this.visit.startDate.setMinutes(this.visit.time.split(':')[1])
    },
    'visit.time' () {
      this.modified = true
      this.visit.startDate = new Date(this.visit.date)
      this.visit.startDate.setHours(this.visit.time.split(':')[0])
      this.visit.startDate.setMinutes(this.visit.time.split(':')[1])
    },
    'changeDateDialog' () {
      eventService.getUserEvents(this.visit.doctor._id, this.$store.getters['user/accessToken'])
        .then((events) => {
          this.events = events.filter(event => {
            return event._id !== this.visit._id
          })
          this.events = this.events.map((event) => {
            if (event._id === this.visit._id) {
              event.color = 'green-9'
            }
            return event
          })
        })
    }
  },
  filters: {
    date (value) {
      return formatDate(value, 'DD.MM.YYYY')
    },
    dateTime (value) {
      return formatDate(value, 'DD.MM.YYYY, HH:mm')
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
