/* eslint-disable */
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
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
import { clickOutsideDirective, logOut } from "./utils";

import Vue3Sanitize from "vue-3-sanitize";

import VWave from "v-wave";
import { sanitizeOptions } from "./const";

import VueGtag from "vue-gtag";

const gAuthOptions = {
	clientId: "956826904172-mcsaj1bqcllv93bpad7dmd0e3oil4758.apps.googleusercontent.com",
	scope: "profile",
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
		if (
			error?.response?.status === 401 &&
			(router.currentRoute.value.name?.toString().toLowerCase() ?? "") !== "login"
		) {
			logOut(false, router.currentRoute.value.fullPath);
		}
		throw error;
	},
);

const app = createApp(App);

app
	.directive("click-outside", clickOutsideDirective)
	.use(VWave, {
		duration: 0.3,
	})
	.use(GAuth, gAuthOptions)
	.use(store)
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

if (!dev) {
	Sentry.init({
		app,
		dsn: "https://a254871461ce4189bc483cc527fcebb9@o1003719.ingest.sentry.io/6265941",
		integrations: [
			new BrowserTracing({
				routingInstrumentation: Sentry.vueRouterInstrumentation(router),
				tracingOrigins: ["localhost", "my-site-url.com", /^\//],
			}),
		],
		// Set tracesSampleRate to 1.0 to capture 100%
		// of transactions for performance monitoring.
		// We recommend adjusting this value in production
		tracesSampleRate: 1.0,
		logErrors: true,
	});
}
