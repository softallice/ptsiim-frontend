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
        <q-btn color="primary" label="Zaloguj się" type="submit"/>
      </q-form>
    </div>

  </q-page>
</template>
<script>
export default {
  name: 'LoginPage',
  data () {
    return {
      form: {
        email: '',
        password: ''
      },
      showPassword: false
    }
  },
  methods: {
    onSubmit () {
      this.$store.dispatch('user/login', this.form)
        .then(() => {
          this.$q.notify({
            type: 'positive',
            message: 'Zalogowano pomyślnie'
          })
          this.$router.push('/')
        })
        .catch(error => {
          console.error(error)
          this.$q.notify({
            type: 'negative',
            message: 'Wystąpił błąd'
          })
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
