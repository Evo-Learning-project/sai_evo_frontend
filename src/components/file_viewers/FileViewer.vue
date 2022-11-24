<template>
	<div>
		<component
			:is="viewerComponentName"
			:source="source"
			@viewerClose="$emit('viewerClose')"
		/>
	</div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "@vue/runtime-core";
import PdfViewer from "./PdfViewer.vue";
export default defineComponent({
	name: "FileViewer",
	props: {
		source: {
			type: String, //Object as PropType<Blob>,
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
