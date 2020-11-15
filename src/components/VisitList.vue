<template>
  <q-list bordered separator>
    <q-item v-for="event in events" :key="event._id">
      <q-item-section>
        <q-item-label>{{ event.title }}</q-item-label>
        <q-item-label caption>
          Lekarz: {{ event.doctorName }} <br>
        </q-item-label>
      </q-item-section>
      <q-item-section side top>
        {{ event.startDate | dateFilter }}
      </q-item-section>
    </q-item>
  </q-list>
</template>
<script>
import { date } from 'quasar'

const { formatDate } = date
export default {
  props: {
    events: {
      type: Array,
      default: () => ([])
    }
  },
  filters: {
    dateFilter (value) {
      return formatDate(value, 'YYYY-MM-DD, hh:mm')
    }
  }
}
</script>
