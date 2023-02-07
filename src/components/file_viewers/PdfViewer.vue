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
			md:flex-row
			flex-col
			items-center
			bg-dark
			fixed
			top-0
			left-0
			w-full
			md:h-14
			shadow-elevation
			bg-opacity-90
			px-2
		"
	>
		<div class="flex items-center w-full">
			<div class="">
				<Btn
					class="md:mr-2"
					:variant="'icon'"
					:outline="true"
					@click="$emit('viewerClose')"
				>
					<span class="material-icons-outlined text-lightText">close</span>
				</Btn>
			</div>
			<div
				class="
					text-lightText
					flex
					md:flex-row
					flex-col
					items-center
					space-x-4
					md:ml-4
					overflow-hidden
				"
				style="text-overflow: ellipsis"
			>
				<h3 class="hidden md:block">{{ filename }}</h3>
				<p class="md:hidden w-full overflow-hidden" style="text-overflow: ellipsis">
					{{ filename }}
				</p>
				<p class="text-sm opacity-70 hidden md:block" v-if="pageCount !== null">
					{{ pageCount }} {{ pageCount === 1 ? $t("misc.page") : $t("misc.pages") }}
				</p>
			</div>
		</div>

		<div class="md:ml-auto md:mt-0 -mt-3 flex items-center text-lightText">
			<p class="text-sm opacity-70 md:hidden" v-if="pageCount !== null">
				{{ pageCount }} {{ pageCount === 1 ? $t("misc.page") : $t("misc.pages") }}
			</p>
			<Btn
				class="md:mr-2"
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
			fixed
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

import { defineComponent } from "@vue/runtime-core";
import Btn from "../ui/Btn.vue";
import LinearProgress from "../ui/LinearProgress.vue";
import { fileViewerProps } from "./shared";
import { fileViewerMixin, mediaQueryMixin } from "@/mixins";
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
	mixins: [fileViewerMixin, mediaQueryMixin],
	mounted() {
		this.downloadNodeFile();
		const bodyContainsOverflowHidden =
			document.body.classList.contains("overflow-y-hidden");
		if (!bodyContainsOverflowHidden) {
			document.body.classList.add("overflow-y-hidden");
		}
		if (!this.mediaQueryMdMatches) {
			this.width = window.screen.availWidth - 10;
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
			reRendering: false,
			page: null,
			pageCount: null as null | number,
			showAllPages: true,
			width: 800,
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
		onZoom(amount: number) {
			if (this.reRendering) {
				return;
			}
			this.reRendering = true;
			const lasdWidth = this.width;
			const MIN_WIDTH = this.mediaQueryMdMatches ? 400 : window.screen.availWidth / 2;
			const MAX_WIDTH = this.mediaQueryMdMatches ? 1800 : window.screen.availWidth * 2;
			if (amount > 0) {
				this.width = Math.min(MAX_WIDTH, this.width + amount);
			} else {
				this.width = Math.max(MIN_WIDTH, this.width + amount);
			}
			if (lasdWidth === this.width) {
				// width didn't change - call re-rendering off
				this.reRendering = false;
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
