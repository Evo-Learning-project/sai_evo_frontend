<template>
	<component
		:is="editorComponentName"
		v-bind="$props"
		@closeEditor="$emit('closeEditor')"
		@patchNode="$emit('patchNode', $event)"
		@blur="$emit('blur')"
		@save="$emit('save')"
		@deleteNode="$emit('deleteNode', $event)"
		@updateState="$emit('updateState', $event)"
	></component>
</template>

<script lang="ts">
import { CourseTreeNode, CourseTreeNodeType } from "@/models";
import { defineComponent, PropType } from "@vue/runtime-core";
import { nodeEditorEmits, nodeEditorProps } from "../shared";
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
	emits: { ...nodeEditorEmits },
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
