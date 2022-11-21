<template>
	<div class="w-full flex flex-col">
		<!-- secondary app bar containing header and route title-->
		<!-- <header
			v-if="showSecondaryHeader"
			class="
				sticky
				top-20
				z-20
				mb-4
				bg-light bg-opacity-100 bg-fallback-firefox
				md:-mx-10 md:-mt-4
				backdrop-blur-sm backdrop-filter
			"
		>
			<div class="flex bg-light w-full px-4 mx-auto md:items-center sm:px-18 lg:px-20">
				<div class="md:items-center md:flex-row">
					 <h2 class="mb-0 text-lg md:mr-6 md:text-2xl">
						{{ routeTitle }}
					</h2> 
					<BreadCrumbs
						v-if="!$route.meta.hideBreadcrumbs"
						:route="$route"
						class="mt-1 md:ml-0"
					></BreadCrumbs>
				</div>
				<div class="flex ml-auto md:w-80">
					<div class="ml-auto" id="main-student-header-right"></div>
				</div>
			</div>
		</header> -->

		<router-view class="w-full" />

		<!-- main pane containing current view -->
		<!-- <main class="w-full bg-white md:px-8">
			<div class="h-full mx-auto lg:px-8" :class="{ 'px-4': showSecondaryHeader }">
				<ErrorView v-if="metaStore.pageWideErrorData"></ErrorView>

				<router-view class="" v-else />

				<transition name="quick-bounce">
					<SnackBar
						class="w-full px-4"
						v-if="metaStore.errorNotificationData"
						:icon="metaStore.errorNotificationData.icon"
						:message="metaStore.errorNotificationData.title"
					/>
				</transition>
			</div>
		</main> -->

		<!-- dialog for editing mat number -->
		<Dialog
			:show-dialog="editingMat"
			@no="editingMat = false"
			@yes="onSaveMat()"
			:yes-text="$t('misc.save')"
			:no-text="$t('dialog.default_cancel_text')"
		>
			<!-- TODO add course selection -->
			<template v-slot:title>{{ $t("student_data.edit_mat_title") }}</template>
			<template v-slot:body>
				<NumberInput v-model="dirtyMat" class="mt-8">{{
					$t("student_data.your_mat")
				}}</NumberInput>
			</template>
		</Dialog>
	</div>
</template>

<script lang="ts">
import { courseIdMixin, eventIdMixin, loadingMixin } from "@/mixins";
import {
	ROUTE_TITLE_COURSE_NAME_TOKEN,
	ROUTE_TITLE_EVENT_NAME_TOKEN,
} from "@/navigation/const";
import { SidebarOption } from "@/navigation/sidebar";
import { defineComponent } from "@vue/runtime-core";
import ErrorView from "../shared/ErrorView.vue";
import SnackBar from "@/components/ui/SnackBar.vue";
import BreadCrumbs from "@/components/ui/BreadCrumbs.vue";
import Btn from "@/components/ui/Btn.vue";
import { isDemoMode, logOut } from "@/utils";
import Dialog from "@/components/ui/Dialog.vue";
import NumberInput from "@/components/ui/NumberInput.vue";
import { mapStores } from "pinia";
import { useMainStore } from "@/stores/mainStore";
import { useMetaStore } from "@/stores/metaStore";
import AppBar from "@/components/ui/AppBar.vue";

export default defineComponent({
	name: "MainStudent",
	data() {
		return {
			editingMat: false,
			dirtyMat: "",
		};
	},
	mixins: [courseIdMixin, eventIdMixin, loadingMixin],
	methods: {
		replaceTitleTokens(str: string) {
			return str
				?.replace(ROUTE_TITLE_COURSE_NAME_TOKEN, this.currentCourse.name)
				?.replace(ROUTE_TITLE_EVENT_NAME_TOKEN, this.currentEvent);
		},
		onShowMatEdit() {
			this.dirtyMat = this.metaStore.user.mat;
			this.editingMat = true;
		},
		async onSaveMat() {
			await this.withLoading(async () =>
				this.metaStore.patchUser({
					userId: this.metaStore.user.id,
					changes: { mat: this.dirtyMat },
				}),
			);
			this.editingMat = false;
			this.metaStore.showSuccessFeedback();
		},
		logOut,
	},
	computed: {
		...mapStores(useMainStore, useMetaStore),
		isDemoMode() {
			return isDemoMode();
		},
		logoUrl() {
			if (!this.isDemoMode) {
				return require("../../../public/unipi-logo.svg");
			}
			return require("../../../public/evo_logo.png");
		},
		// sidebarOptions(): SidebarOption[] {
		// 	return (this.$route.meta?.sidebarOptions ?? []) as SidebarOption[];
		// },
		routeTitle(): string {
			return this.replaceTitleTokens(this.$route.meta.routeTitle as string);
		},
		showSecondaryHeader(): boolean {
			// hide header in routes that have a sidebar
			return !this.$route.matched.map(m => m.name).includes("StudentCourseDashboard");
		},
	},
	components: {
		// ErrorView,
		// SnackBar,
		//BreadCrumbs,
		Dialog,
		NumberInput,
	},
});
</script>

<style>
@-moz-document url-prefix() {
	.bg-fallback-firefox {
		background: rgba(224, 225, 244, 0.9) !important;
	}
}
</style>
