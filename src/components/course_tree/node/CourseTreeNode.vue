<template>
	<component
		v-bind="$props"
		:is="componentName"
		@editNode="$emit('editNode', $event)"
		@deleteNode="$emit('deleteNode', $event)"
		@loadChildren="$emit('loadChildren', $event)"
		@loadComments="$emit('loadComments', $event)"
	/>
</template>

<script lang="ts">
import { CourseTreeNode } from "@/models";
import { defineComponent, PropType, defineAsyncComponent } from "@vue/runtime-core";
import { nodeEmits, nodeProps } from "../shared";
// import FileNode from "./FileNode.vue";
// import TopicNode from "./TopicNode.vue";
// import LessonNode from "./LessonNode.vue";
export default defineComponent({
	name: "CourseTreeNode",
	props: {
		node: {
			type: Object as PropType<CourseTreeNode>,
			required: true,
		},
		...nodeProps,
	},
	emits: {
		...nodeEmits,
	},
	beforeCreate() {
		// dynamically import specialized components to prevent circular imports

		(this.$options.components as any).LessonNode = defineAsyncComponent(
			() => import("./LessonNode.vue"),
		);

		(this.$options.components as any).TopicNode = defineAsyncComponent(
			() => import("./TopicNode.vue"),
		);

		(this.$options.components as any).FileNode = defineAsyncComponent(
			() => import("./FileNode.vue"),
		);

		(this.$options.components as any).AnnouncementNode = defineAsyncComponent(
			() => import("./AnnouncementNode.vue"),
		);

		(this.$options.components as any).PollNode = defineAsyncComponent(
			() => import("./PollNode.vue"),
		);
	},
	methods: {},
	computed: {
		componentName(): string {
			const mapping: Record<CourseTreeNode["resourcetype"], string> = {
				FileNode: "FileNode",
				LessonNode: "LessonNode",
				TopicNode: "TopicNode",
				AnnouncementNode: "AnnouncementNode",
				PollNode: "PollNode",
			};
			return mapping[this.node.resourcetype];
		},
	},
	components: {},
	//components: { FileNode, LessonNode, TopicNode },
});
</script>

<style></style>
