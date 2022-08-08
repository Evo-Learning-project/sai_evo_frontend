<template>
	<div class="relative">
		<div class="mx-auto md:w-2/5" v-if="showTabs">
			<SegmentedControls v-model="currentTab" :options="filteredTabsOptions"></SegmentedControls>
		</div>
		<!-- <transition name="bounce"> -->
		<DraggablePopup @close="showPopup = false" v-show="showPopup" :title="$t('programming_exercise.tab_text')">
			<div class="user-content" v-html="exercise.text"></div>
		</DraggablePopup>
		<!-- </transition> -->

		<div class="mt-4">
			<div class="user-content" v-show="currentTab === ProgrammingExerciseTabs.TEXT">
				<div class="flex w-full -mt-5">
					<Btn
						@click="onOpenPopup()"
						:disabled="showPopup"
						class="ml-auto -mr-2"
						:variant="'icon'"
						v-if="allowPopup"
						:outline="'true'"
						:tooltip="$t('programming_exercise.open_text_popup')"
					>
						<!-- <span style="font-size: 1.1rem !important" class="material-icons"
              >open_in_full</span
            > -->
						<svg style="width: 26px; height: 26px" viewBox="0 0 24 24">
							<path fill="currentColor" d="M4,8H8V4H20V16H16V20H4V8M16,8V14H18V6H10V8H16M6,12V18H14V12H6Z" />
						</svg>
					</Btn>
				</div>
				<div v-html="exercise.text"></div>
			</div>
			<div v-if="currentTab === ProgrammingExerciseTabs.EDITOR" class="relative flex">
				<CodeEditor
					:language="exercise.exercise_type === ExerciseType.JS ? 'typescript' : 'c'"
					class="w-full"
					:size="'lg'"
					v-model="proxyModelValue"
					:showRunButton="true"
					:runCoolDown="runCoolDown"
					:running="executionState === 'running' || running || runCoolDown > 0"
					@run="onRun"
				>
					<template v-slot:runButton
						><span class="ml-1 mr-1 text-base material-icons"> play_arrow </span
						>{{ $t("programming_exercise.run_code") }}
						<span class="opacity-50" v-if="runCoolDown > 0">&nbsp;({{ runCoolDown }})</span>
						<span v-if="runCoolDown < 10" class="opacity-0">0</span></template
					>
					<template v-slot:sidePaneTitle
						><div class="flex items-center p-3 pl-4 space-x-2 rounded-tr-sm bg-gray-50">
							<span class="my-auto material-icons-outlined icon-light"> code </span>
							<h3>
								{{ $t("programming_exercise.execution_results") }}
							</h3>
						</div>
					</template>
					<template v-slot:sidePane>
						<CodeExecutionResults v-if="slot.execution_results" :slot="slot"></CodeExecutionResults>
						<div class="flex flex-col" v-else>
							<span class="mx-auto mt-24 opacity-30 text-8xl material-icons-outlined"> code </span>
							<p class="px-4 mx-auto text-muted">
								{{ $t("programming_exercise.code_execution_will_appear_here") }}
							</p>
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
									bg-opacity-90 bg-light
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
			<div v-show="currentTab === ProgrammingExerciseTabs.TEST_CASES">
				<div class="my-8" v-for="(testcase, index) in exercise.testcases" :key="'t-' + testcase.id">
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
		</div>
	</div>
</template>

<script lang="ts">
const RUN_COOL_DOWN = 0;

import { programmingExerciseTabsOptions, ProgrammingExerciseTabs } from "@/const";
import { EventParticipationSlot, Exercise, ExerciseType } from "@/models";
import { defineComponent, PropType } from "@vue/runtime-core";
import SegmentedControls from "../ui/SegmentedControls.vue";
import CodeEditor from "../ui/CodeEditor.vue";
import ExerciseTestCase from "./ExerciseTestCase.vue";
//import Btn from "../ui/Btn.vue";
import { loadingMixin, texMixin } from "@/mixins";
//import Backdrop from "../ui/Backdrop.vue";
import CodeExecutionResults from "./CodeExecutionResults.vue";
import { SelectableOption } from "@/interfaces";
import Spinner from "../ui/Spinner.vue";
import Btn from "../ui/Btn.vue";
import DraggablePopup from "../ui/DraggablePopup.vue";
export default defineComponent({
	name: "ProgrammingExercise",
	mixins: [loadingMixin, texMixin],
	watch: {},
	props: {
		exercise: {
			type: Object as PropType<Exercise>,
			required: true,
		},
		slot: {
			type: Object as PropType<EventParticipationSlot>,
			required: true,
		},
		modelValue: {
			type: String,
			required: true,
		},
		executionResults: {
			type: Object as PropType<Record<string, string>>,
			required: false,
		},
		running: {
			type: Boolean,
		},
		showEditor: {
			type: Boolean,
			default: true,
		},
		allowPopup: {
			type: Boolean,
			default: true,
		},
		showTabs: {
			type: Boolean,
			default: true,
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
			showPopup: false,
		};
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
		onOpenPopup() {
			this.showPopup = true;
			this.triggerTexRender();
		},
	},
	computed: {
		proxyModelValue: {
			get(): string {
				return this.modelValue;
			},
			set(newVal: string) {
				this.$emit("update:modelValue", newVal);
			},
		},
		filteredTabsOptions(): SelectableOption[] {
			return this.programmingExerciseTabsOptions.filter(
				o => this.showEditor || o.value !== ProgrammingExerciseTabs.EDITOR,
			);
		},
		executionState() {
			return this.executionResults?.state;
		},
	},
	components: {
		SegmentedControls,
		CodeEditor,
		ExerciseTestCase,
		//Btn,
		// Backdrop,
		CodeExecutionResults,
		Spinner,
		Btn,
		DraggablePopup,
	},
});
</script>

<style></style>
