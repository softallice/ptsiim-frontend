import { instance } from '../boot/axios'

export function request (method, endpoint, config) {
  return instance.request({
    method,
    url: endpoint,
    ...config
  })
}

export function requestWithToken (method, endpoint, token, config) {
  return instance.request({
    method,
    url: endpoint,
    headers: {
      Authorization: `Bearer ${token}`
    },
    ...config
  })
}
