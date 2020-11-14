import { request } from './shared'

export function register (userData, config) {
  return request('POST', '/user', { data: userData, ...config })
}

export function login (userCredentials, config) {
  return request('POST', '/auth', { data: userCredentials, ...config })
}

export default {
  register,
  login
}
