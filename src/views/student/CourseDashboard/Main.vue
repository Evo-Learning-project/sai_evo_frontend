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
				class="absolute z-50 w-full h-full opacity-50 bg-dark"
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
				<!-- <div class="flex items-center w-full mt-4">
					<img class="mx-auto w-36" src="../../../../public/unipi-logo.svg" />
				</div> -->
				<!-- <div
					v-if="$store.getters['shared/isAuthenticated']"
					class="
						flex
						items-center
						justify-center
						w-full
						mx-auto
						mt-8
						mb-4
						space-x-1
						text-sm text-light
					"
				>
					<p>{{ $store.getters["shared/email"] }}</p>
					<Btn @click="logOut()" :variant="'icon'" :outline="true"
						><span class="text-lg text-lightText material-icons-outlined">
							logout
						</span></Btn
					>
				</div> -->
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
				<template v-slot:header
					><div class="vsm--header">
						<div class="mx-auto flex space-x-2 items-center">
							<Avatar :user="user" :size="'lg'" />
							<div class="flex flex-col">
								<p class="text-sm mb-0">{{ $store.getters["shared/email"] }}</p>
								<p class="text-xs text-muted -mt-0.5">
									{{ $store.state.shared.user?.mat }}
								</p>
							</div>
						</div>
						<!-- <div class="flex w-full">
							<Btn
								@click="logOut()"
								:variant="'icon'"
								:size="'sm'"
								:outline="true"
								class="ml-auto"
								:tooltip="$t('misc.logout')"
								><span style="font-size: 18px !important" class="material-icons-outlined">
									logout
								</span>
							</Btn>
						</div> -->
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
import { mapState } from "vuex";
import Btn from "@/components/ui/Btn.vue";
export default defineComponent({
	name: "Main",
	props: {},
	mixins: [courseIdMixin, eventIdMixin, coursePrivilegeMixin],
	watch: {
		$route() {
			this.showMobileSidebar = false;
		},
	},
	mounted() {
		this.showMobileSidebarButton = true;
	},
	methods: {
		logOut,
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
		};
	},
	computed: {
		...mapState("shared", ["user"]),
		routeTitle(): string {
			return this.replaceTitleTokens(this.$route.meta.routeTitle as string);
		},
		internalSidebarOptions() {
			return studentDashboardSidebarOptions;
		},
		sidebarOptions() {
			return internalSidebarOptionsToSidebarMenuOptions(studentDashboardSidebarOptions);
		},
	},
	components: { BreadCrumbs, SidebarMenu, Avatar, Btn },
});
</script>

<style></style>
