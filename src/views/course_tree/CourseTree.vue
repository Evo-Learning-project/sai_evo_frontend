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

		<div class="my-4" v-for="node in topLevelNodes" :key="node.id">
			<CourseTreeNode
				@loadChildren="onLoadChildren(node)"
				:canEdit="canEditNodes"
				:node="node"
				@editLesson="onEditLesson(node)"
			/>
		</div>
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
			:fullHeight="true"
			:large="true"
			@no="showEditorDialog = false"
			:showDialog="showEditorDialog"
			:showActions="false"
		>
			<template v-slot:body>
				<!-- editing lesson node -->
				<LessonNodeEditor
					class="text-darkText"
					:modelValue="editingLessonNode"
					@closeEditor="onCloseLessonEditor()"
					v-if="editingLessonNode"
				/>
			</template>
		</Dialog>

		<Dialog
			:large="true"
			@yes="creatingFileNode = false"
			:showDialog="creatingFileNode"
			:confirmOnly="true"
			:yesText="$t('dialog.default_cancel_text')"
		>
			<template v-slot:title>
				<h1>{{ $t("course_tree.create_file_node_title") }}</h1>
			</template>
			<template v-slot:body>
				<div class="flex">
					<div class="m-auto w-2/3">
						<FileUpload :uploading="uploadingFile" v-model="fileUploadProxy" />
					</div>
				</div>
			</template>
		</Dialog>
	</div>
</template>

<script lang="ts">
import CourseTreeNode from "@/components/course_tree/node/CourseTreeNode.vue";
import DropdownMenu from "@/components/ui/DropdownMenu.vue";
import { SelectableOption } from "@/interfaces";
import { courseIdMixin, loadingMixin } from "@/mixins";
import {
	CourseTreeNode as ICourseTreeNode,
	CourseTreeNodeType,
	getBlankFileNode,
	getBlankLessonNode,
	LessonNode,
} from "@/models";
import { useMainStore } from "@/stores/mainStore";
import { useMetaStore } from "@/stores/metaStore";
import { defineComponent } from "@vue/runtime-core";
import { mapStores } from "pinia";
import { icons as courseTreeNodeTypeIcons } from "@/assets/courseTreeNodeTypeIcons";
import { getTranslatedString as _ } from "@/i18n";
import Dialog from "@/components/ui/Dialog.vue";
import LessonNodeEditor from "@/components/course_tree/editors/LessonNodeEditor.vue";
import FileUpload from "@/components/ui/FileUpload.vue";
import { setErrorNotification } from "@/utils";
export default defineComponent({
	name: "CourseTree",
	props: {},
	mixins: [courseIdMixin, loadingMixin],
	async created() {
		await this.withLoading(async () =>
			this.mainStore.getCourseTopLevelNodes({
				courseId: this.courseId,
				fromFirstPage: true,
			}),
		);
	},
	data() {
		return {
			CourseTreeNodeType,
			createMenuExpanded: false,
			showEditorDialog: false,
			editingLessonNode: null as null | ICourseTreeNode,
			creatingFileNode: false,
			uploadingFile: false,
		};
	},
	methods: {
		onEditLesson(node: LessonNode) {
			this.editingLessonNode = node;
			this.showEditorDialog = true;
		},
		onCloseLessonEditor() {
			this.showEditorDialog = false;
			this.editingLessonNode = null;
		},
		async createFileNode(file: Blob) {
			this.uploadingFile = true;
			try {
				await this.mainStore.createCourseTreeNode({
					courseId: this.courseId,
					node: { ...getBlankFileNode(null), file },
				});
				this.metaStore.showSuccessFeedback();
				this.creatingFileNode = false;
			} catch (e) {
				setErrorNotification(e);
			} finally {
				this.uploadingFile = false;
			}
		},
		async onCreateNode(nodeType: CourseTreeNodeType) {
			if (nodeType === CourseTreeNodeType.TopicNode) {
				// TODO create node, insert it immediately & toggle editing on it
			} else if (nodeType === CourseTreeNodeType.LessonNode) {
				// create lesson node & open editor dialog
				await this.withLoading(
					async () =>
						(this.editingLessonNode = await this.mainStore.createCourseTreeNode({
							courseId: this.courseId,
							node: getBlankLessonNode(null),
						})),
				);
				this.showEditorDialog = true;
			} else if (nodeType === CourseTreeNodeType.FileNode) {
				// open dialog to create file node
				this.creatingFileNode = true;
			}
		},
		onLoadChildren(node) {
			console.log("course tree on load children");
		},
	},
	computed: {
		...mapStores(useMainStore, useMetaStore),
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
	components: { CourseTreeNode, DropdownMenu, Dialog, LessonNodeEditor, FileUpload },
});
</script>

<style></style>
