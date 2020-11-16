import { request, requestWithToken } from './shared'

export async function getDoctorOffer (doctorId) {
  return request('GET', '/offer', {
    params: {
      doctorId
    }
  }).then(res => {
    return res.data.services
  })
}

export async function saveDoctorOffer (offer, token) {
  return requestWithToken('PATCH', '/offer', token, {
    data: {
      services: offer
    }
  })
}

export default {
  getDoctorOffer,
  saveDoctorOffer
}
