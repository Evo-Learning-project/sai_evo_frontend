<template>
	<div class="relative flex flex-col w-full">
		<HelpCenter
			@startTour="startTour()"
			@close="metaStore.setHelpCenterVisibility(false)"
			v-if="metaStore.helpCenterOpen"
		></HelpCenter>

		<h1 v-if="routeTitle?.length > 0" class="" style="line-height: 1.2">
			{{ routeTitle }}
		</h1>

		<router-view class=""></router-view>

		<!-- <div class="relative flex flex-col flex-no-wrap flex-grow md:flex-row">
			<div class="flex flex-col py-6 lg:px-10 px-4 flex-grow">
				<h1 v-if="routeTitle?.length > 0" class="">
					{{ routeTitle }}
				</h1>

				<ErrorView v-if="!!metaStore.pageWideErrorData"></ErrorView>

				<router-view v-else class="flex-grow"></router-view>

				<transition name="quick-bounce">
					<SnackBar
						class="w-full px-4"
						v-if="metaStore.errorNotificationData"
						:icon="metaStore.errorNotificationData.icon"
						:message="metaStore.errorNotificationData.title"
					/>
				</transition>
			</div>
		</div> -->
	</div>
</template>

<script lang="ts">
import { courseIdMixin, coursePrivilegeMixin, eventIdMixin } from "@/mixins";
import { Course, Event } from "@/models";
import {
	ROUTE_TITLE_COURSE_NAME_TOKEN,
	ROUTE_TITLE_EVENT_NAME_TOKEN,
} from "@/navigation/const";
import { SidebarOption } from "@/navigation/sidebar";
import { isDemoMode, logAnalyticsEvent } from "@/utils";
import { defineComponent } from "@vue/runtime-core";
import ErrorView from "../shared/ErrorView.vue";
import SnackBar from "@/components/ui/SnackBar.vue";
import Btn from "@/components/ui/Btn.vue";
import HelpCenter from "@/components/shared/HelpCenter/HelpCenter.vue";
import { newSidebarHelpCenterTourSteps, teacherTourSteps, tourOptions } from "@/const";
import LocaleSelector from "@/components/ui/LocaleSelector.vue";

import DropdownMenu from "@/components/ui/DropdownMenu.vue";
import { mapStores } from "pinia";
import { useMetaStore } from "@/stores/metaStore";
import { useMainStore } from "@/stores/mainStore";
import AppBar from "@/components/ui/AppBar.vue";

const LOCAL_STORAGE_FIX_SIDEBAR_KEY = "sai_evo_fix_sidebar";

export default defineComponent({
	name: "MainTeacher",
	watch: {
		$route() {
			this.showMobileSidebar = false;
		},
		showMobileSidebar(newVal) {
			if (newVal) {
				document.body.classList.add("overflow-y-hidden");
			} else {
				document.body.classList.remove("overflow-y-hidden");
			}
		},
	},
	mounted() {
		setTimeout(() => {
			this.routerViewPaddingLeft =
				document.getElementById("desktop-nav")?.clientWidth ?? 0;
			const fixSideBar = JSON.parse(
				localStorage.getItem(LOCAL_STORAGE_FIX_SIDEBAR_KEY) ?? "false",
			);
			this.unfixingSideBar = true;
			// TODO adjust all paddings
			this.fixSideBar = true; //!fixSideBar;
			this.$nextTick(() => (this.unfixingSideBar = false));
		}, 1);
		// adjust router view padding and width according to screen size breakpoint
		const mq = window.matchMedia("(min-width: 768px)");
		mq.addEventListener("change", event => (this.mediaQueryMd = mq.matches));
		this.mediaQueryMd = mq.matches;
	},
	data() {
		return {
			showMobileSidebar: false,
			hoveringSidebar: false,
			sideBarHoverHandle: null as null | number,
			fixSideBar: false,
			unfixingSideBar: false,
			routerViewPaddingLeft: 0,
			teacherTourSteps,
			newSidebarHelpCenterTourSteps,
			tourOptions,
			mediaQueryMd: false,
			donateExpanded: false,
		};
	},
	mixins: [courseIdMixin, eventIdMixin, coursePrivilegeMixin],
	methods: {
		startTour() {
			(this.$tours["helpCenterTour"] as any).start();
		},
		isRouteActive(option: SidebarOption) {
			return (
				option.routeName === this.$route.name ||
				option.children?.includes(this.$route.name as string)
			);
		},
		onSideBarHover(event: MouseEvent) {
			if (
				this.sideBarHoverHandle == null &&
				!(event.target as any).className.split(" ").includes("no-hover-sidebar")
			) {
				this.sideBarHoverHandle = setTimeout(() => (this.hoveringSidebar = true), 300);
			}
		},
		onSideBarLeave() {
			if (this.sideBarHoverHandle != null) {
				clearTimeout(this.sideBarHoverHandle);
				this.sideBarHoverHandle = null;
			}
			this.hoveringSidebar = false;
		},
		toggleFixSideBar() {
			if (this.fixSideBar) {
				this.unfixingSideBar = true;
				this.fixSideBar = false;
				this.$nextTick(() => (this.unfixingSideBar = false));
			} else {
				this.fixSideBar = true;
			}
			localStorage.setItem(LOCAL_STORAGE_FIX_SIDEBAR_KEY, String(this.fixSideBar));
		},
		onToggleDonate() {
			if (!this.donateExpanded) {
				logAnalyticsEvent("toggledDonate", {});
			}
			this.donateExpanded = !this.donateExpanded;
		},
	},
	computed: {
		...mapStores(useMetaStore, useMainStore),
		isDemoMode() {
			return isDemoMode();
		},
		allowedSidebarOptions(): SidebarOption[] {
			return ((this.$route.meta?.sidebarOptions ?? []) as SidebarOption[]).filter(o =>
				this.hasPrivileges(o.requiredPrivileges),
			);
		},
		routeTitle(): string {
			return (this.$route.meta.routeTitle as string)
				?.replace(ROUTE_TITLE_COURSE_NAME_TOKEN, this.currentCourse?.name ?? "")
				?.replace(ROUTE_TITLE_EVENT_NAME_TOKEN, this.currentEvent?.name ?? "");
		},
		currentEvent(): Event {
			return this.mainStore.getEventById(this.eventId);
		},
		routerViewStyle() {
			const unfixedSidebarOnMdScreen = !this.fixSideBar && this.mediaQueryMd;
			return {
				...(unfixedSidebarOnMdScreen
					? { width: "97%" }
					: !this.mediaQueryMd
					? { width: "100%" }
					: {}),
				...(unfixedSidebarOnMdScreen
					? {
							"padding-left": this.routerViewPaddingLeft + "30" + "px",
							"padding-right": "30px",
					  }
					: {}),
			};
		},
	},
	components: {
		// ErrorView,
		// SnackBar,
		HelpCenter,
	},
});
</script>

<style>
.sidebar-link-container {
	transition: border-radius 0.2s;
}
</style>
