import authService from 'services/auth.service'
import userService from 'services/user.service'
import { LocalStorage } from 'quasar'
import jsonwebtoken from 'jsonwebtoken'
import offerService from 'src/services/offer.service'

export function login ({ state, commit, dispatch }, userCredentials) {
  return authService.login(userCredentials).then((res) => {
    if (res.status === 200) {
      LocalStorage.set('accessToken', res.data.accessToken)
      commit('setAccessToken', res.data.accessToken)
      dispatch('getUserData')
    }

    return res
  })
}

export function logout ({ commit }) {
  LocalStorage.remove('accessToken')
  commit('removeAccessToken')
  commit('clearUserData')
}

export function getUserData ({ state, commit, dispatch }) {
  return userService.getMyUser(state.accessToken)
    .then(res => {
      commit('setUserData', res.data)
      if (res.data.isDoctor === true) {
        dispatch('getDoctorOffer')
      }
    })
}

export function getDoctorOffer ({ state, commit }) {
  return offerService.getDoctorOffer(state.userData.id)
    .then(services => {
      commit('setOffer', services)
    })
}
