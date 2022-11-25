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
			<Btn class="mr-2" :variant="'icon'" :outline="true" @click="$emit('download')">
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
			<Spinner
				v-if="isLoading"
				:dark="true"
				style="z-index: 9999999"
				:size="'lg'"
				class="fixed top-1/2 left-1/2 transform -translate-x-1/ -translate-y-1/2"
			/>
			<vue-pdf-embed
				:width="width"
				ref="pdfRef"
				:source="base64Source"
				:page="page"
				@rendered="handleDocumentRender"
			/>
		</div>
	</div>
</template>

<script lang="ts">
import VuePdfEmbed from "vue-pdf-embed";

import { defineComponent, PropType } from "@vue/runtime-core";
import Btn from "../ui/Btn.vue";
import Spinner from "../ui/Spinner.vue";
export default defineComponent({
	name: "PdfViewer",
	props: {
		source: {
			type: String, //Object as PropType<Blob>,
			required: true,
		},
		filename: {
			type: String,
			required: true,
		},
	},
	components: {
		VuePdfEmbed,
		Btn,
		Spinner,
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
			isLoading: true,
			reRendering: false,
			page: null,
			pageCount: null as null | number,
			//pdfSource: "http://127.0.0.1:8000/courses/20/nodes/8/download",
			showAllPages: true,
			width: 800,
		};
	},
	methods: {
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
