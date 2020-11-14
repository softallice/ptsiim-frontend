// import something here
import { LocalStorage } from 'quasar'
// "async" is optional;
// more info on params: https://quasar.dev/quasar-cli/boot-files
export default async ({ store }) => {
  if (LocalStorage.has('accessToken')) {
    store.commit('user/setAccessToken', LocalStorage.getItem('accessToken'))
    store.dispatch('user/getUserData')
  }
}
