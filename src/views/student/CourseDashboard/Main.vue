<template>
	<div class="h-full">
		<div></div>
		<!-- main -->
		<div class="flex h-full space-x-10">
			<!-- sidebar -->
			<section class="h-full lg:-ml-18 w-1/5">
				<div class="h-full py-4 bg-light rounded pr-4">
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
											isRouteActive(option) ? 'text-primary' : 'opacity-60 text-darkText',
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
			</section>
			<!-- main -->
			<section class="w-full">
				<router-view />
			</section>
		</div>
	</div>
</template>

<script lang="ts">
import { SidebarOption } from "@/navigation/sidebar";
import { defineComponent, PropType } from "@vue/runtime-core";
import { studentDashboardSidebarOptions } from "./const";
export default defineComponent({
	name: "Main",
	props: {},
	methods: {
		isRouteActive(option: SidebarOption) {
			return (
				option.routeName === this.$route.name ||
				option.children?.includes(this.$route.name as string)
			);
		},
	},
	data() {
		return {
			sidebarOptions: studentDashboardSidebarOptions,
		};
	},
	computed: {},
});
</script>

<style></style>
