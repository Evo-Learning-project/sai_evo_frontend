<template>
	<component
		@loadChildren="onLoadChildren($event.node, $event.fromFirstPage)"
		@loadComments="onLoadComments($event)"
		:children="nodeChildren"
		:is="componentName"
		v-bind="passDownProps"
		:loadingComments="loadingComments"
		:loadingChildren="loadingChildren"
		:node="node"
		v-if="!firstLoading"
	/>
	<div v-else>
		<SlotSkeleton />
		<SlotSkeleton />
		<SlotSkeleton />
	</div>
</template>

<script lang="ts">
import { nodeProps } from "@/components/course_tree/shared";
import SlotSkeleton from "@/components/ui/skeletons/SlotSkeleton.vue";
import { courseIdMixin, coursePrivilegeMixin, loadingMixin, nodeIdMixin } from "@/mixins";
import { CoursePrivilege, CourseTreeNode } from "@/models";
import { useMainStore } from "@/stores/mainStore";
import { setErrorNotification } from "@/utils";
import { defineAsyncComponent, defineComponent, PropType } from "@vue/runtime-core";
import { mapStores } from "pinia";

export default defineComponent({
	name: "CourseTreeNodeDetail",
	props: {
		//...nodeProps,
	},
	mixins: [nodeIdMixin, loadingMixin, courseIdMixin, coursePrivilegeMixin],
	beforeCreate() {
		// dynamically import specialized components to prevent circular imports
		(this.$options.components as any).LessonNodeDetail = defineAsyncComponent(
			() => import("../../components/course_tree/node_detail/LessonNodeDetail.vue"),
		);

		// (this.$options.components as any).TopicNode = defineAsyncComponent(
		// 	() => import("../../components/course_tree/node_detail/TopicNodeDetail.vue"),
		// );

		// (this.$options.components as any).FileNode = defineAsyncComponent(
		// 	() => import("../../components/course_tree/node_detail/FileNodeDetail.vue"),
		// );
	},
	async created() {
		await this.withFirstLoading(async () =>
			this.mainStore.getCourseTreeNodeDetail({
				courseId: this.courseId,
				nodeId: this.nodeId,
			}),
		);
	},
	data() {
		return {
			loadingChildren: false,
			loadingComments: false,
		};
	},
	methods: {
		async onLoadChildren(node: CourseTreeNode, fromFirstPage: boolean) {
			this.loadingChildren = true;
			try {
				await this.mainStore.getCourseTreeNodeChildren({
					courseId: this.courseId,
					nodeId: node.id,
					fromFirstPage,
				});
			} catch (e) {
				setErrorNotification(e);
			} finally {
				this.loadingChildren = false;
			}
		},
		async onLoadComments(node: CourseTreeNode) {
			this.loadingComments = true;
			try {
				await this.mainStore.getCourseTreeNodeComments({
					courseId: this.courseId,
					nodeId: node.id,
				});
			} catch (e) {
				setErrorNotification(e);
			} finally {
				this.loadingComments = false;
			}
		},
	},
	computed: {
		...mapStores(useMainStore),
		node() {
			return this.mainStore.currentCourseTreeNode; // this.mainStore.getCourseTreeNodeById(this.nodeId);
		},
		nodeChildren() {
			return this.mainStore.paginatedChildrenByNodeId[this.node?.id ?? ""]?.data ?? [];
		},
		passDownProps() {
			return { ...this.$props, canEdit: this.canEdit };
		},
		canEdit() {
			// TODO extract logic shared with CourseTree
			return this.hasPrivileges([CoursePrivilege.MANAGE_MATERIAL]);
		},
		componentName(): string {
			if (!this.node) {
				return "";
			}
			const mapping: Record<CourseTreeNode["resourcetype"], string> = {
				FileNode: "FileNodeDetail",
				LessonNode: "LessonNodeDetail",
				TopicNode: "TopicNodeDetail",
				AnnouncementNode: "AnnouncementNodeDetail",
				PollNode: "PollNodeDetail",
			};
			return mapping[this.node.resourcetype];
		},
	},
	components: { SlotSkeleton },
});
</script>

<style></style>
