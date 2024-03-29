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
		<div class="flex flex-col items-start">
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
				<div>
					<!-- title -->
					<router-link
						:to="{ name: 'CourseTreeNodeDetailDispatcher', params: { nodeId: node.id } }"
					>
						<h2 style="line-height: 0.95" class="mb-2 hover:text-primary hover:underline">
							{{ $t("course_tree.announcement_title") }}
						</h2>
					</router-link>
					<!-- creator name & timestamp -->
					<div class="-mt-2 flex flex-wrap ml-0.5">
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
			</div>
			<div class="md:mx-12 md:px-1 flex flex-col">
				<!-- body -->
				<div class="mt-2 flex flex-col space-y-1">
					<div class="flex flex-wrap items-end">
						<ProcessedTextFragment
							class="truncated-in-dragging-element text-muted"
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
					<!-- TODO find proper positioning -->
					<Avatar :user="node.creator" class="ml-auto" v-if="false" />
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
				<!-- <p
					class="text-muted mr-4 hidden md:block"
					v-if="node.state === AnnouncementNodeState.DRAFT"
				>
					{{ $t("course_tree.draft") }}
				</p> -->
				<div class="text-muted mr-4" v-if="node.state === AnnouncementNodeState.DRAFT">
					<div
						v-if="node.schedule_publish_at"
						class="flex items-center space-x-1 text-sm"
					>
						<p class="md:block hidden">{{ $t("course_tree.scheduled_for") }}</p>
						<p class="block md:hidden">
							<svg
								style="width: 20px; fill: currentColor"
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
							>
								<path
									d="M15,13H16.5V15.82L18.94,17.23L18.19,18.53L15,16.69V13M19,8H5V19H9.67C9.24,18.09 9,17.07 9,16A7,7 0 0,1 16,9C17.07,9 18.09,9.24 19,9.67V8M5,21C3.89,21 3,20.1 3,19V5C3,3.89 3.89,3 5,3H6V1H8V3H16V1H18V3H19A2,2 0 0,1 21,5V11.1C22.24,12.36 23,14.09 23,16A7,7 0 0,1 16,23C14.09,23 12.36,22.24 11.1,21H5M16,11.15A4.85,4.85 0 0,0 11.15,16C11.15,18.68 13.32,20.85 16,20.85A4.85,4.85 0 0,0 20.85,16C20.85,13.32 18.68,11.15 16,11.15Z"
								/>
							</svg>
						</p>
						<Timestamp :value="node.schedule_publish_at" />
					</div>
					<p class="md:block hidden" v-else>{{ $t("course_tree.draft") }}</p>
				</div>
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

		<!-- children -->
		<div
			class="mt-4 hidden-in-dragging-element md:mx-12 md:px-0.5"
			v-if="children.length > 0"
		>
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
import Avatar from "@/components/ui/Avatar.vue";
import Btn from "@/components/ui/Btn.vue";
import CopyToClipboard from "@/components/ui/CopyToClipboard.vue";
import ProcessedTextFragment from "@/components/ui/ProcessedTextFragment.vue";
import Timestamp from "@/components/ui/Timestamp.vue";
import { getTranslatedString as _ } from "@/i18n";
import { courseIdMixin, nodeMixin } from "@/mixins";
import { AnnouncementNode, AnnouncementNodeState } from "@/models";
import { useMainStore } from "@/stores/mainStore";
import { sameDay } from "@/utils";
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
		updatedOnDifferentDay() {
			// TODO use moment
			return !sameDay(new Date(this.node.created), new Date(this.node.modified));
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
		Avatar,
	},
});
</script>

<style></style>
