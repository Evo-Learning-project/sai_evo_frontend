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
import SourceCodeViewer from "./SourceCodeViewer.vue";
import VideoViewer from "./VideoViewer.vue";
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
			return "SourceCodeViewer"; //"VideoViewer";
		},
	},
	components: { PdfViewer, VideoViewer, SourceCodeViewer },
});
</script>

<style></style>
