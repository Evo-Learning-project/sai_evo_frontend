<template>
	<AbstractExercise v-bind="$props">
		<template #exerciseText>
			<div class="mx-auto mb-4 md:w-2/5 hide-in-thumbnail hidden" v-if="readOnly">
				<Tabs v-model="currentTab" :options="filteredTabsOptions"></Tabs>
			</div>
			<!-- exercise text pane -->
			<div
				class="user-content"
				v-show="readOnly && currentTab === ProgrammingExerciseTabs.TEXT"
			>
				<div v-html="exercise.text"></div>
			</div>

			<!-- test cases pane -->
			<div v-show="readOnly && currentTab === ProgrammingExerciseTabs.TEST_CASES">
				<div
					class="my-8"
					v-for="(testcase, index) in exercise.testcases"
					:key="'t-' + testcase.id"
				>
					<h4 class="mb-1">
						{{ $t("programming_exercise.testcase") }} {{ index + 1 }}
						<span
							v-if="!testcase.code && !testcase.text && !testcase.stdin"
							class="ml-2 icon-light inline-icon material-icons-outlined"
							>visibility_off</span
						>
					</h4>
					<ExerciseTestCase :test-case="testcase"></ExerciseTestCase>
				</div>
				<div v-if="exercise.testcases?.length === 0">
					<h4 class="mt-8 text-center text-muted">
						{{ $t("programming_exercise.no_testcases") }}
					</h4>
				</div>
			</div>
		</template>

		<template #submissionControls>
			<div
				v-if="true || currentTab === ProgrammingExerciseTabs.EDITOR"
				class="relative flex"
			>
				<CodeEditor
					:language="languageCode"
					class="w-full"
					:size="'lg'"
					v-model="proxyModelValue"
					:showRunButton="true"
					:runCoolDown="runCoolDown"
					:running="isRunning || runCoolDown > 0"
					@run="onRun()"
					@blur="$emit('blur')"
				>
					<template v-slot:runButton
						><span class="ml-1 mr-1 text-base material-icons"> play_arrow </span
						>{{ $t("programming_exercise.run_code") }}
						<span class="opacity-50" v-if="runCoolDown > 0"
							>&nbsp;({{ runCoolDown }})</span
						>
						<span v-if="runCoolDown < 10" class="opacity-0">0</span></template
					>
					<template v-slot:sidePaneTitle>
						<div class="mx-auto mb-2 md:w-full hide-in-thumbnail">
							<Tabs v-model="currentTab" :options="filteredTabsOptions"></Tabs>
						</div>
					</template>
					<template v-slot:sidePane>
						<div
							class="user-content mx-2 programming-exercise-text"
							v-show="currentTab === ProgrammingExerciseTabs.TEXT"
						>
							<div v-html="exercise.text"></div>
						</div>

						<!-- test cases pane -->
						<div v-show="currentTab === ProgrammingExerciseTabs.TEST_CASES">
							<div
								class="my-8 mx-2"
								v-for="(testcase, index) in exercise.testcases"
								:key="'t-' + testcase.id"
							>
								<h4 class="mb-1">
									{{ $t("programming_exercise.testcase") }} {{ index + 1 }}
									<span
										v-if="!testcase.code && !testcase.text && !testcase.stdin"
										class="ml-2 icon-light inline-icon material-icons-outlined"
										>visibility_off</span
									>
								</h4>
								<ExerciseTestCase :test-case="testcase"></ExerciseTestCase>
							</div>
							<div v-if="exercise.testcases?.length === 0">
								<h4 class="mt-8 text-center text-muted">
									{{ $t("programming_exercise.no_testcases") }}
								</h4>
							</div>
						</div>
						<div v-show="currentTab === ProgrammingExerciseTabs.EXECUTION_RESULTS">
							<div class="flex items-center p-3 pl-4 space-x-2 rounded-tr-sm bg-gray-50">
								<span class="my-auto material-icons-outlined icon-light"> code </span>
								<h3>
									{{ $t("programming_exercise.execution_results") }}
								</h3>
							</div>
							<CodeExecutionResults
								v-if="submission.execution_results"
								:executionResults="submission.execution_results"
								:testCases="exercise.testcases"
							></CodeExecutionResults>
							<div class="flex flex-col" v-else>
								<span class="mx-auto mt-24 opacity-30 text-8xl material-icons-outlined">
									code
								</span>
								<p class="px-4 mx-auto select-none text-muted">
									{{ $t("programming_exercise.code_execution_will_appear_here") }}
								</p>
							</div>
						</div>
					</template>
					<template v-slot:bottom>
						<transition name="quick-bounce"
							><div
								class="
									absolute
									bottom-0
									right-0
									z-50
									flex
									items-center
									px-6
									py-3
									mb-2
									mr-4
									space-x-2
									rounded
									bg-dark
									text-lightText
									bg-opacity-90
									shadow-popup
								"
								v-if="executionState === 'running'"
							>
								<Spinner :fast="true"></Spinner>
								<p>{{ $t("programming_exercise.running_code") }}</p>
							</div>
						</transition></template
					>
				</CodeEditor>
			</div>
		</template>

		<template #readOnlyAnswer>
			<div class="w-full mt-4">
				<p class="ml-2 text-sm text-muted">
					{{ $t("event_assessment.text_answer_label") }}
				</p>
				<CodeFragment
					:value="submission.answer_text"
					:defaultValue="$t('misc.no_answer')"
				></CodeFragment>

				<div class="mt-4 card card-filled" v-if="submission.execution_results">
					<h4 class="ml-2 text-sm text-muted">
						{{ $t("programming_exercise.execution_results") }}
					</h4>
					<CodeExecutionResults
						class="-mx-2"
						:testCases="exercise.testcases"
						:executionResults="submission.execution_results"
						:reduced="true"
					/>
				</div>
			</div>
		</template>

		<template #solution>
			<div class="w-full mt-4">
				<p class="ml-2 text-sm text-muted">
					{{ $t("misc.solution") }}
				</p>
				<CodeFragment :value="exercise.solution" />
			</div>
		</template>
	</AbstractExercise>
</template>

<script lang="ts">
const RUN_COOL_DOWN = 3;

import { programmingExerciseTabsOptions, ProgrammingExerciseTabs } from "@/const";
import {
	EventParticipationSlotSubmission,
	Exercise,
	ExerciseType,
	getEmptySubmission,
	ProgrammingExerciseType,
	programmingExerciseTypeToLanguageId,
} from "@/models";
import { defineComponent, PropType } from "@vue/runtime-core";
import { loadingMixin, texMixin } from "@/mixins";
import { SelectableOption } from "@/interfaces";
import Tabs from "@/components/ui/Tabs.vue";
import CodeEditor from "@/components/ui/CodeEditor.vue";
import CodeExecutionResults from "../CodeExecutionResults.vue";
import Spinner from "@/components/ui/Spinner.vue";
import ExerciseTestCase from "../ExerciseTestCase.vue";
import { exerciseProps } from "./shared";
import AbstractExercise from "./AbstractExercise.vue";
import CodeFragment from "@/components/ui/CodeFragment.vue";
export default defineComponent({
	name: "ProgrammingExercise",
	mixins: [loadingMixin, texMixin],
	props: {
		...exerciseProps,
		running: {
			type: Boolean,
		},
	},
	data() {
		return {
			ProgrammingExerciseTabs,
			programmingExerciseTabsOptions,
			currentTab: ProgrammingExerciseTabs.TEXT,
			showExecutingMessage: false,
			runCoolDown: 0,
			ExerciseType,
		};
	},
	watch: {
		isRunning(newVal, oldVal) {
			if (oldVal && !newVal) {
				this.currentTab = ProgrammingExerciseTabs.EXECUTION_RESULTS;
			}
		},
	},
	methods: {
		onRun() {
			this.$emit("runCode");
			this.runCoolDown = RUN_COOL_DOWN;
			const coolDownHandle = setInterval(() => {
				this.runCoolDown--;
				if (this.runCoolDown <= 0) {
					clearInterval(coolDownHandle);
				}
			}, 1000);
		},
	},
	computed: {
		proxyModelValue: {
			get() {
				return this.submission.answer_text;
			},
			set(val: string) {
				this.$emit("updateSubmission", ["answer_text", val]);
			},
		},
		filteredTabsOptions(): SelectableOption[] {
			return this.programmingExerciseTabsOptions.filter(
				o => !this.readOnly || o.value === ProgrammingExerciseTabs.TEXT,
			);
		},
		executionState() {
			return this.submission.execution_results?.state;
		},
		languageCode() {
			return programmingExerciseTypeToLanguageId[
				this.exercise.exercise_type as ProgrammingExerciseType
			];
		},
		isRunning() {
			return this.running || this.executionState === "running";
		},
	},
	components: {
		Tabs,
		CodeEditor,
		CodeExecutionResults,
		Spinner,
		ExerciseTestCase,
		AbstractExercise,
		CodeFragment,
	},
});
</script>

<style></style>
