<template>
	<div>
		<component
			@loadChildren="onLoadChildren($event.node, $event.fromFirstPage)"
			@loadComments="onLoadComments($event)"
			@editNode="onEditNode()"
			@deleteNode="onDeleteNode($event)"
			@viewerClose="onViewerClose()"
			:children="nodeChildren"
			:is="componentName"
			v-bind="passDownProps"
			:loadingComments="loadingComments"
			:loadingChildren="loadingChildren"
			:node="node"
			v-if="!firstLoading"
		/>
		<div v-else>
			<SlotSkeleton />
			<SlotSkeleton />
			<SlotSkeleton />
		</div>
		<Dialog
			:fullHeight="fullScreenDialog"
			:large="!fullScreenDialog"
			:fullWidth="fullScreenDialog"
			@no="onDismissEditor()"
			:showDialog="editorOpen"
			:showActions="false"
			:dismissible="false"
			:loading="blockingSaving"
		>
			<template v-slot:body>
				<CourseTreeNodeEditor
					:isExistingNode="true"
					class="text-darkText"
					:saving="saving"
					:savingError="savingError"
					:blockingSaving="blockingSaving"
					:modelValue="proxyEditingNode"
					:showAutoSaveIndicator="false"
					@patchNode="onEditingNodeChange($event.key, $event.value, !!$event.save)"
					@updateState="onStateUpdate($event)"
					@save="onSave()"
					@closeEditor="onDismissEditor()"
					@deleteNode="onDeleteNode($event)"
				/>
			</template>
		</Dialog>
	</div>
</template>

<script lang="ts">
import { AutoSaveManager, FieldList } from "@/autoSave";
import CourseTreeNodeEditor from "@/components/course_tree/editors/CourseTreeNodeEditor.vue";
import {
	NodeEditorStateUpdatePayload,
	nodeEmits,
	nodeProps,
} from "@/components/course_tree/shared";
import Dialog from "@/components/ui/Dialog.vue";
import SlotSkeleton from "@/components/ui/skeletons/SlotSkeleton.vue";
import { getTranslatedString as _ } from "@/i18n";
import { courseIdMixin, coursePrivilegeMixin, loadingMixin, nodeIdMixin } from "@/mixins";
import { CoursePrivilege, CourseTreeNode, CourseTreeNodeType } from "@/models";
import { useMainStore } from "@/stores/mainStore";
import { setErrorNotification } from "@/utils";
import { defineAsyncComponent, defineComponent, PropType } from "@vue/runtime-core";
import { mapStores } from "pinia";

export default defineComponent({
	name: "CourseTreeNodeDetail",
	props: {
		//...nodeProps,
	},
	emits: {
		...nodeEmits,
	},
	mixins: [nodeIdMixin, loadingMixin, courseIdMixin, coursePrivilegeMixin],
	beforeCreate() {
		// dynamically import specialized components to prevent circular imports
		(this.$options.components as any).LessonNodeDetail = defineAsyncComponent(
			() => import("../../components/course_tree/node_detail/LessonNodeDetail.vue"),
		);
		(this.$options.components as any).PollNodeDetail = defineAsyncComponent(
			() => import("../../components/course_tree/node_detail/PollNodeDetail.vue"),
		);
		(this.$options.components as any).AnnouncementNodeDetail = defineAsyncComponent(
			() => import("../../components/course_tree/node_detail/AnnouncementNodeDetail.vue"),
		);
		(this.$options.components as any).FileNodeDetail = defineAsyncComponent(
			() => import("../../components/course_tree/node_detail/FileNodeDetail.vue"),
		);
	},
	beforeUnmount() {
		window.removeEventListener("beforeunload", this.beforeWindowUnload);
	},
	async created() {
		window.addEventListener("beforeunload", this.beforeWindowUnload);
		await this.withFirstLoading(async () =>
			this.mainStore.getCourseTreeNodeDetail({
				courseId: this.courseId,
				nodeId: this.nodeId,
			}),
		);
	},
	data() {
		return {
			loadingChildren: false,
			loadingComments: false,
			unsavedChanges: {},
			autoSaveManager: null as null | AutoSaveManager<CourseTreeNode>,
			editorOpen: false,
			saving: false,
			savingError: false,
			blockingSaving: false,
		};
	},
	methods: {
		beforeWindowUnload(e: { preventDefault: () => void; returnValue: string }) {
			if (
				Object.keys(this.unsavedChanges).length > 0 &&
				!confirm(_("course_tree.editor_discard_unsaved_changes"))
			) {
				// Cancel the event
				e.preventDefault();
				// Chrome requires returnValue to be set
				e.returnValue = "";
			}
		},
		onViewerClose() {
			this.$router.push({
				name: "CourseTreeDispatcher",
				params: { courseId: this.courseId },
			});
		},
		async onSave() {
			try {
				this.blockingSaving = true;
				await this.autoSaveManager?.onChange(this.unsavedChanges);
				await this.autoSaveManager?.flush();
				this.unsavedChanges = {};
				this.onDismissEditor();
				this.metaStore.showSuccessFeedback();
			} catch (e) {
				setErrorNotification(e);
			} finally {
				this.blockingSaving = false;
			}
		},
		async onStateUpdate({ newState, params }: NodeEditorStateUpdatePayload) {
			const changes = {
				state: newState,
				...this.unsavedChanges,
			};
			try {
				this.blockingSaving = true;
				await this.mainStore.partialUpdateCourseTreeNode({
					courseId: this.courseId,
					nodeId: this.node.id,
					changes,
					fireIntegrationEvent: params.fireIntegrationEvent,
				});
				this.mainStore.patchCourseTreeNode({
					courseId: this.courseId,
					nodeId: this.node.id,
					changes,
				});
				this.unsavedChanges = {};
				this.onDismissEditor();
				this.metaStore.showSuccessFeedback();
			} catch (e) {
				setErrorNotification(e);
			} finally {
				this.blockingSaving = false;
			}
		},
		instantiateAutoSaveManager(node: CourseTreeNode) {
			this.autoSaveManager = new AutoSaveManager<CourseTreeNode>(
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
				this.editingNodeDebouncedFields as FieldList<CourseTreeNode>,
				2500,
				undefined,
				e => {
					this.saving = false;
					this.savingError = true;
					throw e;
				},
			);
		},
		async onEditingNodeChange<K extends keyof CourseTreeNode>(
			key: K,
			value: CourseTreeNode[K],
			save: boolean,
		) {
			// update local copy of unsaved changes
			this.unsavedChanges = {
				...this.unsavedChanges,
				[key]: value,
			};
			if (save) {
				await this.onSave();
			}
		},
		onEditNode() {
			this.unsavedChanges = {};
			// TODO passing this.node causes bug that we had in exercise children editor, fix
			this.instantiateAutoSaveManager(this.node as CourseTreeNode);
			this.editorOpen = true;
		},
		onDismissEditor() {
			if (
				Object.keys(this.unsavedChanges).length > 0 &&
				!confirm(_("course_tree.editor_discard_unsaved_changes"))
			) {
				return;
			}
			this.editorOpen = false;
			this.autoSaveManager = null;
		},
		async onLoadChildren(node: CourseTreeNode, fromFirstPage: boolean) {
			this.loadingChildren = true;
			try {
				await this.mainStore.getCourseTreeNodeChildren({
					courseId: this.courseId,
					nodeId: node.id,
					fromFirstPage,
				});
			} catch (e) {
				setErrorNotification(e);
			} finally {
				this.loadingChildren = false;
			}
		},
		async onLoadComments(node: CourseTreeNode) {
			this.loadingComments = true;
			try {
				await this.mainStore.getCourseTreeNodeComments({
					courseId: this.courseId,
					nodeId: node.id,
				});
			} catch (e) {
				setErrorNotification(e);
			} finally {
				this.loadingComments = false;
			}
		},
		async onDeleteNode(node: CourseTreeNode) {
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
	},
	computed: {
		...mapStores(useMainStore),
		node() {
			return this.mainStore.currentCourseTreeNode as CourseTreeNode;
		},
		nodeChildren() {
			return this.mainStore.paginatedChildrenByNodeId[this.node?.id ?? ""]?.data ?? [];
		},
		// TODO extract shared logic
		editingNodeDebouncedFields() {
			if (this.node?.resourcetype !== CourseTreeNodeType.LessonNode) {
				return [];
			}
			return ["body", "title"];
		},
		proxyEditingNode() {
			return { ...this.node, ...this.unsavedChanges };
		},
		fullScreenDialog() {
			return this.node?.resourcetype === CourseTreeNodeType.LessonNode;
		},
		passDownProps() {
			return { ...this.$props, canEdit: this.canEdit };
		},
		canEdit() {
			// TODO extract logic shared with CourseTree
			return this.hasPrivileges([CoursePrivilege.MANAGE_MATERIAL]);
		},
		componentName(): string {
			if (!this.node) {
				return "";
			}
			const mapping: Record<CourseTreeNode["resourcetype"], string> = {
				FileNode: "FileNodeDetail",
				LessonNode: "LessonNodeDetail",
				TopicNode: "TopicNodeDetail",
				AnnouncementNode: "AnnouncementNodeDetail",
				PollNode: "PollNodeDetail",
			};
			return mapping[this.node.resourcetype];
		},
	},
	components: { SlotSkeleton, Dialog, CourseTreeNodeEditor },
});
</script>

<style></style>
