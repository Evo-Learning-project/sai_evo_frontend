<template>
	<teleport v-if="showMobileSidebarButton" to="#main-student-nav-right">
		<Btn
			:variant="'icon'"
			:outline="true"
			class="ml-auto md:hidden"
			@click="showMobileSidebar = true"
			><span class="material-icons-outlined text-lightText"> menu </span></Btn
		></teleport
	>
	<div class="h-full">
		<transition name="fade"
			><div
				@click="showMobileSidebar = false"
				class="fixed z-50 w-full h-full opacity-50 bg-dark"
				v-show="showMobileSidebar"
			></div
		></transition>
		<!--Mobile responsive sidebar-->
		<div
			style="z-index: 9999999"
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
				bg-light
			"
			id="mobile-nav"
			:class="{
				'-translate-x-full': !showMobileSidebar,
				'translate-x-0 shadow-all-around': showMobileSidebar,
			}"
		>
			<div class="w-full h-full px-2">
				<div
					class="mobile-sidebar-header p-4 mt-4 rounded bg-primary-light bg-opacity-10"
				>
					<div class="mx-auto flex space-x-2 items-center">
						<Avatar :user="user" :size="'lg'" />
						<div class="flex flex-col">
							<p class="text-sm mb-0">{{ $store.getters["shared/email"] }}</p>
							<p class="text-xs text-muted -mt-0.5">
								{{ $store.state.shared.user?.mat }}
							</p>
						</div>
					</div>
				</div>
				<div class="sidebar-title mt-6">{{ currentCourse.name }}</div>
				<ul class="flex flex-col w-full mt-6 -ml-4">
					<router-link
						class="relative my-1 overflow-hidden w-full"
						v-for="(option, index) in internalSidebarOptions"
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
								pl-5
								py-2.5
								rounded-r-full
								cursor-pointer
								hover:transition-colors
								vsm--link vsm--item
							"
							:class="{
								'vsm--link_active pointer-events-none': isRouteActive(option),
							}"
						>
							<div class="flex items-center space-x-2.5">
								<span class="vsm--icon text-2xl material-icons-outlined">
									{{ option.icon }}
								</span>
								<span class="ml-4 md:inline">{{ option.label }}</span>
							</div>
						</li>
					</router-link>
				</ul>
				<div class="flex w-full mt-6">
					<Btn
						@click="logOut()"
						:variant="'primary'"
						:size="'sm'"
						:outline="true"
						class=""
						><span class="text-lg material-icons-outlined mr-2"> logout </span>
						{{ $t("misc.logout") }}
					</Btn>
				</div>
			</div>
		</div>
		<!-- Sidebar ends -->
		<div></div>
		<!-- main -->
		<div class="flex h-full bg-red md:space-x-10">
			<!-- sidebar -->
			<SidebarMenu
				class="lg:-ml-20 md:-ml-9 hidden md:block"
				:width="sidebarWidth"
				:menu="sidebarOptions"
				:relative="true"
			>
				<template v-slot:header>
					<div class="vsm--header">
						<div class="mx-auto flex space-x-2 items-center">
							<Avatar :user="user" :size="'lg'" />
							<div class="flex flex-col">
								<p class="text-sm mb-0">{{ $store.getters["shared/email"] }}</p>
								<p class="text-xs text-muted -mt-0.5">
									{{ $store.state.shared.user?.mat }}
								</p>
							</div>
						</div>
						<div class="relative flex items-center mt-3 ml-1" v-if="gamificationContext">
							<p class="material-icons mr-1.5 text-primary text-base">auto_awesome</p>
							<p class="font-semibold">{{ gamificationContext?.reputation ?? 0 }}</p>
							<div
								class="flex items-center space-x-1"
								v-if="
									gamificationContext && gamificationContext.leaderboard_position !== null
								"
							>
								<p class="ml-3 material-icons-outlined text-primary text-base">
									leaderboard
								</p>
								<p class="">
									{{ gamificationContext.leaderboard_position }}
								</p>
								<p
									v-if="gamificationContext.leaderboard_position <= 3"
									:class="{
										'text-yellow-400': gamificationContext.leaderboard_position === 1,
										'text-gray-400': gamificationContext.leaderboard_position === 2,
										'text-yellow-900': gamificationContext.leaderboard_position === 3,
									}"
								>
									<svg style="width: 18px; height: 18px" viewBox="0 0 24 24">
										<path
											fill="currentColor"
											d="M5 16L3 5L8.5 10L12 4L15.5 10L21 5L19 16H5M19 19C19 19.6 18.6 20 18 20H6C5.4 20 5 19.6 5 19V18H19V19Z"
										/>
									</svg>
								</p>
							</div>
							<Btn
								:tooltip="showGamificationPanel ? '' : $t('gamification.show_panel')"
								:variant="'icon'"
								@click="showGamificationPanel = !showGamificationPanel"
								:outline="true"
								><span
									style="font-size: 20px !important"
									:class="{
										'material-icons-outlined': !showGamificationPanel,
										'material-icons': showGamificationPanel,
									}"
									>visibility</span
								>

								<!-- 
									<svg style="width: 10rem; height: 10rem" viewBox="0 0 24 24">
										<path
											fill="currentColor"
											d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12C22,10.84 21.79,9.69 21.39,8.61L19.79,10.21C19.93,10.8 20,11.4 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4C12.6,4 13.2,4.07 13.79,4.21L15.4,2.6C14.31,2.21 13.16,2 12,2M19,2L15,6V7.5L12.45,10.05C12.3,10 12.15,10 12,10A2,2 0 0,0 10,12A2,2 0 0,0 12,14A2,2 0 0,0 14,12C14,11.85 14,11.7 13.95,11.55L16.5,9H18L22,5H19V2M12,6A6,6 0 0,0 6,12A6,6 0 0,0 12,18A6,6 0 0,0 18,12H16A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8V6Z"
										/>
									</svg>
								-->
							</Btn>
							<DraggablePopup
								:title="''"
								v-if="showGamificationPanel"
								@close="showGamificationPanel = false"
								:initialTop="160"
								:initialLeft="1"
								:opaque="true"
								:resizable="false"
								:large="true"
							>
								<GamificationContextPanel
									style="margin-top: -34px"
									class="w-full"
									v-if="showGamificationPanel"
								/>
							</DraggablePopup>
						</div>
					</div>
				</template>
				<template v-slot:footer>
					<div
						v-if="hasAnyPrivileges()"
						class="
							mt-4
							flex flex-col
							space-y-1
							items-center
							vsm--footer
							bg-primary-light bg-opacity-5
							px-3
							py-4
						"
						:style="'width: ' + sidebarWidth"
					>
						<p class="mx-auto text-muted text-sm text-center">
							{{ $t("student_course_dashboard.you_are_in_student_mode") }}
						</p>
						<router-link
							class="w-full"
							:to="{
								name: 'TeacherCourseDashboard',
								params: { courseId },
							}"
							><Btn :outline="true" class="w-full">
								<span class="mr-1 text-lg material-icons-two-tone two-tone-primary">
									shield
								</span>
								<span class="text-base md:text-xs xl:text-base 2xl:text-lg">{{
									$t("courses.course_panel")
								}}</span>
							</Btn></router-link
						>
					</div>
				</template>
			</SidebarMenu>
			<!-- main -->
			<section class="w-full pb-4 md:px-0 px-4">
				<div class="mb-8 mt-4">
					<h2 class="mb-0">{{ routeTitle }}</h2>
					<BreadCrumbs :route="$route" />
				</div>
				<router-view />
			</section>
		</div>
	</div>
</template>

<script lang="ts">
const SIDEBAR_WIDTH_EXPANDED = "270px";
import { logOut } from "@/utils";

import { SidebarOption, studentDashboardSidebarOptions } from "@/navigation/sidebar";
import { defineComponent, PropType } from "@vue/runtime-core";
import BreadCrumbs from "@/components/ui/BreadCrumbs.vue";
import {
	ROUTE_TITLE_COURSE_NAME_TOKEN,
	ROUTE_TITLE_EVENT_NAME_TOKEN,
} from "@/navigation/const";
import { courseIdMixin, coursePrivilegeMixin, eventIdMixin } from "@/mixins";
import { SidebarMenu } from "vue3-sidebar-menu";
import "vue3-sidebar-menu/dist/vue-sidebar-menu.css";
import { internalSidebarOptionsToSidebarMenuOptions } from "@/navigation/utils";
import Avatar from "@/components/ui/Avatar.vue";
import { mapState, mapActions } from "vuex";
import Btn from "@/components/ui/Btn.vue";
import { Course } from "@/models";
import GamificationContextPanel from "@/components/student/GamificationContextPanel.vue";
import DraggablePopup from "@/components/ui/DraggablePopup.vue";
export default defineComponent({
	name: "Main",
	props: {},
	mixins: [courseIdMixin, eventIdMixin, coursePrivilegeMixin],
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
	async created() {
		await this.getCourseGamificationContext({ courseId: this.courseId });
		if (this.gamificationContext) {
			await this.getGamificationContextGoals({ contextId: this.gamificationContext.id });
		}
	},
	mounted() {
		this.showMobileSidebarButton = true;
	},
	methods: {
		logOut,
		...mapActions("shared", [
			"getCourseGamificationContext",
			"getGamificationContextGoals",
		]),
		isRouteActive(option: SidebarOption) {
			return (
				option.routeName === this.$route.name ||
				option.children?.includes(this.$route.name as string)
			);
		},
		replaceTitleTokens(str: string) {
			return str
				?.replace(ROUTE_TITLE_COURSE_NAME_TOKEN, this.currentCourse.name)
				?.replace(ROUTE_TITLE_EVENT_NAME_TOKEN, this.currentEvent);
		},
	},
	data() {
		return {
			sidebarWidth: SIDEBAR_WIDTH_EXPANDED,
			showMobileSidebar: false,
			showMobileSidebarButton: false,
			showGamificationPanel: false,
		};
	},
	computed: {
		...mapState("shared", ["user", "gamificationContext", "gamificationGoals"]),
		routeTitle(): string {
			return this.replaceTitleTokens(this.$route.meta.routeTitle as string);
		},
		internalSidebarOptions() {
			return studentDashboardSidebarOptions;
		},
		sidebarOptions() {
			return [
				{ header: this.currentCourse.name },
				...internalSidebarOptionsToSidebarMenuOptions(studentDashboardSidebarOptions),
			];
		},
	},
	components: {
		BreadCrumbs,
		SidebarMenu,
		Avatar,
		Btn,
		GamificationContextPanel,
		DraggablePopup,
	},
});
</script>

<style></style>
