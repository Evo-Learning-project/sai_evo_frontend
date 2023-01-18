<template>
	<div class="mb-2">
		<!-- top row -->
		<div class="flex w-full items-center mb-8">
			<Btn :variant="'icon'" :outline="true" class="-ml-2"
				><span class="material-icons-outlined" @click="$emit('closeEditor')"> close</span>
			</Btn>
			<h1 class="mb-0 ml-2 mr-auto">{{ $t("course_tree.file_editor_title") }}</h1>
			<!-- <CloudSaveStatus
				v-if="showAutoSaveIndicator"
				:saving="saving"
				:hadError="savingError"
				class="mt-1 mr-6"
			/> -->
			<!-- <div
				class="flex space-x-3 items-center"
				v-if="modelValue.state === LessonNodeState.DRAFT"
			>
				<p class="text-muted">{{ $t("course_tree.draft") }}</p>
				<Btn @click="onPublish()">{{ $t("course_tree.publish_lesson") }}</Btn>
			</div> -->
			<!-- <div v-if="!autoSave" class="ml-2">
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
			</div> -->
			<Dropdown
				class="w-1/3 ml-auto"
				:loading="loadingTopics"
				:options="topicsAsOptions"
				:modelValue="modelValue.parent_id"
				@update:modelValue="onParentChange($event)"
			></Dropdown>
		</div>
		<SegmentedControls
			v-if="false"
			class="mb-10"
			:options="panes"
			v-model="currentPane"
		/>
		<!-- file upload pane-->
		<div v-show="currentPane === 'file_upload'">
			<FileUpload
				:uploadProgress="uploadProgress"
				:uploading="blockingSaving"
				:showMaxSize="true"
				v-model="fileProxy"
			/>
		</div>

		<!-- url pane-->
		<div v-show="currentPane === 'url'">
			<!-- <h1>url</h1> -->
			<div class="flex h-64 space-x-8 mb-2">
				<!-- url input -->
				<div class="w-2/3 mb-auto flex flex-col">
					<p class="text-muted mb-8">
						{{ $t("course_tree.file_by_url_description") }} <ArticleHandle />.
					</p>
					<div class="flex items-start space-x-2 mb-2">
						<span class="material-icons text-muted mt-1.5">link</span>
						<div class="w-full">
							<TextInput class="w-full" :placeholder="$t('course_tree.file_url')" />
							<Btn class="mt-2">{{ $t("misc.save") }}</Btn>
						</div>
					</div>
				</div>
				<!-- preview -->
				<div class="w-1/3 flex">
					<!-- <div class="w-full h-full bg-light rounded-sm m-auto"></div> -->
					<!-- <iframe
						src="https://docs.google.com/presentation/d/e/2PACX-1vTLZ3kilXPqLUvNQ3SG_u8q0EMySyBmSKQF5ibi8Ofh0LZvLLzH4_az63uIccEKkGONGJh_-sZ_9wZK/embed?start=false&loop=false&delayms=3000"
						frameborder="0"
						width="100%"
						height="100%"
						allowfullscreen="true"
						mozallowfullscreen="true"
						webkitallowfullscreen="true"
					></iframe> -->
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { getCourseTopicNodes } from "@/api";
import ArticleHandle from "@/components/shared/HelpCenter/ArticleHandle.vue";
import Btn from "@/components/ui/Btn.vue";
import Dropdown from "@/components/ui/Dropdown.vue";
import DropdownMenu from "@/components/ui/DropdownMenu.vue";
import FileUpload from "@/components/ui/FileUpload.vue";
import SegmentedControls from "@/components/ui/SegmentedControls.vue";
import TextInput from "@/components/ui/TextInput.vue";
import { getTranslatedString as _ } from "@/i18n";
import { SelectableOption } from "@/interfaces";
import { courseIdMixin } from "@/mixins";
import { FileNode, TopicNode } from "@/models";
import { useMainStore } from "@/stores/mainStore";
import { setErrorNotification } from "@/utils";
import { defineComponent, PropType } from "@vue/runtime-core";
import { mapStores } from "pinia";
import { nodeEditorEmits, nodeEditorProps } from "../shared";
export default defineComponent({
	name: "FileNodeEditor",
	props: {
		modelValue: {
			type: Object as PropType<FileNode>,
			required: true,
		},
		...nodeEditorProps,
	},
	emits: {
		...nodeEditorEmits,
	},
	mixins: [courseIdMixin],
	async created() {
		this.loadingTopics = true;
		try {
			this.topics = await getCourseTopicNodes(this.courseId);
		} catch (e) {
			setErrorNotification(e);
		} finally {
			this.loadingTopics = false;
		}
	},
	data() {
		return {
			panes: [
				{
					content: _("course_tree.file_node_editor_file_upload"),
					value: "file_upload",
				},
				{
					content: _("course_tree.file_node_editor_url"),
					value: "url",
				},
			] as SelectableOption[],
			currentPane: "file_upload",
			// TODO extract repeated code from this editor & lesson editor
			topics: [] as TopicNode[],
			loadingTopics: false,
		};
	},
	methods: {
		onNodeChange<K extends keyof FileNode>(key: any, value: any, save = false) {
			this.$emit("patchNode", { key, value, save });
		},
		onParentChange(parentId: string) {
			this.onNodeChange("parent_id", parentId);
		},
	},
	computed: {
		...mapStores(useMainStore),
		fileProxy: {
			get() {
				return [];
			},
			set(val: Blob) {
				this.onNodeChange("file", val, true);
			},
		},
		// TODO refactor, duplicated with other editors - move up to abstract component & pass as prop
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
	},
	components: { SegmentedControls, FileUpload, Btn, Dropdown, TextInput, ArticleHandle },
});
</script>

<style></style>
