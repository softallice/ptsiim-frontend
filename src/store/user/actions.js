import authService from 'services/auth.service'
import userService from 'services/user.service'
import { LocalStorage } from 'quasar'
import jsonwebtoken from 'jsonwebtoken'

export function login ({ commit, dispatch }, userCredentials) {
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
}

export function getUserData ({ state, commit }) {
  userService.getMyUser(state.accessToken)
    .then(res => {
      commit('setUserData', res.data)
    })
}
