import { CourseTreeNode } from "@/models";
import { useMainStore } from "@/stores/mainStore";

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
		resolveFn,
	}: {
		node: CourseTreeNode;
		fromFirstPage: boolean;
		resolveFn?: (moreResults: boolean) => void;
		rejectFn?: (error: any) => void;
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
	isExistingNode: {
		// whether the editor is being used to create a new node (false)
		// or to update an existing one (true)
		type: Boolean,
		required: true as const,
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
		fireIntegrationEvent,
	}: {
		key: K;
		value: N[K];
		save?: boolean;
		fireIntegrationEvent?: boolean;
	}) {
		return true;
	},
	deleteNode(node: CourseTreeNode) {
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

/**
 * Handles reordering of a node. It is called when a node is
 * dropped after having been dragged.
 */
export async function onChangeNodePosition(
	courseId: string,
	nodeList: CourseTreeNode[],
	oldIndex: number,
	newIndex: number,
) {
	if (oldIndex === newIndex) {
		// node didn't change position
		return;
	}
	// no updates have been fired yet, so to retrieve the node that was moved
	// it's sufficient to index the list of nodes using its old position
	const movedNode = nodeList[oldIndex];

	// to fire the update request, two parameters are needed: a target arguments are dictated
	// and the position relative to the target. the meaning of these two by django-mptt:
	// https://django-mptt.readthedocs.io/en/stable/mptt.models.html#mptt.models.TreeManager.move_node
	let moveArgs: {
		target: string | null;
		position: "first-child" | "last-child" | "left" | "right";
	};

	if (newIndex === 0) {
		// node moved to the top of the list: it's the first child of its parent now
		moveArgs = { target: movedNode.parent_id, position: "first-child" };
	} else if (newIndex === nodeList.length - 1) {
		// node moved to the end of the list: it's the last child of its parent now
		moveArgs = { target: movedNode.parent_id, position: "last-child" };
	} else if (newIndex < oldIndex) {
		// node moved to the left: it's now the left sibling of the node
		// that was at `newIndex` before the node was moved
		const newRightSibling = nodeList[newIndex];
		moveArgs = { target: newRightSibling.id, position: "left" };
	} else {
		// node moved to the right: it's now the right siblin of the node
		// that was at `newIndex` before the node was moved
		const newRightSibling = nodeList[newIndex];
		moveArgs = { target: newRightSibling.id, position: "right" };
	}

	// fire move request
	await useMainStore().moveCourseTreeNode({
		courseId,
		node: movedNode,
		targetId: moveArgs.target as string,
		position: moveArgs.position,
	});
}
