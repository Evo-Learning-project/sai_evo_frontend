<template>
	<div>
		<FileViewer
			@viewerClose="$emit('viewerClose')"
			v-if="base64Contents !== null"
			:source="base64Contents"
			:filename="node.file.name"
			@fileDownload="onDownload()"
			:url="fileUrl"
			:id="node.id + '-viewer'"
			:downloading="downloading"
		/>
	</div>
</template>

<script lang="ts">
import { FileNode } from "@/models";
import { defineComponent, PropType } from "@vue/runtime-core";
import { nodeProps } from "../shared";
import FileViewer from "@/components/file_viewers/FileViewer.vue";
import { downloadFileNode, downloadFileNodeAsAttachment, getFileNodeUrl } from "@/api";
import { courseIdMixin } from "@/mixins";
import { arraybufferToBase64, setErrorNotification } from "@/utils";

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
			downloading: false,
		};
	},
	methods: {
		async downloadNodeFile() {
			const fileBlob = await downloadFileNode(this.courseId, this.node.id);
			console.log("BLOB", fileBlob);
			this.base64Contents = arraybufferToBase64(fileBlob);
		},
		async onDownload() {
			this.downloading = true;
			try {
				await downloadFileNodeAsAttachment(this.courseId, this.node.id);
			} catch (e) {
				setErrorNotification(e);
			} finally {
				this.downloading = false;
			}
		},
	},
	computed: {
		fileUrl() {
			return getFileNodeUrl(this.courseId, this.node.id);
		},
	},
});
</script>

<style></style>
