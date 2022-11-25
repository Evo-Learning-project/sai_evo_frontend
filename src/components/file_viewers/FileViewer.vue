<template>
	<div>
		<component
			:is="viewerComponentName"
			:source="source"
			:filename="filename"
			@viewerClose="$emit('viewerClose')"
			@download="$emit('fileDownload')"
		/>
	</div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "@vue/runtime-core";
import PdfViewer from "./PdfViewer.vue";
export default defineComponent({
	name: "FileViewer",
	props: {
		// TODO extract shared props
		source: {
			type: String, //Object as PropType<Blob>,
			required: true,
		},
		filename: {
			type: String,
			required: true,
		},
	},
	methods: {},
	computed: {
		viewerComponentName() {
			return "PdfViewer";
		},
	},
	components: { PdfViewer },
});
</script>

<style></style>
