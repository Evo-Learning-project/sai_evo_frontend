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
			<p class="text-sm opacity-70" v-if="pageCount !== null">
				{{ pageCount }} {{ pageCount === 1 ? $t("misc.page") : $t("misc.pages") }}
			</p>
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
			<Btn class="" :variant="'icon'" :outline="true" @click="onZoom(100)">
				<span class="material-icons-outlined text-lightText">zoom_in</span>
			</Btn>
			<Btn :variant="'icon'" :outline="true" @click="onZoom(-100)">
				<span class="material-icons-outlined text-lightText">zoom_out</span>
			</Btn>
		</div>
	</div>
	<div
		style="z-index: 1001"
		class="
			mt-14
			absolute
			top-1/2
			transform
			-translate-y-1/2 -translate-x-1/2
			left-1/2
			overflow-y-auto
			h-screen
		"
	>
		<div class="relative">
			<transition name="fade">
				<LinearProgress v-if="isLoading || downloading" class="z-50 absolute top-0" />
			</transition>
			<vue-pdf-embed
				:id="id"
				:width="width"
				ref="pdfRef"
				:source="base64Source"
				:page="page"
				@progress="onProgress($event)"
				@rendered="handleDocumentRender"
			/>
		</div>
	</div>
</template>

<script lang="ts">
import VuePdfEmbed from "vue-pdf-embed";

import { defineComponent, PropType } from "@vue/runtime-core";
import Btn from "../ui/Btn.vue";
import LinearProgress from "../ui/LinearProgress.vue";
import { fileViewerProps } from "./shared";
import { arraybufferToBase64 } from "@/utils";
import { downloadFileNode } from "@/api";
export default defineComponent({
	name: "PdfViewer",
	props: {
		...fileViewerProps,
	},
	components: {
		VuePdfEmbed,
		Btn,
		LinearProgress,
	},
	mounted() {
		this.downloadNodeFile();
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
			downloading: true,
			isLoading: true,
			reRendering: false,
			page: null,
			pageCount: null as null | number,
			//pdfSource: "http://127.0.0.1:8000/courses/20/nodes/8/download",
			showAllPages: true,
			width: 800,
			source: "",
		};
	},
	methods: {
		async downloadNodeFile() {
			const fileBlob = await downloadFileNode(this.url);
			console.log("BLOB", fileBlob);
			this.source = arraybufferToBase64(fileBlob);
			this.downloading = false;
		},
		onZoom(amount: number) {
			if (this.reRendering) {
				return;
			}
			this.reRendering = true;
			const MIN_WIDTH = 600;
			const MAX_WIDTH = 1200;
			if (amount > 0) {
				this.width = Math.min(MAX_WIDTH, this.width + amount);
			} else {
				this.width = Math.max(MIN_WIDTH, this.width + amount);
			}
		},
		onProgress(evt: any) {
			console.log("prog", evt);
		},
		handleDocumentRender() {
			this.isLoading = false;
			this.reRendering = false;
			this.pageCount = (this.$refs as any).pdfRef.pageCount;
		},
	},
	computed: {
		base64Source() {
			return `data:application/pdf;base64,${this.source}`;
		},
	},
});
</script>

<style></style>
