<template>
	<component
		:is="editorComponentName"
		v-bind="$props"
		@closeEditor="$emit('closeEditor')"
	></component>
</template>

<script lang="ts">
import { CourseTreeNode, CourseTreeNodeType } from "@/models";
import { defineComponent, PropType } from "@vue/runtime-core";
import { nodeEditorProps } from "../shared";
import AnnouncementNodeEditor from "./AnnouncementNodeEditor.vue";
import FileNodeEditor from "./FileNodeEditor.vue";
import LessonNodeEditor from "./LessonNodeEditor.vue";
import PollNodeEditor from "./PollNodeEditor.vue";
import TopicNodeEditor from "./TopicNodeEditor.vue";
export default defineComponent({
	name: "CourseTreeNodeEditor",
	props: {
		modelValue: {
			type: Object as PropType<CourseTreeNode>,
			required: true,
		},
		...nodeEditorProps,
	},
	methods: {},
	computed: {
		editorComponentName() {
			const resourceTypeToEditorMapping: Record<CourseTreeNodeType, string> = {
				[CourseTreeNodeType.FileNode]: "FileNodeEditor",
				[CourseTreeNodeType.LessonNode]: "LessonNodeEditor",
				[CourseTreeNodeType.TopicNode]: "TopicNodeEditor",
				[CourseTreeNodeType.PollNode]: "PollNodeEditor",
				[CourseTreeNodeType.AnnouncementNode]: "AnnouncementNodeEditor",
			};
			return resourceTypeToEditorMapping[this.modelValue.resourcetype];
		},
	},
	components: {
		FileNodeEditor,
		LessonNodeEditor,
		TopicNodeEditor,
		AnnouncementNodeEditor,
		PollNodeEditor,
	},
});
</script>

<style></style>
