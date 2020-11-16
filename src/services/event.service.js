import { request, requestWithToken } from './shared'

export async function createEvent (visitData, token) {
  return request('POST', '/event', {
    data: visitData
  })
}

export async function getUserEvents (userId) {
  return request('GET', `/user/${userId}/events`)
}

export default {
  createEvent,
  getUserEvents
}
