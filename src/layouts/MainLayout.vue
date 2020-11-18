<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          v-if="headerIcon === 'menu'"
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />
        <q-btn
          v-if="headerIcon === 'back'"
          flat
          dense
          round
          icon="arrow_back"
          aria-label="Wstecz"
          @click="$router.go(-1)"
        />

        <q-toolbar-title>
          {{ pageTitle }}
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      content-class="bg-grey-1"
    >
      <q-list>
        <q-item-label header class="text-grey-8">
          {{ accountString }}
        </q-item-label>
        <template v-if="!isLoggedIn">
          <q-item clickable to="/login">
            <q-item-section avatar>
              <q-icon name="login"/>
            </q-item-section>
            <q-item-section>
              <q-item-label>Zaloguj się</q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable to="/register">
            <q-item-section avatar>
              <q-icon name="person_add"/>
            </q-item-section>
            <q-item-section>
              <q-item-label>Zarejestruj się</q-item-label>
            </q-item-section>
          </q-item>
        </template>
        <template v-else>
          <q-item @click="$store.dispatch('user/logout')" clickable>
            <q-item-section avatar>
              <q-icon name="logout"/>
            </q-item-section>
            <q-item-section>
              <q-item-label>Wyloguj się</q-item-label>
            </q-item-section>
          </q-item>
        </template>
        <q-separator/>
        <q-item-label header class="text-grey-8">
          Nawigacja
        </q-item-label>
        <q-item clickable exact to="/">
          <q-item-section avatar>
            <q-icon name="home"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>Strona główna</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable v-if="userType === 'patient'" exact to="/reserve">
          <q-item-section avatar>
            <q-icon name="note_add"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>Zarezerwuj wizytę</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable v-if="userType === 'doctor'" exact to="/offer">
          <q-item-section avatar>
            <q-icon name="edit"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>Edytuj ofertę</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable v-if="userType === 'doctor'" exact to="/busy-time">
          <q-item-section avatar>
            <q-icon name="alarm_off"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>Czas zajętości</q-item-label>
          </q-item-section>
        </q-item>
        <!-- <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        /> -->
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { mapGetters } from 'vuex'
import EssentialLink from 'components/EssentialLink.vue'

const linksData = [
  {
    title: 'Zaloguj się',
    icon: 'login'
  },
  {
    title: 'Docs',
    caption: 'quasar.dev',
    icon: 'school',
    link: 'https://quasar.dev'
  },
  {
    title: 'Github',
    caption: 'github.com/quasarframework',
    icon: 'code',
    link: 'https://github.com/quasarframework'
  },
  {
    title: 'Discord Chat Channel',
    caption: 'chat.quasar.dev',
    icon: 'chat',
    link: 'https://chat.quasar.dev'
  },
  {
    title: 'Forum',
    caption: 'forum.quasar.dev',
    icon: 'record_voice_over',
    link: 'https://forum.quasar.dev'
  },
  {
    title: 'Twitter',
    caption: '@quasarframework',
    icon: 'rss_feed',
    link: 'https://twitter.quasar.dev'
  },
  {
    title: 'Facebook',
    caption: '@QuasarFramework',
    icon: 'public',
    link: 'https://facebook.quasar.dev'
  },
  {
    title: 'Quasar Awesome',
    caption: 'Community Quasar projects',
    icon: 'favorite',
    link: 'https://awesome.quasar.dev'
  }
]

export default {
  name: 'MainLayout',
  components: { EssentialLink },
  data () {
    return {
      leftDrawerOpen: false,
      essentialLinks: linksData
    }
  },
  computed: {
    ...mapGetters({
      pageTitle: 'pageTitle',
      headerIcon: 'headerIcon',
      isLoggedIn: 'user/isLoggedIn',
      email: 'user/email',
      userType: 'user/userType'
    }),
    accountString () {
      if (this.isLoggedIn) {
        return this.email
      } else {
        return 'Konto'
      }
    }
  },
  methods: {
    toggleLeftDrawer () {
      this.leftDrawerOpen = !this.leftDrawerOpen
    }
  }
}
</script>
