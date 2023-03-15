<template>
	<div class="relative">
		<Spinner
			:size="'lg'"
			class="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2"
			v-if="loading"
		/>
		<!-- user hasn't granted any scopes yet -->
		<div v-if="!loading && outstandingScopes.length === scopes.length" class="">
			<p>{{ $t("integrations.classroom.grant_scopes_to_use_integration") }}</p>
		</div>
		<!-- user has granted some but not all scopes-->
		<div
			v-if="
				!loading &&
				outstandingScopes.length > 0 &&
				outstandingScopes.length < scopes.length
			"
			class="banner banner-danger"
		>
			<div class="flex flex-col space-y-2">
				<p>{{ $t("integrations.classroom.you_have_outstanding_scopes") }}</p>
				<!-- <ul class="text-sm">
					<li v-for="scope in outstandingScopes" :key="scope">
						{{ $t("integrations.classroom.scopes_descriptions." + scope) }}
					</li>
				</ul> -->
			</div>
		</div>
		<!-- button to grant scopes-->
		<GoogleScopesButton
			v-if="!loading && outstandingScopes.length > 0"
			class="mt-4"
			:getUrl="googleIntegrationStore.getClassroomScopesAuthUrl"
			@authDone="loadAuthorizedScopes()"
		>
			<div class="flex items-center space-x-2.5">
				<img src="@/assets/google.png" style="width: 15px" />
				<span>{{ $t("integrations.classroom.grant_scopes_btn") }}</span>
			</div>
		</GoogleScopesButton>
	</div>
</template>

<script lang="ts">
import Spinner from "@/components/ui/Spinner.vue";
import { setErrorNotification } from "@/utils";
import { defineComponent, PropType } from "@vue/runtime-core";
import { mapStores } from "pinia";
import { useGoogleIntegrationsStore } from "../stores/googleIntegrationsStore";
import GoogleScopesButton from "./GoogleScopesButton.vue";
export default defineComponent({
	name: "GoogleScopeChecker",
	props: {
		scopes: {
			type: Array as PropType<string[]>,
			required: true,
		},
	},
	async created() {
		// TODO remove setTimeout in production, it's to avoid local db lock
		setTimeout(async () => await this.loadAuthorizedScopes(), 1000);
	},
	watch: {
		outstandingScopesLength(newVal) {
			if (newVal === 0) {
				console.log("OK");
				this.$emit("scopesOk");
			}
		},
	},
	data() {
		return {
			loading: true,
			error: false,
		};
	},
	methods: {
		async loadAuthorizedScopes() {
			this.loading = true;
			try {
				await this.googleIntegrationStore.getAuthorizedScopes();
			} catch (e) {
				this.error = true;
				setErrorNotification(e);
			} finally {
				this.loading = false;
			}
		},
	},
	computed: {
		...mapStores(useGoogleIntegrationsStore),
		outstandingScopes() {
			// List of required scopes the user hasn't granted yet
			const granted = this.googleIntegrationStore.authorizedScopes;
			return this.scopes.filter(s => !granted.includes(s));
		},
		outstandingScopesLength() {
			if (!this.loading) {
				return this.outstandingScopes.length;
			}
			return undefined;
		},
	},
	components: { Spinner, GoogleScopesButton },
});
</script>

<style></style>
