<template>
	<div
		:class="{ 'bg-light': node.state === AnnouncementNodeState.DRAFT }"
		class="
			group
			card card-border card-hoverable
			hover-shadow-elevation hover:border-transparent
			relative
		"
	>
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
		<!-- header -->
		<div class="flex items-start">
			<!-- icon -->
			<div
				class="flex rounded-full mr-3"
				:class="{
					'bg-gray-200': node.state === AnnouncementNodeState.DRAFT,
					'bg-primary  bg-opacity-15': node.state === AnnouncementNodeState.PUBLISHED,
				}"
				style="
					min-width: 2.5rem;
					max-width: 2.5rem;
					min-height: 2.5rem;
					max-height: 2.5rem;
				"
			>
				<span
					style="font-size: 28px !important"
					:class="{
						'text-gray-500': node.state === AnnouncementNodeState.DRAFT,
						'text-primary': node.state === AnnouncementNodeState.PUBLISHED,
					}"
					class="m-auto material-icons-outlined"
					>campaign</span
				>
			</div>
			<!-- title, creator, timestamp-->
			<div class="flex w-full flex-col">
				<!-- title -->
				<router-link
					:to="{ name: 'CourseTreeNodeDetailDispatcher', params: { nodeId: node.id } }"
				>
					<h2 style="line-height: 0.95" class="mb-2 hover:text-primary hover:underline">
						{{ $t("course_tree.announcement_title") }}
					</h2>
				</router-link>
				<div
					class="
						-mt-2
						md:flex-row
						flex-col flex
						md:space-y-0
						-space-y-1
						md:space-x-2
						ml-0.5
					"
				>
					<p v-if="node.creator" class="text-sm">
						{{ node.creator.full_name }}
					</p>
					<Timestamp :date-only="true" class="text-sm text-muted" :value="node.created" />
				</div>
				<!-- body -->
				<div class="mt-2 flex flex-wrap items-end">
					<ProcessedTextFragment
						class="w-full truncated-in-dragging-element text-muted"
						:value="bodyPreview"
					/>
					<Btn
						v-if="isTruncated"
						:size="'xs'"
						class="-ml-1"
						:variant="'primary-borderless'"
						@click="onShowMore()"
						><span class="text-base">{{ $t("misc.show_more") }}</span></Btn
					>
				</div>
				<!-- children -->
				<div class="mt-4 hidden-in-dragging-element" v-if="children.length > 0">
					<div class="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
						<div class="" v-for="child in children" :key="child.id">
							<CourseTreeNode
								v-bind="$props"
								:node="child"
								:isDraggable="false"
								@deleteNode="$emit('deleteNode', $event)"
							></CourseTreeNode>
						</div>
					</div>
				</div>
			</div>
			<!-- teacher actions-->
			<div
				class="
					group-hover:opacity-100
					transition-opacity
					duration-100
					ease
					opacity-50
					ml-auto
					flex
					items-center
				"
			>
				<p class="text-muted mr-4" v-if="node.state === AnnouncementNodeState.DRAFT">
					{{ $t("course_tree.draft") }}
				</p>
				<Btn
					v-if="canEdit"
					@click="onEdit"
					:variant="'icon'"
					:outline="true"
					class="icon-btn-primary"
					:tooltip="$t('misc.edit')"
				>
					<span class="text-xl material-icons"> edit </span>
				</Btn>
				<Btn
					class="mr-4"
					v-if="canEdit"
					@click="onDelete"
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

		<!-- footer -->
		<!-- comments -->
		<CourseTreeNodeCommentSection
			class="w-full md:ml- mt-6 hidden-in-dragging-element"
			:nodeId="node.id"
		/>
		<!-- <div class="flex items-center">
		</div> -->
	</div>
</template>

<script lang="ts">
import Btn from "@/components/ui/Btn.vue";
import CopyToClipboard from "@/components/ui/CopyToClipboard.vue";
import ProcessedTextFragment from "@/components/ui/ProcessedTextFragment.vue";
import Timestamp from "@/components/ui/Timestamp.vue";
import { getTranslatedString as _ } from "@/i18n";
import { courseIdMixin, nodeMixin } from "@/mixins";
import { AnnouncementNode, AnnouncementNodeState } from "@/models";
import { useMainStore } from "@/stores/mainStore";
import { defineComponent, PropType } from "@vue/runtime-core";
import { mapStores } from "pinia";
import CourseTreeNodeCommentSection from "../CourseTreeNodeCommentSection.vue";
import { nodeEmits, nodeProps } from "../shared";
import CourseTreeNode from "./CourseTreeNode.vue";
export default defineComponent({
	name: "AnnouncementNode",
	props: {
		node: {
			type: Object as PropType<AnnouncementNode>,
			required: true,
		},
		...nodeProps,
	},
	mixins: [courseIdMixin, nodeMixin],
	created() {
		this.$emit("loadChildren", { node: this.node, fromFirstPage: true });
		this.$emit("loadComments", this.node);
	},
	data() {
		return {
			AnnouncementNodeState,
		};
	},
	emits: {
		...nodeEmits,
	},
	methods: {
		onShowMore() {
			// TODO implement
		},
		onEdit() {
			this.$emit("editNode", this.node);
		},
		onDelete() {
			this.$emit("deleteNode", this.node);
		},
	},
	computed: {
		...mapStores(useMainStore),
		children() {
			return this.mainStore.paginatedChildrenByNodeId[this.node.id]?.data ?? [];
		},
		bodyPreview() {
			return this.node.body;
		},
		isTruncated() {
			// TODO implement
			return false;
		},
	},
	// eslint-disable-next-line vue/no-unused-components
	components: {
		ProcessedTextFragment,
		Timestamp,
		Btn,
		CopyToClipboard,
		CourseTreeNode,
		CourseTreeNodeCommentSection,
	},
});
</script>

<style></style>
