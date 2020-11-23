<template>
  <q-page :class="{'q-page--contained': !isLoggedIn }" padding>
    <template v-if="isLoggedIn">
      <template v-if="nextVisit">
        <h4>Nadchodząca wizyta</h4>
          <q-card class="q-mb-md">
            <q-card-section>
              <div class="text-h5">{{ nextVisit.title }}</div>
            </q-card-section>
            <q-card-section>
              <div class="text-h6 q-mt-none q-mb-xs">Doktor: {{ nextVisit.doctor.firstName }} {{ nextVisit.doctor.lastName }}</div>
              <div class="text-h6 q-mt-none q-mb-xs">Pacjent: {{ nextVisit.creator.firstName }} {{ nextVisit.creator.lastName }}</div>
              <div class="text-caption text-gray">{{ nextVisit.description }}</div>
            </q-card-section>
            <q-card-actions align="left">
              <q-btn flat icon="event"/>
              <q-btn flat>{{ nextVisit.startDate | dateTime }}</q-btn>
              <q-btn color="primary" :to="`/visit/${nextVisit._id}`" flat>Szczegóły</q-btn>
            </q-card-actions>
          </q-card>
      </template>
      <template v-if="userType == 'doctor'">
        <h4>Kalendarz wizyt</h4>
        <calendar-view @delete="deleteEvent" :removables="true" :events="this.$store.state.events.events" :linkToVisit="true"/>
      </template>
      <div class="row q-col-gutter-md">
        <div class="col-12 col-md-6">
          <h4>Historia wizyt</h4>
          <event-list :events="this.$store.state.events.events"/>
        </div>
        <div class="col-12 col-md-6">
          <h4>Ostatnie wiadomości</h4>
          <q-list bordered separator>
            <q-item v-for="room in rooms" :key="room._id" clickable :to="`/chat/${room._id}`">
              <q-item-section>
                <q-item-label>
                  {{ room.user1._id === userId ? `${room.user2.firstName} ${room.user2.lastName}` : `${room.user1.firstName} ${room.user1.lastName}` }}
                </q-item-label>
                <q-item-label caption>
                  {{ room.lastMessage.senderId._id === userId ? 'Ty: ' : `${room.lastMessage.senderId.firstName} ${room.lastMessage.senderId.lastName}: `}}
                  {{ room.lastMessage.content }}
                </q-item-label>
              </q-item-section>
              <q-item-section side top>
                <q-item-label>{{ room.lastMessage.createDt | dateTime }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </div>
      </div>
    </template>
    <template v-else>
      <div class="text-body1">
        <p class="text-body1">Witaj w serwisie!</p>
        <p>Aby skorzystać z funkcjonalności aplikacji, musisz posiadać konto w serwisie i być zalogowanym</p>
      </div>
      <div class="row q-col-gutter-md">
        <div class="col-12 col-md-6">
          <q-btn to="register" color="primary" class="full-width"
            >Rejestracja</q-btn
          >
        </div>
        <div class="col-12 col-md-6">
          <q-btn
            color="primary"
            class="col-12 col-md-6 full-width"
            to="login"
            outline
            >Logowanie</q-btn
          >
        </div>
      </div>
    </template>
  </q-page>
</template>

<script>
import { mapGetters } from 'vuex'
import EventList from 'components/EventList'
import CalendarView from 'src/components/CalendarView.vue'
import eventService from 'src/services/event.service'
import chatService from 'src/services/chat.service'
import { date } from 'quasar'

export default {
  name: 'PageIndex',
  components: {
    EventList,
    CalendarView
  },
  data () {
    return {
      rooms: []
    }
  },
  methods: {
    deleteEvent (event) {
      eventService.removeEvent(event._id, this.$store.getters['user/accessToken'])
        .then(this.$store.dispatch('events/getMyEvents'))
    },
    loadRooms () {
      chatService.getLastMessages(this.userId)
        .then(rooms => { this.rooms = rooms })
    }
  },
  mounted () {
    this.$store.commit('setPageTitle', 'Strona główna')
    this.$store.dispatch('user/getUserData')
      .then(() => {
        this.$store.dispatch('events/getMyEvents')
      })
      .then(this.loadRooms)
  },
  computed: {
    ...mapGetters({
      isLoggedIn: 'user/isLoggedIn',
      userType: 'user/userType',
      userId: 'user/id'
    }),
    nextVisit () {
      const visits = this.$store.state.events.events
      if (visits.length > 0) {
        const topVisit = visits[0]
        if (new Date(topVisit.startDate) > new Date()) {
          return topVisit
        }
      }
      return null
    }
  },
  filters: {
    dateTime (dt) {
      return date.formatDate(dt, 'DD.MM.YYYY, HH:mm')
    }
  }
}
</script>
