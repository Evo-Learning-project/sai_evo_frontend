<template>
	<div>
		<!-- top section with create button-->
		<div class="flex w-full mb-6 md:-mt-2 lg:-mt-8" v-if="canCreateNodes">
			<DropdownMenu
				class="ml-auto"
				:expanded="createMenuExpanded"
				@toggleExpanded="createMenuExpanded = !createMenuExpanded"
				:label="$t('course_tree.new')"
				:placement="'right'"
				:icon="'add'"
				:trailingIcon="'arrow_drop_down'"
			>
				<div class="-mx-5 -my-2">
					<ul class="">
						<li
							tabindex="0"
							v-wave
							class="
								flex
								pl-4
								pr-8
								py-2.5
								hover:bg-light
								transition-colors
								cursor-pointer
								items-top
								duration-75
							"
							v-for="nodeType in nodeTypesAsSelectableOptions"
							:key="nodeType.value"
							@click="onCreateNode(nodeType.value)"
						>
							<span class="material-icons-outlined text-muted mr-2">{{
								nodeType.icons[0]
							}}</span
							>{{ nodeType.content }}
						</li>
					</ul>
				</div>
			</DropdownMenu>
		</div>

		<!-- node list -->
		<draggable
			:modelValue="topLevelNodes"
			ghost-class="drag-ghost"
			drag-class="dragging-element"
			handle=".drag-handle"
			item-key="id"
			@start="onNodeDragStart($event)"
			@end="onNodeDragEnd($event)"
			animation="200"
			:class="{ 'dragging-inside-collection': mainStore.draggingCourseTreeNode }"
		>
			<template #item="{ element }">
				<div>
					<CourseTreeNode
						:isDraggable="canEditNodes"
						class="my-4"
						@loadChildren="
							onLoadChildren(
								$event.node,
								$event.fromFirstPage,
								$event.resolveFn,
								$event.rejectFn,
							)
						"
						@loadComments="onLoadComments($event)"
						:canEdit="canEditNodes"
						:node="element"
						@editNode="onEditNode($event)"
						@deleteNode="onDeleteNode($event)"
					/>
				</div>
			</template>
		</draggable>

		<VueEternalLoading
			v-if="!loading"
			:load="onLoadMore"
			v-model:is-initial="isInitialInfiniteLoad"
		>
			<template #loading>
				<Spinner />
			</template>
			<template #no-more> &nbsp; </template>
		</VueEternalLoading>

		<!-- empty state -->
		<div v-if="!loading && topLevelNodes.length === 0" class="flex w-full h-full mt-12">
			<div class="m-auto flex flex-col">
				<p style="font-size: 10rem" class="material-icons-outlined opacity-10 mx-auto">
					book
				</p>
				<h2 class="opacity-40 mx-auto">
					{{ $t("course_tree.no_nodes") }}
				</h2>
			</div>
		</div>

		<!-- dialog containing node editor -->
		<Dialog
			:fullHeight="fullHeightDialog"
			:large="largeDialog"
			:fullWidth="fullScreenDialog"
			@no="onDismissNodeEditor()"
			:showDialog="showEditorDialog"
			:showActions="false"
			:dismissible="autoSaveEditingNode"
			:loading="editorDialogLoading"
		>
			<template v-slot:body>
				<CourseTreeNodeEditor
					class="text-darkText"
					v-if="editingNode"
					:saving="saving"
					:savingError="savingError"
					:blockingSaving="blockingSaving"
					:modelValue="proxyEditingNode"
					:showAutoSaveIndicator="autoSaveEditingNode"
					:uploadProgress="fileUploadProgress"
					:isExistingNode="!!editingNode.id"
					@patchNode="onEditingNodeChange($event.key, $event.value, !!$event.save)"
					@save="onEditingNodeSave()"
					@closeEditor="onDismissNodeEditor()"
					@blur="onEditorBlur()"
					@deleteNode="onDeleteNode($event)"
				/>
			</template>
		</Dialog>
	</div>
</template>

<script lang="ts">
import draggable from "vuedraggable";

import CourseTreeNode from "@/components/course_tree/node/CourseTreeNode.vue";
import { SelectableOption } from "@/interfaces";
import {
	blockingDialogMixin,
	courseIdMixin,
	coursePrivilegeMixin,
	loadingMixin,
	savingMixin,
} from "@/mixins";
import {
	CoursePrivilege,
	CourseTreeNode as ICourseTreeNode,
	CourseTreeNodeType,
	FileNode,
	getBlankAnnouncementNode,
	getBlankFileNode,
	getBlankLessonNode,
	getBlankPollNode,
	getBlankTopicNode,
	TopicNode,
} from "@/models";
import { useMainStore } from "@/stores/mainStore";
import { useMetaStore } from "@/stores/metaStore";
import { defineComponent } from "@vue/runtime-core";
import { mapStores } from "pinia";
import { icons as courseTreeNodeTypeIcons } from "@/assets/courseTreeNodeTypeIcons";
import { getTranslatedString as _ } from "@/i18n";
import Dialog from "@/components/ui/Dialog.vue";
import { setErrorNotification, setPageWideError } from "@/utils";
import CourseTreeNodeEditor from "@/components/course_tree/editors/CourseTreeNodeEditor.vue";
import { getCourseTopicNodes } from "@/api";
import DropdownMenu from "@/components/ui/DropdownMenu.vue";
import { AutoSaveManager, FieldList } from "@/autoSave";
import VueEternalLoading from "@ts-pro/vue-eternal-loading/src/components/VueEternalLoading/VueEternalLoading.vue";
import { LoadAction } from "@ts-pro/vue-eternal-loading";
import Spinner from "@/components/ui/Spinner.vue";
import { onChangeNodePosition } from "@/components/course_tree/shared";

export default defineComponent({
	name: "CourseTree",
	props: {},
	mixins: [
		courseIdMixin,
		loadingMixin,
		blockingDialogMixin,
		savingMixin,
		coursePrivilegeMixin,
	],
	async created() {
		await this.withLoading(
			async () =>
				await this.mainStore.getCourseTopLevelNodes({
					courseId: this.courseId,
					fromFirstPage: true,
				}),
			setPageWideError,
		);
		await this.mainStore.getCourseRootId({ courseId: this.courseId });
		this.topics = await getCourseTopicNodes(this.courseId);
		this.selectedTopicId = this.mainStore.courseIdToTreeRootId[this.courseId];
	},
	watch: {
		"editingNode.id"(newVal) {
			// re-instantiate (or dispose of) auto save manager each time
			// a new node is edited (or no node is edited anymore)
			if (newVal) {
				this.instantiateAutoSaveManager(this.editingNode as ICourseTreeNode);
			} else {
				this.editingNodeAutoSaveManager = null;
			}
			this.editingNodeUnsavedChanges = {};
		},
	},
	data() {
		return {
			CourseTreeNodeType,
			createMenuExpanded: false,
			showEditorDialog: false,
			editingNode: null as null | ICourseTreeNode,
			editingNodeAutoSaveManager: null as null | AutoSaveManager<ICourseTreeNode>,
			editingNodeUnsavedChanges: {},
			autoSaveEditingNode: true,
			uploadingFile: false,
			editingTopicName: "",
			selectedTopicId: "",
			topics: [] as TopicNode[],
			draggingNode: false,
			saving: false,
			savingError: false,
			blockingSaving: false,
			draftFileNode: null as null | FileNode,
			fileUploadProgress: undefined as undefined | number,
			isInitialInfiniteLoad: false,
		};
	},
	methods: {
		async onLoadMore({ loaded, noMore, error }: LoadAction) {
			try {
				const moreResults = await this.mainStore.getCourseTopLevelNodes({
					courseId: this.courseId,
					fromFirstPage: false,
				});
				if (!moreResults) {
					noMore();
				} else {
					loaded();
				}
			} catch {
				error();
			}
		},
		async onNodeDragStart() {
			this.mainStore.draggingCourseTreeNode = true;
		},
		async onNodeDragEnd(event: { oldIndex: number; newIndex: number }) {
			this.mainStore.draggingCourseTreeNode = false;
			try {
				await onChangeNodePosition(
					this.courseId,
					this.topLevelNodes,
					event.oldIndex,
					event.newIndex,
				);
			} catch (e) {
				setErrorNotification(e);
			}
		},
		async onEditorBlur() {
			this.editingNodeAutoSaveManager?.flush();
		},
		onDismissNodeEditor() {
			if (
				Object.keys(this.editingNodeUnsavedChanges).length > 0 &&
				!confirm(_("course_tree.editor_discard_unsaved_changes"))
			) {
				return;
			}
			this.showEditorDialog = false;
			this.editingNode = null;
			this.editingNodeUnsavedChanges = {};
		},
		// TODO extract shared logic with NodeDetail
		instantiateAutoSaveManager(node: ICourseTreeNode) {
			this.editingNodeAutoSaveManager = new AutoSaveManager<ICourseTreeNode>(
				node,
				async changes => {
					await this.mainStore.partialUpdateCourseTreeNode({
						courseId: this.courseId,
						nodeId: node.id,
						changes,
					});
					this.saving = false;
				},
				changes => {
					this.saving = true;
					this.savingError = false;
					this.mainStore.patchCourseTreeNode({
						courseId: this.courseId,
						nodeId: node.id,
						changes,
					});
				},
				this.editingNodeDebouncedFields as FieldList<ICourseTreeNode>,
				2500,
				undefined,
				e => {
					this.saving = false;
					this.savingError = true;
					throw e;
				},
			);
		},
		async onEditingNodeChange<K extends keyof ICourseTreeNode>(
			key: K,
			value: ICourseTreeNode[K],
			save: boolean,
		) {
			if (this.autoSaveEditingNode) {
				await this.editingNodeAutoSaveManager?.onChange({ [key]: value });
			} else {
				// update local copy of unsaved changes
				this.editingNodeUnsavedChanges = {
					...this.editingNodeUnsavedChanges,
					[key]: value,
				};
			}
			if (save) {
				await this.onEditingNodeSave();
			}
		},
		async createNodeFromUnsavedChanges() {
			// used if creating a FileNode to keep track of upload progress for the file
			const onUploadProgress = (e: { loaded: number; total: number }) => {
				this.fileUploadProgress = (e.loaded / e.total) * 100;
				// make loader indeterminate after upload completes for
				//better visual feedback to the user
				if (this.fileUploadProgress === 100) {
					setTimeout(() => {
						this.fileUploadProgress = undefined;
					}, 100);
				}
			};
			try {
				// TODO if creating a file node, don't display loader in dialog
				this.blockingSaving = true;
				await this.mainStore.createCourseTreeNode({
					courseId: this.courseId,
					node: this.proxyEditingNode as ICourseTreeNode,
					config: {
						onUploadProgress,
					},
				});
				this.editingNodeUnsavedChanges = {};
				this.onDismissNodeEditor();
				this.metaStore.showSuccessFeedback();
			} catch (e) {
				setErrorNotification(e);
			} finally {
				this.blockingSaving = false;
				this.fileUploadProgress = 0;
			}
		},
		async updateNodeFromUnsavedChanges() {
			try {
				this.blockingSaving = true;
				await this.editingNodeAutoSaveManager?.onChange(this.editingNodeUnsavedChanges);
				await this.editingNodeAutoSaveManager?.flush();
				this.editingNodeUnsavedChanges = {};
				this.onDismissNodeEditor();
				this.metaStore.showSuccessFeedback();
			} catch (e) {
				setErrorNotification(e);
			} finally {
				this.blockingSaving = false;
			}
		},
		async onEditingNodeSave() {
			/**
			 * Generic utility function that saves changes to a node. This is used
			 * under a few different circumstances:
			 *
			 * - when the node exists & autosave is on: this just closes the editor
			 * dialog and show a feedback, without any actual saving operation
			 * - when the node exists & autosave is off: this saves all unsaved
			 * changes to the node, closes the editor, and shows a feedback
			 * - when the node doesn't exist yet: this creates the node, saving
			 * all unsaved changes to it
			 */
			if (!this.editingNode) {
				throw new Error(
					"onEditingNodeSave called but editingNode is " + this.editingNode,
				);
			}
			if (!this.editingNode.id) {
				/**
				 * Create node
				 * */
				await this.createNodeFromUnsavedChanges();
			} else if (!this.autoSaveEditingNode) {
				/**
				 * Save changes to existing node
				 */
				await this.updateNodeFromUnsavedChanges();
			} else {
				/**
				 * Autosave is on, so changes were already saved
				 * flush any pending changes & close editor
				 */
				await this.editingNodeAutoSaveManager?.flush();
				this.onDismissNodeEditor();
				this.metaStore.showSuccessFeedback();
			}
		},
		onEditNode(node: ICourseTreeNode) {
			this.autoSaveEditingNode = false;
			this.editingNode = node;
			this.showEditorDialog = true;
		},
		async onDeleteNode(node: ICourseTreeNode) {
			// TODO extract duplicated code with other components
			if (!confirm(_("course_tree.delete_node_confirm"))) {
				return;
			}
			await this.withLoading(
				async () =>
					await this.mainStore.deleteCourseTreeNode({
						courseId: this.courseId,
						nodeId: node.id,
					}),
				setErrorNotification,
			);
		},
		async onCreateNode(nodeType: CourseTreeNodeType) {
			// functions used to get a new node based on the given node type
			const factories = {
				[CourseTreeNodeType.LessonNode]: getBlankLessonNode,
				[CourseTreeNodeType.AnnouncementNode]: getBlankAnnouncementNode,
				[CourseTreeNodeType.PollNode]: getBlankPollNode,
				[CourseTreeNodeType.TopicNode]: getBlankTopicNode,
				[CourseTreeNodeType.FileNode]: getBlankFileNode,
			};
			const factory = factories[nodeType];
			const newNode = factory(this.mainStore.courseIdToTreeRootId[this.courseId]);

			// these types of node are autosaved on the server when created, and require
			// different treatment upon creation
			const autoSavedNodeTypes = [
				CourseTreeNodeType.LessonNode,
				CourseTreeNodeType.AnnouncementNode,
				CourseTreeNodeType.PollNode,
			];
			// set autosaving on or off depending on whether the type of node being
			// created requires it
			this.autoSaveEditingNode = autoSavedNodeTypes.includes(nodeType);

			// for autosaved node types, create the node immediately and use that one
			// for editing
			if (this.autoSaveEditingNode) {
				await this.withLoading(async () => {
					this.editingNode = await this.mainStore.createCourseTreeNode({
						courseId: this.courseId,
						node: newNode,
					});
				}, setErrorNotification);
			} else {
				// otherwise, only save changes to local object
				this.editingNode = newNode;
			}
			this.showEditorDialog = true;
		},
		async onLoadComments(node: ICourseTreeNode) {
			await this.mainStore.getCourseTreeNodeComments({
				courseId: this.courseId,
				nodeId: node.id,
			});
		},
		async onLoadChildren(
			node: ICourseTreeNode,
			fromFirstPage: boolean,
			resolveFn: (moreResults: boolean) => void,
			rejectFn: (e: any) => void,
		) {
			console.log("course tree on load children", fromFirstPage);
			try {
				const moreResults = await this.mainStore.getCourseTreeNodeChildren({
					courseId: this.courseId,
					nodeId: node.id,
					fromFirstPage,
				});
				resolveFn(moreResults);
			} catch (e) {
				rejectFn?.(e);
			}
		},
	},
	computed: {
		...mapStores(useMainStore, useMetaStore),
		proxyEditingNode() {
			if (this.autoSaveEditingNode) {
				return this.editingNode;
			}
			return {
				...this.editingNode,
				...this.editingNodeUnsavedChanges,
			} as ICourseTreeNode;
		},
		fullScreenDialog() {
			return (
				this.editingNode?.resourcetype !== CourseTreeNodeType.TopicNode &&
				this.editingNode?.resourcetype !== CourseTreeNodeType.FileNode
			); //this.editingNode?.resourcetype === CourseTreeNodeType.LessonNode;
		},
		fullHeightDialog() {
			return (
				this.fullScreenDialog &&
				this.editingNode?.resourcetype !== CourseTreeNodeType.FileNode
			); //this.editingNode?.resourcetype === CourseTreeNodeType.LessonNode;
		},
		largeDialog() {
			return (
				!this.fullScreenDialog &&
				// display a smaller dialog for topic editor, as it only includes a
				// single input field and feels less like an "editor"
				this.editingNode?.resourcetype !== CourseTreeNodeType.TopicNode
			);
		},
		editorDialogLoading() {
			return (
				this.blockingSaving &&
				// don't display loader in dialog for file nodes, as their editor
				// already shows a loader on the file upload component
				this.editingNode?.resourcetype !== CourseTreeNodeType.FileNode
			);
		},
		nodeTypesAsSelectableOptions(): SelectableOption[] {
			return (Object.keys(CourseTreeNodeType) as any[]).map(key => ({
				content: _("course_tree_node_types." + key),
				icons: courseTreeNodeTypeIcons[key],
				value: key,
			}));
		},
		topLevelNodes() {
			return this.mainStore.paginatedTopLevelCourseTreeNodes?.data ?? [];
		},
		canEditNodes() {
			return this.hasPrivileges([CoursePrivilege.MANAGE_MATERIAL]);
		},
		canCreateNodes() {
			return this.hasPrivileges([CoursePrivilege.MANAGE_MATERIAL]);
		},
		editingNodeDebouncedFields() {
			if (!this.editingNode) {
				return [];
			}
			const debouncedFields: Record<CourseTreeNodeType, string[]> = {
				AnnouncementNode: ["body"],
				TopicNode: ["name"],
				FileNode: [],
				PollNode: ["text"],
				LessonNode: ["body", "title"],
			};
			return debouncedFields[this.editingNode.resourcetype];
		},
	},
	components: {
		draggable,
		CourseTreeNode,
		DropdownMenu,
		Dialog,
		VueEternalLoading,
		CourseTreeNodeEditor,
		Spinner,
	},
});
</script>

<style></style>
