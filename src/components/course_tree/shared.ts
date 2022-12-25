import { CourseTreeNode } from "@/models";

export const nodeProps = {
	canEdit: {
		type: Boolean,
		required: true as const,
	},
	isDraggable: {
		type: Boolean,
		required: true as const,
	},
	loadingComments: {
		type: Boolean,
		default: false as const,
	},
	loadingChildren: {
		type: Boolean,
		default: false as const,
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
	loadComments(node: CourseTreeNode) {
		return true;
	},
	viewerClose() {
		return true;
	},
};

export const nodeEditorProps = {
	blockingSaving: {
		type: Boolean,
		default: false as const,
	},
	saving: {
		type: Boolean,
		default: false as const,
	},
	savingError: {
		type: Boolean,
		default: false as const,
	},
	showAutoSaveIndicator: {
		type: Boolean,
		required: true as const,
	},
	uploadProgress: {
		type: Number,
		required: false as const,
	},
};

export const nodeEditorEmits = {
	patchNode<N extends CourseTreeNode, K extends keyof N>({
		key,
		value,
		save,
	}: {
		key: K;
		value: N[K];
		save?: boolean;
	}) {
		return true;
	},
	blur() {
		return true;
	},
	save() {
		return true;
	},
	closeEditor() {
		return true;
	},
};
