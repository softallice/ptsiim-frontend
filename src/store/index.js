import Vue from 'vue'
import Vuex from 'vuex'

// import example from './module-example'

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
      // example
    },
    state: () => ({
      pageTitle: '',
      headerIcon: 'menu'
    }),
    getters: {
      pageTitle (state) {
        return state.pageTitle
      },
      headerIcon (state) {
        return state.headerIcon
      }
    },
    mutations: {
      setPageTitle (state, title) {
        state.pageTitle = title
      },
      setHeaderIcon (state, headerIcon) {
        state.headerIcon = headerIcon
      }
    },

    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: process.env.DEBUGGING
  })

  return Store
}
