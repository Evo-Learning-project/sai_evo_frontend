<template>
	<div class="flex flex-col">
		<div class="flex items-center mb-2">
			<div class="mt-auto">
				<Spinner class="mb-2 ml-0.5" v-if="executingSolution"></Spinner>
				<Tooltip
					:textCode="'testcase_passes'"
					v-else-if="executionResults && testCaseExecutionResults && testCaseExecutionResults?.passed"
				>
					<span class="material-icons-outlined text-success-dark">check_circle</span>
				</Tooltip>
				<Tooltip
					:placement="'bottom'"
					:allowHoverOnText="true"
					:textCode="'testcase_fails'"
					v-else-if="
						executionResults &&
						(testCaseExecutionResults || executionResults.compilation_errors || executionResults.execution_error)
					"
				>
					<span class="material-icons-outlined text-danger-dark">warning</span>
					<template v-slot:body>
						<div class="max-w-lg m-2 overflow-y-scroll rounded-sm max-h-64 bg-light">
							<CodeExecutionResults
								:executionResults="executionResults"
								:testCases="executionResultsSlot?.exercise.testcases"
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

		<div class="flex flex-col py-3 mb-12 space-y-2 md:flex-row md:space-x-4 md:space-y-0 md:items-start">
			<!-- <span
      class="row-span-2 my-auto text-lg cursor-move material-icons-outlined opacity-70"
    >
      drag_indicator
    </span> -->
			<div class="grid w-full grid-cols-6 gap-5 md:grid-cols-12">
				<div
					:class="{
						'col-span-6': testCaseType === ExerciseType.JS,
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
				<CodeEditor
					class="col-span-6 md:row-span-2"
					v-if="testCaseType === ExerciseType.JS"
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
				<div v-else class="flex col-span-7 space-x-2 md:row-span-2">
					<CodeEditor
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
								<span class="mr-2 text-sm material-icons-outlined">visibility_off</span>{{ $t("misc.hidden") }}
							</div>
						</div></CodeEditor
					>
					<CodeEditor
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
								<span class="mr-2 text-sm material-icons-outlined">visibility_off</span>{{ $t("misc.hidden") }}
							</div>
						</div></CodeEditor
					>
				</div>
				<TextEditor
					:class="{
						'col-span-6': testCaseType === ExerciseType.JS,
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
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import {
	CodeExecutionResults as ICodeExecutionResults,
	EventParticipationSlot,
	ExerciseTestCase,
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

export default defineComponent({
	name: "TestCaseEditor",
	props: {
		modelValue: {
			type: Object as PropType<ExerciseTestCase>,
			required: true,
		},
		testCaseType: {
			type: Number as PropType<ExerciseType.JS | ExerciseType.C>,
			required: true,
		},
		executionResultsSlot: {
			type: Object as PropType<EventParticipationSlot>,
		},
		executingSolution: {
			type: Boolean,
			default: false,
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
	},
	data() {
		return {
			testcaseTypeOptions,
			ExerciseTestCaseType,
			ExerciseType,
		};
	},
	methods: {
		onUpdate(field: keyof ExerciseTestCase, value: unknown) {
			this.$emit("testCaseUpdate", { field, value });
		},
	},
	computed: {
		executionResults(): ICodeExecutionResults | undefined {
			return this.executionResultsSlot?.execution_results;
		},
		testCaseExecutionResults(): TestCaseExecutionResults | undefined {
			return this.executionResults?.tests?.find(t => t.id == this.modelValue.id);
		},
	},
});
</script>

<style></style>
