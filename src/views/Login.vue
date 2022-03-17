<template>
  <div>
    <spinner v-if="loading"></spinner>
    <div class="my-auto">
      <h1 class="mx-auto mb-10 text-4xl text-center text-primary">
        SAI Evo &mdash; ver. &alpha; 1.0
      </h1>
      <!-- <button @click="printDebug()">debug</button>
    <button @click="testGetUser()">test get user</button> -->
      <div
        class="w-full px-6 py-12 mx-auto my-auto text-center rounded-md shadow-elevation-2 md:px-20 md:mx-auto md:w-2/3 border-gray-150"
      >
        <div
          class="absolute z-50 w-11/12 p-4 transform -translate-x-1/2 -translate-y-1/2 rounded-md md:hidden shadow-all-around h-96 bg-light left-1/2 top-1/2"
        >
          <h2>Dispositivo non ancora supportato</h2>
          <p>
            Al momento gli schermi piccoli non sono supportati. Per favore,
            visita il sito da un computer. Grazie per la pazienza!
          </p>
        </div>
        <h1 class="mx-auto text-center">
          {{ $t("headings.login") }}
        </h1>
        <p class="mb-3">
          {{ $t("login_screen.login_text") }}
          <strong
            >@{{
              $route.params.role == "teacher" ? "" : "studenti."
            }}unipi.it</strong
          >.
        </p>
        <p class="mb-3">
          <strong> {{ $t("login_screen.warning") }}:</strong>
          {{ $t("login_screen.cookies_warning") }}
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
        <div class="mt-12 text-center">
          <Btn
            @click="handleClickSignIn"
            :variant="'success'"
            :size="'lg'"
            class="relative md:w-max"
            :disabled="!googleOauthReady || localLoading"
            :loading="!googleOauthReady && !googleOauthHadError"
          >
            <span class="mr-3 material-icons-outlined">login</span>
            {{ $t("login_screen.login") }}
          </Btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
/* eslint-disable */
import Btn from "@/components/ui/Btn.vue";
import { inject, toRefs } from "vue";
//import { getMainView } from '@/router'
import Spinner from "@/components/ui/Spinner.vue";
import { defineComponent } from "@vue/runtime-core";
import { loadingMixin } from "@/mixins";
import { redirectToMainView } from "@/utils";

export default defineComponent({
  name: "Login",
  components: {
    Btn,
    Spinner,
  },
  data() {
    return {
      user: "",
      loadingLogin: true,
    };
  },
  mixins: [loadingMixin],
  methods: {
    redirectToMainView,
    async handleClickSignIn() {
      try {
        await this.withLocalLoading(async () => {
          const googleUser = await this.$gAuth.signIn();
          console.log(googleUser);
          if (!googleUser) {
            return null;
          }
          this.user = googleUser.getBasicProfile().getEmail();
          const token = googleUser.getAuthResponse().access_token;
          await this.$store.dispatch("shared/convertToken", token);
          await this.$store.dispatch("shared/getUserData");
          this.redirectToMainView();
        });
      } catch (error) {
        throw error;
      }
    },
  },
  setup() {
    const Vue3GoogleOauth = inject("Vue3GoogleOauth");
    return {
      Vue3GoogleOauth,
    };
  },
  created() {
    //this.$store.commit("shared/resetToken");
    if (this.$store.getters["shared/isAuthenticated"]) {
      this.redirectToMainView();
    }
  },
  computed: {
    googleOauthReady() {
      return (this as any).Vue3GoogleOauth.isInit;
    },
    googleOauthHadError() {
      return (this as any).Vue3GoogleOauth.hadError;
    },
  },
});
</script>
