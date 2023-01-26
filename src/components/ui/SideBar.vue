<template>
	<!-- desktop -->
	<div
		:style="
			'' +
			(hovering && !!collapsed
				? 'box-shadow: 2px 5px 5px rgba(0, 0, 0, 0.3); z-index: 50'
				: '')
		"
		class="flex-col hidden h-full md:block bg-light"
		:class="{
			'absolute top-0': true || !!collapsed,
			'w-18': !hovering && !!collapsed,
			'lg:w-2/12 w-4/12 hovering-sidebar': hovering || !collapsed,
			'transition-width duration-200 ease-in-out': !initializing,
		}"
		id="desktop-nav"
	>
		<div class="fixed h-full pr-2" style="width: inherit; z-index: 100">
			<div
				class="h-full"
				@mouseover="onSideBarHover($event)"
				@mouseleave="onSideBarLeave()"
			>
				<!-- <transition name="fade-quick">
					<div
						:class="[hovering || !collapsed ? 'opacity-100' : 'opacity-0']"
						class="
							flex
							items-center
							w-full
							pl-10
							pr-8
							mt-4
							overflow-visible
							whitespace-pre
						"
					>
						<img :class="[isDemoMode ? 'w-40' : 'w-32']" :src="logoUrl" /></div
				></transition> -->

				<!-- <template v-slot:header>
						<slot name="header"></slot>
					</template>
					<template v-slot:footer>
						<slot name="footer"></slot>
					</template> -->

				<div v-if="header" class="mx-5 mt-6 overflow-hidden">
					<h5
						:title="header"
						style="text-overflow: ellipsis; white-space: nowrap; max-width: 500px"
						class="mb-0 overflow-hidden"
					>
						{{ header }}
					</h5>
				</div>

				<div class="mx-5 mt-6 overflow-hidden" v-if="$slots.header?.()">
					<slot name="header"></slot>
				</div>

				<ul class="flex flex-col w-full mt-6" :class="{ 'h-full': !$slots.footer?.() }">
					<router-link
						v-wave="{
							color: '#6a16f0',
						}"
						class="relative overflow-hidden rounded-r-full"
						v-for="(option, index) in sidebarOptions"
						:key="'sidebar-' + option.label"
						:to="{ name: option.routeName }"
						:class="{
							'mt-auto mb-44': false && index == sidebarOptions.length - 1,
							'pl-1.25px': true || (!hovering && !!collapsed),
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
								'md:w-full': true || !!collapsed,
								'md:w-11/12': false && !collapsed,
								'rounded-r-full pl-5 -ml-1.25px': hovering || !collapsed,
								'rounded-full ml-1': !hovering && !!collapsed,
								'bg-primary-light bg-opacity-20 pointer-events-none':
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
										v-show="hovering || !collapsed"
										class="ml-4 whitespace-pre sidebar-link-label"
										:class="{
											'delay-0': hovering,
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
				<transition name="fade">
					<div
						class="mt-6 ml-2 overflow-visible"
						v-if="(hovering || !collapsed) && $slots.footer?.()"
					>
						<slot name="footer"></slot>
					</div>
				</transition>
			</div>
		</div>
	</div>
	<!-- end desktop -->

	<!-- mobile -->
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
			<div class="mobile-sidebar-header mt-4 rounded">
				<div class="mx-auto flex space-x-2 items-center">
					<Avatar :user="metaStore.user" :size="'lg'" />
					<div class="flex flex-col">
						<p class="text-sm mb-0">{{ metaStore.email }}</p>
						<!-- <p class="text-xs text-muted -mt-0.5">
							{{ metaStore.user.mat }}
						</p> -->
					</div>
				</div>
			</div>

			<div class="mt-3 ml-1.5 overflow-hidden" v-if="$slots.header?.()">
				<slot name="header"></slot>
			</div>

			<!-- <div class="sidebar-title mt-6">{{ currentCourse.name }}</div> -->
			<ul class="flex flex-col w-full mt-6 -ml-4">
				<router-link
					class="relative my-1 overflow-hidden w-full"
					v-for="(option, index) in sidebarOptions"
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
							'bg-primary-light bg-opacity-20 text-primary shadow-none pointer-events-none':
								isRouteActive(option),
						}"
					>
						<div class="flex items-center space-x-2.5">
							<span
								class="text-2xl material-icons-outlined"
								:class="{ 'text-primary': isRouteActive(option) }"
							>
								{{ option.icon }}
							</span>
							<span class="ml-4 md:inline">{{ option.label }}</span>
						</div>
					</li>
				</router-link>
			</ul>
			<div class="mt-6 ml-2 overflow-visible" v-if="$slots.footer?.()">
				<slot name="footer"></slot>
			</div>
			<div class="flex w-full mt-6">
				<Btn
					@click="$emit('logout')"
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

	<transition name="fade">
		<div
			@click="$emit('toggleMobileSidebar')"
			v-if="showMobileSidebar"
			class="absolute z-50 w-full h-full opacity-50 bg-dark"
			style=""
		></div>
	</transition>
	<!-- </div> -->
</template>

<script lang="ts">
const DESKTOP_SIDEBAR_WIDTH_EXPANDED = "270px";

import { SidebarOption } from "@/navigation/sidebar";
import { defineComponent, PropType } from "@vue/runtime-core";
import Avatar from "./Avatar.vue";
import Btn from "./Btn.vue";

export default defineComponent({
	name: "SideBar",
	props: {
		header: {
			type: String,
			default: "",
		},
		sidebarOptions: {
			type: Array as PropType<SidebarOption[]>,
			required: true,
		},
		showMobileSidebar: {
			type: Boolean,
			default: true,
		},
		collapsed: {
			type: Boolean,
			required: true,
		},
		initializing: {
			type: Boolean,
			required: false,
		},
	},
	setup() {
		// TODO temporary workaround for a werid issue: if use import like this:
		//import { useMainStore } from "./stores/mainStore";
		// the app won't render as useMainStore will be undefined in other components; investigate
		const useMetaStore = require("../../stores/metaStore").useMetaStore;
		const metaStore = useMetaStore();
		return {
			metaStore,
		};
	},
	data() {
		return {
			desktopSidebarWidth: DESKTOP_SIDEBAR_WIDTH_EXPANDED,
			hovering: false,
			hoverHandle: null as null | number,
		};
	},
	methods: {
		onSideBarHover(event: MouseEvent) {
			if (
				this.hoverHandle == null &&
				!(event.target as any).className.split(" ").includes("no-hover-sidebar")
			) {
				this.hoverHandle = setTimeout(() => (this.hovering = true), 300);
			}
		},
		onSideBarLeave() {
			if (this.hoverHandle != null) {
				clearTimeout(this.hoverHandle);
				this.hoverHandle = null;
			}
			this.hovering = false;
		},
		isRouteActive(option: SidebarOption) {
			return (
				option.routeName === this.$route.name ||
				option.children?.includes(this.$route.name as string)
			);
		},
	},

	components: {
		Btn,
		Avatar,
	},
});
</script>

<style></style>
