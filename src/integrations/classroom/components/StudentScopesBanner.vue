<template>
	<div>
		<Transition name="fade">
			<div
				v-show="showMissingScopesBanner"
				class="banner banner-danger mb-8"
				role="alert"
				:class="{ shake: googleIntegrationStore.studentScopesBannerShaking }"
				@animationend="googleIntegrationStore.studentScopesBannerShaking = false"
			>
				<!-- <strong class="font-bold">Missing scopes!</strong>
			<span class="block sm:inline"
				>You need to grant the missing scopes to use this feature.</span
			>
			<span class="absolute top-0 bottom-0 right-0 px-4 py-3">
				<svg
					class="fill-current h-6 w-6 text-red-500"
					role="button"
					@click="showMissingScopesBanner = false"
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 20 20"
				>
					<title>Close</title>
					<path
						d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"
					/>
				</svg>
			</span> -->
				<div class="flex flex-col space-y-4">
					<div class="flex items-center space-x-2">
						<span class="material-icons">error_outline</span>
						<h4 class="mb-0">{{ $t("misc.warning") }}</h4>
					</div>
					<GoogleScopeChecker
						class="flex flex-col items-start space-y-4"
						@scopesOk="onScopesOk()"
						@scopesCheckFailed="onScopesCheckFailed()"
						:role="'student'"
					>
						<template v-slot:noScopes>
							<p>
								{{ $t("integrations.classroom.student_no_scopes_warning") }}
							</p>
							<p><ArticleHandle :articleId="'why_evo_asks_for_google_scopes'" />.</p>
						</template>
						<template v-slot:outstandingScopes>
							<p>
								{{ $t("integrations.classroom.student_no_scopes_warning") }}
							</p>
							<p><ArticleHandle :articleId="'why_evo_asks_for_google_scopes'" />.</p>
						</template>
					</GoogleScopeChecker>
				</div>
			</div>
		</Transition>
		<HelpCenter
			@close="metaStore.setHelpCenterVisibility(false)"
			v-if="metaStore.helpCenterOpen"
			:allowGoBack="false"
		></HelpCenter>
	</div>
</template>

<script lang="ts">
import GoogleScopeChecker from "@/integrations/components/GoogleScopeChecker.vue";
import { defineComponent, PropType } from "@vue/runtime-core";
import { CLASSROOM_STUDENT_SCOPES } from "../const";
import { mapStores } from "pinia";
import { useMetaStore } from "../../../stores/metaStore";
import ArticleHandle from "../../../components/shared/HelpCenter/ArticleHandle.vue";
import HelpCenter from "../../../components/shared/HelpCenter/HelpCenter.vue";
import { useGoogleIntegrationsStore } from "../../stores/googleIntegrationsStore";
export default defineComponent({
	name: "StudentScopesBanner",
	props: {},
	data() {
		return {
			CLASSROOM_STUDENT_SCOPES,
			shakeBanner: false,
		};
	},
	methods: {
		onScopesOk() {
			this.googleIntegrationStore.studentScopesBannerVisible = false;
		},
		onScopesCheckFailed() {
			this.googleIntegrationStore.studentScopesBannerVisible = true;
		},
	},
	computed: {
		...mapStores(useMetaStore, useGoogleIntegrationsStore),
		showMissingScopesBanner(): boolean {
			return this.googleIntegrationStore.studentScopesBannerVisible;
		},
	},
	components: { GoogleScopeChecker, ArticleHandle, HelpCenter },
});
</script>

<style></style>
