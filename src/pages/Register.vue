<template>
  <q-page class="q-page--contained" padding>
    <h3>Rejestracja</h3>
    <p class="text-body1">Wypełnij poniższy formularz, aby utworzyć nowe konto w systemie</p>
    <div class="q-py-md">
      <q-form @submit.prevent="onSubmit" class="row q-col-gutter-md">
        <q-field class="col-12" label="Jestem" borderless stack-label>
          <template v-slot:control>
          <q-btn-toggle
            class="q-my-sm"
            v-model="form.isMedic"
            rounded
            toggle-color="primary"
            :options="[
            {
              label: 'Pacjentem', value: false
            },
            {
              label: 'Lekarzem', value: true
              }]"
          />
          </template>
        </q-field>
        <q-input class="col-12 col-md-6" outlined label="Imię" v-model="form.firstName"/>
        <q-input class="col-12 col-md-6" outlined label="Nazwisko" v-model="form.lastName"/>
        <q-input class="col-12" type="email" outlined label="E-mail" v-model="form.email"/>
        <q-input class="col-12 col-md-6" type="password" outlined label="Hasło" v-model="form.password"/>
        <q-input class="col-12 col-md-6" type="password" outlined label="Powtórz hasło" v-model="form.passwordConfirmation"/>
        <q-input class="col-12" outlined label="Numer telefonu" v-model="form.telephoneNumber"/>
        <q-input class="col-12" outlined label="Numer PESEL" v-model="form.pesel"/>
        <q-field class="col-12" label="Płeć" borderless stack-label>
          <template v-slot:control>
            <q-radio v-model="form.sex" :val="false" label="Mężczyzna"/>
            <q-radio v-model="form.sex" :val="true" label="Kobieta"/>
          </template>
        </q-field>
        <div v-if="error===true" style="color:red;">{{ error_message}}</div>
        <div class="col-12">
          <q-btn color="primary" label="Zarejestruj się" type="submit"/>
        </div>
      </q-form>
    </div>
  </q-page>
</template>
<script>
import axios from 'axios'

export default {
  name: 'RegisterPage',
  data () {
    return {
      form: {
        isMedic: false,
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        passwordConfirmation: '',
        telephoneNumber: '',
        sex: false,
        pesel: ''
      },
      showPassword: false,
      error: false,
      error_message: ''
    }
  },
  methods: {
    onSubmit () {
      axios({
        method: 'post',
        url: '/api/users/register', // make sure your endpoint is correct
        data: this.form
      })
        .then(response => {
        // handle success
          console.log(response)
        // do some stuff here: redirect or something you want
        })
        .catch(error => {
        // handle error
          console.log(error.response)
          this.error = true
          this.error_message = error.response.data.msg
        })
    }
  },
  mounted () {
    this.$store.commit('setPageTitle', 'Rejestracja')
    this.$store.commit('setHeaderIcon', 'back')
  },
  beforeDestroy () {
    this.$store.commit('setHeaderIcon', 'menu')
  }
}
</script>
