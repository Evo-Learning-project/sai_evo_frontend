<template>
	<div class="relative">
		<LinearProgress v-if="blockingSaving" class="absolute top-0" />
		<!-- top row -->
		<div class="flex w-full items-center mb-12">
			<Btn :variant="'icon'" :outline="true" class="-ml-2"
				><span class="material-icons-outlined" @click="$emit('closeEditor')">
					close</span
				></Btn
			>
			<h1 class="mb-0 ml-2 mr-auto">{{ $t("course_tree.lesson_editor_title") }}</h1>
			<CloudSaveStatus
				v-if="showAutoSaveIndicator"
				:saving="saving"
				:hadError="savingError"
				class="mt-1 mr-6"
			/>
			<div
				class="flex space-x-3 items-center"
				v-if="modelValue.state === LessonNodeState.DRAFT"
			>
				<p class="text-muted">{{ $t("course_tree.draft") }}</p>
				<Btn @click="onPublish()">{{ $t("course_tree.publish_lesson") }}</Btn>
			</div>
			<div class="ml-2">
				<Btn
					:disabled="blockingSaving"
					:outline="modelValue.state === LessonNodeState.DRAFT"
					@click="onSave()"
				>
					{{
						modelValue.state === LessonNodeState.DRAFT
							? $t("course_tree.save_draft")
							: $t("course_tree.save")
					}}
				</Btn>
			</div>
		</div>
		<!-- title & creation date -->
		<div class="mb-8 flex items-center space-x-8">
			<TextInput
				class="w-full"
				:modelValue="modelValue.title"
				@blur="onBlur()"
				@update:modelValue="onNodeChange('title', $event)"
			>
				{{ $t("course_tree.lesson_title") }}
			</TextInput>
			<div class="w-1/3">
				<Dropdown
					:loading="loadingTopics"
					:options="topicsAsOptions"
					:modelValue="modelValue.parent_id"
					@update:modelValue="onParentChange($event)"
					>{{ $t("course_tree.topic_label") }}</Dropdown
				>
			</div>
			<!-- <div class="w-1/4 text-muted flex items-center">
				<span style="font-size: 14px !important" class="ml-auto material-icons"
					>calendar_today</span
				>
				<p class="ml-1 text-sm">
					{{ $t("course_tree.lesson_creation_date") }}:
					<Timestamp :value="modelValue.created" />
				</p>
			</div> -->
		</div>
		<!-- body -->
		<div>
			<TextEditor
				:modelValue="modelValue.body"
				:fixedLabel="true"
				@blur="onBlur()"
				@update:modelValue="onNodeChange('body', $event)"
			>
				{{ $t("course_tree.lesson_body") }}
			</TextEditor>
		</div>
		<!-- attachments -->
		<div class="mt-8">
			<h3 class="mb-4">{{ $t("course_tree.lesson_attachments") }}</h3>
			<div class="grid lg:grid-cols-2 lg:gap-6 gap-4 grid-cols-1">
				<div v-for="fileNode in fileChildren" :key="fileNode.id">
					<FileNode :canEdit="true" :node="fileNode" />
				</div>
				<FileUpload
					:uploading="creatingAttachment"
					v-model="attachmentProxy"
					:autoUpload="true"
					:clearImmediately="true"
				/>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { getCourseTopicNodes } from "@/api";
import { AutoSaveManager } from "@/autoSave";
import Btn from "@/components/ui/Btn.vue";
import CloudSaveStatus from "@/components/ui/CloudSaveStatus.vue";
import Dropdown from "@/components/ui/Dropdown.vue";
import FileUpload from "@/components/ui/FileUpload.vue";
import LinearProgress from "@/components/ui/LinearProgress.vue";
import TextEditor from "@/components/ui/TextEditor.vue";
import TextInput from "@/components/ui/TextInput.vue";
import Timestamp from "@/components/ui/Timestamp.vue";
import { getTranslatedString as _ } from "@/i18n";
import { SelectableOption } from "@/interfaces";
import { courseIdMixin, savingMixin } from "@/mixins";
import {
	CourseTreeNode,
	CourseTreeNodeType,
	FileNode as IFileNode,
	getBlankFileNode,
	LessonNode,
	LessonNodeState,
	TopicNode,
} from "@/models";
import { useMainStore } from "@/stores/mainStore";
import { useMetaStore } from "@/stores/metaStore";
import { setErrorNotification } from "@/utils";
import { defineComponent, PropType } from "@vue/runtime-core";
import { mapStores } from "pinia";
import FileNode from "../node/FileNode.vue";
import { nodeEditorEmits, nodeEditorProps } from "../shared";
export default defineComponent({
	name: "LessonNodeEditor",
	props: {
		modelValue: {
			type: Object as PropType<LessonNode>,
			required: true,
		},
		...nodeEditorProps,
	},
	emits: {
		...nodeEditorEmits,
	},
	mixins: [courseIdMixin, savingMixin],
	data() {
		return {
			LessonNodeState,
			creatingAttachment: false,
			topics: [] as TopicNode[],
			loadingTopics: false,
			loadingChildren: false,
		};
	},
	async created() {
		await this.mainStore.getCourseRootId({ courseId: this.courseId });
		await Promise.all([
			(async () => {
				this.loadingChildren = true;
				try {
					await this.mainStore.getCourseTreeNodeChildren({
						courseId: this.courseId,
						nodeId: this.modelValue.id,
						fromFirstPage: true,
					});
				} catch (e) {
					setErrorNotification(e);
				} finally {
					this.loadingChildren = false;
				}
			})(),
			(async () => {
				this.loadingTopics = true;
				try {
					this.topics = await getCourseTopicNodes(this.courseId);
				} catch (e) {
					setErrorNotification(e);
				} finally {
					this.loadingTopics = false;
				}
			})(),
		]);
	},
	methods: {
		onNodeChange<K extends keyof CourseTreeNode>(
			key: any, //K,
			value: any, //CourseTreeNode[K],
			save = false,
		) {
			this.$emit("patchNode", { key, value, save });
		},
		onSave() {
			this.$emit("save");
		},
		onBlur() {
			this.$emit("blur");
		},
		onParentChange(parentId: string) {
			console.log("PARENT CHANGE", parentId);
			this.onNodeChange("parent_id", parentId);
		},
		async onPublish() {
			this.onNodeChange("state", LessonNodeState.PUBLISHED, true);
		},
		async onCreateAttachment(file) {
			this.creatingAttachment = true;
			try {
				await this.mainStore.createCourseTreeNode({
					courseId: this.courseId,
					node: { ...getBlankFileNode(this.modelValue.id), file },
				});
			} catch (e) {
				setErrorNotification(e);
			} finally {
				this.creatingAttachment = false;
			}
		},
	},
	computed: {
		...mapStores(useMainStore, useMetaStore),
		// TODO refactor, duplicated with other editors
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
		fileChildren(): IFileNode[] {
			return (
				this.mainStore.paginatedChildrenByNodeId[this.modelValue.id]?.data ?? []
			).filter(c => c.resourcetype === CourseTreeNodeType.FileNode) as IFileNode[];
		},
		attachmentProxy: {
			get() {
				return [];
			},
			async set(val: any) {
				await this.onCreateAttachment(val);
			},
		},
	},
	components: {
		TextInput,
		TextEditor,
		CloudSaveStatus,
		Btn,
		//Timestamp,
		FileUpload,
		FileNode,
		LinearProgress,
		Dropdown,
	},
});
</script>

<style></style>
