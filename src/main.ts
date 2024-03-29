/* eslint-disable */
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import axios from "axios";
import VueAxios from "vue-axios";
import { i18n } from "./i18n";

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

import vue3GoogleLogin from "vue3-google-login";

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
	.use(vue3GoogleLogin, {
		clientId: process.env.VUE_APP_GOOGLE_CLIENT_ID,
	})
	.use(VWave, {
		duration: 0.3,
	})
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
