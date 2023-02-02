<template>
	<div class="md:flex h-full md:h-screen md:w-screen md:-mx-6 lg:-mx-10 -my-2 md:-my-4">
		<!-- login column -->
		<div
			class="flex relative md:w-11/12 flex-col items-center h-full md:shadow-elevation-2"
		>
			<img src="@/assets/logo.png" class="mt-4 md:w-7/12 w-10/12" />

			<!-- main area -->
			<div
				class="
					w-11/12
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
				<!-- no cookies banner -->
				<div
					v-if="googleOauthHadError"
					class="mx-4 w-full px-4 space-x-3 banner banner-danger mt-6"
				>
					<div
						style="width: 40px; height: 40px; padding-left: 2.5px"
						class="flex items-start rounded-full bg-danger bg-opacity-50"
					>
						<span class="m-auto material-icons" style="font-size: 35px">cookies</span>
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

				<!-- unauthorized email address banner -->
				<div
					v-if="loginAttemptWithUnauthorizedEmailAddress"
					class="mx-4 w-full px-4 space-x-3 banner banner-danger mt-6"
				>
					<div
						style="width: 40px; height: 40px; padding-left: 2.5px"
						class="flex items-start rounded-full"
					>
						<span class="m-auto material-icons" style="font-size: 35px"
							>remove_circle_outline</span
						>
					</div>
					<div>
						<!-- <p class="">
							<b> {{ $t("login_screen.warning") }}:</b>
						</p> -->
						<p>
							{{ $t("login_screen.unauthorized_email_1") }}
							<strong class="text-danger-dark">{{
								$t("login_screen.unauthorized_email_2")
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
			<div class="mb-1 mt-auto mr-auto ml-2 md:ml-4 opacity-0">
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
			loginAttemptWithUnauthorizedEmailAddress: false,
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
				this.loginAttemptWithUnauthorizedEmailAddress = false;
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
					isDemoMode()
						? this.redirectToDemoPage
						: e => {
								// rethrow error to custom handler
								throw e;
						  },
				);
			} catch (error: any) {
				console.error("sign in error", error);

				const UNAUTHORIZED_EMAIL_DOMAIN_MSG = "Your credentials aren't allowed";
				if (error.response?.data?.error_description === UNAUTHORIZED_EMAIL_DOMAIN_MSG) {
					this.onLoginAttemptWithUnauthorizedEmailAddress();
				} else if (error.error === "popup_closed_by_user") {
					logAnalyticsEvent("popup_closed_by_user", {});
				} else {
					setErrorNotification(error);
				}
				throw error;
			}
		},
		onLoginAttemptWithUnauthorizedEmailAddress() {
			logAnalyticsEvent("unauth_login_attempt", {});
			this.loginAttemptWithUnauthorizedEmailAddress = true;
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
