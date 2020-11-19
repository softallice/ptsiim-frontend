import { request } from './shared'

export function uploadMedia (eventId, mediaData) {
  const body = new FormData()
  body.append('mediaFile', mediaData)
  return request('POST', `/event/${eventId}/media`, {
    data: body
  })
}

export function getEventMedia (eventId) {
  return new Promise((resolve, reject) => {
    request('GET', `/event/${eventId}/media`)
      .then(res => {
        resolve(res.data)
      })
      .catch(reject)
  })
}

export function deleteMedia (mediaId) {
  return request('DELETE', `/media/${mediaId}`)
}

export default {
  uploadMedia,
  getEventMedia,
  deleteMedia
}
