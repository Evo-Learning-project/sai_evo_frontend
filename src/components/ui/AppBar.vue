<template>
	<nav
		style="z-index: 1000"
		:class="{ sticky: sticky }"
		class="
			top-0
			py-0.5
			md:px-12
			text-gray-700
			bg-white
			px-4
			shadow-elevation
			mx-auto
			sm:px-6
			lg:px-8
			w-full
		"
	>
		<div class="flex items-center h-14 z-999">
			<div
				v-if="showCollapseSideBarButton"
				class="flex items-center mt-4 mb-4 hidden lg:block -ml-4.5 mr-8"
			>
				<Btn
					id="toggle-sidebar"
					:tooltip="!sidebarCollapsed ? $t('misc.unfix_sidebar') : $t('misc.fix_sidebar')"
					:variant="'icon'"
					:outline="true"
					@click="$emit('toggleSidebarCollapsed')"
					class="hidden lg:block"
				>
					<span class="material-icons-outlined">{{
						!sidebarCollapsed ? "menu_open" : "menu"
					}}</span>
				</Btn>
			</div>
			<div class="flex items-center mr-auto">
				<img class="w-60 -ml-1" :src="logoUrl" />
			</div>
			<div class="">
				<div v-if="metaStore.isAuthenticated" class="flex items-center ml-4 md:ml-6">
					<!-- <Btn :variant="'icon'" :outline="true"
							><span class="material-icons-outlined">brightness_4</span></Btn
						> -->
					<LocaleSelector v-if="false && showLocaleSelector"></LocaleSelector>
					<DropdownMenu
						:placement="'left'"
						class="text-lightText"
						:expanded="donateExpanded"
						@toggleExpanded="onToggleDonate()"
						v-if="isDemoMode"
						><template v-slot:icon>
							<span class="material-icons-outlined text-lightText"
								>volunteer_activism</span
							>
						</template>
						<div class="w-72 text-center">
							<h3>{{ $t("donate.donate_title") }}</h3>
							<p class="mb-4">{{ $t("donate.donate_content") }}</p>
							<a href="https://paypal.me/bsamusp00?country.x=IT&locale.x=it_IT">
								<Btn>{{ $t("donate.donate_now") }}</Btn>
							</a>
						</div>
					</DropdownMenu>
					<Btn
						v-if="showHelpCenterButton"
						:tooltip="$t('help.help_guide_label')"
						@click="metaStore.setHelpCenterVisibility(true)"
						id="help-center"
						:variant="'icon'"
						:outline="true"
						><span class="text-lg material-icons-outlined"> help_outline </span></Btn
					>
					<p class="ml-4 mr-1 text-xs md:text-base hidden sm:block">
						{{ metaStore.email }}
					</p>
					<p
						@click="$emit('showMatEditor')"
						class="hidden text-xs cursor-pointer md:block md:text-sm"
					>
						{{ metaStore.user?.mat }}
					</p>
					<Btn
						class="hidden sm:block"
						:tooltip="$t('misc.logout')"
						@click="$emit('logout')"
						:variant="'icon'"
						:outline="true"
						><span class="text-lg material-icons-outlined"> logout </span></Btn
					>
				</div>
			</div>
			<div class="md:hidden" v-if="showMobileSidebarButton">
				<Btn
					:variant="'icon'"
					:outline="true"
					class="md:hidden"
					@click="$emit('toggleMobileSidebar')"
					><span class="material-icons-outlined text-darkText"> menu </span></Btn
				>
			</div>
		</div>
	</nav>
</template>

<script lang="ts">
//import { useMetaStore } from "@/stores/metaStore";
import { isDemoMode, logAnalyticsEvent } from "@/utils";
import { defineComponent, PropType } from "@vue/runtime-core";
//import { mapStores } from "pinia";
import Btn from "./Btn.vue";
import DropdownMenu from "./DropdownMenu.vue";
import LocaleSelector from "./LocaleSelector.vue";
export default defineComponent({
	name: "AppBar",
	props: {
		sticky: {
			type: Boolean,
			deafault: true,
		},
		moreHorizontalPadding: {
			type: Boolean,
			default: true,
		},
		sidebarCollapsed: {
			type: Boolean,
			required: true,
		},
		showCollapseSideBarButton: {
			type: Boolean,
			required: true,
		},
		showHelpCenterButton: {
			type: Boolean,
			required: true,
		},
		showLocaleSelector: {
			type: Boolean,
			default: true,
		},
		showMobileSidebarButton: {
			type: Boolean,
			required: true,
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
			donateExpanded: false,
		};
	},
	methods: {
		onToggleDonate() {
			if (!this.donateExpanded) {
				logAnalyticsEvent("toggledDonate", {});
			}
			this.donateExpanded = !this.donateExpanded;
		},
	},
	computed: {
		//...mapStores(useMetaStore),
		isDemoMode() {
			return isDemoMode();
		},
		logoUrl() {
			return require("../../assets/logo.png");
		},
	},
	components: { Btn, DropdownMenu, LocaleSelector },
});
</script>

<style></style>
