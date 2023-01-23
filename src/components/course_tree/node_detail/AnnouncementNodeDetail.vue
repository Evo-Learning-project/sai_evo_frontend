<template>
	<div v-if="firstLoading" class="mt-6">
		<SlotSkeleton />
		<SlotSkeleton class="mb-4 mt-2" />
		<SlotSkeleton />
	</div>
	<div v-else class="mt-2">
		<!-- back button-->
		<div class="mb-4">
			<router-link :to="{ name: 'CourseTreeDispatcher', params: { courseId } }">
				<Btn :size="'xs'" :variant="'primary-borderless'">
					<span class="material-icons-outlined">chevron_left</span>
					{{ $t("course_tree.back_to_tree") }}
				</Btn>
			</router-link>
		</div>
		<!-- header -->
		<div class="flex flex-start md:items-center">
			<!-- icon-->
			<div
				style="min-width: 3.5rem; max-width: 3.5rem"
				class="flex rounded-full w-14 h-14 bg-primary bg-opacity-15 mr-3"
			>
				<span
					style="font-size: 40px !important"
					class="m-auto material-icons-outlined text-primary"
					>campaign</span
				>
			</div>
			<div class="flex md:flex-row flex-col md:space-x-2 md:mt-0 mt-1 w-full">
				<!-- responsive title, timestamp, & author -->
				<div class="flex flex-col">
					<h1 style="line-height: 1.1" class="mb-0 hidden md:block">
						{{ $t("course_tree.announcement_title") }}
					</h1>
					<h3 style="line-height: 1.1" class="mb-0 md:hidden">
						{{ $t("course_tree.announcement_title") }}
					</h3>
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
		<div class="mx-2 md:mx-4">
			<div class="mt-8">
				<ProcessedTextFragment :value="node.body" />
			</div>

			<!-- children -->
			<div class="mt-12">
				<div v-if="loadingChildren">
					<SlotSkeleton />
					<SlotSkeleton />
				</div>
				<div class="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
					<div class="" v-for="child in children" :key="child.id">
						<CourseTreeNode
							v-bind="$props"
							:node="child"
							@deleteNode="$emit('deleteNode', $event)"
						/>
					</div>
				</div>
			</div>

			<!-- comments -->
			<CourseTreeNodeCommentSection
				:loadingComments="loadingComments"
				class="mt-8"
				:nodeId="node.id"
			/>
		</div>
	</div>
</template>

<script lang="ts">
import Btn from "@/components/ui/Btn.vue";
import CopyToClipboard from "@/components/ui/CopyToClipboard.vue";
import Dialog from "@/components/ui/Dialog.vue";
import ProcessedTextFragment from "@/components/ui/ProcessedTextFragment.vue";
import SlotSkeleton from "@/components/ui/skeletons/SlotSkeleton.vue";
import Timestamp from "@/components/ui/Timestamp.vue";
import { getTranslatedString as _ } from "@/i18n";
import { courseIdMixin, loadingMixin, nodeMixin } from "@/mixins";
import { CourseTreeNode as ICourseTreeNode, FileNode, AnnouncementNode } from "@/models";
import { defineComponent, PropType } from "@vue/runtime-core";
import CourseTreeNodeCommentSection from "../CourseTreeNodeCommentSection.vue";
import CourseTreeNode from "../node/CourseTreeNode.vue";
import { nodeEmits, nodeProps } from "../shared";
export default defineComponent({
	name: "AnnouncementNodeDetail",
	mixins: [loadingMixin, nodeMixin, courseIdMixin],
	props: {
		node: {
			type: Object as PropType<AnnouncementNode>,
			required: true,
		},
		children: {
			type: Array as PropType<ICourseTreeNode[]>,
			default: () => [],
		},
		...nodeProps,
	},
	emits: {
		...nodeEmits,
	},
	created() {
		// TODO possibly extract shared logic
		this.$emit("loadChildren", { node: this.node, fromFirstPage: true });
		this.$emit("loadComments", this.node);
	},
	methods: {
		onEdit() {
			this.$emit("editNode", this.node);
		},
	},
	computed: {},
	components: {
		Timestamp,
		ProcessedTextFragment,
		Btn,
		SlotSkeleton,
		CourseTreeNode,
		CopyToClipboard,
		CourseTreeNodeCommentSection,
	},
});
</script>

<style></style>
