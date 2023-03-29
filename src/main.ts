/* eslint-disable */
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
//import store from "./store";
import axios from "axios";
import VueAxios from "vue-axios";
import { i18n } from "./i18n";
//import GAuth from './src/plugins/vue3-google-oauth2'; //'vue3-google-oauth2';
//import GAuth from "vue3-google-oauth2";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import GAuth from "./plugins/vue-google-oauth2"; //'vue3-google-oauth2';

import "./index.css";
import VueClipboard from "vue3-clipboard";

import Vue3Tour from "vue3-tour";

import * as Sentry from "@sentry/vue";
import { BrowserTracing } from "@sentry/tracing";

import "vue3-tour/dist/vue3-tour.css";
import { clickOutsideDirective, logOut, redirectToCourseEnrollment } from "./utils";

import Vue3Sanitize from "vue-3-sanitize";

import VWave from "v-wave";
import { sanitizeOptions } from "./const";

import VueGtag from "vue-gtag";
import { createPinia } from "pinia";

// TODO export to env vars
const gAuthOptions = {
	clientId: "956826904172-mcsaj1bqcllv93bpad7dmd0e3oil4758.apps.googleusercontent.com",
	scope:
		"profile email https://www.googleapis.com/auth/classroom.rosters https://www.googleapis.com/auth/classroom.coursework.me",
	// TODO probably remove this - see https://developers.google.com/identity/openid-connect/openid-connect#re-consent
	prompt: "consent",
	fetch_basic_profile: true,
	//hosted_domain: ["studenti.unipi.it"]
};

const dev = process.env.NODE_ENV !== "production";

axios.defaults.baseURL = dev
	? process.env.VUE_APP_AXIOS_BASE ?? "http://127.0.0.1:8000"
	: process.env.VUE_APP_AXIOS_BASE;

axios.interceptors.response.use(
	response => {
		return response;
	},
	error => {
		/* 
		TODO if this happens when calling a dispatcher url such as `courses/.../material/...`, it'll
		redirect to login?redirect=/ instead of redirecting to the original url. fix this
		*/
		if (
			error?.response?.status === 401 &&
			(router.currentRoute.value.name?.toString().toLowerCase() ?? "") !== "login"
		) {
			logOut(false, router.currentRoute.value.fullPath);
		} else if (
			error?.response?.status === 403 &&
			error.response.data?.detail === "NOT_ENROLLED" &&
			!("redirect" in router.currentRoute.value.query ?? {})
		) {
			redirectToCourseEnrollment(router.currentRoute.value.fullPath);
		}
		throw error;
	},
);

const app = createApp(App);

app
	.directive("click-outside", clickOutsideDirective)
	.use(createPinia())
	.use(VWave, {
		duration: 0.3,
	})
	.use(GAuth, gAuthOptions)
	//.use(store)
	.use(router)
	.use(VueAxios, axios)
	.use(i18n)
	.use(VueClipboard, {
		autoSetContainer: true,
		appendToBody: true,
	})
	.use(Vue3Tour)
	.use(Vue3Sanitize, sanitizeOptions)
	.use(VueGtag, {
		config: { id: process.env.VUE_APP_GTAG_ID },
	})
	.mount("#app");

if (!dev && process.env.VUE_APP_SENTRY_URL) {
	Sentry.init({
		app,
		dsn: process.env.VUE_APP_SENTRY_URL,
		integrations: [
			new BrowserTracing({
				routingInstrumentation: Sentry.vueRouterInstrumentation(router),
				tracingOrigins: ["localhost", "my-site-url.com", /^\//],
			}),
		],
		tracesSampleRate: 0.5,
		logErrors: true,
		beforeSend(event) {
			const IGNORED_MESSAGES = [
				"Request failed with status code 401",
				"Request failed with status code 403",
				"Request failed with status code 404",
			];
			if (IGNORED_MESSAGES.includes(event.exception?.values?.[0]?.value ?? "")) {
				return null;
			}
			return event;
		},
	});
}
