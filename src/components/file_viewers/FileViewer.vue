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
import ImageViewer from "./ImageViewer.vue";
import PdfViewer from "./PdfViewer.vue";
import { fileViewerProps } from "./shared";
import SourceCodeViewer from "./SourceCodeViewer.vue";
import VideoViewer from "./VideoViewer.vue";
import FallbackFileViewer from "./FallbackFileViewer.vue";
export default defineComponent({
	name: "FileViewer",
	props: {
		...fileViewerProps,
	},
	methods: {},
	computed: {
		viewerComponentName() {
			const mimeTypePrefix = this.mimeType.split("/")[0];
			const mimeTypeSuffix = this.mimeType.split("/")[1];
			if (mimeTypePrefix === "text" || this.mimeType === "application/json") {
				return "SourceCodeViewer";
			}
			if (mimeTypePrefix === "video" && ["mp4", "mov"].includes(mimeTypeSuffix)) {
				return "VideoViewer";
			}
			if (this.mimeType === "application/pdf") {
				return "PdfViewer";
			}
			if (mimeTypePrefix === "image") {
				return "ImageViewer";
			}
			return "FallbackFileViewer";
		},
	},
	components: {
		PdfViewer,
		VideoViewer,
		SourceCodeViewer,
		ImageViewer,
		FallbackFileViewer,
	},
});
</script>

<style></style>
