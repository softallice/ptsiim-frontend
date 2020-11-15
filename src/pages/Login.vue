<template>
  <q-page class="q-page--contained" padding>
    <h3>Logowanie</h3>
    <p class="text-body1">Wypełnij poniższy formularz, aby zalogować się do swojego konta</p>
    <div class="q-py-md">
      <q-form @submit.prevent="onSubmit" class="q-gutter-md">
        <q-input outlined v-model="form.email" label="Adres e-mail"/>
        <q-input v-model="form.password" outlined :type="showPassword ? 'text' : 'password'" label="Hasło">
          <template v-slot:append>
            <q-icon
              :name="showPassword ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="showPassword = !showPassword"
            />
          </template>
        </q-input>
         <div v-if="error===true" style="color:red;">{{ error_message}}</div>
        <q-btn color="primary" label="Zaloguj się" type="submit"/>
      </q-form>
    </div>

  </q-page>
</template>
<script>
import axios from 'axios'

export default {
  name: 'LoginPage',
  data () {
    return {
      form: {
        email: '',
        password: ''
      },
      showPassword: false,
      error: false,
      error_message: 'Niepoprawny login lub hasło.'
    }
  },
  methods: {
    onSubmit () {
      axios({
        method: 'post',
        url: '/api/auth/',
        data: this.form
      })
        .then(response => {
          const token = response.data.accessToken
          const userId = response.data.user._id
          console.log(userId)
          localStorage.setItem('jwt', token)
          localStorage.setItem('userId', userId)
          if (token) {
            this.$router.push('/offer')
          }
        })
        .catch(error => {
          console.log(error)
          this.error = true
        })
    }
  },
  mounted () {
    this.$store.commit('setPageTitle', 'Logowanie')
    this.$store.commit('setHeaderIcon', 'back')
  },
  beforeDestroy () {
    this.$store.commit('setHeaderIcon', 'menu')
  }
}
</script>
