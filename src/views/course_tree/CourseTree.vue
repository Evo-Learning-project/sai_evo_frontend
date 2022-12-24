<template>
	<div>
		<!-- top section with create button-->
		<div class="flex w-full mb-6 -mt-8" v-if="canCreateNodes">
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

		<draggable
			:modelValue="topLevelNodes"
			ghost-class="drag-ghost"
			drag-class="dragging-element"
			handle=".drag-handle"
			item-key="id"
			@start="onNodeDragStart($event)"
			@end="onNodeDragEnd($event)"
			animation="200"
		>
			<template #item="{ element }">
				<div>
					<CourseTreeNode
						:isDraggable="canEditNodes"
						class="my-4"
						:class="{ 'dragging-inside-collection': draggingNode }"
						@loadChildren="onLoadChildren($event.node, $event.fromFirstPage)"
						@loadComments="onLoadComments($event)"
						:canEdit="canEditNodes"
						:node="element"
						@editNode="onEditNode($event)"
						@deleteNode="onDeleteNode($event)"
					/>
				</div>
			</template>
		</draggable>

		<!-- <div class="my-4" v-for="node in topLevelNodes" :key="node.id">
			<CourseTreeNode
				@loadChildren="onLoadChildren($event.node, $event.fromFirstPage)"
				:canEdit="canEditNodes"
				:node="node"
				@editNode="onEditNode($event)"
				@deleteNode="onDeleteNode($event)"
			/>
		</div> -->
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

		<Dialog
			:fullHeight="fullScreenDialog"
			:large="!fullScreenDialog"
			:fullWidth="fullScreenDialog"
			@no="onDismissNodeEditor()"
			:showDialog="showEditorDialog"
			:showActions="false"
			:dismissible="autoSaveEditingNode"
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
					@patchNode="onEditingNodeChange($event.key, $event.value, !!$event.save)"
					@save="onEditingNodeSave()"
					@closeEditor="onDismissNodeEditor()"
					@blur="onEditorBlur()"
				/>
			</template>
		</Dialog>

		<!-- <Dialog
			:fullWidth="true"
			@yes="creatingFileNode = false"
			:showDialog="creatingFileNode"
			:confirmOnly="true"
			:yesText="$t('dialog.default_cancel_text')"
		>
			<template v-slot:title>
				<h1>{{ $t("course_tree.create_file_node_title") }}</h1>
			</template>
			<template v-slot:body>
				<div class="flex flex-col space-y-4">
					 <div class="w-2/3 flex mx-auto">
						<Dropdown
							class="mr-auto w-1/2"
							:options="topicsAsOptions"
							v-model="selectedTopicId"
							>{{ $t("course_tree.topic_label") }}</Dropdown
						>
					</div>
					<FileNodeEditor
						:modelValue="draftFileNode"
						@patchNode="onEditingNodeChange()"
					></FileNodeEditor>

					<div class="m-auto w-2/3">
						<FileUpload :uploading="uploadingFile" v-model="fileUploadProxy" />
					</div>
				</div>
			</template>
		</Dialog> -->

		<Dialog
			@yes="resolveBlockingDialog(true)"
			@no="resolveBlockingDialog(false)"
			:showDialog="showBlockingDialog"
			:yesText="localLoading ? $t('misc.wait') : $t('course_tree.create')"
			:noText="$t('dialog.default_cancel_text')"
			:disableOk="editingTopicName.trim().length === 0 || localLoading"
		>
			<template v-slot:title>
				<h1>{{ $t("course_tree.new_topic_title") }}</h1>
			</template>
			<template v-slot:body>
				<div class="flex">
					<TextInput class="w-full mx-auto" v-model="editingTopicName">{{
						$t("course_tree.topic_node_name")
					}}</TextInput>
				</div>
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
import FileUpload from "@/components/ui/FileUpload.vue";
import { setErrorNotification } from "@/utils";
import CourseTreeNodeEditor from "@/components/course_tree/editors/CourseTreeNodeEditor.vue";
import TextInput from "@/components/ui/TextInput.vue";
import { getCourseTopicNodes } from "@/api";
import DropdownMenu from "@/components/ui/DropdownMenu.vue";
import Dropdown from "@/components/ui/Dropdown.vue";
import { AutoSaveManager, FieldList } from "@/autoSave";
import FileNodeEditor from "@/components/course_tree/editors/FileNodeEditor.vue";

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
		await this.withLoading(async () =>
			this.mainStore.getCourseTopLevelNodes({
				courseId: this.courseId,
				fromFirstPage: true,
			}),
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
			creatingFileNode: false,
			uploadingFile: false,
			editingTopicName: "",
			selectedTopicId: "",
			topics: [] as TopicNode[],
			draggingNode: false,
			saving: false,
			savingError: false,
			blockingSaving: false,
			draftFileNode: null as null | FileNode,
			fileUploadProgress: 0,
		};
	},
	methods: {
		async onNodeDragStart() {
			this.draggingNode = true;
		},
		async onNodeDragEnd(event: { oldIndex: number; newIndex: number }) {
			this.draggingNode = false;
			console.log("node drag end", event);
			const newIndex = event.newIndex;
			const oldIndex = event.oldIndex;
			if (oldIndex === newIndex) {
				return;
			}
			const movedNode = this.topLevelNodes[oldIndex];
			let moveArgs: {
				target: string | null;
				position: "first-child" | "last-child" | "left" | "right";
			};
			if (newIndex === 0) {
				moveArgs = { target: movedNode.parent_id, position: "first-child" };
			} else if (newIndex === this.topLevelNodes.length - 1) {
				moveArgs = { target: movedNode.parent_id, position: "last-child" };
			} else if (newIndex < oldIndex) {
				const newRightSibling = this.topLevelNodes[newIndex];
				moveArgs = { target: newRightSibling.id, position: "left" };
			} else {
				const newRightSibling = this.topLevelNodes[newIndex];
				moveArgs = { target: newRightSibling.id, position: "right" };
			}
			try {
				await this.mainStore.moveCourseTreeNode({
					courseId: this.courseId,
					node: movedNode,
					targetId: moveArgs.target as string,
					position: moveArgs.position,
				});
			} catch (e) {
				setErrorNotification(e);
			}
		},
		async onEditorBlur() {
			this.editingNodeAutoSaveManager?.flush();
		},
		onDismissNodeEditor() {
			this.showEditorDialog = false;
			this.editingNode = null;
		},
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

				// used if creating a FileNode to keep track of upload progress for the file
				const onUploadProgress = (e: { loaded: number; total: number }) => {
					this.fileUploadProgress = (e.loaded / e.total) * 100;
				};
				try {
					this.blockingSaving = true;
					await this.mainStore.createCourseTreeNode({
						courseId: this.courseId,
						node: this.proxyEditingNode,
						config: {
							onUploadProgress,
						},
					});
					this.onDismissNodeEditor();
					this.metaStore.showSuccessFeedback();
				} catch (e) {
					setErrorNotification(e);
				} finally {
					this.blockingSaving = false;
					this.fileUploadProgress = 0;
				}
			} else if (!this.autoSaveEditingNode) {
				/**
				 * Save changes to existing node
				 */
				try {
					this.blockingSaving = true;
					await this.editingNodeAutoSaveManager?.onChange(this.editingNodeUnsavedChanges);
					await this.editingNodeAutoSaveManager?.flush();
					this.onDismissNodeEditor();
					this.metaStore.showSuccessFeedback();
				} catch (e) {
					setErrorNotification(e);
				} finally {
					this.blockingSaving = false;
				}
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
			/* TODO make deep copy of editing node and await a blocking dialog
			meanwhile, you save all changes in the deep copied object and if the user
			saves, you flush everything in the autosave manager.

			In order to be able to do this, you need to lift up the manager here
			instead of using it in the editors. The editors will simply emit patchNode({key: val})
			*/
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
		async createFileNode(file: Blob) {
			this.uploadingFile = true;
			try {
				await this.mainStore.createCourseTreeNode({
					courseId: this.courseId,
					node: { ...getBlankFileNode(this.selectedTopicId), file },
				});
				this.metaStore.showSuccessFeedback();
				this.creatingFileNode = false;
				this.selectedTopicId = this.mainStore.courseIdToTreeRootId[this.courseId];
			} catch (e) {
				setErrorNotification(e);
			} finally {
				this.uploadingFile = false;
			}
		},
		async createTopicNode() {
			const choice = await this.getBlockingBinaryDialogChoice();
			if (!choice) {
				this.showBlockingDialog = false;
				return;
			}
			await this.withLocalLoading(async () => {
				await this.mainStore.createCourseTreeNode({
					courseId: this.courseId,
					node: getBlankTopicNode(null, this.editingTopicName.trim()),
				});
			});
			this.showBlockingDialog = false;
			this.editingTopicName = "";
		},
		async onCreateNode(nodeType: CourseTreeNodeType) {
			if (nodeType === CourseTreeNodeType.TopicNode) {
				await this.createTopicNode();
			} else if (nodeType === CourseTreeNodeType.FileNode) {
				// don't create node on the server just yet
				this.editingNode = getBlankFileNode(
					this.mainStore.courseIdToTreeRootId[this.courseId],
				);
				this.autoSaveEditingNode = false;
				this.showEditorDialog = true;
			} else {
				// immediately create node & open editor
				const factories = {
					[CourseTreeNodeType.LessonNode]: getBlankLessonNode,
					[CourseTreeNodeType.AnnouncementNode]: getBlankAnnouncementNode,
					[CourseTreeNodeType.PollNode]: getBlankPollNode,
				};
				await this.withLoading(async () => {
					this.editingNode = await this.mainStore.createCourseTreeNode({
						courseId: this.courseId,
						node: factories[nodeType](null),
					});
					this.autoSaveEditingNode = true;
					this.showEditorDialog = true;
				}, setErrorNotification);
			}
		},
		async onLoadComments(node: ICourseTreeNode) {
			await this.mainStore.getCourseTreeNodeComments({
				courseId: this.courseId,
				nodeId: node.id,
			});
		},
		async onLoadChildren(node: ICourseTreeNode, fromFirstPage: boolean) {
			console.log("course tree on load children", fromFirstPage);
			await this.mainStore.getCourseTreeNodeChildren({
				courseId: this.courseId,
				nodeId: node.id,
				fromFirstPage,
			});
		},
	},
	computed: {
		...mapStores(useMainStore, useMetaStore),
		proxyEditingNode() {
			if (this.autoSaveEditingNode) {
				return this.editingNode;
			}
			return { ...this.editingNode, ...this.editingNodeUnsavedChanges };
		},
		fullScreenDialog() {
			return this.editingNode?.resourcetype === CourseTreeNodeType.LessonNode;
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
			if (this.editingNode?.resourcetype !== CourseTreeNodeType.LessonNode) {
				return [];
			}
			return ["body", "title"];
		},
	},
	components: {
		draggable,
		CourseTreeNode,
		DropdownMenu,
		Dialog,
		//FileUpload,
		CourseTreeNodeEditor,
		TextInput,
		//Dropdown,
		//FileNodeEditor,
	},
});
</script>

<style></style>
