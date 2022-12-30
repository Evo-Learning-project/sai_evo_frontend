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
			fixed
			top-1/2
			left-1/2
			transform
			-translate-x-1/2 -translate-y-1/2
			shadow-all-around
		"
	>
		<video controls v-if="videoSrc">
			<source :src="videoSrc" />
			<p>{{ $t("misc.no_native_video_support") }}</p>
		</video>
		<!-- loading placeholder -->
		<div v-else class="relative">
			<LinearProgress :progress="downloadProgress" class="absolute top-0 rounded-t-sm" />
			<div style="width: 650px; height: 350px" class="bg-gray-600 rounded-sm"></div>
		</div>
	</div>
</template>

<script lang="ts">
import { fileViewerProps } from "./shared";

import { defineComponent, PropType } from "@vue/runtime-core";
import Btn from "../ui/Btn.vue";
import { fileViewerMixin } from "@/mixins";
import LinearProgress from "../ui/LinearProgress.vue";
export default defineComponent({
	name: "VideoViewer",
	props: {
		...fileViewerProps,
	},
	mixins: [fileViewerMixin],
	async created() {
		await this.downloadNodeFile();
		this.videoSrc = (window.URL || window.webkitURL).createObjectURL(
			new Blob([this.arrayBufferSource as ArrayBuffer]),
		);
	},
	mounted() {
		const bodyContainsOverflowHidden =
			document.body.classList.contains("overflow-y-hidden");
		if (!bodyContainsOverflowHidden) {
			document.body.classList.add("overflow-y-hidden");
		}
	},
	beforeUnmount() {
		const bodyContainsOverflowHidden =
			document.body.classList.contains("overflow-y-hidden");
		if (bodyContainsOverflowHidden) {
			document.body.classList.remove("overflow-y-hidden");
		}
	},
	data() {
		return {
			videoSrc: null as string | null,
			downloadProgress: undefined as undefined | number,
		};
	},
	methods: {
		onDownloadProgress(e: { loaded: number }) {
			const downloaded = e.loaded;
			this.downloadProgress = (downloaded / this.size) * 100;
			console.log({ e, p: this.downloadProgress });
		},
	},
	components: {
		Btn,
		LinearProgress,
	},
});
</script>
