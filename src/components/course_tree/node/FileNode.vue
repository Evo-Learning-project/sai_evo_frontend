<template>
	<div>
		<div
			tabindex="0"
			class="relative flex rounded card-border group"
			:class="{
				'card-hoverable hover-shadow-elevation hover:border-transparent': isDraggable,
			}"
		>
			<LinearProgress
				class="absolute w-full top-0 left-0 rounded-t-sm"
				v-if="loadingFile || loadingThumbnail"
			/>
			<div
				class="
					md:ml-5
					ml-4
					mb-auto
					md:my-auto
					mt-4
					flex
					rounded-full
					mr-3
					bg-primary bg-opacity-15
				"
				style="
					min-width: 2.5rem;
					max-width: 2.5rem;
					min-height: 2.5rem;
					max-height: 2.5rem;
				"
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
			<div class="flex-col md:flex-row flex w-full py-4 overflow-hidden">
				<div class="my-auto overflow-hidden" v-if="node.file">
					<h4
						:title="node.file.name"
						@click="showDetails = true"
						@keyup.enter="showDetails = true"
						style="
							line-height: 0.95;
							white-space: nowrap;
							overflow: hidden;
							text-overflow: ellipsis;
						"
						class="mb-0.5 pr-1 cursor-pointer hover:text-primary hover:underline"
					>
						{{ node.file.name }}
					</h4>
					<!-- <div class="flex xl:flex-row flex-col xl:space-x-2 ml-0.5">
						<p v-if="node.creator" class="text-sm">
							{{ node.creator.full_name }}
						</p>
						<Timestamp
							:date-only="true"
							class="text-sm text-muted"
							:value="node.created"
						/>
					</div> -->
					<div class="flex flex-wrap ml-0.5">
						<p v-if="node.creator" class="text-sm mr-2">
							{{ node.creator.full_name }}
						</p>
						<span
							class="text-sm text-muted"
							style="margin-right: 3px"
							v-if="updatedOnDifferentDay"
							>{{ $t("misc.updated_on") }}</span
						>
						<Timestamp
							:date-only="true"
							class="text-sm text-muted"
							:value="node.modified"
						/>
					</div>
				</div>
				<!-- actions -->
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
				style="min-height: 120px !important"
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
				<img
					style="height: 50px !important; margin: auto"
					class="pointer-events-none opacity-100"
					v-else-if="!loadingThumbnail"
					:src="defaultThumbnail"
				/>
			</div>
			<!-- TODO file preview -->
			<!-- <div class="ml-auto bg-gray-200 -my-8 h-full"></div> -->
		</div>
		<FileNodeDetail @viewerClose="showDetails = false" v-if="showDetails" :node="node" />
	</div>
</template>

<script lang="ts">
import Btn from "@/components/ui/Btn.vue";
import CopyToClipboard from "@/components/ui/CopyToClipboard.vue";
import LinearProgress from "@/components/ui/LinearProgress.vue";
import Timestamp from "@/components/ui/Timestamp.vue";
import { courseIdMixin, nodeMixin } from "@/mixins";
import { FileNode } from "@/models";
import { useMainStore } from "@/stores/mainStore";
import { getDefaultThumbnail, getHumanFileSize, sameDay } from "@/utils";
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
	mixins: [courseIdMixin, nodeMixin],
	async created() {
		this.loadingThumbnail = true;
		try {
			await this.mainStore.loadCourseTreeNodeThumbnail({
				courseId: this.courseId,
				nodeId: this.node.id,
			});
			this.thumbnailLoaded = true;
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
			return (
				!this.loadingThumbnail &&
				this.thumbnailLoaded &&
				!!this.mainStore.thumbnailByCourseNodeId[this.node.id]
			);
		},
		thumbnailSrc() {
			const thumbnail = this.mainStore.thumbnailByCourseNodeId[this.node.id];
			if (!thumbnail || !this.thumbnailLoaded) {
				return "";
			}
			return `data:image/jpeg;base64,${thumbnail}`;
		},
		defaultThumbnail() {
			return getDefaultThumbnail(this.node.mime_type);
		},
		humanReadableFileSize() {
			return getHumanFileSize(this.node.file?.size ?? 0);
		},
		updatedOnDifferentDay() {
			return !sameDay(new Date(this.node.created), new Date(this.node.modified));
		},
	},
	components: { LinearProgress, FileNodeDetail, Timestamp, CopyToClipboard, Btn },
});
</script>

<style></style>
