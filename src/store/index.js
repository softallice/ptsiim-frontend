import Vue from 'vue'
import Vuex from 'vuex'

// import example from './module-example'
import user from './user'
import events from './events'

Vue.use(Vuex)

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

export default function (/* { ssrContext } */) {
  const Store = new Vuex.Store({
    modules: {
      user,
      events
    },
    state: () => ({
      pageTitle: '',
      headerIcon: 'menu',
      leftDrawerOpen: false
    }),
    getters: {
      pageTitle (state) {
        return state.pageTitle
      },
      headerIcon (state) {
        return state.headerIcon
      },
      leftDrawerOpen (state) {
        return state.leftDrawerOpen
      }
    },
    mutations: {
      setPageTitle (state, title) {
        state.pageTitle = title
      },
      setHeaderIcon (state, headerIcon) {
        state.headerIcon = headerIcon
      },
      openLeftDrawer (state) {
        state.leftDrawerOpen = true
      },

      hideLeftDrawer (state) {
        state.leftDrawerOpen = false
      },

      toggleLeftDrawer (state) {
        state.leftDrawerOpen = !state.leftDrawerOpen
      },

      setLeftDrawer (state, payload) {
        state.leftDrawerOpen = payload
      }
    },

    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: process.env.DEBUGGING
  })

  return Store
}
