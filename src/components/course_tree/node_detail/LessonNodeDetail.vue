<template>
	<div v-if="firstLoading" class="mt-6">
		<SlotSkeleton />
		<SlotSkeleton class="mb-4 mt-2" />
		<SlotSkeleton />
	</div>
	<div v-else class="mt-2">
		<div class="mb-4">
			<router-link :to="{ name: 'CourseTree' }"
				><Btn :size="'xs'" :variant="'primary-borderless'">
					<span class="material-icons-outlined">chevron_left</span>
					{{ $t("course_tree.back_to_tree") }}</Btn
				></router-link
			>
		</div>
		<!-- header -->
		<div class="flex items-center">
			<div
				style="min-width: 3.5rem; max-width: 3.5rem"
				class="flex rounded-full w-14 h-14 bg-primary bg-opacity-15 mr-3"
			>
				<span
					style="font-size: 32px !important"
					class="m-auto material-icons-outlined text-primary"
					>book</span
				>
			</div>
			<div class="flex space-x-2">
				<div class="flex flex-col">
					<h1 style="line-height: 1.1" class="mb-0">{{ node.title }}</h1>
					<div class="flex space-x-2 ml-0.5">
						<p v-if="node.creator" class="text-sm">
							{{ node.creator.full_name }}
						</p>
						<Timestamp
							:date-only="true"
							class="text-sm text-muted"
							:value="node.created"
						/>
					</div>
				</div>
				<!-- teacher actions-->
				<div class="ml-auto flex items-center">
					<Btn
						v-if="canEdit"
						@click="onEdit"
						:variant="'icon'"
						:outline="true"
						class="
							icon-btn-primary
							hover:opacity-100
							transition-opacity
							duration-100
							ease
							opacity-50
						"
						:tooltip="$t('misc.edit')"
					>
						<span class="text-xl material-icons"> edit </span>
					</Btn>
					<CopyToClipboard
						class="hover:opacity-100 transition-opacity duration-100 ease opacity-50"
						:icon-only="true"
						:tooltip="$t('exercise_solution.share')"
						:value="permalink"
					/>
				</div>
			</div>
		</div>

		<!-- body -->
		<div class="mx-18">
			<div class="mt-8">
				<ProcessedTextFragment :value="node.body" />
			</div>

			<!-- children -->
			<div class="mt-12">
				<div v-if="localLoading">
					<SlotSkeleton />
					<SlotSkeleton />
				</div>
				<div class="grid grid-cols-2 gap-8">
					<div class="" v-for="child in children" :key="child.id">
						<CourseTreeNode
							v-bind="$props"
							:node="child"
							@showFileNode="onShowFileNode(child)"
						></CourseTreeNode>
					</div>
				</div>
			</div>
		</div>
		<FileNodeDetail
			@viewerClose="openedNode = null"
			v-if="openedNode"
			:node="openedNode"
		/>
	</div>
</template>

<script lang="ts">
import Btn from "@/components/ui/Btn.vue";
import CopyToClipboard from "@/components/ui/CopyToClipboard.vue";
import ProcessedTextFragment from "@/components/ui/ProcessedTextFragment.vue";
import SlotSkeleton from "@/components/ui/skeletons/SlotSkeleton.vue";
import Timestamp from "@/components/ui/Timestamp.vue";
import { loadingMixin } from "@/mixins";
import { CourseTreeNode as ICourseTreeNode, FileNode, LessonNode } from "@/models";
import { defineComponent, PropType } from "@vue/runtime-core";
import CourseTreeNode from "../node/CourseTreeNode.vue";
import { nodeProps } from "../shared";
import FileNodeDetail from "./FileNodeDetail.vue";
export default defineComponent({
	name: "LessonNodeDetail",
	mixins: [loadingMixin],
	props: {
		node: {
			type: Object as PropType<LessonNode>,
			required: true,
		},
		children: {
			type: Array as PropType<ICourseTreeNode[]>,
			default: () => [],
		},
		...nodeProps,
	},
	created() {
		this.$emit("loadChildren");
	},
	data() {
		return {
			openedNode: null as null | FileNode,
		};
	},
	methods: {
		onEdit() {
			console.log("edit");
		},
		onShowFileNode(node: FileNode) {
			console.log("showed", node);
			this.openedNode = node;
		},
	},
	computed: {
		permalink() {
			// TODO implement generic permalink for any node type
			return "";
		},
	},
	components: {
		Timestamp,
		ProcessedTextFragment,
		Btn,
		SlotSkeleton,
		CourseTreeNode,
		CopyToClipboard,
		FileNodeDetail,
	},
});
</script>

<style></style>