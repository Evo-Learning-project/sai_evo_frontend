<template>
	<component :is="componentName" v-bind="passDownProps" :node="node"></component>
</template>

<script lang="ts">
import { nodeProps } from "@/components/course_tree/shared";
import { courseIdMixin, loadingMixin, nodeIdMixin } from "@/mixins";
import { CourseTreeNode } from "@/models";
import { useMainStore } from "@/stores/mainStore";
import { defineAsyncComponent, defineComponent, PropType } from "@vue/runtime-core";
import { mapStores } from "pinia";

export default defineComponent({
	name: "CourseTreeNodeDetail",
	props: {
		//...nodeProps,
	},
	mixins: [nodeIdMixin, loadingMixin, courseIdMixin],
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
	methods: {},
	computed: {
		...mapStores(useMainStore),
		node() {
			return this.mainStore.currentCourseTreeNode; // this.mainStore.getCourseTreeNodeById(this.nodeId);
		},
		passDownProps() {
			return { ...this.$props, canEdit: this.canEdit };
		},
		canEdit() {
			// TODO implement
			return true;
		},
		componentName(): string {
			if (!this.node) {
				return "";
			}
			const mapping: Record<CourseTreeNode["resourcetype"], string> = {
				FileNode: "FileNodeDetail",
				LessonNode: "LessonNodeDetail",
				TopicNode: "TopicNodeDetail",
			};
			return mapping[this.node.resourcetype];
		},
	},
	components: {},
});
</script>

<style></style>
