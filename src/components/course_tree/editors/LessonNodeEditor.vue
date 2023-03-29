<template>
	<div class="relative">
		<!-- <LinearProgress v-if="blockingSaving" class="absolute top-0" /> -->
		<!-- top row -->
		<div class="mb-12 flex flex-col space-y-4">
			<div
				class="flex md:flex-row md:space-y-0 space-y-2 flex-col w-full md:items-center"
			>
				<div class="flex items-center mr-auto">
					<Btn :variant="'icon'" :outline="true" class="-ml-2"
						><span class="material-icons-outlined" @click="$emit('closeEditor')">
							close</span
						></Btn
					>
					<h1 class="mb-0 ml-2">{{ $t("course_tree.lesson_editor_title") }}</h1>
				</div>
				<div class="flex items-center md:ml-0 ml-auto">
					<CloudSaveStatus
						v-if="showAutoSaveIndicator"
						:saving="saving"
						:hadError="savingError"
						class="mt-1 mr-6 ml-auto hidden md:block"
					/>
					<!-- 'draft' label & publish button -->
					<div
						class="flex space-x-3 items-center"
						v-if="modelValue.state === LessonNodeState.DRAFT"
					>
						<p class="text-muted">{{ $t("course_tree.draft") }}</p>
						<Btn :disabled="blockingSaving" @click="onPublish()">{{
							$t("course_tree.publish_lesson")
						}}</Btn>
					</div>
					<!-- save button-->
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
					<div class="ml-2" v-if="modelValue.state === LessonNodeState.DRAFT">
						<Btn
							:variant="'icon'"
							:outline="true"
							class="icon-btn-primary"
							:disabled="blockingSaving"
							@click="showScheduleDialog = true"
							:tooltip="$t('course_tree.schedule')"
						>
							<svg
								style="width: 24px; fill: currentColor"
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
							>
								<path
									d="M15,13H16.5V15.82L18.94,17.23L18.19,18.53L15,16.69V13M19,8H5V19H9.67C9.24,18.09 9,17.07 9,16A7,7 0 0,1 16,9C17.07,9 18.09,9.24 19,9.67V8M5,21C3.89,21 3,20.1 3,19V5C3,3.89 3.89,3 5,3H6V1H8V3H16V1H18V3H19A2,2 0 0,1 21,5V11.1C22.24,12.36 23,14.09 23,16A7,7 0 0,1 16,23C14.09,23 12.36,22.24 11.1,21H5M16,11.15A4.85,4.85 0 0,0 11.15,16C11.15,18.68 13.32,20.85 16,20.85A4.85,4.85 0 0,0 20.85,16C20.85,13.32 18.68,11.15 16,11.15Z"
								/>
							</svg>
							<!-- <span class="material-icons">schedule_send</span> -->
						</Btn>
					</div>
				</div>
			</div>
			<div class="w-full flex">
				<IntegrationSwitch
					v-if="
						showClassroomIntegrationSwitch && modelValue.state === LessonNodeState.DRAFT
					"
					class="ml-auto"
					v-model="publishToClassroom"
				/>
				<PublishedOnClassroom
					class="banner-success px-2 ml-auto"
					v-if="hasGoogleClassroomTwin"
					:remoteObjectUrl="googleClassroomMaterialTwin?.data.alternateLink"
				/>
				<div
					:class="[
						(showClassroomIntegrationSwitch &&
							modelValue.state === LessonNodeState.DRAFT) ||
						hasGoogleClassroomTwin
							? 'ml-12'
							: 'ml-auto',
					]"
					class="banner banner-light py-1.5 px-1.5 text-muted"
					v-if="canceledScheduledPublish"
				>
					{{ $t("course_tree.save_to_cancel_scheduled_publish") }}
				</div>
				<div
					:class="[
						(showClassroomIntegrationSwitch &&
							modelValue.state === LessonNodeState.DRAFT) ||
						hasGoogleClassroomTwin
							? 'ml-12'
							: 'ml-auto',
					]"
					class="banner banner-light py-0.5 pr-1"
					v-if="
						modelValue.state === LessonNodeState.DRAFT && modelValue.schedule_publish_at
					"
				>
					<svg
						style="width: 24px; fill: currentColor"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
					>
						<path
							d="M15,13H16.5V15.82L18.94,17.23L18.19,18.53L15,16.69V13M19,8H5V19H9.67C9.24,18.09 9,17.07 9,16A7,7 0 0,1 16,9C17.07,9 18.09,9.24 19,9.67V8M5,21C3.89,21 3,20.1 3,19V5C3,3.89 3.89,3 5,3H6V1H8V3H16V1H18V3H19A2,2 0 0,1 21,5V11.1C22.24,12.36 23,14.09 23,16A7,7 0 0,1 16,23C14.09,23 12.36,22.24 11.1,21H5M16,11.15A4.85,4.85 0 0,0 11.15,16C11.15,18.68 13.32,20.85 16,20.85A4.85,4.85 0 0,0 20.85,16C20.85,13.32 18.68,11.15 16,11.15Z"
						/>
					</svg>
					<p>
						{{ $t("course_tree.scheduled_for") }}
						<Timestamp :value="modelValue.schedule_publish_at" />
					</p>
					<div class="flex items-center">
						<Btn :variant="'icon'" :outline="true" @click="showScheduleDialog = true"
							><span class="material-icons">edit</span></Btn
						>
						<Btn :variant="'icon'" :outline="true" @click="onSchedule(null)"
							><span class="material-icons">close</span></Btn
						>
					</div>
				</div>
			</div>
		</div>

		<!-- title & creation date -->
		<div
			class="
				mb-8
				flex flex-col
				md:flex-row
				items-center
				md:space-x-8 md:space-y-0
				space-y-6
			"
		>
			<TextInput
				class="w-full"
				:modelValue="modelValue.title"
				@blur="onBlur()"
				@update:modelValue="onNodeChange('title', $event)"
			>
				{{ $t("course_tree.lesson_title") }}
				<template v-if="v$.modelValue.title.$errors.length > 0" v-slot:errors>
					<div
						class="input-errors"
						v-for="error of v$.modelValue.title.$errors"
						:key="error.$uid"
					>
						<div class="error-msg">
							{{ $t("validation_errors.course_tree.lesson." + error.$uid) }}
						</div>
					</div>
				</template>
			</TextInput>
			<div class="md:w-1/3 w-full">
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
					<FileNode
						@deleteNode="$emit('deleteNode', $event)"
						:isDraggable="false"
						:canEdit="true"
						:node="fileNode"
					/>
				</div>
				<FileUpload
					:uploadProgress="attachmentUploadProgress"
					:uploading="creatingAttachment"
					v-model="attachmentProxy"
					:autoUpload="true"
					:clearImmediately="true"
				/>
			</div>
		</div>
		<SchedulePublishDialog
			@cancel="showScheduleDialog = false"
			@confirm="onSchedule($event)"
			:visible="showScheduleDialog"
			:initialValue="modelValue.schedule_publish_at"
		/>
	</div>
</template>

<script lang="ts">
import { getCourseTopicNodes } from "@/api";
import Btn from "@/components/ui/Btn.vue";
import CloudSaveStatus from "@/components/ui/CloudSaveStatus.vue";
import Dropdown from "@/components/ui/Dropdown.vue";
import FileUpload from "@/components/ui/FileUpload.vue";
import TextEditor from "@/components/ui/TextEditor.vue";
import TextInput from "@/components/ui/TextInput.vue";
import Timestamp from "@/components/ui/Timestamp.vue";
import { getTranslatedString as _ } from "@/i18n";
import IntegrationSwitch from "@/integrations/classroom/components/IntegrationSwitch.vue";
import PublishedOnClassroom from "@/integrations/classroom/components/PublishedOnClassroom.vue";
import { GoogleClassroomMaterialTwin } from "@/integrations/classroom/interfaces";
import { useGoogleIntegrationsStore } from "@/integrations/stores/googleIntegrationsStore";
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
import { lessonNodeValidation } from "@/validation/models";
import { defineComponent, PropType } from "@vue/runtime-core";
import useVuelidate from "@vuelidate/core";
import { mapStores } from "pinia";
import FileNode from "../node/FileNode.vue";
import { nodeEditorEmits, nodeEditorProps } from "../shared";
import SchedulePublishDialog from "./SchedulePublishDialog.vue";
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
	validations() {
		return {
			modelValue: lessonNodeValidation,
		};
	},
	setup() {
		const v = useVuelidate();
		return { v$: v };
	},
	data() {
		return {
			LessonNodeState,
			creatingAttachment: false,
			topics: [] as TopicNode[],
			loadingTopics: false,
			loadingChildren: false,
			attachmentUploadProgress: undefined as undefined | number,
			publishToClassroom: true,
			showClassroomIntegrationSwitch: false,
			googleClassroomMaterialTwin: null as null | GoogleClassroomMaterialTwin,
			showScheduleDialog: false,
			canceledScheduledPublish: false,
		};
	},
	async created() {
		await this.mainStore.getCourseRootId({ courseId: this.courseId });
		this.showClassroomIntegrationSwitch =
			await this.googleIntegrationStore.isGoogleClassroomIntegrationActive(this.courseId);
		this.checkForMaterialTwin();
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
		async onSchedule(datetime) {
			const save = datetime !== null;
			this.onNodeChange("schedule_publish_at", datetime, save);
			if (datetime === null) {
				this.canceledScheduledPublish = true;
			}
			//this.showScheduleDialog = false;
		},
		async checkForMaterialTwin() {
			this.googleClassroomMaterialTwin =
				await this.googleIntegrationStore.getGoogleClassroomMaterialTwin(
					this.modelValue.id,
				);
		},
		onNodeChange<K extends keyof CourseTreeNode>(
			key: any, //K,
			value: any, //CourseTreeNode[K],
			save = false,
		) {
			// TODO extract shared behavior (mixin?)
			this.$emit("patchNode", { key, value, save });
		},
		onSave() {
			if (this.modelValue.state !== LessonNodeState.DRAFT && this.v$.$invalid) {
				this.v$.$touch();
				return;
			}
			this.$emit("save");
		},
		onBlur() {
			this.$emit("blur");
		},
		onParentChange(parentId: string) {
			this.onNodeChange("parent_id", parentId);
		},
		async onPublish() {
			this.v$.$touch();
			if (this.v$.$errors.length === 0) {
				this.$emit("updateState", {
					newState: LessonNodeState.PUBLISHED,
					params: {
						fireIntegrationEvent: this.publishToClassroom,
					},
				});
			}
		},
		async onCreateAttachment(file) {
			this.creatingAttachment = true;
			const onUploadProgress = (e: { loaded: number; total: number }) => {
				this.attachmentUploadProgress = (e.loaded / e.total) * 100;
				// make loader indeterminate after upload completes for
				//better visual feedback to the user
				if (this.attachmentUploadProgress === 100) {
					setTimeout(() => {
						this.attachmentUploadProgress = undefined;
					}, 100);
				}
			};
			try {
				await this.mainStore.createCourseTreeNode({
					courseId: this.courseId,
					node: { ...getBlankFileNode(this.modelValue.id), file },
					config: {
						onUploadProgress,
					},
				});
			} catch (e) {
				setErrorNotification(e);
			} finally {
				this.creatingAttachment = false;
			}
		},
	},
	computed: {
		...mapStores(useMainStore, useMetaStore, useGoogleIntegrationsStore),
		hasGoogleClassroomTwin() {
			return this.googleClassroomMaterialTwin !== null;
		},
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
		//LinearProgress,
		Dropdown,
		IntegrationSwitch,
		PublishedOnClassroom,
		SchedulePublishDialog,
		Timestamp,
	},
});
</script>

<style></style>
