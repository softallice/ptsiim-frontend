import { request } from './shared'

export function getRoomByUsers (user1, user2) {
  return request('GET', '/room', {
    params: {
      user1,
      user2
    }
  })
}

export function createRoom (user1, user2) {
  return request('POST', '/room', {
    data: {
      user1,
      user2
    }
  })
}

export default {
  getRoomByUsers,
  createRoom
}
