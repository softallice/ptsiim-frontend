export function logIn (state, payload) {
  state.loggedIn = true
  state.userData = payload
}

export function setType (state, type) {
  state.userData.type = type
}
