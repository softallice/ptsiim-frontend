import { request, requestWithToken } from './shared'

export async function createEvent (visitData, token) {
  return request('POST', '/event', {
    data: visitData
  })
}

export async function getUserEvents (userId) {
  return request('GET', `/user/${userId}/events`)
}

export function getEvent (eventId) {
  return new Promise((resolve, reject) => {
    request('GET', `/event/${eventId}`)
      .then(res => {
        const event = res.data
        resolve(event)
      })
  })
}

export default {
  createEvent,
  getUserEvents,
  getEvent
}
