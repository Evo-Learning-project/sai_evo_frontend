<template>
	<div
		class="fixed h-screen w-screen top-0 left-0 bg-dark bg-opacity-60"
		style="z-index: 1000"
		@click="$emit('viewerClose')"
	/>
	<!-- control bar -->
	<div
		style="z-index: 1002"
		class="bg-dark fixed top-0 left-0 w-full h-16 shadow-elevation bg-opacity-90"
	>
		<Btn :variant="'icon'" @click="onZoom(100)">+</Btn>
		<Btn :variant="'icon'" @click="onZoom(-100)">-</Btn>
	</div>
	<div
		style="z-index: 1001"
		class="
			absolute
			top-1/2
			transform
			-translate-y-1/2 -translate-x-1/2
			left-1/2
			overflow-y-auto
			h-full
		"
	>
		<div>
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
export default defineComponent({
	name: "PdfViewer",
	props: {
		source: {
			type: String, //Object as PropType<Blob>,
			required: true,
		},
	},
	components: {
		VuePdfEmbed,
		Btn,
	},
	data() {
		return {
			isLoading: true,
			page: null,
			pageCount: 1,
			//pdfSource: "http://127.0.0.1:8000/courses/20/nodes/8/download",
			showAllPages: true,
			width: 800,
		};
	},
	methods: {
		onZoom(amount) {
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
