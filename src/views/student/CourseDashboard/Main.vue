<template>
	<div class="h-full">
		<div></div>
		<!-- main -->
		<div class="flex h-full bg-red space-x-10">
			<!-- sidebar -->
			<SidebarMenu
				class="lg:-ml-20 md:-ml-9"
				:width="'250px'"
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
			</SidebarMenu>
			<!-- <section class="h-full relative bg-light lg:-ml-20 -mt-6 w-1/5">
				<div class="sticky top-10 py-4 rounded pr-4">
					<div class="h-full">
						<ul class="flex flex-col w-full h-full mt-6">
							<router-link
								v-wave="{
									color: '#303f9f',
								}"
								class="relative overflow-hidden rounded-r-full"
								v-for="(option, index) in sidebarOptions"
								:key="'sidebar-' + option.label"
								:to="{ name: option.routeName }"
								:class="{
									'pl-1.25px': true,
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
										'md:w-full': true,
										'rounded-r-full pl-5 -ml-1.25px': true,
										'bg-primary-light bg-opacity-30 pointer-events-none':
											isRouteActive(option),
									}"
								>
									<div class="flex items-center space-x-2.5">
										<span
											:class="[
												'text-2xl  material-icons-outlined',
												isRouteActive(option)
													? 'text-primary'
													: 'opacity-60 text-darkText',
											]"
										>
											{{ option.icon }}
										</span>
										<transition name="fade-quick">
											<span
												v-show="true"
												class="ml-4 whitespace-pre sidebar-link-label"
												:class="{
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
			</section> -->
			<!-- main -->
			<section class="w-full">
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
import { SidebarOption, studentDashboardSidebarOptions } from "@/navigation/sidebar";
import { defineComponent, PropType } from "@vue/runtime-core";
import BreadCrumbs from "@/components/ui/BreadCrumbs.vue";
import {
	ROUTE_TITLE_COURSE_NAME_TOKEN,
	ROUTE_TITLE_EVENT_NAME_TOKEN,
} from "@/navigation/const";
import { courseIdMixin, eventIdMixin } from "@/mixins";
import { SidebarMenu } from "vue-sidebar-menu";
import "vue-sidebar-menu/dist/vue-sidebar-menu.css";
import { internalSidebarOptionsToSidebarMenuOptions } from "@/navigation/utils";
import Avatar from "@/components/ui/Avatar.vue";
import { mapState } from "vuex";
export default defineComponent({
	name: "Main",
	props: {},
	mixins: [courseIdMixin, eventIdMixin],
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
			//sidebarOptions: studentDashboardSidebarOptions,
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
	components: { BreadCrumbs, SidebarMenu, Avatar },
});
</script>

<style></style>
