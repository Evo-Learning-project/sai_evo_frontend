<template>
	<div
		tabindex="0"
		@click="showDetails = true"
		@keyup.enter="showDetails = true"
		v-wave="{ initialOpacity: 0.25 }"
		class="
			relative
			cursor-pointer
			card-border
			flex
			rounded
			hover:bg-light
			transition-colors
			duration-75
			ease
		"
	>
		<LinearProgress
			class="absolute w-full top-0 left-0 rounded-t-sm"
			v-if="loadingFile || loadingThumbnail"
		/>
		<div
			class="md:ml-5 ml-4 my-auto flex rounded-full mr-3 bg-primary bg-opacity-15"
			style="min-width: 2.5rem; max-width: 2.5rem; min-height: 2.5rem; max-height: 2.5rem"
		>
			<span
				style="font-size: 28px !important"
				class="m-auto material-icons-outlined text-primary"
				>file_present</span
			>
		</div>
		<div class="flex py-4">
			<div class="my-auto" v-if="node.file">
				<h4>{{ node.file.name }}</h4>
				<div class="flex space-x-2 ml-0.5">
					<p v-if="node.creator" class="text-sm">
						{{ node.creator.full_name }}
					</p>
					<Timestamp :date-only="true" class="text-sm text-muted" :value="node.created" />
				</div>
			</div>
		</div>
		<div
			class="bg-gray-200 lg:w-56 w-40 flex ml-auto relative overflow-hidden"
			style="height: 120px !important"
		>
			<img
				v-if="thumbnailPresent"
				class="absolute top-0 w-11/12 left-1/2 transform -translate-x-1/2"
				:src="thumbnailSrc"
			/>
		</div>
		<!-- TODO file preview -->
		<!-- <div class="ml-auto bg-gray-200 -my-8 h-full"></div> -->
	</div>
	<!-- <transition name="fade"> -->
	<FileNodeDetail @viewerClose="showDetails = false" v-if="showDetails" :node="node" />
	<!-- </transition> -->
</template>

<script lang="ts">
import LinearProgress from "@/components/ui/LinearProgress.vue";
import Timestamp from "@/components/ui/Timestamp.vue";
import { courseIdMixin } from "@/mixins";
import { FileNode } from "@/models";
import { useMainStore } from "@/stores/mainStore";
import { getHumanFileSize } from "@/utils";
import { defineComponent, PropType } from "@vue/runtime-core";
import { mapStores } from "pinia";
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
	mixins: [courseIdMixin],
	async created() {
		this.loadingThumbnail = true;
		try {
			await this.mainStore.loadCourseTreeNodeThumbnail({
				courseId: this.courseId,
				nodeId: this.node.id,
			});
			this.thumbnailLoaded = true;
		} catch {
			// TODO set default thumbnail
		} finally {
			this.loadingThumbnail = false;
		}
	},
	data() {
		return {
			showDetails: false,
			loadingThumbnail: false,
			thumbnailLoaded: false,
		};
	},
	methods: {},
	computed: {
		...mapStores(useMainStore),
		thumbnailPresent() {
			return !this.loadingThumbnail && this.thumbnailLoaded && this.node.thumbnail;
		},
		thumbnailSrc() {
			if (!this.node.thumbnail || !this.thumbnailLoaded) {
				return "";
			}
			return `data:image/jpeg;base64,${this.node.thumbnail}`;
		},
		humanReadableFileSize() {
			return getHumanFileSize(this.node.file?.size ?? 0);
		},
	},
	components: { LinearProgress, FileNodeDetail, Timestamp },
});
</script>

<style></style>
