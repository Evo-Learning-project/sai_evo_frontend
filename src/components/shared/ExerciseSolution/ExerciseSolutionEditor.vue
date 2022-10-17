<template>
	<div
		style="z-index: 1000"
		class="fixed top-0 left-0 flex items-center justify-center w-full h-full"
	>
		<div
			style="width: 100vw !important; height: 100vh !important"
			class="fixed z-10 w-full h-full transition-none bg-gray-900 opacity-80"
		></div>
		<div
			:style="
				mediaQueryMdMatches ? 'min-height: 24rem; max-height: 40rem' : 'height: 100vh'
			"
			class="
				fixed
				bottom-0
				left-0
				z-20
				flex flex-col
				w-full
				px-10
				py-6
				bg-gray-50
				shadow-all-around
			"
		>
			<div class="flex items-center w-full mb-8">
				<h3>{{ $t("exercise_solution.propose_solution_title") }}</h3>
				<Btn
					:variant="'icon'"
					class="ml-auto"
					:outline="true"
					@click="$emit('close')"
					:tooltip="$t('misc.close')"
					><span class="material-icons-outlined">close</span></Btn
				>
			</div>
			<div
				class="div flex items-center space-x-2 text-muted rounded-sm py-1 mb-2 lg:w-max"
			>
				<span class="material-icons-outlined text-lg">info</span>
				<p class="text-sm">{{ $t("exercise_solution.copyright_disclaimer") }}</p>
			</div>
			<div
				class="flex md:flex-row w-full h-full pb-10 flex-col md:space-x-8 overflow-y-auto"
			>
				<!-- editor section -->
				<div class="w-full h-full md:h-auto md:order-1 order-2 mt-4 md:mt-0">
					<TextEditor
						v-if="editorType === 'text'"
						:tall="true"
						class="mt-auto"
						:modelValue="modelValue.content"
						:placeholder="$t('exercise_solution.your_solution_placeholder')"
						@update:modelValue="onUpdate('content', $event)"
					/>
					<CodeEditor
						v-else
						:showRunButton="true"
						:runCoolDown="runCoolDown"
						:running="runningCode || runCoolDown > 0"
						:size="'lg'"
						@run="runCode()"
						:modelValue="modelValue.content"
						@update:modelValue="onUpdate('content', $event)"
						:language="editorType"
					>
						<template v-slot:runButton
							><span class="ml-1 mr-1 text-base material-icons"> play_arrow </span
							>{{ $t("programming_exercise.run_code") }}
							<span class="opacity-50" v-if="runCoolDown > 0"
								>&nbsp;({{ runCoolDown }})</span
							>
							<span v-if="runCoolDown < 10" class="opacity-0">0</span></template
						>
						<template v-slot:bottom>
							<transition name="quick-bounce"
								><div
									class="
										absolute
										bottom-20
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
									v-if="runningCode"
								>
									<Spinner :fast="true"></Spinner>
									<p>{{ $t("programming_exercise.running_code") }}</p>
								</div>
							</transition></template
						>
					</CodeEditor>
				</div>
				<!-- exercise section -->
				<div class="md:order-2 order-1 w-full h-full md:h-auto overflow-y-auto">
					<SegmentedControls
						v-if="editorType !== 'text'"
						class="mb-4"
						v-model="currentTab"
						:options="programmingExerciseTabsOptions"
					/>

					<FullExercise
						:showTags="false"
						v-show="currentTab === ProgrammingExerciseTabs.TEXT"
						:exercise="exercise"
					/>
					<CodeExecutionResults
						:reduced="true"
						:testCases="exercise.testcases ?? []"
						:executionResults="executionResults"
						v-show="currentTab === ProgrammingExerciseTabs.EXECUTION_RESULTS"
					/>
				</div>
			</div>
			<div class="flex items-center px-10 py-3 -mx-10 -mb-6 shadow-popup bg-light">
				<Btn
					:disabled="publishing || modelValue.content.trim().length === 0"
					@click="onSubmit()"
					>{{
						publishing
							? $t("exercise_solution.publishing")
							: $t("exercise_solution.publish")
					}}</Btn
				>
				<p
					class="ml-6 text-muted"
					v-if="modelValue.state === ExerciseSolutionState.DRAFT"
				>
					({{ $t("exercise_solution.states." + ExerciseSolutionState.DRAFT) }})
				</p>
				<CloudSaveStatus class="ml-auto" :saving="saving" :hadError="savingError" />
			</div>
		</div>
	</div>
</template>

<script lang="ts">
const RUN_COOL_DOWN = 10;

import { defineComponent, PropType } from "@vue/runtime-core";
import TextEditor from "@/components/ui/TextEditor.vue";
import {
	CodeExecutionResults as ICodeExecutionResults,
	Exercise,
	ExerciseSolution,
	ExerciseSolutionState,
} from "@/models";
import Btn from "@/components/ui/Btn.vue";
import CloudSaveStatus from "@/components/ui/CloudSaveStatus.vue";
import { mediaQueryMixin, texMixin } from "@/mixins";
import CodeEditor from "@/components/ui/CodeEditor.vue";
import { v4 as uuid4 } from "uuid";
import { openAuthenticatedWsConnection } from "@/ws/utils";
import FullExercise from "../FullExercise.vue";
import { ProgrammingExerciseTabs, programmingExerciseTabsOptions } from "@/const";
import CodeExecutionResults from "../CodeExecutionResults.vue";
import SegmentedControls from "@/components/ui/SegmentedControls.vue";
import Spinner from "@/components/ui/Spinner.vue";

export default defineComponent({
	name: "ExerciseSolutionEditor",
	mixins: [texMixin, mediaQueryMixin],
	props: {
		modelValue: {
			type: Object as PropType<ExerciseSolution>,
			required: true,
		},
		exercise: {
			type: Object as PropType<Exercise>,
			required: true,
		},
		saving: {
			type: Boolean,
			required: true,
		},
		savingError: {
			type: Boolean,
			required: true,
		},
		editorType: {
			type: String as PropType<"text" | "typescript" | "c" | "python">,
			required: true,
		},
		publishing: {
			type: Boolean,
			default: false,
		},
	},
	beforeUnmount() {
		const bodyContainsOverflowHidden =
			document.body.classList.contains("overflow-y-hidden");
		if (bodyContainsOverflowHidden) {
			document.body.classList.remove("overflow-y-hidden");
		}
		this.ws?.close();
	},
	created() {
		// prevent scrolling of the underlying page when open
		const bodyContainsOverflowHidden =
			document.body.classList.contains("overflow-y-hidden");
		if (!bodyContainsOverflowHidden) {
			document.body.classList.add("overflow-y-hidden");
		}
		this.triggerTexRender();
	},
	methods: {
		onUpdate<K extends keyof ExerciseSolution>(key: K, value: ExerciseSolution[K]) {
			this.$emit("updateSolution", { key, value });
		},
		onSubmit() {
			this.onUpdate(
				"state",
				this.modelValue.state === ExerciseSolutionState.DRAFT
					? ExerciseSolutionState.SUBMITTED
					: this.modelValue.state,
			);
		},
		async runCode() {
			const taskId = uuid4();
			const taskMessage = {
				task_id: taskId,
				exercise_id: this.exercise.id,
				code: this.modelValue.content,
				action: "run_code",
			};
			this.runCoolDown = RUN_COOL_DOWN;
			this.intervalHandle = setInterval(() => {
				this.runCoolDown--;
				if (this.runCoolDown === 0) {
					clearInterval(this.intervalHandle as number);
					this.intervalHandle = null;
				}
			}, 1000);
			this.runningCode = true;
			this.ws = await openAuthenticatedWsConnection(
				"code_runner",
				s => s.send(JSON.stringify(taskMessage)),
				m => {
					const payload = JSON.parse(m.data);
					if (payload.action === "execution_results") {
						this.executionResults = JSON.parse(payload.data);
						this.runningCode = false;
						this.currentTab = ProgrammingExerciseTabs.EXECUTION_RESULTS;
					}
				},
			);
		},
	},
	data() {
		return {
			ExerciseSolutionState,
			runCoolDown: 0,
			runningCode: false,
			ws: null as null | WebSocket,
			executionResults: {} as ICodeExecutionResults,
			ProgrammingExerciseTabs,
			programmingExerciseTabsOptions: programmingExerciseTabsOptions.filter(o =>
				[
					ProgrammingExerciseTabs.TEXT,
					ProgrammingExerciseTabs.EXECUTION_RESULTS,
				].includes(o.value),
			),
			currentTab: ProgrammingExerciseTabs.TEXT,
			intervalHandle: null as null | number,
		};
	},
	computed: {},
	components: {
		TextEditor,
		Btn,
		CloudSaveStatus,
		CodeEditor,
		FullExercise,
		CodeExecutionResults,
		SegmentedControls,
		Spinner,
	},
});
</script>

<style></style>
