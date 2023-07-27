<template>
	<div class="flex flex-col items-center">
		<div class="banner banner-danger mb-4" v-if="popupBlocked">
			<p>{{ $t("misc.popup_blocked") }}</p>
		</div>
		<Btn :variant="'secondary'" :loading="loading" @click="grantScopes()">
			<slot></slot>
		</Btn>
	</div>
</template>

<script lang="ts">
// const CLIENT_ID = process.env.VUE_APP_GOOGLE_OAUTH_CLIENT_ID;
// const CLIENT_SECRET = process.env.VUE_APP_GOOGLE_OAUTH_CLIENT_SECRET;
// const REDIRECT_URI = "http://localhost:8080/redirect";
// const DEFAULT_SCOPES = ["https://www.googleapis.com/auth/gmail.readonly"];

// const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

import { defineComponent, PropType } from "@vue/runtime-core";
import { setErrorNotification } from "@/utils";
import Btn from "@/components/ui/Btn.vue";
export default defineComponent({
	name: "GoogleScopesButton",
	props: {
		getUrl: {
			type: Function as PropType<() => Promise<string>>,
			required: true,
		},
	},
	data() {
		return {
			loading: false,
			popupBlocked: false,
			popupHandle: null as number | null,
		};
	},
	methods: {
		async grantScopes() {
			this.popupBlocked = false;
			this.loading = true;
			const url = await this.getUrl();
			const popup = window.open(url, "", "popup=true");
			if (!popup || popup.closed) {
				this.popupBlocked = true;
				this.loading = false;
				return;
			}
			this.popupHandle = setInterval(() => {
				if (popup.closed) {
					// popup has been closed, check if scopes were granted
					clearInterval(this.popupHandle as number);
					this.loading = false;
					this.onAuthDone();
				}
			}, 300);
		},
		onAuthDone() {
			this.$emit("authDone");
		},
	},
	computed: {},
	components: { Btn },
});
</script>

<style></style>
