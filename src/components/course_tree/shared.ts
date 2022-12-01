import { CourseTreeNode } from "@/models";

export const nodeProps = {
	canEdit: {
		type: Boolean,
		required: true as const,
	},
};

export const nodeEmits = {
	editNode(node: CourseTreeNode) {
		return true;
	},
	deleteNode(node: CourseTreeNode) {
		return true;
	},
	loadChildren({
		node,
		fromFirstPage,
	}: {
		node: CourseTreeNode;
		fromFirstPage: boolean;
	}) {
		return true;
	},
};

export const nodeEditorProps = {
	autoSave: {
		type: Boolean,
		required: true as const,
	},
};
