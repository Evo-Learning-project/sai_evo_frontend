<template>
	<div>
		<!-- top section with create button-->
		<div class="flex w-full mb-6 -mt-8">
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
						class="my-2"
						:class="{ 'dragging-inside-collection': draggingNode }"
						@loadChildren="onLoadChildren($event.node, $event.fromFirstPage)"
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
			@no="
				showEditorDialog = false;
				editingNode = null;
			"
			:showDialog="showEditorDialog"
			:showActions="false"
		>
			<template v-slot:body>
				<CourseTreeNodeEditor
					v-if="editingNode"
					:modelValue="editingNode"
					:autoSave="autoSaveEditingNode"
					@closeEditor="
						showEditorDialog = false;
						editingNode = null;
					"
				/>
			</template>
		</Dialog>

		<Dialog
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

					<div class="m-auto w-2/3">
						<FileUpload :uploading="uploadingFile" v-model="fileUploadProxy" />
					</div>
				</div>
			</template>
		</Dialog>

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
import { blockingDialogMixin, courseIdMixin, loadingMixin } from "@/mixins";
import {
	CourseTreeNode as ICourseTreeNode,
	CourseTreeNodeType,
	getBlankAnnouncementNode,
	getBlankFileNode,
	getBlankLessonNode,
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

export default defineComponent({
	name: "CourseTree",
	props: {},
	mixins: [courseIdMixin, loadingMixin, blockingDialogMixin],
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
	data() {
		return {
			CourseTreeNodeType,
			createMenuExpanded: false,
			showEditorDialog: false,
			editingNode: null as null | ICourseTreeNode,
			autoSaveEditingNode: true,
			creatingFileNode: false,
			uploadingFile: false,
			editingTopicName: "",
			selectedTopicId: "",
			topics: [] as TopicNode[],
			draggingNode: false,
		};
	},
	methods: {
		async onNodeDragStart() {
			console.log("start");
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
		async onCreateNode(nodeType: CourseTreeNodeType) {
			if (nodeType === CourseTreeNodeType.TopicNode) {
				const choice = await this.getBlockingBinaryDialogChoice();
				if (!choice) {
					this.showBlockingDialog = false;
					return;
				}
				await this.withLocalLoading(
					async () =>
						await this.mainStore.createCourseTreeNode({
							courseId: this.courseId,
							node: getBlankTopicNode(null, this.editingTopicName.trim()),
						}),
				);
				this.showBlockingDialog = false;
				this.editingTopicName = "";
			} else if (nodeType === CourseTreeNodeType.FileNode) {
				// open dialog to create file node
				this.creatingFileNode = true;
			} else {
				const factories = {
					[CourseTreeNodeType.LessonNode]: getBlankLessonNode,
					[CourseTreeNodeType.AnnouncementNode]: getBlankAnnouncementNode,
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
		async onLoadChildren(node, fromFirstPage: boolean) {
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
		fullScreenDialog() {
			return this.editingNode?.resourcetype === CourseTreeNodeType.LessonNode;
		},
		topicsAsOptions(): SelectableOption[] {
			return [
				{
					value: this.mainStore.courseIdToTreeRootId[this.courseId],
					content: _("course_tree.no_topic"),
				},
				...this.topics.map(t => ({
					value: t.id,
					content: t.name,
				})),
			];
		},
		nodeTypesAsSelectableOptions(): SelectableOption[] {
			return (
				(Object.keys(CourseTreeNodeType) as any[])
					//.filter((key: string | number) => parseInt(key as string) == key)
					.map(key => ({
						content: _("course_tree_node_types." + key),
						icons: courseTreeNodeTypeIcons[key],
						value: key,
						// icons: exerciseStatesIcons[key],
						// value: parseInt(String(key)),
						// content: _("exercise_states." + key),
						// description: _("exercise_states_descriptions." + key),
					}))
			);
		},
		fileUploadProxy: {
			get() {
				return [];
			},
			async set(val: Blob) {
				await this.createFileNode(val);
			},
		},
		topLevelNodes() {
			return this.mainStore.paginatedTopLevelCourseTreeNodes?.data ?? [];
		},
		canEditNodes() {
			return true;
		},
		canCreateNodes() {
			return true;
		},
	},
	components: {
		draggable,
		CourseTreeNode,
		DropdownMenu,
		Dialog,
		FileUpload,
		CourseTreeNodeEditor,
		TextInput,
		Dropdown,
	},
});
</script>

<style></style>
