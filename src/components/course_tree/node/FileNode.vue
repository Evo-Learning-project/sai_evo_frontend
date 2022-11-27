<template>
	<div
		tabindex="0"
		@click="showDetails = true"
		@keyup.enter="showDetails = true"
		v-wave="{ initialOpacity: 0.25 }"
		class="
			rounded-sm
			relative
			cursor-pointer
			card-border
			flex
			card
			items-center
			hover:bg-light
			transition-colors
			duration-75
			ease
		"
	>
		<LinearProgress
			class="absolute w-full top-0 left-0 rounded-t-sm"
			v-if="loadingFile"
		/>
		<div
			class="flex rounded-full mr-3 bg-primary bg-opacity-15"
			style="min-width: 2.5rem; max-width: 2.5rem; min-height: 2.5rem; max-height: 2.5rem"
		>
			<span
				style="font-size: 28px !important"
				class="m-auto material-icons-outlined text-primary"
				>insert_drive_file</span
			>
		</div>
		<div class="flex">
			<div class="my-auto" v-if="node.file">
				<h4>{{ node.file.name }}</h4>
				<p class="text-muted text-sm">
					<Timestamp
						:date-only="true"
						class="text-sm text-muted mr-2"
						:value="node.created"
					/>
					{{ humanReadableFileSize }}
				</p>
			</div>
		</div>
		<!-- TODO file preview -->
		<!-- <div class="ml-auto bg-gray-200 -my-8 h-full"></div> -->
	</div>
	<transition name="fade">
		<FileNodeDetail @viewerClose="showDetails = false" v-if="showDetails" :node="node"
	/></transition>
</template>

<script lang="ts">
import LinearProgress from "@/components/ui/LinearProgress.vue";
import Timestamp from "@/components/ui/Timestamp.vue";
import { FileNode } from "@/models";
import { getHumanFileSize } from "@/utils";
import { defineComponent, PropType } from "@vue/runtime-core";
import FileNodeDetail from "../node_detail/FileNodeDetail.vue";
import { nodeProps } from "../shared";
export default defineComponent({
	name: "FileNode",
	props: {
		node: {
			type: Object as PropType<FileNode>,
			required: true,
		},
		loadingFile: {
			type: Boolean,
			default: false,
		},
		...nodeProps,
	},
	data() {
		return { showDetails: false };
	},
	methods: {},
	computed: {
		humanReadableFileSize() {
			return getHumanFileSize(this.node.file?.size ?? 0);
		},
	},
	components: { LinearProgress, FileNodeDetail, Timestamp },
});
</script>

<style></style>
