import { getUserEvents } from './event.service'
import { request, requestWithToken } from './shared'

export function getUserById (id, accessToken) {
  return requestWithToken('GET', `/user/${id}`, accessToken)
}

export function getMyUser (accessToken) {
  return requestWithToken('GET', '/users/me', accessToken)
}

export function getUsers (filter) {
  return request('GET', '/users', {
    params: filter
  })
}

export default {
  getUserById,
  getMyUser,
  getUsers
}
