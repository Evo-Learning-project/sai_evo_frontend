<template>
	<div>
		<component
			:is="viewerComponentName"
			v-bind="$props"
			@viewerClose="$emit('viewerClose')"
			@download="$emit('fileDownload')"
		/>
	</div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "@vue/runtime-core";
import PdfViewer from "./PdfViewer.vue";
import { fileViewerProps } from "./shared";
export default defineComponent({
	name: "FileViewer",
	props: {
		...fileViewerProps,
	},
	methods: {},
	computed: {
		viewerComponentName() {
			if (this.filename.slice(-3) === "pdf") {
				return "PdfViewer";
			}
			return "VideoViewer";
		},
	},
	components: { PdfViewer },
});
</script>

<style></style>
