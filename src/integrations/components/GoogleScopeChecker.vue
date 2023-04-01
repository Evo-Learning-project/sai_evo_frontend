<template>
	<div class="relative">
		<Spinner
			:size="'lg'"
			class="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2"
			v-if="loading"
		/>
		<!-- user hasn't granted any scopes yet -->
		<div v-if="!loading && outstandingScopes.length === scopes.length" class="">
			<slot name="noScopes">
				<p class="mb-4">
					{{ $t("integrations.classroom.grant_scopes_to_use_integration") }}
				</p>
			</slot>
		</div>
		<!-- user has granted some but not all scopes-->
		<div
			v-else-if="
				!loading &&
				outstandingScopes.length > 0 &&
				outstandingScopes.length < scopes.length
			"
			class=""
		>
			<slot name="outstandingScopes">
				<p class="mb-4">
					{{ $t("integrations.classroom.grant_scopes_to_use_integration") }}
				</p>
			</slot>
		</div>
		<!-- button to grant scopes-->
		<GoogleScopesButton
			v-if="!loading && outstandingScopes.length > 0"
			:getUrl="() => googleIntegrationStore.getClassroomScopesAuthUrl(role)"
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
import { CLASSROOM_STUDENT_SCOPES, CLASSROOM_TEACHER_SCOPES } from "../classroom/const";
import { useGoogleIntegrationsStore } from "../stores/googleIntegrationsStore";
import GoogleScopesButton from "./GoogleScopesButton.vue";
export default defineComponent({
	name: "GoogleScopeChecker",
	props: {
		role: {
			type: String as PropType<"teacher" | "student">,
			required: true,
		},
		// scopes: {
		// 	type: Array as PropType<string[]>,
		// 	required: true,
		// },
	},
	async created() {
		// TODO remove setTimeout in production, it's to avoid local db lock
		setTimeout(async () => await this.loadAuthorizedScopes(), 1000);
	},
	watch: {
		outstandingScopesLength(newVal) {
			if (newVal === 0) {
				this.$emit("scopesOk");
			} else {
				this.$emit("scopesCheckFailed");
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
		scopes() {
			return this.role === "teacher"
				? CLASSROOM_TEACHER_SCOPES
				: CLASSROOM_STUDENT_SCOPES;
		},
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
