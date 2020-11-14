import { requestWithToken } from './shared'

export function getUserById (id, accessToken) {
  return requestWithToken('GET', `/user/${id}`, accessToken)
}

export function getMyUser (accessToken) {
  return requestWithToken('GET', '/users/me', accessToken)
}

export default {
  getUserById,
  getMyUser
}
