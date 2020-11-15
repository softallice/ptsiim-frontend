import eventService from 'src/services/event.service'

export function getMyEvents ({ rootState, commit }) {
  const userId = rootState.user.userData.id
  const token = rootState.user.accessToken

  eventService.getUserEvents(userId)
    .then(res => {
      commit('setEvents', res.data)
    })
}
