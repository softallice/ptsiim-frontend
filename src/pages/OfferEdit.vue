<template>
  <q-page class="q-page--contained text-body1" padding>
    <q-toolbar class="q-mt-xl q-mb-md">
      <q-btn color="primary" @click="newServiceDialog = true" label="Dodaj nową usługę" icon="add"/>
      <q-space/>
      <q-btn v-show="selected.length" color="negative" flat label="Usuń zaznaczone" @click="deleteConfirmDialog = true"/>
    </q-toolbar>
    <q-table title="Oferta" :columns="columns" :data="data" row-key="name" selection="multiple" :selected.sync="selected">
      <template v-slot:header-selection="scope">
        <q-checkbox v-model="scope.selected" />
      </template>
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="selection">
            <q-checkbox v-model="props.selected"/>
          </q-td>
          <q-td key="name" :props="props">
            {{ props.row.name }}
            <q-popup-edit v-model="props.row.name" @save="markModified">
              <q-input v-model="props.row.name"/>
            </q-popup-edit>
          </q-td>

          <q-td key="price" :props="props">
            {{ props.row.price }} zł
            <q-popup-edit v-model="props.row.price" buttons @save="markModified">
              <q-input type="number" v-model="props.row.price"/>
            </q-popup-edit>
          </q-td>
        </q-tr>
      </template>
    </q-table>
    <q-dialog v-model="deleteConfirmDialog" persistent>
      <q-card>
        <q-card-section>
          Czy napewno chcesz usunąć zaznaczone usługi?
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Tak" color="primary" @click="deleteSelected" v-close-popup/>
          <q-btn flat label="Nie" color="primary" v-close-popup/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="newServiceDialog">
      <q-card style="max-width: 80vw; width: 300px">
        <q-card-section>
          <div class="text-h6">Nowa usługa</div>
        </q-card-section>
        <q-card-section class="row q-gutter-md">
          <q-input outlined v-model="newService.name" label="Nazwa usługi"/>
          <q-input outlined type="number" v-model="newService.price" label="Cena usługi"/>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn color="primary" label="Dodaj" @click="addNewService" v-close-popup/>
          <q-btn color="primary" flat label="Anuluj" @click="clearNewService" v-close-popup/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-page-sticky expand position="top">
      <q-toolbar class="bg-white text-black shadow-up-4">
        <q-space/>
        <q-btn color="primary" :label="saveButtonLabel" :disable="!modified" @click="saveOffer"/>
      </q-toolbar>
    </q-page-sticky>
  </q-page>
</template>

<script>
import { mapGetters } from 'vuex'
import offerService from 'services/offer.service'

export default {
  // name: 'PageName',
  data () {
    return {
      columns: [
        {
          name: 'name',
          label: 'Nazwa',
          field: 'name',
          align: 'left',
          sortable: true
        },
        {
          name: 'price',
          label: 'Cena',
          field: (row) => row.price,
          align: 'left',
          sortable: true
        }
      ],
      newService: {
        name: null,
        price: null
      },
      modified: false,
      newServiceDialog: false,
      deleteConfirmDialog: false,
      selected: []
    }
  },
  methods: {
    markModified () {
      this.modified = true
    },
    addNewService () {
      this.data.push({ ...this.newService })
      this.modified = true
      this.clearNewService()
    },
    clearNewService () {
      this.newService.name = null
      this.newService.price = null
    },
    deleteSelected () {
      this.$store.commit('user/deleteSelectedFromOffer', this.selected)
      this.selected = []
      this.modified = true
    },
    saveOffer () {
      offerService.saveDoctorOffer(this.data, this.$store.state.user.accessToken)
        .then(res => {
          this.$q.notify({
            type: 'positive',
            message: 'Zapisano zmiany'
          })
          this.modified = false
        })
        .catch(error => {
          console.error(error)
          this.$q.notify({
            type: 'negative',
            message: 'Wystąpił błąd podczas zapisywania oferty, spróbuj ponownie!'
          })
        })
    }
  },
  computed: {
    saveButtonLabel () {
      if (this.modified) {
        return 'Zapisz'
      } else {
        return 'Wszystkie zmiany zapisane'
      }
    },
    ...mapGetters({
      data: 'user/offer'
    })
  },
  mounted () {
    this.$store.commit('setPageTitle', 'Edycja oferty')
  }
}
</script>
