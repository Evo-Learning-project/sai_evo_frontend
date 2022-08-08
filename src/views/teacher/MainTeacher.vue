<template>
	<div class="relative flex flex-col flex-grow">
		<HelpCenter @startTour="startTour()" @close="setHelpCenterVisibility(false)" v-if="helpCenterOpen"></HelpCenter>
		<nav
			style="z-index: 100"
			class="
				sticky
				hidden
				md:block
				top-0
				py-0.5
				md:px-12
				bg-primary
				px-4
				shadow-elevation
				mx-auto
				sm:px-6
				lg:px-8
				w-full
			"
		>
			<div class="flex items-center h-14 z-999">
				<div class="flex items-center mt-4 mb-4 -ml-4.5">
					<Btn
						id="toggle-sidebar"
						:tooltip="fixSideBar ? $t('misc.unfix_sidebar') : $t('misc.fix_sidebar')"
						:variant="'icon'"
						:outline="true"
						@click="toggleFixSideBar()"
						class="hidden lg:block"
					>
						<span class="text-gray-200 material-icons-outlined">{{ fixSideBar ? "menu_open" : "menu" }}</span>
					</Btn>
				</div>
				<div class="flex items-center mr-auto lg:ml-10">
					<img class="w-32 -ml-1" src="../../../public/unipi-logo.svg" />
				</div>
				<div class="">
					<div v-if="$store.getters['shared/isAuthenticated']" class="flex items-center ml-4 md:ml-6">
						<LocaleSelector v-if="false"></LocaleSelector>
						<Btn
							:tooltip="$t('help.help_guide_label')"
							@click="setHelpCenterVisibility(true)"
							id="help-center"
							:variant="'icon'"
							:outline="true"
							><span class="text-lg text-lightText material-icons-outlined"> help_outline </span></Btn
						>
						<p class="ml-4 mr-1 text-xs text-lightText md:text-base">
							{{ $store.getters["shared/email"] }}
						</p>
						<p @click="onShowMatEdit" class="hidden text-xs cursor-pointer md:block text-lightText md:text-sm">
							{{ $store.state.shared.user?.mat }}
						</p>
						<Btn :tooltip="$t('misc.logout')" @click="logOut()" :variant="'icon'" :outline="true"
							><span class="text-lg text-lightText material-icons-outlined"> logout </span></Btn
						>
					</div>
				</div>
			</div>
		</nav>
		<div class="relative flex flex-col flex-no-wrap flex-grow md:flex-row">
			<transition name="fade"
				><div
					@click="showMobileSidebar = false"
					class="absolute z-50 w-full h-full opacity-50 bg-dark"
					v-show="showMobileSidebar"
				></div
			></transition>
			<!-- bg-gray-500 -->
			<nav
				style="z-index: 999"
				class="sticky top-0 flex items-center w-full px-3 py-2 shadow-elevation-2 md:hidden bg-primary"
			>
				<img class="w-32" src="../../../public/unipi-logo.svg" />
				<Btn :variant="'icon'" :outline="true" class="ml-auto" @click="showMobileSidebar = true"
					><span class="material-icons-outlined text-lightText"> menu </span></Btn
				>
			</nav>
			<!-- Sidebar starts -->
			<!-- FIXME review shadow here and in the other two spots in this file -->
			<div
				:style="'' + (hoveringSidebar && !fixSideBar ? 'box-shadow: 2px 5px 5px rgba(0, 0, 0, 0.3); z-index: 50' : '')"
				class="flex-col hidden h-full md:block bg-light"
				:class="{
					'absolute top-0': true || !fixSideBar,
					'w-18': !hoveringSidebar && !fixSideBar,
					'lg:w-2/12 w-4/12 hovering-sidebar': hoveringSidebar || fixSideBar,
					'transition-width duration-200 ease-in-out': !unfixingSideBar,
				}"
				id="desktop-nav"
			>
				<div class="fixed h-full pr-2" style="width: inherit; z-index: 100">
					<div class="h-full" @mouseover="onSideBarHover($event)" @mouseleave="onSideBarLeave()">
						<transition name="fade-quick">
							<div
								:class="[hoveringSidebar || fixSideBar ? 'opacity-100' : 'opacity-0']"
								class="flex items-center hidden w-full pl-10 pr-8 mt-4 overflow-visible whitespace-pre"
							>
								<img class="w-36" src="../../../public/unipi-logo.svg" /></div
						></transition>

						<transition name="fade-quick">
							<div
								v-if="false && $store.getters['shared/isAuthenticated']"
								:class="[hoveringSidebar || fixSideBar ? 'opacity-100' : 'opacity-0']"
								class="
									flex
									items-center
									justify-center
									w-full
									pl-2
									mx-auto
									mt-8
									mb-4
									space-x-1
									text-sm
									whitespace-pre
									text-light
								"
							>
								<p>{{ $store.getters["shared/email"] }}</p>
								<Btn @click="logOut()" :variant="'icon'" :outline="true"
									><span class="text-lg text-lightText material-icons-outlined"> logout </span></Btn
								>
							</div></transition
						>
						<ul class="flex flex-col w-full h-full mt-6">
							<router-link
								v-wave="{
									color: '#303f9f',
								}"
								class="relative overflow-hidden rounded-r-full"
								v-for="(option, index) in allowedSidebarOptions"
								:key="'sidebar-' + option.label"
								:to="{ name: option.routeName }"
								:class="{
									'mt-auto mb-44': false && index == sidebarOptions.length - 1,
									'pl-1.25px': true || (!hoveringSidebar && !fixSideBar),
								}"
							>
								<li
									:id="'sidebar-option-' + index"
									style="padding-top: 11px; padding-bottom: 11px"
									class="
										flex
										items-center
										justify-between
										px-4
										cursor-pointer
										sidebar-link-container
										hover:transition-colors
										text-darkText
										hover:bg-primary-light hover:bg-opacity-10 hover:duration-100
									"
									:class="{
										'md:w-full': true || !fixSideBar,
										'md:w-11/12': false && fixSideBar,
										'rounded-r-full pl-5 -ml-1.25px': hoveringSidebar || fixSideBar,
										'rounded-full ml-1': !hoveringSidebar && !fixSideBar,
										'bg-primary-light bg-opacity-30 pointer-events-none': isRouteActive(option),
									}"
								>
									<div class="flex items-center space-x-2.5">
										<span
											:class="[
												'text-2xl  material-icons-outlined',
												isRouteActive(option) ? 'text-primary' : 'opacity-60 text-darkText',
											]"
										>
											{{ option.icon }}
										</span>
										<transition name="fade-quick">
											<span
												v-show="hoveringSidebar || fixSideBar"
												class="ml-4 whitespace-pre sidebar-link-label"
												:class="{
													'delay-0': hoveringSidebar,
													'text-primary font-semibold': isRouteActive(option),
													'opacity-80': !isRouteActive(option),
												}"
												>{{ option.label }}</span
											></transition
										>
									</div>
								</li>
							</router-link>
						</ul>
					</div>
				</div>
			</div>
			<!--Mobile responsive sidebar-->
			<div
				style="z-index: 99999"
				class="
					fixed
					flex-col
					justify-between
					block
					w-9/12
					h-full
					overflow-y-auto
					transition-transform
					duration-300
					ease-in-out
					transform
					md:hidden
					bg-primary
				"
				id="mobile-nav"
				:class="{
					'-translate-x-full': !showMobileSidebar,
					'translate-x-0 shadow-all-around': showMobileSidebar,
				}"
			>
				<div class="w-full h-full px-2">
					<div class="flex items-center w-full mt-4">
						<img class="mx-auto w-36" src="../../../public/unipi-logo.svg" />
					</div>
					<div
						v-if="$store.getters['shared/isAuthenticated']"
						class="flex items-center justify-center w-full mx-auto mt-8 mb-4 space-x-1 text-sm text-light"
					>
						<p>{{ $store.getters["shared/email"] }}</p>
						<Btn @click="logOut()" :variant="'icon'" :outline="true"
							><span class="text-lg text-lightText material-icons-outlined"> logout </span></Btn
						>
					</div>
					<ul class="flex flex-col w-full h-full mt-6">
						<router-link
							class="relative my-1 overflow-hidden rounded-md"
							v-for="(option, index) in allowedSidebarOptions"
							:key="'sidebar-' + option.label"
							:to="{ name: option.routeName }"
							:class="{
								'mt-auto mb-44': false && index == sidebarOptions.length - 1,
							}"
						>
							<li
								:id="'sidebar-option-' + index"
								class="
									flex
									items-center
									justify-between
									w-full
									px-3
									md:px-2
									py-2.5
									rounded-md
									cursor-pointer
									hover:transition-colors
									text-lightText
									hover:bg-primary-dark hover:duration-100
								"
								:class="{
									'bg-primary-dark pointer-events-none': isRouteActive(option),
								}"
							>
								<div class="flex items-center space-x-2.5">
									<span class="text-2xl text-gray-200 material-icons-outlined opacity-80">
										{{ option.icon }}
									</span>
									<span class="ml-4 md:inline">{{ option.label }}</span>
								</div>
							</li>
						</router-link>
					</ul>
				</div>
			</div>
			<!-- Sidebar ends -->

			<!-- Desktop -->
			<div
				class="flex flex-col py-6"
				:style="
					!fixSideBar && mediaQueryMd
						? 'width: 97%; padding-left: ' + Math.max(routerViewPaddingLeft + 30, 100) + 'px; padding-right: 30px'
						: (fixSideBar && mediaQueryMd
								? 'padding-left: calc(16.66667% + 30px); width: 100%; padding-right: 30px'
								: '') + (!mediaQueryMd ? 'width: 100%; padding-left: 12px; padding-right: 12px' : '')
				"
				:class="{
					// TODO REMOVE
					'mx-auto px-2': !fixSideBar,
					'md:w-10/12 mx-auto md:px-10': fixSideBar,
				}"
			>
				<h1 v-if="routeTitle?.length > 0" class="">
					{{ routeTitle }}
				</h1>
				<ErrorView v-if="!!$store.state.shared.pageWideErrorData"></ErrorView>
				<router-view v-else class="flex-grow"></router-view>
				<transition name="quick-bounce"
					><SnackBar
						class="w-full px-4"
						v-if="$store.state.shared.errorNotificationData"
						:icon="$store.state.shared.errorNotificationData.icon"
						:message="$store.state.shared.errorNotificationData.title"
					></SnackBar
				></transition>
			</div>
		</div>
		<v-tour name="helpCenterTour" :steps="teacherTourSteps" :options="tourOptions"></v-tour>
		<v-tour name="newSideBarTour" :steps="newSidebarHelpCenterTourSteps" :options="tourOptions"></v-tour>
	</div>
</template>

<script lang="ts">
import { courseIdMixin, coursePrivilegeMixin, eventIdMixin } from "@/mixins";
import { Course, Event } from "@/models";
import { ROUTE_TITLE_COURSE_NAME_TOKEN, ROUTE_TITLE_EVENT_NAME_TOKEN } from "@/navigation/const";
import { SidebarOption } from "@/navigation/sidebar";
import { logOut } from "@/utils";
import { defineComponent } from "@vue/runtime-core";
import ErrorView from "../shared/ErrorView.vue";
import SnackBar from "@/components/ui/SnackBar.vue";
import Btn from "@/components/ui/Btn.vue";
import HelpCenter from "@/components/shared/HelpCenter/HelpCenter.vue";
import { newSidebarHelpCenterTourSteps, teacherTourSteps, tourOptions } from "@/const";
import LocaleSelector from "@/components/ui/LocaleSelector.vue";

import { createNamespacedHelpers } from "vuex";
const { mapMutations, mapState } = createNamespacedHelpers("shared");

const LOCAL_STORAGE_FIX_SIDEBAR_KEY = "sai_evo_fix_sidebar";
const LOCAL_STORAGE_HAS_TAKEN_SIDEBAR_TOUR_KEY = "has_taken_sidebar_tour";

export default defineComponent({
	name: "MainTeacher",
	watch: {
		$route() {
			this.showMobileSidebar = false;
		},
	},
	mounted() {
		setTimeout(() => {
			this.routerViewPaddingLeft = document.getElementById("desktop-nav")?.clientWidth ?? 0;
			const fixSideBar = JSON.parse(localStorage.getItem(LOCAL_STORAGE_FIX_SIDEBAR_KEY) ?? "false");
			this.unfixingSideBar = true;
			this.fixSideBar = fixSideBar;
			this.$nextTick(() => (this.unfixingSideBar = false));
		}, 1);

		if (!JSON.parse(localStorage.getItem(LOCAL_STORAGE_HAS_TAKEN_SIDEBAR_TOUR_KEY) ?? "false")) {
			setTimeout(() => {
				(this.$tours["newSideBarTour"] as any).start();
				localStorage.setItem(LOCAL_STORAGE_HAS_TAKEN_SIDEBAR_TOUR_KEY, "true");
			}, 500);
		}

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
		};
	},
	mixins: [courseIdMixin, eventIdMixin, coursePrivilegeMixin],
	methods: {
		...mapMutations(["setHelpCenterVisibility"]),
		logOut,
		startTour() {
			(this.$tours["helpCenterTour"] as any).start();
		},
		isRouteActive(option: SidebarOption) {
			return option.routeName === this.$route.name || option.children?.includes(this.$route.name as string);
		},
		onSideBarHover(event: MouseEvent) {
			if (this.sideBarHoverHandle == null && !(event.target as any).className.split(" ").includes("no-hover-sidebar")) {
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
	},
	computed: {
		...mapState(["helpCenterOpen"]),
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
			return this.$store.getters["teacher/event"](this.eventId);
		},
		routerViewStyle() {
			const unfixedSidebarOnMdScreen = !this.fixSideBar && this.mediaQueryMd;
			return {
				...(unfixedSidebarOnMdScreen ? { width: "97%" } : !this.mediaQueryMd ? { width: "100%" } : {}),
				...(unfixedSidebarOnMdScreen
					? {
							"padding-left": this.routerViewPaddingLeft + "30" + "px",
							"padding-right": "30px",
					  }
					: {}),
			};
		},
	},
	components: { ErrorView, SnackBar, Btn, HelpCenter, LocaleSelector },
});
</script>

<style>
.sidebar-link-container {
	transition: border-radius 0.2s;
}
</style>
