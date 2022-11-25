<template>
	<div>
		<FileViewer
			@viewerClose="$emit('viewerClose')"
			v-if="base64Contents !== null"
			:source="base64Contents"
			:filename="node.file.name"
		/>
	</div>
</template>

<script lang="ts">
import { FileNode } from "@/models";
import { defineComponent, PropType } from "@vue/runtime-core";
import { nodeProps } from "../shared";
import FileViewer from "@/components/file_viewers/FileViewer.vue";
import { downloadFileNode } from "@/api";
import { courseIdMixin } from "@/mixins";
import { arraybufferToBase64 } from "@/utils";

export default defineComponent({
	name: "FileNodeDetail",
	props: {
		node: {
			type: Object as PropType<FileNode>,
			required: true,
		},
		...nodeProps,
	},
	mixins: [courseIdMixin],
	components: {
		FileViewer,
	},
	async created() {
		await this.downloadNodeFile();
	},
	data() {
		return {
			base64Contents: null as null | string,
		};
	},
	methods: {
		async downloadNodeFile() {
			const fileBlob = await downloadFileNode(this.courseId, this.node.id);
			console.log("BLOB", fileBlob);
			this.base64Contents = arraybufferToBase64(fileBlob);
		},
	},
	computed: {},
});
</script>

<style></style>
