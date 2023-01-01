<template>
	<div class="md:flex h-full md:h-screen md:w-screen md:-mx-6 lg:-mx-10 -my-2 md:-my-4">
		<!-- login column -->
		<div
			class="flex relative md:w-11/12 flex-col items-center h-full md:shadow-elevation-2"
		>
			<img src="@/assets/logo.png" class="mt-4 md:w-8/12 w-10/12" />

			<!-- main area -->
			<div
				class="
					absolute
					top-1/2
					transform
					-translate-x-1/2 -translate-y-1/2
					left-1/2
					flex
					items-center
					flex-col
				"
			>
				<h1 class="mx-auto mb-8 text-5xl text-center">
					{{ $t("headings.login") }}
				</h1>
				<div
					style="width: 150px; height: 150px"
					class="mx-auto flex bg-opacity-100 rounded-full bg-primary shadow-elevation-2"
				>
					<!-- <span class="text-gray-300 text-8xl material-symbols-outlined">
            account_circle
          </span> -->
					<span
						style="font-size: 145px"
						class="opacity-100 material-icons m-auto text-light"
					>
						person
					</span>
				</div>
				<div
					v-if="googleOauthHadError"
					class="mx-4 px-4 space-x-3 banner banner-danger mt-6"
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
						style="background: white !important"
						:disabled="!googleOauthReady || localLoading || disableLogin"
						:loading="(!googleOauthReady && !googleOauthHadError) || localLoading"
					>
						<!-- <img class="mr-2.5" style="width: 22px" src="@/assets/google.png" /> -->
						<img class="mr-2.5" style="width: 30px" src="@/assets/unipi.png" />
						<!-- <span class="mr-2 text-xl material-icons">lock</span> -->
						{{ $t("login_screen.login") }}
					</Btn>
				</div>
			</div>
			<!-- terms & conditions-->
			<div class="mb-1 mt-auto mr-auto ml-2 md:ml-4">
				<p class="text-xs text-muted">
					{{ $t("login_screen.entering_you_agree_to") }}
					<span class="text-primary hover:underline cursor-pointer"
						>{{ $t("misc.terms_and_conditions") }} </span
					>.
				</p>
			</div>
			<!-- copyright & info-->
			<div class="w-full text-sm px-2 md:px-4 py-4 bg-light">
				<div class="flex items-center">
					<p class="">
						<span class="mr-0.5">&copy;</span>
						<a
							target="_blank"
							class="font-medium text-primary hover:underline"
							href="https://evo-learning.com"
							>Evo Learning</a
						>
					</p>
					<p class="mx-2">&#183;</p>
					<p>
						Crafted with ❤️ by
						<a
							target="_blank"
							class="font-medium text-primary hover:underline"
							href="http://bsamu.it"
							>Samuele Bonini</a
						>
					</p>
				</div>
			</div>

			<!-- </div> -->
		</div>
		<!-- hero column-->
		<div class="w-full relative hidden md:flex h-full px-2 md:px-6 lg:px-10 py-4 hero-bg">
			<div
				style="top: 10%; left: 70%"
				class="hero-icon"
				:class="{ 'hero-hidden': !showIcons }"
			>
				<span style="font-size: 72px !important" class="material-icons">code</span>
			</div>
			<div
				style="bottom: 10%; right: 70%"
				class="hero-icon"
				:class="{ 'hero-hidden': !showIcons }"
			>
				<span style="font-size: 72px !important" class="material-icons"
					>assignment_turned_in</span
				>
			</div>
			<div
				style="bottom: 30%; right: 10%"
				class="hero-icon"
				:class="{ 'hero-hidden': !showIcons }"
			>
				<span style="font-size: 72px !important" class="material-icons">book</span>
			</div>
			<div
				style="top: 32.5%; left: 10%"
				class="hero-icon"
				:class="{ 'hero-hidden': !showIcons }"
			>
				<span style="font-size: 72px !important" class="material-icons">bar_chart</span>
			</div>
			<div
				style="position: relative !important"
				class="hero-icon m-auto"
				:class="{ 'hero-hidden': !showIcons }"
			>
				<span style="font-size: 72px !important" class="material-icons">school</span>
			</div>
			<!-- <img
				class="absolute top-0 right-0 mt-24 mr-24 filter drop-shadow-lg"
				style="width: 375px"
				src="@/assets/hero/undraw_6.svg"
			/>
			<img
				class="absolute filter drop-shadow-lg bottom-0 left-0 mb-12 ml-12"
				style="width: 300px"
				src="@/assets/hero/undraw_teaching_re_g7e3.svg"
			/> -->
		</div>
		<!-- <div
			class="
				w-full
				overflow-hidden
				relative
				h-full
				bg-gradient
				grad-bg
				px-2
				md:px-6
				lg:px-10
				py-4
			"
		>
			<div
				class="
					absolute
					zigzag-pattern
					w-1/2
					h-96
					-top-40
					-left-40
					opacity-80
					rounded-xl
					-rotate-45
					transform
				"
			></div>
			<div
				style="
					height: 800px;
					width: 800px;
					bottom: -500px;
					right: -500px;
					border-radius: 500px;
				"
				class="absolute patterns opacity-40"
			></div>
		</div> -->
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
import { defineComponent } from "@vue/runtime-core";
import { loadingMixin } from "@/mixins";
import {
	isDemoMode,
	logAnalyticsEvent,
	redirectToMainView,
	setErrorNotification,
} from "@/utils";
import { getTranslatedString as _ } from "@/i18n";
import { demoLoginTourSteps, tourOptions } from "@/const";
import { mapStores } from "pinia";
import { useMetaStore } from "@/stores/metaStore";

const DEMO_TOUR_KEY = "demo_tour_taken";

export default defineComponent({
	name: "Login",
	components: {
		Btn,
	},
	watch: {
		googleOauthReady(newVal) {
			// trigger demo tour
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
			showIcons: false,
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
						if (!googleUser) {
							return null;
						}
						this.user = googleUser.getBasicProfile().getEmail();
						const token = googleUser.getAuthResponse().access_token;

						await this.metaStore.convertToken(token);
						await this.metaStore.getUserData();

						redirectToMainView();

						// TODO if you use this.setErroNotification, this is undefined - investigate (hint: it has to do something with the mixin and possibily the store)
						setErrorNotification(_("misc.logged_in"), true);
					},
					// different error handling depending on whether in demo mode
					isDemoMode() ? this.redirectToDemoPage : this.setErrorNotification,
				);
			} catch (error) {
				// TODO handle special errors like email domain unauthorized
				console.error("sign in error", error);
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
	mounted() {
		setTimeout(() => (this.showIcons = true), 10);
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
.patterns {
	background-color: #ffffff00;
	opacity: 1;
	background-image: radial-gradient(
		ellipse farthest-corner at 13px 13px,
		rgba(41, 111, 249, 1),
		rgba(51, 96, 243, 1) 50%,
		#ffffff00 50%
	);
	background-size: 13px 13px;
}

#login-btn:hover {
	filter: brightness(0.9825);
}

.dot-patterns {
	background-image: radial-gradient(rgba(51, 96, 243, 1) 1.5px, #e5e5f700 0.5px);
	background-size: 20px 20px;
}

.hero-bg {
	--grad-start: rgba(115, 5, 253, 1);
	--grad-mid-1: rgba(97, 30, 210, 1);
	--grad-mid-2: rgba(51, 96, 243, 1);
	--grad-end: rgba(41, 111, 249, 1);
	background: linear-gradient(
		150deg,
		var(--grad-start) 0%,
		var(--grad-mid-1) 25%,
		var(--grad-mid-2) 83% /* var(--grad-end) 100% */
	);
	background-image: url("~@/assets/hero-bg.png");
	background-size: cover;
	background-repeat: no-repeat;
}

.zigzag-pattern {
	background-color: #ffffff00;
	opacity: 1;
	background-image: linear-gradient(135deg, rgba(97, 30, 210, 1) 25%, transparent 25%),
		linear-gradient(225deg, rgba(97, 30, 210, 1) 25%, transparent 25%),
		linear-gradient(45deg, rgba(97, 30, 210, 1) 25%, transparent 25%),
		linear-gradient(315deg, rgba(97, 30, 210, 1) 25%, #ffffff00 25%);
	background-position: 13px 0, 13px 0, 0 0, 0 0;
	background-size: 26px 26px;
	background-repeat: repeat;
}
</style>
