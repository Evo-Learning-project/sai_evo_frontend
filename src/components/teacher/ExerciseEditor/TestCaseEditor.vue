<template>
	<div class="flex flex-col">
		<!-- top row -->
		<div class="flex items-center mb-2">
			<div class="mt-auto" v-if="(executionResultsSlots ?? []).length > 0">
				<Spinner class="mb-2 ml-0.5" v-if="executingSolution"></Spinner>
				<Tooltip :textCode="'testcase_passes'" v-else-if="allTestsPass">
					<span class="material-icons-outlined text-success-dark">check_circle</span>
				</Tooltip>
				<Tooltip
					:placement="'right'"
					:allowHoverOnText="true"
					:textCode="'testcase_fails'"
					v-else
				>
					<span class="material-icons-outlined text-danger-dark">warning</span>
					<template v-slot:body>
						<div class="max-w-lg m-2 overflow-y-scroll rounded-sm max-h-64 bg-light">
							<CodeExecutionResults
								v-for="(executionResults, index) in nonPassingExecutionResults"
								:key="'test-' + modelValue.id + '-non-passing-' + index"
								:executionResults="executionResults"
								:testCases="executionResultsSlots?.[0].exercise.testcases"
								:showTestIds="[modelValue.id]"
								:onlyErrors="true"
							></CodeExecutionResults>
						</div>
					</template>
				</Tooltip>
			</div>
			<div class="ml-auto">
				<Btn
					:outline="true"
					:variant="'icon'"
					@click="$emit('delete')"
					:tooltip="$t('exercise_editor.delete_testcase')"
					class="transition-opacity duration-100 opacity-50 hover:opacity-100"
					><span class="text-base material-icons"> delete </span></Btn
				>
			</div>
		</div>
		<!-- body -->
		<div
			class="
				flex flex-col
				py-3
				mb-12
				space-y-2
				md:flex-row md:space-x-4 md:space-y-0 md:items-start
			"
		>
			<!-- <span
      class="row-span-2 my-auto text-lg cursor-move material-icons-outlined opacity-70"
    >
      drag_indicator
    </span> -->
			<div class="grid w-full grid-cols-6 gap-5 md:grid-cols-12">
				<!-- visibility controls -->
				<div
					:class="{
						'col-span-6':
							testCaseType === ExerciseType.JS || testCaseType === ExerciseType.PYTHON,
						'md:col-span-5 col-span-7': testCaseType === ExerciseType.C,
					}"
				>
					<SegmentedControls
						:modelValue="modelValue.testcase_type"
						@update:modelValue="onUpdate('testcase_type', $event)"
						:options="testcaseTypeOptions"
						>{{ $t("exercise_editor.testcase_type") }}</SegmentedControls
					>
				</div>

				<!-- JS/Python test case codice -->
				<CodeEditor
					@blur="$emit('blur')"
					class="col-span-6 md:row-span-2"
					v-if="testCaseType === ExerciseType.JS || testCaseType === ExerciseType.PYTHON"
					:size="'sm'"
					:modelValue="modelValue.code"
					@update:modelValue="onUpdate('code', $event)"
					><div class="flex w-full">
						<p class="mr-auto">{{ $t("exercise_editor.testcase_code") }}</p>
						<div
							v-if="
								modelValue.testcase_type === ExerciseTestCaseType.HIDDEN ||
								modelValue.testcase_type === ExerciseTestCaseType.SHOW_TEXT_ONLY
							"
							class="flex items-center ml-8 space-x-2 text-danger-dark"
						>
							<span class="mr-2 text-sm material-icons-outlined">visibility_off</span
							>{{ $t("exercise_editor.hidden_to_students") }}
						</div>
					</div></CodeEditor
				>

				<!-- stdin & stdout -->
				<div v-else class="flex col-span-7 space-x-2 md:row-span-2">
					<CodeEditor
						@blur="$emit('blur')"
						class="w-1/2"
						:size="'sm'"
						:modelValue="modelValue.stdin"
						@update:modelValue="onUpdate('stdin', $event)"
						><div class="flex w-full">
							<p class="">{{ $t("exercise_editor.testcase_stdin") }}</p>
							<div
								v-if="
									modelValue.testcase_type === ExerciseTestCaseType.HIDDEN ||
									modelValue.testcase_type === ExerciseTestCaseType.SHOW_TEXT_ONLY
								"
								class="flex items-center ml-2 ml-4 space-x-2 text-danger-dark"
							>
								<span class="mr-2 text-sm material-icons-outlined">visibility_off</span
								>{{ $t("misc.hidden") }}
							</div>
						</div></CodeEditor
					>
					<CodeEditor
						@blur="$emit('blur')"
						class="w-1/2"
						:size="'sm'"
						:modelValue="modelValue.expected_stdout"
						@update:modelValue="onUpdate('expected_stdout', $event)"
						><div class="flex w-full">
							<p class="">
								{{ $t("exercise_editor.testcase_expected_stdout") }}
							</p>
							<div
								v-if="
									modelValue.testcase_type === ExerciseTestCaseType.HIDDEN ||
									modelValue.testcase_type === ExerciseTestCaseType.SHOW_TEXT_ONLY
								"
								class="flex items-center ml-3 space-x-2 text-danger-dark"
							>
								<span class="mr-2 text-sm material-icons-outlined">visibility_off</span
								>{{ $t("misc.hidden") }}
							</div>
						</div></CodeEditor
					>
				</div>

				<!-- test case description editor -->
				<TextEditor
					@blur="$emit('blur')"
					:class="{
						'col-span-6':
							testCaseType === ExerciseType.JS || testCaseType === ExerciseType.PYTHON,
						'md:col-span-5 col-span-7': testCaseType === ExerciseType.C,
					}"
					:modelValue="modelValue.text"
					@update:modelValue="onUpdate('text', $event)"
					><div class="flex w-full">
						<p class="mr-auto">{{ $t("exercise_editor.testcase_text") }}</p>
						<div
							v-if="modelValue.testcase_type === ExerciseTestCaseType.HIDDEN"
							class="flex items-center ml-8 space-x-2 text-danger-dark"
						>
							<span class="mr-2 text-sm material-icons-outlined">visibility_off</span
							>{{ $t("exercise_editor.hidden_to_students") }}
						</div>
					</div></TextEditor
				>

				<!-- test case attachments -->
				<Btn
					class="-mt-4 col-span-3 w-max"
					@click="showAttachmentArea = true"
					v-if="testCaseType === ExerciseType.C && !showAttachmentArea"
					:variant="'primary-borderless'"
					:size="'xs'"
					><span class="text-sm">{{
						$t("exercise_editor.testcase_add_attachments")
					}}</span></Btn
				>
				<div v-else-if="testCaseType === ExerciseType.C" class="col-span-12">
					<h5 class="mb-1">{{ $t("exercise_editor.testcase_attachments") }}</h5>
					<p class="text-muted mb-2 text-sm">
						{{ $t("exercise_editor.testcase_attachments_description") }}
					</p>
					<div class="w-full flex items-start space-x-4">
						<!-- attachment upload -->
						<div class="w-full">
							<FileUpload :small="true" :autoUpload="true" v-model="attachmentProxy" />
						</div>

						<!-- attachment list -->
						<div class="w-full" v-if="attachments.length > 0">
							<div
								class="flex items-center w-full my-0.5"
								v-for="testcaseAttachment in attachments"
								:key="'attachment-' + testcaseAttachment.id"
							>
								<div class="flex items-center">
									<span
										class="material-icons text-muted mr-1"
										style="font-size: 18px !important"
										>insert_drive_file</span
									>
									<p class="text-sm mr-2">{{ testcaseAttachment.attachment.name }}</p>
									<p class="text-xs text-muted mr-2">
										{{ testcaseAttachment.attachment.size / 1000 }} KB
									</p>
									<Btn
										@click="$emit('downloadAttachment', testcaseAttachment)"
										:size="'xs'"
										:outline="true"
										:variant="'icon'"
										><span
											class="material-icons-outlined text-muted"
											style="font-size: 18px !important"
											>file_download</span
										></Btn
									>
								</div>
								<Btn
									class="
										transition-opacity
										duration-100
										ml-auto
										mr-2.5
										opacity-50
										hover:opacity-100
									"
									@click="$emit('deleteAttachment', testcaseAttachment)"
									:variant="'icon'"
									:size="'xs'"
									:outline="true"
									><span style="font-size: 16px !important" class="material-icons"
										>close</span
									></Btn
								>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import {
	CodeExecutionResults as ICodeExecutionResults,
	EventParticipationSlot,
	ExerciseTestCase,
	ExerciseTestCaseAttachment,
	ExerciseTestCaseType,
	ExerciseType,
	TestCaseExecutionResults,
} from "@/models";
import { defineComponent, PropType } from "@vue/runtime-core";
import TextEditor from "@/components/ui/TextEditor.vue";
import CodeEditor from "@/components/ui/CodeEditor.vue";
import SegmentedControls from "@/components/ui/SegmentedControls.vue";
import { testcaseTypeOptions } from "@/const";
import Btn from "@/components/ui/Btn.vue";
import Tooltip from "@/components/ui/Tooltip.vue";
import Spinner from "@/components/ui/Spinner.vue";
import CodeExecutionResults from "@/components/shared/CodeExecutionResults.vue";
import FileUpload from "@/components/ui/FileUpload.vue";

export default defineComponent({
	name: "TestCaseEditor",
	props: {
		modelValue: {
			type: Object as PropType<ExerciseTestCase>,
			required: true,
		},
		testCaseType: {
			type: Number as PropType<ExerciseType.JS | ExerciseType.C | ExerciseType.PYTHON>,
			required: true,
		},
		executionResultsSlots: {
			type: Array as PropType<EventParticipationSlot[]>,
		},
		executingSolution: {
			type: Boolean,
			default: false,
		},
		attachments: {
			type: Array as PropType<ExerciseTestCaseAttachment[]>,
			default: () => [],
		},
		// TODO add language prop
	},
	watch: {
		// TODO review, it might be shared among components
		attachments: {
			deep: true,
			handler(newVal) {
				if (newVal.length > 0) {
					this.showAttachmentArea = true;
				}
			},
		},
	},
	components: {
		TextEditor,
		CodeEditor,
		SegmentedControls,
		Btn,
		Tooltip,
		Spinner,
		CodeExecutionResults,
		FileUpload,
	},
	data() {
		return {
			testcaseTypeOptions,
			ExerciseTestCaseType,
			ExerciseType,
			showAttachmentArea: false,
		};
	},
	methods: {
		onUpdate(field: keyof ExerciseTestCase, value: unknown) {
			this.$emit("testCaseUpdate", { field, value });
		},
	},
	computed: {
		attachmentProxy: {
			get() {
				return [];
			},
			set(val: any) {
				this.$emit("createAttachment", val);
			},
		},
		executionResults(): ICodeExecutionResults[] {
			return (this.executionResultsSlots ?? []).map(
				s => s.execution_results ?? { state: "completed", tests: [] },
			);
		},
		nonPassingExecutionResults(): ICodeExecutionResults[] {
			return this.executionResults.filter(e => {
				const testResults = (e.tests ?? []).find(t => t.id == this.modelValue.id);
				return typeof testResults === "undefined" || !testResults.passed;
			});
		},
		testCaseExecutionResults(): (TestCaseExecutionResults | undefined)[] {
			return this.executionResults.map(r =>
				r.tests?.find(t => t.id == this.modelValue.id),
			);
		},
		allTestsPass(): boolean {
			return this.testCaseExecutionResults.every(
				r => typeof r !== "undefined" && r.passed,
			);
		},
	},
});
</script>

<style></style>
