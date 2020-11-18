import { request, requestWithToken } from './shared'

import { date } from 'quasar'

export async function createEvent (visitData, token) {
  const dt = new Date(visitData.date)
  dt.setHours(visitData.time.split(':')[0])
  dt.setMinutes(visitData.time.split(':')[1])
  visitData.startDate = dt
  delete visitData.date
  delete visitData.time
  return request('POST', '/event', {
    data: visitData
  })
}

export async function getUserEvents (userId, token) {
  return new Promise((resolve, reject) => {
    requestWithToken('GET', `/user/${userId}/events`, token)
      .then(res => {
        const events = res.data.map((event) => {
          const d = new Date(event.startDate)
          const dateString = date.formatDate(d, 'YYYY-MM-DD')
          const time = date.formatDate(d, 'HH:mm')
          return { date: dateString, time, ...event }
        })
        resolve(events)
      })
  })
}

export function getEvent (eventId) {
  return new Promise((resolve, reject) => {
    request('GET', `/event/${eventId}`)
      .then(res => {
        const d = new Date(res.data.startDate)
        const dateString = date.formatDate(d, 'YYYY-MM-DD')
        const time = date.formatDate(d, 'HH:mm')
        resolve({ date: dateString, time, ...res.data })
      })
  })
}

export default {
  createEvent,
  getUserEvents,
  getEvent
}
