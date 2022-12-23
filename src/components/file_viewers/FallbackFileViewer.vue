<template>
	<div
		class="fixed h-screen w-screen top-0 left-0 bg-dark bg-opacity-60"
		style="z-index: 1000"
		@click="$emit('viewerClose')"
	/>
	<!-- control bar -->
	<div
		style="z-index: 1002"
		class="
			flex
			items-center
			bg-dark
			fixed
			top-0
			left-0
			w-full
			h-14
			shadow-elevation
			bg-opacity-90
			px-2
		"
	>
		<div class="mr-auto">
			<Btn class="mr-2" :variant="'icon'" :outline="true" @click="$emit('viewerClose')">
				<span class="material-icons-outlined text-lightText">close</span>
			</Btn>
		</div>
		<div class="text-lightText flex items-center space-x-4">
			<h3 class="">{{ filename }}</h3>
		</div>
		<div class="ml-auto">
			<Btn
				class="mr-2"
				:loading="downloading"
				:variant="'icon'"
				:outline="true"
				@click="$emit('download')"
			>
				<span class="material-icons-outlined text-lightText">file_download</span>
			</Btn>
		</div>
	</div>
	<div
		style="z-index: 1001"
		class="
			mt-14
			fixed
			top-1/2
			transform
			-translate-y-1/2 -translate-x-1/2
			left-1/2
			overflow-y-auto
			h-screen
			w-max
			flex
		"
	>
		<!-- <Btn
			class="mr-2"
			:loading="downloading"
			:variant="'icon'"
			:outline="true"
		> -->
		<div class="m-auto flex flex-col items-center">
			<h1 class="-mt-40 text-lightText">{{ $t("misc.download") }} {{ filename }}</h1>

			<Tooltip :placement="'bottom'" :noArrow="true" :textValue="$t('misc.download')"
				><span
					v-wave
					@click="$emit('download')"
					style="font-size: 10rem !important"
					class="
						mb-1
						filter
						drop-shadow-lg
						cursor-pointer
						opacity-70
						rounded-full
						material-icons-outlined
						text-lightText
						hover:opacity-90
						transition-opacity
						duration-100
						ease-in-out
						p-4
					"
					>cloud_download</span
				></Tooltip
			>
		</div>

		<!-- </Btn> -->
	</div>
</template>

<script lang="ts">
import { fileViewerMixin } from "@/mixins";
import { defineComponent, PropType } from "@vue/runtime-core";
import Btn from "../ui/Btn.vue";
import CodeFragment from "../ui/CodeFragment.vue";
import Tooltip from "../ui/Tooltip.vue";
import { fileViewerProps } from "./shared";
export default defineComponent({
	name: "FallBackFileViewer",
	props: {
		...fileViewerProps,
	},
	mixins: [fileViewerMixin],
	mounted() {
		//this.downloadNodeFile();
	},
	methods: {},
	computed: {
		// sourceAsText() {
		// 	// source is in base64; convert back to string
		// 	return atob(this.source);
		// },
	},
	components: { Btn, Tooltip },
});
</script>

<style></style>
