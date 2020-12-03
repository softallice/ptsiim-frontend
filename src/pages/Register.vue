<template>
  <q-page class="q-page--contained" padding>
    <h3>Rejestracja</h3>
    <p class="text-body1">Wypełnij poniższy formularz, aby utworzyć nowe konto w systemie</p>
    <div class="q-py-md">
      <q-form @submit.prevent="onSubmit" class="row q-col-gutter-md">
        <q-field class="col-12" label="Jestem"
        :error-message="errors.isDoctor"
        :error="!!errors.isDoctor"
        bottom-slots
        borderless stack-label>
          <template v-slot:control>
          <q-btn-toggle
            class="q-my-sm"
            v-model="form.isDoctor"
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
        <q-input class="col-12 col-md-6" outlined label="Imię" :error-message="errors.firstName"
          :error="!!errors.firstName"
          bottom-slots
          v-model="form.firstName"/>
        <q-input class="col-12 col-md-6" outlined label="Nazwisko"
        :error-message="errors.lastName"
        :error="!!errors.lastName"
        bottom-slots
        v-model="form.lastName"/>
        <q-input class="col-12" type="email"
        :error-message="errors.email"
        :error="!!errors.email"
        bottom-slots
        outlined label="E-mail" v-model="form.email"/>
        <q-input class="col-12 col-md-6" type="password"
        :error-message="errors.password"
        :error="!!errors.password"
        bottom-slots
        outlined label="Hasło" v-model="form.password"/>
        <q-input class="col-12 col-md-6" type="password"
        :error-message="errors.passwordConfirmation"
        :error="!!errors.passwordConfirmation"
        bottom-slots
        outlined label="Powtórz hasło" v-model="form.passwordConfirmation"/>
        <q-input class="col-12"
        :error-message="errors.telephoneNumber"
        :error="!!errors.telephoneNumber"
        bottom-slots
        outlined label="Numer telefonu" v-model="form.telephoneNumber"/>
        <q-input class="col-12 col-md-6" outlined v-model="form.birthDt" mask="##.##.####" label="Data urodzenia"
          bottom-slots
          :error-message="errors.birthDt"
          :error="!!errors.birthDt"
          >
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                <q-date v-model="form.birthDt" mask="DD.MM.YYYY">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
        <q-input class="col-12 col-md-6"
        :error-message="errors.PESEL"
        :error="!!errors.PESEL"
        bottom-slots
        outlined label="Numer PESEL" v-model="form.PESEL"/>
        <q-field class="col-12" label="Płeć"
        :error-message="errors.sex"
        :error="!!errors.sex"
        bottom-slots
        borderless stack-label>
          <template v-slot:control>
            <q-radio v-model="form.sex" :val="false" label="Mężczyzna"/>
            <q-radio v-model="form.sex" :val="true" label="Kobieta"/>
          </template>
        </q-field>
        <div class="col-12">
          <q-btn color="primary" label="Zarejestruj się" type="submit"/>
        </div>
      </q-form>
    </div>
  </q-page>
</template>
<script>
import authService from 'services/auth.service.js'

export default {
  name: 'RegisterPage',
  data () {
    return {
      form: {
        isDoctor: false,
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        passwordConfirmation: '',
        telephoneNumber: '',
        sex: false,
        PESEL: '',
        birthDt: '01.01.2000'
      },
      showPassword: false,
      errors: {
        isDoctor: null,
        firstName: null,
        lastName: null,
        email: null,
        password: null,
        passwordConfirmation: null,
        telephoneNumber: null,
        sex: null,
        PESEL: null,
        birthDt: null
      }
    }
  },
  methods: {
    onSubmit () {
      authService.register(this.form)
        .then(result => {
          console.log(result)
          this.$q.notify({
            type: 'positive',
            message: 'Zarejestrowano pomyślnie!'
          })
          this.$router.push('/')
        })
        .catch(error => {
          console.error(error)
          if (error.response) {
            if (error.response.status === 422) {
              error.response.data.errors.forEach((err) => {
                console.log(err)
                this.errors[err.param] = err.msg
              })
              return this.$q.notify({
                type: 'warning',
                message:
                    'Podano złe dane, sprawdź formularz i spróbuj ponownie'
              })
            }
          } else {
            this.$q.notify({
              type: 'negative',
              message: 'Błąd podczas rejestracji'
            })
          }
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
