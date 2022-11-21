<template>
	<div class="h-full">
		<transition name="fade"
			><div
				@click="showMobileSidebar = false"
				class="fixed z-50 w-full h-full opacity-50 bg-dark"
				v-show="showMobileSidebar"
			></div
		></transition>
		<div></div>
		<!-- main -->
		<div class="flex h-full bg-red md:space-x-10">
			<!-- sidebar -->
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
import { defineComponent } from "@vue/runtime-core";
import BreadCrumbs from "@/components/ui/BreadCrumbs.vue";
import {
	ROUTE_TITLE_COURSE_NAME_TOKEN,
	ROUTE_TITLE_EVENT_NAME_TOKEN,
} from "@/navigation/const";
import {
	courseIdMixin,
	coursePrivilegeMixin,
	eventIdMixin,
	adComponentMixin,
} from "@/mixins";
import { mapStores } from "pinia";
import { useMainStore } from "@/stores/mainStore";
import { useMetaStore } from "@/stores/metaStore";
export default defineComponent({
	name: "Main",
	props: {},
	mixins: [courseIdMixin, eventIdMixin, coursePrivilegeMixin, adComponentMixin],
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
		await this.mainStore.getCourseGamificationContext({ courseId: this.courseId });
		if (this.mainStore.gamificationContext) {
			await this.mainStore.getGamificationContextGoals({
				contextId: this.mainStore.gamificationContext.id,
			});
		}
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
			showGamificationPanel: false,
		};
	},
	computed: {
		...mapStores(useMainStore, useMetaStore),
		routeTitle(): string {
			return this.replaceTitleTokens(this.$route.meta.routeTitle as string);
		},
		internalSidebarOptions() {
			return [
				...studentDashboardSidebarOptions.filter(
					r => r.routeName !== "StudentCourseList",
				),
				{
					...studentDashboardSidebarOptions.filter(
						r => r.routeName === "StudentCourseList",
					)[0],
					// override path for course list for teachers so it goes to /teacher/courses
					// instead of /student/courses
					...(this.metaStore.user.is_teacher ? { routeName: "TeacherCourseList" } : {}),
				},
			];
		},
	},
	components: {
		BreadCrumbs,
	},
});
</script>

<style></style>
