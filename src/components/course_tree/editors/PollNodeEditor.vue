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
			<h1 class="mb-0 ml-2 mr-auto">{{ $t("course_tree.poll_editor_title") }}</h1>
			<CloudSaveStatus
				v-if="autoSave"
				:saving="saving"
				:hadError="savingError"
				class="mt-1 mr-6"
			/>
			<div
				class="flex space-x-3 items-center"
				v-if="computedModelValue.state === PollNodeState.DRAFT"
			>
				<p class="text-muted">{{ $t("course_tree.draft") }}</p>
				<Btn @click="onPublish()">{{ $t("course_tree.publish_poll") }}</Btn>
			</div>
			<div v-if="!autoSave" class="ml-2">
				<Btn
					:disabled="blockingSaving"
					:outline="computedModelValue.state === PollNodeState.DRAFT"
					@click="onSave()"
				>
					{{
						computedModelValue.state === PollNodeState.DRAFT
							? $t("course_tree.save_draft")
							: $t("course_tree.save")
					}}
				</Btn>
			</div>
		</div>
		<!-- title & creation date -->
		<div class="mb-8 flex items-center space-x-8">
			<!-- <TextInput
				class="w-full"
				:modelValue="computedModelValue.title"
				:fixedLabel="true"
				@blur="onBlur()"
				@update:modelValue="onNodeChange('title', $event)"
			>
				{{ $t("course_tree.poll_title") }}
			</TextInput> -->
			<div class="w-1/3">
				<Dropdown
					:loading="loadingTopics"
					:options="topicsAsOptions"
					:modelValue="computedModelValue.parent_id"
					@update:modelValue="onParentChange($event)"
					>{{ $t("course_tree.topic_label") }}</Dropdown
				>
			</div>
			<!-- <div class="w-1/4 text-muted flex items-center">
				<span style="font-size: 14px !important" class="ml-auto material-icons"
					>calendar_today</span
				>
				<p class="ml-1 text-sm">
					{{ $t("course_tree.poll_creation_date") }}:
					<Timestamp :value="modelValue.created" />
				</p>
			</div> -->
		</div>
		<!-- text -->
		<div>
			<TextEditor
				:modelValue="computedModelValue.text"
				:fixedLabel="true"
				@blur="onBlur()"
				@update:modelValue="onNodeChange('text', $event)"
			>
				{{ $t("course_tree.poll_text") }}
			</TextEditor>
		</div>
		<!-- choices -->
		<div class="mt-8">
			<h3 class="mb-4">{{ $t("course_tree.poll_choices") }}</h3>
			<div class="grid lg:grid-cols-2 lg:gap-6 gap-4 grid-cols-1">
				<div v-for="choice in modelValue.choices" :key="choice.id">
					<!-- TODO choice editor-->
				</div>
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
import LinearProgress from "@/components/ui/LinearProgress.vue";
import TextEditor from "@/components/ui/TextEditor.vue";
import TextInput from "@/components/ui/TextInput.vue";
import Timestamp from "@/components/ui/Timestamp.vue";
import { getTranslatedString as _ } from "@/i18n";
import { SelectableOption } from "@/interfaces";
import { courseIdMixin, savingMixin } from "@/mixins";
import {
	CourseTreeNodeType,
	FileNode as IFileNode,
	getBlankFileNode,
	PollNode,
	PollNodeState,
	TopicNode,
} from "@/models";
import { useMainStore } from "@/stores/mainStore";
import { useMetaStore } from "@/stores/metaStore";
import { setErrorNotification } from "@/utils";
import { defineComponent, PropType } from "@vue/runtime-core";
import { mapStores } from "pinia";
import FileNode from "../node/FileNode.vue";
import { nodeEditorProps } from "../shared";
export default defineComponent({
	name: "PollNodeEditor",
	props: {
		modelValue: {
			type: Object as PropType<PollNode>,
			required: true,
		},
		...nodeEditorProps,
	},
	mixins: [courseIdMixin, savingMixin],
	data() {
		return {
			PollNodeState,
			autoSaveManager: null as AutoSaveManager<PollNode> | null,
			saving: false,
			savingError: false,
			creatingAttachment: false,
			unsavedChanges: {},
			blockingSaving: false,
			topics: [] as TopicNode[],
			loadingTopics: false,
			loadingChildren: false,
		};
	},
	async created() {
		this.instantiateAutoSaveManager();

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
		instantiateAutoSaveManager() {
			this.autoSaveManager = new AutoSaveManager<PollNode>(
				this.modelValue,
				async changes => {
					await this.mainStore.partialUpdateCourseTreeNode({
						courseId: this.courseId,
						nodeId: this.modelValue.id,
						changes,
					});
					this.saving = false;
					if (changes.state === PollNodeState.OPEN) {
						this.$emit("closeEditor");
						this.metaStore.showSuccessFeedback();
					}
				},
				changes => {
					this.saving = true;
					this.savingError = false;
					this.mainStore.patchCourseTreeNode({
						courseId: this.courseId,
						nodeId: this.modelValue.id,
						changes,
					});
				},
				["text"],
				2500,
				undefined,
				() => {
					this.saving = false;
					this.savingError = true;
				},
			);
		},
		async onNodeChange<K extends keyof PollNode>(key: K, value: PollNode[K]) {
			if (this.autoSave) {
				await this.autoSaveManager?.onChange({ [key]: value });
			} else {
				// update local copy of unsaved changes
				this.unsavedChanges = { ...this.unsavedChanges, [key]: value };
			}
		},
		async onSave() {
			this.blockingSaving = true;
			await this.autoSaveManager?.onChange(this.unsavedChanges);
			await this.autoSaveManager?.flush();
			this.blockingSaving = false;
			this.$emit("closeEditor");
			this.metaStore.showSuccessFeedback();
		},
		async onBlur() {
			await this.autoSaveManager?.flush();
		},
		async onParentChange(parentId: string) {
			console.log("PARENT CHANGE", parentId);
			await this.onNodeChange("parent_id", parentId);
		},
		async onPublish() {
			this.blockingSaving = true;
			await this.onNodeChange("state", PollNodeState.OPEN);
			if (!this.autoSave) {
				await this.onSave();
			}
			this.blockingSaving = false;
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
		computedModelValue() {
			// when autosave is off, take into account unsaved changes too
			if (this.autoSave) {
				return this.modelValue;
			}
			return { ...this.modelValue, ...this.unsavedChanges };
		},
		// TODO refactor, duplicated with CourseTree
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
		//TextInput,
		TextEditor,
		CloudSaveStatus,
		Btn,

		LinearProgress,
		Dropdown,
	},
});
</script>

<style></style>
