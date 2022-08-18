<template>
	<div class="flex flex-col flex-grow">
		<nav
			:class="{ sticky: !showSecondaryHeader }"
			class="shadow-elevation py-0.5 md:px-2 top-0 lg:px-12 bg-primary"
			style="z-index: 999999"
		>
			<div class="px-4 mx-auto sm:px-6 lg:px-8">
				<div class="flex items-center justify-between h-14">
					<div class="flex items-center">
						<div class="flex-shrink-0">
							<img class="w-32 -ml-1" src="../../../public/unipi-logo.svg" />
						</div>
					</div>
					<div v-if="!$route.meta.hideUserInfoFromNav" class="">
						<div
							v-if="$store.getters['shared/isAuthenticated']"
							class="flex items-center ml-4 space-x-2 md:ml-6"
						>
							<p class="text-xs text-lightText md:text-base">
								{{ $store.getters["shared/email"] }}
							</p>
							<p
								@click="onShowMatEdit"
								class="hidden text-xs cursor-pointer md:block text-lightText md:text-sm"
							>
								{{ $store.state.shared.user?.mat }}
							</p>
							<Btn @click="logOut()" :variant="'icon'" :outline="true"
								><span class="text-lg text-lightText material-icons-outlined">
									logout
								</span></Btn
							>
						</div>
					</div>
					<div class="ml-auto md:hidden" id="main-student-nav-right"></div>
				</div>
			</div>
		</nav>
		<header
			v-if="showSecondaryHeader"
			class="
				sticky
				top-0
				z-50
				mb-6
				shadow
				bg-light bg-opacity-100 bg-fallback-firefox
				md:px-2
				backdrop-blur-sm backdrop-filter
			"
		>
			<div
				class="flex bg-light w-full px-4 py-4 mx-auto md:items-center sm:px-18 lg:px-20"
			>
				<div class="md:items-center md:flex-row">
					<h2 class="mb-0 text-lg md:mr-6 md:text-2xl">
						{{ routeTitle }}
					</h2>
					<BreadCrumbs
						v-if="!$route.meta.hideBreadcrumbs"
						:route="$route"
						class="mt-1 ml-2 md:ml-0"
					></BreadCrumbs>
				</div>
				<div class="flex ml-auto md:w-80">
					<div class="ml-auto" id="main-student-header-right"></div>
				</div>
			</div>
		</header>
		<main class="flex-grow bg-white md:px-8 lg:px-12">
			<div class="h-full mx-auto lg:px-8" :class="{ 'px-4': showSecondaryHeader }">
				<ErrorView v-if="!!$store.state.shared.pageWideErrorData"></ErrorView>
				<router-view class="" v-else />
				<transition name="quick-bounce"
					><SnackBar
						class="w-full px-4"
						v-if="$store.state.shared.errorNotificationData"
						:icon="$store.state.shared.errorNotificationData.icon"
						:message="$store.state.shared.errorNotificationData.title"
					></SnackBar
				></transition>
			</div>
		</main>
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
import { logOut } from "@/utils";
import Dialog from "@/components/ui/Dialog.vue";
import { createNamespacedHelpers } from "vuex";
import NumberInput from "@/components/ui/NumberInput.vue";
const { mapState, mapActions } = createNamespacedHelpers("shared");

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
		...mapActions(["updateUser"]),
		replaceTitleTokens(str: string) {
			return str
				?.replace(ROUTE_TITLE_COURSE_NAME_TOKEN, this.currentCourse.name)
				?.replace(ROUTE_TITLE_EVENT_NAME_TOKEN, this.currentEvent);
		},
		onShowMatEdit() {
			this.dirtyMat = this.user.mat;
			this.editingMat = true;
		},
		async onSaveMat() {
			await this.withLoading(async () =>
				this.updateUser({
					userId: this.user.id,
					changes: { mat: this.dirtyMat },
				}),
			);
			this.editingMat = false;
			this.$store.commit("shared/showSuccessFeedback");
		},
		logOut,
	},
	computed: {
		...mapState(["user"]),
		sidebarOptions(): SidebarOption[] {
			return (this.$route.meta?.sidebarOptions ?? []) as SidebarOption[];
		},
		routeTitle(): string {
			return this.replaceTitleTokens(this.$route.meta.routeTitle as string);
		},
		showSecondaryHeader(): boolean {
			// hide header in routes that have a sidebar
			return !this.$route.matched.map(m => m.name).includes("StudentCourseDashboard");
		},
	},
	components: { ErrorView, SnackBar, BreadCrumbs, Btn, Dialog, NumberInput },
});
</script>

<style>
@-moz-document url-prefix() {
	.bg-fallback-firefox {
		background: rgba(224, 225, 244, 0.9) !important;
	}
}
</style>
