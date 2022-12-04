<template>
	<div class="flex flex-col h-full">
		<Spinner v-if="loading" />
		<div class="flex flex-col h-full">
			<!-- <div class="flex items-center">
				<img src="../assets/logo1.png" />
				<img src="../assets/logo2.png" />
			</div> -->
			<div class="flex flex-col space-y-2 relative w-max">
				<div
					class="top-0 w-20 h-20 text-white absolute"
					style="
						width: 120px;
						height: 80px;
						top: 0;
						left: -77px;
						transform: rotate(125deg);
					"
				>
					<svg
						style="fill: rgba(255, 255, 255, 0.2)"
						viewBox="0 0 10 5"
						xmlns="http://www.w3.org/2000/svg"
					>
						<ellipse cx="5" cy="2" rx="5" ry="2" />
					</svg>
				</div>
				<div
					class="top-0 w-20 h-20 text-white absolute"
					style="
						width: 120px;
						height: 80px;
						top: 15.5px;
						right: -40.5px;
						transform: rotate(90deg);
					"
				>
					<svg
						style="fill: rgba(255, 255, 255, 1)"
						viewBox="0 0 100 100"
						xmlns="http://www.w3.org/2000/svg"
					>
						<ellipse cx="14.5" cy="14.5" rx="15.5" ry="10.5" />
					</svg>
				</div>
				<div
					class="top-0 w-20 h-20 text-white absolute"
					style="
						width: 120px;
						height: 80px;
						top: 88px;
						right: -40.5px;
						transform: rotate(90deg);
					"
				>
					<svg
						style="fill: rgba(255, 255, 255, 1)"
						viewBox="0 0 100 100"
						xmlns="http://www.w3.org/2000/svg"
					>
						<ellipse cx="14.5" cy="14.5" rx="15.5" ry="10.5" />
					</svg>
				</div>
				<div
					class="top-0 w-20 h-20 text-white absolute"
					style="
						width: 120px;
						height: 35px;
						top: 75px;
						right: -22.5px;
						transform: rotate(90deg);
					"
				>
					<svg
						style="fill: rgba(255, 255, 255, 1)"
						viewBox="0 0 100 100"
						xmlns="http://www.w3.org/2000/svg"
					>
						<ellipse cx="14.5" cy="14.5" rx="15.5" ry="10.5" />
					</svg>
				</div>
				<div
					style="
						width: 7.3rem;
						background: url('https://www.evo-learning.com/img/hero-bg.png');
					"
					class="rounded-sm rounded-l-full h-7 text-transparent"
				></div>
				<div
					style="background-color: #5f21d4; width: 4.5rem"
					class="rounded-sm rounded-l-full h-7 text-transparent"
				></div>
				<div
					style="width: 7.3rem; background-color: #5434dc"
					class="rounded-sm rounded-l-full h-7 text-transparent"
				></div>
			</div>
			<h1 class="mb-0 mx-auto text-5xl text-center text-primary">Evo Learning</h1>
			<div
				class="
					w-11/12
					pb-12
					m-auto
					text-center
					rounded
					bg-gray-50
					pt-11
					lg:px-52 lg:w-max
					login-card
				"
			>
				<h1 class="mx-auto mb-8 text-4xl text-center">
					{{ $t("headings.login") }}
				</h1>
				<div
					style="width: 150px; height: 150px"
					class="mx-auto bg-opacity-100 rounded-full bg-secondary shadow-elevation-2"
				>
					<!-- <span class="text-gray-300 text-8xl material-symbols-outlined">
            account_circle
          </span> -->
					<span style="font-size: 145px" class="opacity-100 material-icons text-light">
						person
					</span>
				</div>
				<div
					v-if="googleOauthHadError"
					class="mx-4 lg:-mx-48 space-x-3 banner banner-danger mt-6"
				>
					<div
						style="width: 40px; height: 40px; padding-left: 2.5px"
						class="flex items-start rounded-full bg-danger bg-opacity-50"
					>
						<span class="m-auto material-icons" style="font-size: 35px">cookies</span>
						<!-- <span class="mr-2 opacity-100 text-danger-dark">
							<svg style="width: 22px; height: 22px" viewBox="0 0 24 24">
								<path
									fill="currentColor"
									d="M22.11 21.46L2.39 1.73L1.11 3L6.31 8.2L6 9H7.11L8.61 10.5H2V12H10.11L13.5 15.37C13.38 15.61 13.3 15.85 13.24 16.1C12.29 15.69 11.41 15.8 10.76 16.09C10.35 14.31 8.79 13 6.94 13C4.77 13 3 14.79 3 17C3 19.21 4.77 21 6.94 21C9 21 10.68 19.38 10.84 17.32C11.18 17.08 12.07 16.63 13.16 17.34C13.34 19.39 15 21 17.06 21C17.66 21 18.22 20.86 18.72 20.61L20.84 22.73L22.11 21.46M6.94 19.86C5.38 19.86 4.13 18.58 4.13 17C4.13 15.42 5.39 14.14 6.94 14.14C8.5 14.14 9.75 15.42 9.75 17C9.75 18.58 8.5 19.86 6.94 19.86M17.06 19.86C15.5 19.86 14.25 18.58 14.25 17C14.25 16.74 14.29 16.5 14.36 16.25L17.84 19.73C17.59 19.81 17.34 19.86 17.06 19.86M22 12H15.2L13.7 10.5H22V12M17.06 13C19.23 13 21 14.79 21 17C21 17.25 20.97 17.5 20.93 17.73L19.84 16.64C19.68 15.34 18.66 14.32 17.38 14.17L16.29 13.09C16.54 13.03 16.8 13 17.06 13M12.2 9L7.72 4.5L8.43 2.68C8.63 2.17 9.19 1.89 9.72 2.04L9.77 2.05L12 2.79L14.22 2.05C14.75 1.88 15.32 2.14 15.54 2.63L15.56 2.68L18 9H12.2Z"
								/>
							</svg>
						</span> -->
					</div>
					<div>
						<p class="">
							<b> {{ $t("login_screen.warning") }}:</b>
							{{ $t("login_screen.cookies_warning") }}
							<strong class="text-danger-dark">{{
								$t("login_screen.all_cookies")
							}}</strong
							>.
						</p>
						<p>
							{{ $t("login_screen.enable_third_party_cookies_1") }}
							<strong class="text-danger-dark">{{
								$t("login_screen.enable_third_party_cookies_2")
							}}</strong
							>.
						</p>
					</div>
				</div>
				<div class="mt-8 text-center">
					<Btn
						id="login-btn"
						@click="handleClickSignIn"
						:variant="'secondary'"
						:size="'lg'"
						class="md:w-max"
						:disabled="!googleOauthReady || localLoading || disableLogin"
						:loading="(!googleOauthReady && !googleOauthHadError) || localLoading"
					>
						<span class="mr-2 text-xl material-icons">lock</span>
						{{ $t("login_screen.login") }}
					</Btn>
				</div>
			</div>
		</div>
		<v-tour
			name="demoTour"
			:steps="demoLoginTourSteps"
			:options="tourOptions"
			:callbacks="{ onFinish: onTourFinish }"
		></v-tour>
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
import {
	isDemoMode,
	logAnalyticsEvent,
	redirectToMainView,
	setErrorNotification,
} from "@/utils";
import { getTranslatedString } from "@/i18n";
import { demoLoginTourSteps, tourOptions } from "@/const";
import { mapStores } from "pinia";
import { useMetaStore } from "@/stores/metaStore";

const DEMO_TOUR_KEY = "demo_tour_taken";

export default defineComponent({
	name: "Login",
	components: {
		Btn,
		Spinner,
	},
	watch: {
		googleOauthReady(newVal) {
			if (newVal && isDemoMode() && !(DEMO_TOUR_KEY in localStorage)) {
				setTimeout(() => ((this as any).$tours["demoTour"] as any).start(), 50);
				this.disableLogin = true;
			}
		},
	},
	data() {
		return {
			user: "",
			loadingLogin: true,
			disableLogin: false,
			demoLoginTourSteps,
			tourOptions,
		};
	},
	mixins: [loadingMixin],
	methods: {
		onTourFinish() {
			this.disableLogin = false;
			localStorage.setItem(DEMO_TOUR_KEY, "true");
		},
		async handleClickSignIn() {
			try {
				await this.withLocalLoading(
					async () => {
						const googleUser = await this.$gAuth.signIn();
						console.log(googleUser);
						if (!googleUser) {
							return null;
						}
						this.user = googleUser.getBasicProfile().getEmail();
						const token = googleUser.getAuthResponse().access_token;
						await this.metaStore.convertToken(token);
						await this.metaStore.getUserData();
						console.log("main", redirectToMainView, "err", setErrorNotification);

						redirectToMainView();
						// TODO if you use this.setErroNotification, this is undefined - investigate (hint: it has to do something with the mixin and possibily the store)
						setErrorNotification(getTranslatedString("misc.logged_in"), true);
					},
					isDemoMode() ? this.redirectToDemoPage : this.setErrorNotification,
				);
			} catch (error) {
				throw error;
			}
		},
		redirectToDemoPage() {
			logAnalyticsEvent("loginFailedRedirectToDemo", {});
			const redirectUrl =
				process.env.VUE_APP_DEMO_REDIRECT_URL ?? "http://localhost:8081";
			window.location.href = redirectUrl;
		},
	},
	setup() {
		const Vue3GoogleOauth = inject("Vue3GoogleOauth");
		return {
			Vue3GoogleOauth,
		};
	},
	created() {
		if (this.metaStore.isAuthenticated) {
			redirectToMainView();
		}
	},
	computed: {
		...mapStores(useMetaStore),
		googleOauthReady() {
			return (this as any).Vue3GoogleOauth.isInit;
		},
		googleOauthHadError() {
			return (this as any).Vue3GoogleOauth.hadError;
		},
	},
});
</script>

<style>
.login-card {
	box-shadow: rgba(60, 64, 67, 0.3) 0 4px 4px 0, rgba(60, 64, 67, 0.15) 0 8px 12px 6px;
}
</style>
