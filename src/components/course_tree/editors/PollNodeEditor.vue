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
			<div class="mb-4">
				<div
					v-for="choice in modelValue.choices"
					:key="choice.id"
					class="
						flex
						items-center
						space-x-1
						my-0.5
						group
						transition-colors
						duration-100
						ease-in-out
						rounded-sm
					"
					:class="{ 'hover:bg-light': editingChoice?.id !== choice.id }"
				>
					<span class="material-icons opacity-60" style="font-size: 20px !important">
						radio_button_checked
					</span>
					<!-- TODO choice editor-->
					<div v-if="editingChoice?.id !== choice.id" class="flex items-center">
						<p class="mr-4 ml-1">{{ choice.text }}</p>
						<Btn
							class="
								opacity-0
								group-hover:opacity-80
								duration-100
								transition-opacity
								ease-in-out
							"
							@click="onEditChoice(choice)"
							:variant="'icon'"
							:outline="true"
						>
							<span class="material-icons">edit</span></Btn
						>
						<Btn
							class="
								opacity-0
								group-hover:opacity-80
								duration-100
								transition-opacity
								ease-in-out
							"
							@click="onDeleteChoice(choice)"
							:variant="'icon'"
							:outline="true"
						>
							<span class="material-icons">delete</span></Btn
						>
					</div>
					<div v-else class="flex w-full items-center space-x-2">
						<TextInput
							@keyup.enter="onSaveChoice"
							class="w-full"
							v-model="editingChoice.text"
						>
							<!-- {{ $t("course_tree.poll_choice_text") }} -->
						</TextInput>
						<Btn
							:disabled="editingChoice.text.trim().length === 0"
							@click="onSaveChoice"
							:variant="'icon'"
							:outline="true"
						>
							<span class="material-icons-outlined">done</span></Btn
						>
						<Btn @click="onDiscardChoice" :variant="'icon'" :outline="true">
							<span class="material-icons-outlined">close</span></Btn
						>
					</div>
				</div>
				<div
					v-if="editingChoice?.id === ''"
					class="mt-4 flex w-full items-center space-x-1"
				>
					<span class="material-icons opacity-60" style="font-size: 20px !important">
						radio_button_checked
					</span>
					<TextInput
						class="w-full"
						@keyup.enter="onSaveChoice"
						v-model="editingChoice.text"
						:placeholder="$t('course_tree.poll_choice_text')"
					></TextInput>
					<Btn
						:disabled="editingChoice.text.trim().length === 0"
						@click="onSaveChoice"
						:variant="'icon'"
						:outline="true"
						class="my-auto"
					>
						<span class="material-icons-outlined">done</span></Btn
					>
					<Btn class="my-auto" @click="onDiscardChoice" :variant="'icon'" :outline="true">
						<span class="material-icons">close</span></Btn
					>
				</div>

				<Btn
					v-else
					class="mt-4 w-max"
					:variant="'secondary'"
					:size="'sm'"
					@click="onCreateChoice()"
				>
					<span class="mr-1 text-base material-icons-outlined"> add </span
					>{{ $t("course_tree.new_poll_choice") }}</Btn
				>
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
	getBlankPollNodeChoice,
	PollNode,
	PollNodeChoice,
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
			//blockingSaving: false,
			topics: [] as TopicNode[],
			loadingTopics: false,
			loadingChildren: false,
			editingChoice: null as null | PollNodeChoice,
			editingChoiceText: "",
			savingChoice: false,
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
		onCreateChoice() {
			this.editingChoice = getBlankPollNodeChoice();
		},
		onEditChoice(choice: PollNodeChoice) {
			this.editingChoice = JSON.parse(JSON.stringify(choice));
		},
		async onSaveChoice() {
			if (!this.editingChoice) {
				throw new Error(
					"attempting to save editingChoice, which is " + this.editingChoice,
				);
			}
			if (this.editingChoice.text.trim().length === 0) {
				return;
			}
			try {
				this.savingChoice = false;
				if (!this.editingChoice.id) {
					console.log("Creating", this.editingChoice);
					await this.mainStore.createPollNodeChoice({
						courseId: this.courseId,
						nodeId: this.modelValue.id,
						choice: this.editingChoice,
					});
				} else {
					await this.mainStore.partialUpdatePollNodeChoice({
						courseId: this.courseId,
						nodeId: this.modelValue.id,
						choiceId: this.editingChoice.id,
						changes: this.editingChoice,
					});
				}
				this.editingChoice = null;
			} catch (e) {
				setErrorNotification(e);
			} finally {
				this.savingChoice = false;
			}
		},
		onDiscardChoice() {
			this.editingChoice = null;
		},
		async onDeleteChoice(choice: PollNodeChoice) {
			if (!confirm(_("course_tree.confirm_delete_poll_choice"))) {
				return;
			}
			await this.mainStore.deletePollNodeChoice({
				courseId: this.courseId,
				nodeId: this.modelValue.id,
				choiceId: choice.id,
			});
		},
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
			// TODO migrate to new logic like lesson editor
			//this.blockingSaving = true;
			await this.autoSaveManager?.onChange(this.unsavedChanges);
			await this.autoSaveManager?.flush();
			//this.blockingSaving = false;
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
		TextInput,
	},
});
</script>

<style></style>
