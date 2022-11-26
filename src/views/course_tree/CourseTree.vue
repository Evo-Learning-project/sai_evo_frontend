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

		<Dialog
			:fullHeight="true"
			:large="true"
			@no="showEditorDialog = false"
			:showDialog="showEditorDialog"
		>
			<template v-slot:body>
				<LessonNodeEditor
					class="text-darkText"
					:modelValue="editingNode"
					v-if="editingNode"
				/>
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
			editingNode: null as null | ICourseTreeNode,
		};
	},
	methods: {
		onEditLesson(node: LessonNode) {
			this.editingNode = node;
			this.showEditorDialog = true;
		},
		async onCreateNode(nodeType: CourseTreeNodeType) {
			if (nodeType === CourseTreeNodeType.TopicNode) {
				// TODO create node, insert it immediately & toggle editing on it
			} else if (nodeType === CourseTreeNodeType.LessonNode) {
				// TODO create node, insert it immediately & show dialog with editor
				await this.withLoading(
					async () =>
						(this.editingNode = await this.mainStore.createCourseTreeNode({
							courseId: this.courseId,
							node: getBlankLessonNode(null),
						})),
				);
				this.showEditorDialog = true;
			} else if (nodeType === CourseTreeNodeType.FileNode) {
				// TODO create node and show dialog with upload component
			}
			//this.showEditorDialog = true;
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
	components: { CourseTreeNode, DropdownMenu, Dialog, LessonNodeEditor },
});
</script>

<style></style>
