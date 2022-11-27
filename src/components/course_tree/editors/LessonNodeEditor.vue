<template>
	<div>
		<!-- top row -->
		<div class="flex w-full items-center mb-12">
			<Btn :variant="'icon'" :outline="true" class="-ml-2"
				><span class="material-icons-outlined" @click="$emit('closeEditor')">
					close</span
				></Btn
			>
			<h1 class="mb-0 ml-2">{{ $t("course_tree.lesson_editor_title") }}</h1>
			<CloudSaveStatus
				:saving="saving"
				:hadError="savingError"
				class="ml-auto mt-1 mr-6"
			/>
			<div
				class="flex space-x-3 items-center"
				v-if="modelValue.state === LessonNodeState.DRAFT"
			>
				<p class="text-muted">{{ $t("course_tree.draft") }}</p>
				<Btn @click="onPublish()">{{ $t("course_tree.publish_lesson") }}</Btn>
			</div>
		</div>
		<!-- title & creation date -->
		<div class="mb-8 flex items-center space-x-8">
			<TextInput
				class="w-full"
				:modelValue="modelValue.title"
				:fixedLabel="true"
				@blur="onBlur()"
				@update:modelValue="onNodeChange('title', $event)"
			>
				{{ $t("course_tree.lesson_title") }}
			</TextInput>
			<div class="w-1/4 text-muted flex items-center">
				<span style="font-size: 14px !important" class="ml-auto material-icons"
					>calendar_today</span
				>
				<p class="ml-1 text-sm">
					{{ $t("course_tree.lesson_creation_date") }}:
					<Timestamp :value="modelValue.created" />
				</p>
			</div>
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
import { AutoSaveManager } from "@/autoSave";
import Btn from "@/components/ui/Btn.vue";
import CloudSaveStatus from "@/components/ui/CloudSaveStatus.vue";
import FileUpload from "@/components/ui/FileUpload.vue";
import TextEditor from "@/components/ui/TextEditor.vue";
import TextInput from "@/components/ui/TextInput.vue";
import Timestamp from "@/components/ui/Timestamp.vue";
import { courseIdMixin, savingMixin } from "@/mixins";
import {
	CourseTreeNodeType,
	FileNode as IFileNode,
	getBlankFileNode,
	LessonNode,
	LessonNodeState,
} from "@/models";
import { useMainStore } from "@/stores/mainStore";
import { useMetaStore } from "@/stores/metaStore";
import { setErrorNotification } from "@/utils";
import { defineComponent, PropType } from "@vue/runtime-core";
import { mapStores } from "pinia";
import FileNode from "../node/FileNode.vue";
export default defineComponent({
	name: "LessonNodeEditor",
	props: {
		modelValue: {
			type: Object as PropType<LessonNode>,
			required: true,
		},
	},
	mixins: [courseIdMixin, savingMixin],
	data() {
		return {
			LessonNodeState,
			autoSaveManager: null as AutoSaveManager<LessonNode> | null,
			saving: false,
			savingError: false,
			creatingAttachment: false,
		};
	},
	created() {
		this.instantiateAutoSaveManager();
		this.mainStore.getCourseTreeNodeChildren({
			courseId: this.courseId,
			nodeId: this.modelValue.id,
			fromFirstPage: true,
		});
	},
	methods: {
		instantiateAutoSaveManager() {
			this.autoSaveManager = new AutoSaveManager<LessonNode>(
				this.modelValue,
				async changes => {
					await this.mainStore.partialUpdateCourseTreeNode({
						courseId: this.courseId,
						nodeId: this.modelValue.id,
						changes,
					});
					this.saving = false;
				},
				changes => {
					this.saving = true;
					this.savingError = false;
					this.mainStore.patchCourseTreeNode({ nodeId: this.modelValue.id, changes });
				},
				["body", "title"],
				2500,
				undefined,
				() => {
					this.saving = false;
					this.savingError = true;
				},
			);
		},
		async onNodeChange<K extends keyof LessonNode>(key: K, value: LessonNode[K]) {
			await this.autoSaveManager?.onChange({ field: key, value });
		},
		async onBlur() {
			await this.autoSaveManager?.flush();
		},
		async onPublish() {
			await this.onNodeChange("state", LessonNodeState.PUBLISHED);
			this.$emit("closeEditor");
			this.metaStore.showSuccessFeedback();
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
		Timestamp,
		FileUpload,
		FileNode,
	},
});
</script>

<style></style>
