<template>
	<div>
		<div class="px-4 pt-1" v-if="executionResults?.state === 'internal_error'">
			{{ $t("programming_exercise.internal_error") }}
		</div>
		<div v-if="executionResults?.tests">
			<div v-if="executionResults.tests.length === 0">
				<p class="px-4 text-muted">
					{{ $t("programming_exercise.results_ok_but_no_testcases") }}
				</p>
			</div>
			<div
				v-for="(test, index) in filteredExecutionResultsTests"
				:key="'details-' + test.id"
				class="px-6 py-6 -mx-2"
			>
				<div v-if="!onlyErrors" class="flex items-center mb-2 space-x-3">
					<h5 class="">{{ $t("programming_exercise.testcase") }} {{ index + 1 }}</h5>
					<div
						v-if="test.passed"
						class="flex items-center font-semibold text-success-dark"
					>
						<span class="mr-1 text-base material-icons-outlined"> done </span>
						<span>{{ $t("programming_exercise.passed") }}</span>
					</div>
					<div v-else class="flex items-center font-semibold text-danger-dark">
						<span class="mr-1 text-base material-icons-outlined"> close </span>
						<span>{{ $t("programming_exercise.not_passed") }}</span>
					</div>
					<Btn
						v-if="reduced"
						:variant="'icon'"
						:outline="true"
						@click="
							testCaseDetailsVisibility[test.id] = !testCaseDetailsVisibility[test.id]
						"
						><span
							:class="[
								testCaseDetailsVisibility[test.id]
									? 'material-icons'
									: 'material-icons-outlined',
							]"
							>visibility</span
						></Btn
					>
				</div>
				<div v-show="!reduced || testCaseDetailsVisibility[test.id]">
					<ExerciseTestCase
						:small="true"
						v-if="!onlyErrors"
						:test-case="exerciseTestCase(test.id)"
					></ExerciseTestCase>
					<div v-if="!test.passed && test.stdout" class="mt-3">
						<p class="mb-1 text-muted">
							{{ $t("programming_exercise.test_failed_stdout") }}:
						</p>
						<CodeFragment
							:collapsible="true"
							:value="test.stdout"
							:small="true"
						></CodeFragment>
					</div>
					<div v-if="!test.passed && test.error" class="mt-3">
						<p class="mb-1 text-muted">
							{{ $t("programming_exercise.test_failed_with_error") }}:
						</p>
						<CodeFragment
							:collapsible="true"
							:value="test.stderr || test.error"
							:small="true"
						></CodeFragment>
					</div>
				</div>
			</div>
		</div>
		<div
			class="px-4 pt-1"
			v-else-if="!!executionResults && executionResults.execution_error"
		>
			<p class="mb-1 text-muted">{{ $t("programming_exercise.code_errored") }}:</p>
			<CodeFragment
				:collapsible="true"
				:value="executionResults?.execution_error"
			></CodeFragment>
		</div>
		<div
			class="px-4 pt-1"
			v-else-if="!!executionResults && executionResults.compilation_errors"
		>
			<p class="mb-1 text-muted">{{ $t("programming_exercise.compilation_errored") }}:</p>
			<CodeFragment
				:collapsible="true"
				:value="String(executionResults?.compilation_errors)"
			></CodeFragment>
		</div>
	</div>
</template>

<script lang="ts">
import { CodeExecutionResults, ExerciseTestCase as IExerciseTestCase } from "@/models";
import { defineComponent, PropType } from "@vue/runtime-core";
import ExerciseTestCase from "./ExerciseTestCase.vue";
import CodeFragment from "../ui/CodeFragment.vue";
import Btn from "../ui/Btn.vue";
export default defineComponent({
	name: "CodeExecutionResults",
	props: {
		// slot: {
		//   type: Object as PropType<EventParticipationSlot>,
		//   required: true,
		// },
		executionResults: {
			type: Object as PropType<CodeExecutionResults>,
			required: true,
		},
		testCases: {
			type: Array as PropType<IExerciseTestCase[]>,
			required: true,
		},
		showTestIds: {
			type: Array as PropType<string[]>,
			default: () => [],
		},
		onlyErrors: {
			type: Boolean,
			default: false,
		},
		reduced: {
			type: Boolean,
			default: false,
		},
	},
	data() {
		return {
			// test case id -> whether it's expanded
			testCaseDetailsVisibility: {} as Record<string, boolean>,
		};
	},
	methods: {},
	computed: {
		exerciseTestCase() {
			return (id: string) => this.testCases.find(t => String(t.id) === String(id));
		},
		filteredExecutionResultsTests() {
			return this.executionResults?.tests?.filter(
				t =>
					this.showTestIds.length === 0 ||
					this.showTestIds.map(i => String(i)).includes(String(t.id)),
			);
		},
	},
	components: { ExerciseTestCase, CodeFragment, Btn },
});
</script>

<style></style>
