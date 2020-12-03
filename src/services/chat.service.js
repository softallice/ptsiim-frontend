import user from 'src/boot/user'
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

export function getLastMessages (userId) {
  return new Promise((resolve, reject) => {
    request('GET', `/user/${userId}/rooms`)
      .then(res => resolve(res.data))
      .catch(reject)
  })
}

export default {
  getRoomByUsers,
  createRoom,
  getLastMessages
}
