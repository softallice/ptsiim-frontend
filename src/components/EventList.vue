<template>
<div>
    <q-card class="q-mb-md" v-for="event in eventsFiltered" :key="event._id">
      <q-card-section>
        <div class="text-h5">{{ event.title }}</div>
      </q-card-section>
      <q-card-section>
        <div class="text-h6 q-mt-none q-mb-xs">{{ event.doctorName }}</div>
        <div class="text-caption text-gray">{{ event.description }}</div>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat icon="event"/>
        <q-btn flat>{{ event.startDate | dateFilter }}</q-btn>
        <q-btn color="primary" :to="`/visit/${event._id}`" flat>Szczegóły</q-btn>
      </q-card-actions>
    </q-card>
</div>
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
  computed: {
    eventsFiltered () {
      return this.events.filter(event => event.isMedical)
    }
  },
  filters: {
    dateFilter (value) {
      return formatDate(value, 'DD.MM.YYYY, HH:mm')
    }
  }
}
</script>
