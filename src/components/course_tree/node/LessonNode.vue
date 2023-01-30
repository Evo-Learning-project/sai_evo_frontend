<template>
	<div
		:class="{ 'bg-light': node.state === LessonNodeState.DRAFT }"
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
		<div class="flex flex-wrap md:items-center">
			<div class="flex items-center">
				<!-- icon -->
				<div
					class="flex rounded-full mr-3"
					:class="{
						'bg-gray-200': node.state === LessonNodeState.DRAFT,
						'bg-primary  bg-opacity-15': node.state === LessonNodeState.PUBLISHED,
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
							'text-gray-500': node.state === LessonNodeState.DRAFT,
							'text-primary': node.state === LessonNodeState.PUBLISHED,
						}"
						class="m-auto material-icons-outlined"
						>book</span
					>
				</div>
				<div class="flex flex-col -space-y-1 md:-space-y-2">
					<router-link
						:to="{ name: 'CourseTreeNodeDetailDispatcher', params: { nodeId: node.id } }"
					>
						<h2
							style="line-height: 0.95"
							class="md:block hidden mb-2 hover:text-primary hover:underline"
						>
							{{ lessonTitle }}
						</h2>
						<h3
							style="line-height: 0.95"
							class="mb-2 md:hidden hover:text-primary hover:underline"
						>
							{{ lessonTitle }}
						</h3>
					</router-link>
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
					md:flex-row
					flex-col
					items-center
				"
			>
				<p
					class="text-muted mr-4 md:block hidden"
					v-if="node.state === LessonNodeState.DRAFT"
				>
					{{ $t("course_tree.draft") }}
				</p>
				<div class="flex">
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
		</div>
		<div class="ml-12 pl-1 mt-2 -mb-1" v-if="node.comment_count > 0">
			<router-link
				class="flex items-center space-x-2 w-max"
				:to="{ name: 'CourseTreeNodeDetailDispatcher', params: { nodeId: node.id } }"
			>
				<span
					class="material-icons-outlined text-muted"
					style="
						margin-bottom: -1px;
						font-size: 16px !important;
						text-decoration: none !important;
					"
					>question_answer</span
				>
				<p class="text-muted hover:underline">
					{{ node.comment_count }}
					{{
						node.comment_count === 1
							? $t("course_tree.node_comment_title")
							: $t("course_tree.node_comments_title")
					}}
				</p>
			</router-link>
		</div>
		<!-- body -->
		<!-- <div class="ml-1">
			<ProcessedTextFragment
				style="
					display: -webkit-box;
					-webkit-line-clamp: 2;
					-webkit-box-orient: vertical;
					overflow: hidden;
				"
				class="w-full overflow-x-hidden overflow-ellipsis text-muted"
				:value="bodyPreview"
			/>
		</div> -->
		<!-- footer -->
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
import { LessonNode, LessonNodeState } from "@/models";
import { sameDay } from "@/utils";
import { defineComponent, PropType } from "@vue/runtime-core";
import { nodeEmits, nodeProps } from "../shared";
export default defineComponent({
	name: "LessonNode",
	mixins: [courseIdMixin, nodeMixin],
	props: {
		node: {
			type: Object as PropType<LessonNode>,
			required: true,
		},
		...nodeProps,
	},

	data() {
		return {
			LessonNodeState,
		};
	},
	emits: {
		...nodeEmits,
	},
	methods: {
		onEdit() {
			this.$emit("editNode", this.node);
		},
		onDelete() {
			this.$emit("deleteNode", this.node);
		},
	},
	computed: {
		lessonTitle() {
			return this.node.title || _("course_tree.unnamed_lesson");
		},
		bodyPreview() {
			return this.node.body;
		},
		updatedOnDifferentDay() {
			return !sameDay(new Date(this.node.created), new Date(this.node.modified));
		},
	},
	// eslint-disable-next-line vue/no-unused-components
	components: { ProcessedTextFragment, Timestamp, Btn, CopyToClipboard },
});
</script>

<style></style>
