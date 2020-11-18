import eventService from 'src/services/event.service'

export function getMyEvents ({ rootState, commit, rootGetters }) {
  const userId = rootState.user.userData.id
  const token = rootState.user.accessToken

  eventService.getUserEvents(userId, rootGetters['user/accessToken'])
    .then(events => {
      commit('setEvents', events)
    })
}
