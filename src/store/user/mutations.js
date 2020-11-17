import user from '.'
import jsonwebtoken from 'jsonwebtoken'

export function setType (state, type) {
  state.userData.type = type
}

export function setAccessToken (state, token) {
  state.accessToken = token
}

export function removeAccessToken (state) {
  state.accessToken = null
}

export function parseUserData (state, token) {
  const data = jsonwebtoken.decode(token)
  setUserData(state, data)
}

export function setUserData (state, userData) {
  console.log(userData)
  state.userData.type = userData.isDoctor ? 'doctor' : 'patient'
  state.userData.firstName = userData.firstName
  state.userData.lastName = userData.lastName
  state.userData.email = userData.email
  state.userData.id = userData.id || userData._id || null
}

export function clearUserData (state) {
  state.userData.type = null
  state.userData.firstName = null
  state.userData.lastName = null
  state.userData.id = null
  state.userData.email = null
}

export function login (state, accessToken) {
  parseUserData(state, accessToken)
  setAccessToken(state, accessToken)
}

export function setOffer (state, offer) {
  state.offer = offer
}

export function deleteSelectedFromOffer (state, selected) {
  state.offer = state.offer.filter(item => {
    return selected.indexOf(item) === -1
  })
}
