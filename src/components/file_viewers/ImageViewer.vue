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
			<Btn class="" :variant="'icon'" :outline="true" @click="onZoom(1)">
				<span class="material-icons-outlined text-lightText">zoom_in</span>
			</Btn>
			<Btn :variant="'icon'" :outline="true" @click="onZoom(-1)">
				<span class="material-icons-outlined text-lightText">zoom_out</span>
			</Btn>
		</div>
	</div>
	<div
		style="z-index: 1001"
		class="mt-14 fixed top-1/2 transform -translate-y-2/3 -translate-x-1/2 left-1/2"
	>
		<div class="relative w-max">
			<!-- <transition name="fade">
				<LinearProgress v-if="isLoading || downloading" class="z-50 absolute top-0" />
			</transition> -->
			<Spinner :variant="'primary'" :size="'xl'" v-if="isLoading || downloading" />
			<img
				v-else
				class="m-auto"
				:style="{ width: width + '%', 'max-width': '300% !important' }"
				:src="base64Source"
			/>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "@vue/runtime-core";
import Btn from "../ui/Btn.vue";
import { fileViewerProps } from "./shared";
import { arraybufferToBase64, setErrorNotification } from "@/utils";
import { downloadFileNode } from "@/api";
import { fileViewerMixin } from "@/mixins";
import Spinner from "../ui/Spinner.vue";
export default defineComponent({
	name: "ImageViewer",
	props: {
		...fileViewerProps,
	},
	components: {
		Btn,
		Spinner,
	},
	mixins: [fileViewerMixin],
	async mounted() {
		this.isLoading = true;
		try {
			await this.downloadNodeFile();
			await this.setInitialWidth();
		} catch (e) {
			setErrorNotification(e);
		} finally {
			this.isLoading = false;
		}
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
			//downloading: true,
			isLoading: true,
			width: 100,
			initialWidth: 100,
			//source: "",
		};
	},
	methods: {
		// async downloadNodeFile() {
		// 	const fileBlob = await downloadFileNode(this.url);
		// 	console.log("BLOB", fileBlob);
		// 	this.source = arraybufferToBase64(fileBlob);
		// 	this.downloading = false;
		// },
		async setInitialWidth() {
			const MAX_INITIAL_WIDTH_RATIO = 0.7;
			const windowWidth = window.innerWidth;
			const imageWidth: number = await new Promise(resolve => {
				const image = new Image();
				image.onload = () => resolve(image.naturalWidth);
				image.src = this.base64Source;
			});
			if (imageWidth <= windowWidth * MAX_INITIAL_WIDTH_RATIO) {
				this.initialWidth = 100;
			} else {
				this.initialWidth = ((MAX_INITIAL_WIDTH_RATIO * windowWidth) / imageWidth) * 100;
			}
			this.width = this.initialWidth;
		},
		onZoom(multiplier: number) {
			const MIN_WIDTH = this.initialWidth / 3;
			const MAX_WIDTH = this.initialWidth * 3;
			const FACTOR = this.initialWidth / 5;
			if (multiplier > 0) {
				this.width = Math.min(MAX_WIDTH, this.width + FACTOR);
			} else {
				this.width = Math.max(MIN_WIDTH, this.width - FACTOR);
			}
		},
	},
	computed: {
		base64Source() {
			return `data:image;base64,${this.source}`;
		},
	},
});
</script>

<style></style>
