<template>
	<div
		tabindex="0"
		class="
			relative
			flex
			rounded
			card-border card-hoverable
			hover-shadow-elevation hover:border-transparent
			group
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
		<span
			v-if="isDraggable"
			class="
				opacity-0
				group-hover:opacity-50
				transition-opacity
				duration-100
				ease
				absolute
				top-1/2
				transform
				-translate-y-1/2
				left-0
				text-lg
				cursor-move
				drag-handle
				material-icons-outlined
			"
		>
			drag_indicator
		</span>
		<div class="flex w-full py-4">
			<div class="my-auto" v-if="node.file">
				<h4
					:title="node.file.name"
					@click="showDetails = true"
					@keyup.enter="showDetails = true"
					style="
						line-height: 0.95;
						display: -webkit-box;
						-webkit-line-clamp: 1;
						-webkit-box-orient: vertical;
						overflow: hidden;
					"
					class="mb-0.5 cursor-pointer hover:text-primary hover:underline"
				>
					{{ node.file.name }}
				</h4>
				<div class="flex xl:flex-row flex-col xl:space-x-2 ml-0.5">
					<p v-if="node.creator" class="text-sm">
						{{ node.creator.full_name }}
					</p>
					<Timestamp :date-only="true" class="text-sm text-muted" :value="node.created" />
				</div>
			</div>
			<div
				class="
					z-10
					mr-2
					ml-auto
					flex
					items-center
					group-hover:opacity-100
					transition-opacity
					duration-100
					ease
					opacity-50
				"
			>
				<Btn
					class="mr-4"
					v-if="canEdit"
					@click="$emit('deleteNode', node)"
					:variant="'icon'"
					:outline="true"
					:tooltip="$t('misc.delete')"
				>
					<span class="text-xl material-icons"> delete </span>
				</Btn>
				<CopyToClipboard
					:icon-only="true"
					:tooltip="$t('exercise_solution.share')"
					:value="permalink"
				/>
			</div>
		</div>
		<div
			@click="showDetails = true"
			@keyup.enter="showDetails = true"
			v-wave="{ initialOpacity: 0.25 }"
			class="
				bg-gray-200
				lg:w-56
				w-40
				cursor-pointer
				flex
				rounded-tr-sm rounded-br-sm
				ml-auto
				relative
				overflow-hidden
			"
			style="height: 120px !important"
		>
			<img
				v-if="thumbnailPresent"
				class="
					absolute
					top-0
					w-11/12
					left-1/2
					transform
					-translate-x-1/2
					pointer-events-none
				"
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
import Btn from "@/components/ui/Btn.vue";
import CopyToClipboard from "@/components/ui/CopyToClipboard.vue";
import LinearProgress from "@/components/ui/LinearProgress.vue";
import Timestamp from "@/components/ui/Timestamp.vue";
import { courseIdMixin } from "@/mixins";
import { FileNode } from "@/models";
import { useMainStore } from "@/stores/mainStore";
import { getHumanFileSize } from "@/utils";
import { defineComponent, PropType } from "@vue/runtime-core";
import { mapStores } from "pinia";
import FileNodeDetail from "../node_detail/FileNodeDetail.vue";
import { nodeEmits, nodeProps } from "../shared";
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
	emits: { ...nodeEmits },
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
		permalink() {
			// TODO implement
			return "";
		},
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
	components: { LinearProgress, FileNodeDetail, Timestamp, CopyToClipboard, Btn },
});
</script>

<style></style>
