<template>
	<div class="h-full">
		<div></div>
		<!-- main -->
		<div class="flex h-full bg-red space-x-10">
			<!-- sidebar -->
			<SidebarMenu
				class="lg:-ml-20 md:-ml-9"
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
					</div>
				</template>
				<template v-slot:footer v-if="hasAnyPrivileges()">
					<div
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
			<section class="w-full pb-4">
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
	methods: {
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
		};
	},
	computed: {
		...mapState("shared", ["user"]),
		routeTitle(): string {
			return this.replaceTitleTokens(this.$route.meta.routeTitle as string);
		},
		sidebarOptions() {
			return internalSidebarOptionsToSidebarMenuOptions(studentDashboardSidebarOptions);
		},
	},
	components: { BreadCrumbs, SidebarMenu, Avatar, Btn },
});
</script>

<style></style>
