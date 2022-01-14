<template
  ><div>
    <spinner v-if="loading"></spinner>
    <div class="relative transform -translate-y-1/2 top-1/2">
      <h1 class="mx-auto mb-10 text-4xl text-center">
        Esercitazioni Unipi
      </h1>
      <!-- <button @click="printDebug()">debug</button>
    <button @click="testGetUser()">test get user</button> -->
      <div
        class="w-full px-6 py-12 mx-auto my-auto text-center border shadow-xl rounded-xl md:px-20 md:mx-auto md:w-2/3 border-gray-150"
      >
        <h1 class="mx-auto mb-4 text-2xl text-center">
          Login {{ $route.params.role == 'teacher' ? 'docente' : 'studente' }}
        </h1>
        <p class="mb-3">
          Effettua l'accesso con il tuo indirizzo email
          <strong
            >@{{
              $route.params.role == 'teacher' ? '' : 'studenti.'
            }}unipi.it</strong
          >.
        </p>
        <p class="mb-3">
          <i class="mr-1 text-sm text-red-700 fas fa-exclamation-circle"></i>
          <span class="font-semibold text-red-700">Attenzione:</span> i cookie
          devono essere abilitati per effettuare il login, e non si deve essere
          in modalità incognito.
        </p>
        <!-- <div class="mb-4">
        <span class="mr-3 font-medium">Browser supportati:</span>
        <img
          class="inline-block w-5 h-5 my-auto mr-2 drop-shadow"
          src="../assets/chrome.png"
        />
        <img
          class="inline-block w-5 h-5 my-auto drop-shadow"
          src="../assets/firefox.png"
        />
      </div> -->
        <div class="mt-6 text-center">
          <Btn
            @click="handleClickSignIn"
            :variant="'green'"
            :size="'lg'"
            class="relative md:w-max"
            :disabled="!googleOauthReady || loading"
          >
            <div
              class="absolute ml-2.5 mt-0.5 left-1/2 top-1/2"
              v-if="!googleOauthReady && !googleOauthHadError"
            >
              <spinner :fixed="false"></spinner>
            </div>
            <i class="mr-1 fas fa-lock"></i> Entra
          </Btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import Btn from '@/components/ui/Btn.vue'
import { inject, toRefs } from 'vue'
//import { getMainView } from '@/router'
import Spinner from '@/components/ui/Spinner.vue'
export default {
  name: 'Login',
  components: {
    Btn,
    Spinner
  },
  data () {
    return {
      user: '',
      loadingLogin: true,
      loading: false
    }
  },
  methods: {
    redirectToMainView () {
      this.$router.push('/teacher/courses')
    },
    async handleClickSignIn () {
      try {
        this.loading = true
        const googleUser = await this.$gAuth.signIn()
        console.log(googleUser)

        if (!googleUser) {
          return null
        }
        this.user = googleUser.getBasicProfile().getEmail()
        const token = googleUser.getAuthResponse().access_token
        await this.$store.dispatch('convertToken', token)
        await this.$store.dispatch('getUserData')

        this.redirectToMainView()
      } catch (error) {
        // this.$store.commit('pushNotification', {
        //   severity: 2,
        //   autoHide: 9000,
        //   message: 'Si è verificato un errore durante il login. Riprova.'
        // })
        throw error
      } finally {
        this.loading = false
      }
    }
  },
  setup () {
    const Vue3GoogleOauth = inject('Vue3GoogleOauth')
    return {
      Vue3GoogleOauth
    }
  },
  created () {
    // if (this.$store.getters.isAuthenticated) {
    //   this.$router.push(getMainView())
    // }
  },
  computed: {
    googleOauthReady () {
      return this.Vue3GoogleOauth.isInit
    },
    googleOauthHadError () {
      return this.Vue3GoogleOauth.hadError
    }
  }
}
</script>
