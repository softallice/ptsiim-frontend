<template>
<div>
    <q-card v-for="event in events" :key="event._id">
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
  filters: {
    dateFilter (value) {
      return formatDate(value, 'YYYY-MM-DD, hh:mm')
    }
  }
}
</script>
