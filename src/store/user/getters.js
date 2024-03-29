export function accessToken (state) {
  return state.accessToken
}

export function isLoggedIn (state) {
  return !!state.accessToken
}

export function userType (state) {
  return state.userData.type
}

export function email (state) {
  return state.userData.email
}

export function offer (state) {
  return state.offer
}

export function id (state) {
  return state.userData.id
}
