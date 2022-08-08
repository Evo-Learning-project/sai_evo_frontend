<template>
	<div>
		<div class="flex items-center space-x-4">
			<h4 class="">{{ $t("exercise_solution.proposed_solutions_title") }}</h4>
			<!-- <Btn :variant="'primary'" :size="'sm'" :outline="true">
            <span class="mr-2 text-base material-icons">reviews</span>
            {{ $t("exercise_solution.propose_solution") }}</Btn
          > -->
		</div>
		<ExerciseSolution
			class="w-full my-4"
			v-for="solution in shownSolutions"
			:key="'e-' + exercise.id + '-solution-' + solution.id"
			:solution="solution"
			:exercise="exercise"
			@editSolution="onEditSolution(solution)"
		/>
		<div class="flex items-center space-x-4" v-if="(exercise.solutions ?? []).length === 0">
			<p class="text-muted">
				{{ $t("exercise_solution.no_solutions_call_to_action") }}
			</p>
			<Btn @click="onAddSolution()" :variant="'primary'" class="" :size="'sm'" :outline="true">
				<span class="mr-2 text-base material-icons">reviews</span>
				{{ $t("exercise_solution.propose_solution") }}
			</Btn>
		</div>
		<div class="flex flex-col">
			<Btn
				@click="showAll = true"
				:size="'xs'"
				:variant="'primary-borderless'"
				class="mr-auto -ml-1"
				v-if="!showAll && nonDraftSolutions.length > SHOW_INITIALLY_COUNT"
			>
				{{ $t("exercise_solution.show_all") }} ({{ nonDraftSolutions.length }})</Btn
			>
			<Btn
				@click="onAddSolution()"
				v-if="(exercise.solutions ?? []).length > 0"
				:variant="'primary'"
				class="mt-4 mr-auto"
				:size="'sm'"
				:outline="true"
			>
				<span class="mr-2 text-base material-icons">reviews</span>
				{{ $t("exercise_solution.propose_solution") }}
			</Btn>
		</div>

		<div v-if="editingSolutionId !== null">
			<ExerciseSolutionEditor
				:publishing="publishing"
				:saving="saving"
				:savingError="savingError"
				:modelValue="editingSolution"
				@updateSolution="onDraftSolutionChange($event.key, $event.value)"
				@close="onClose()"
				:editorType="editorType"
			>
				<Exercise :exercise="exercise" :showSolution="true" :readOnly="true" />
			</ExerciseSolutionEditor>
		</div>
	</div>
</template>

<script lang="ts">
const SHOW_INITIALLY_COUNT = 1;

import {
	Exercise as IExercise,
	ExerciseSolution as IExerciseSolution,
	ExerciseSolutionState,
	ExerciseType,
	getBlankExerciseSolution,
} from "@/models";
import { defineComponent, PropType } from "@vue/runtime-core";
import Btn from "@/components/ui/Btn.vue";
import ExerciseSolution from "./ExerciseSolution.vue";
import ExerciseSolutionEditor from "./ExerciseSolutionEditor.vue";
import { createExerciseSolution } from "@/api/exercises";
import { courseIdMixin, savingMixin } from "@/mixins";
import { setErrorNotification } from "@/utils";
import Exercise from "../Exercise/Exercise.vue";
import { AutoSaveManager } from "@/autoSave";
import { mapActions, mapMutations } from "vuex";
import { EXERCISE_SOLUTION_AUTO_SAVE_DEBOUNCE_FIELDS, EXERCISE_SOLUTION_AUTO_SAVE_DEBOUNCE_TIME_MS } from "@/const";
export default defineComponent({
	name: "ExerciseSolutionContainer",
	props: {
		exercise: {
			type: Object as PropType<IExercise>,
			required: true,
		},
	},
	mixins: [courseIdMixin, savingMixin],
	methods: {
		...mapActions("shared", ["updateExerciseChild"]),
		...mapActions("student", ["addExerciseSolution"]),
		...mapMutations("student", ["setExerciseSolution"]),
		onClose() {
			this.editingSolutionId = null;
		},
		async onDraftSolutionChange<K extends keyof IExerciseSolution>(key: K, value: IExerciseSolution[K]) {
			await this.autoSaveManager?.onChange({ field: key, value });
		},
		instantiateAutoSaveManager() {
			this.autoSaveManager ??= new AutoSaveManager<IExerciseSolution>(
				this.editingSolution as IExerciseSolution,
				async changes => {
					if (changes.state === ExerciseSolutionState.SUBMITTED) {
						this.publishing = true;
					}
					await this.updateExerciseChild({
						childType: "solution",
						courseId: this.courseId,
						exerciseId: this.exercise.id,
						payload: { ...this.editingSolution, ...changes },
						reFetch: false,
					});
					if (changes.state === ExerciseSolutionState.SUBMITTED) {
						this.onDraftSolutionSubmitted();
					}
				},
				changes => {
					this.saving = true;
					this.savingError = false;
					this.setExerciseSolution({
						exerciseId: this.exercise.id,
						payload: {
							...this.editingSolution,
							...changes,
						},
					});
				},
				EXERCISE_SOLUTION_AUTO_SAVE_DEBOUNCE_FIELDS,
				EXERCISE_SOLUTION_AUTO_SAVE_DEBOUNCE_TIME_MS,
				undefined,
				() => (this.savingError = true),
				() => {
					this.saving = false;
					this.publishing = false;
				},
			);
		},
		async onAddSolution() {
			this.creatingSolution = true;
			try {
				const changed = await this.editDraftSolution();
				if (changed) {
					this.instantiateAutoSaveManager();
				}
			} catch (e) {
				setErrorNotification(e);
			} finally {
				this.creatingSolution = false;
			}
		},
		onEditSolution(solution: IExerciseSolution) {
			this.editingSolutionId = solution.id;
			this.instantiateAutoSaveManager();
		},
		async editDraftSolution(): Promise<boolean> {
			/**
			 * Assigns an ExerciseSolution in DRAFT state to this.solutionBeingEdited,
			 * if it doesn't have a value assigned to it yet.
			 *
			 * If such a solution exists, it is retrieved locally, otherwise a new
			 * ExerciseSolution is created on the backend.
			 *
			 * Returns true iff a new value was assigned to this.solutionBeingEdited
			 */
			if (this.solutionBeingEdited !== null) {
				return false;
			}
			if (this.draftSolutions.length > 0) {
				this.editingSolutionId = this.draftSolutions[0].id;
			} else {
				const newSolution: IExerciseSolution = await this.addExerciseSolution({
					courseId: this.courseId,
					exerciseId: this.exercise.id,
					solution: getBlankExerciseSolution(ExerciseSolutionState.DRAFT),
				});
				this.editingSolutionId = newSolution.id;
			}
			return true;
		},
		onDraftSolutionSubmitted() {
			this.editingSolutionId = null;
			this.$store.commit("shared/showSuccessFeedback");
		},
	},
	data() {
		return {
			saving: false,
			savingError: false,
			creatingSolution: false,
			publishing: false,
			editingSolutionId: null as string | null,
			solutionBeingEdited: null as IExerciseSolution | null,
			autoSaveManager: null as AutoSaveManager<IExerciseSolution> | null,
			showAll: false,
			SHOW_INITIALLY_COUNT,
		};
	},
	computed: {
		editorType() {
			if (this.exercise.exercise_type === ExerciseType.JS) {
				return "typescript";
			}
			if (this.exercise.exercise_type === ExerciseType.C) {
				return "c";
			}
			return "text";
		},
		shownSolutions(): IExerciseSolution[] {
			return this.nonDraftSolutions.filter((_, i) => this.showAll || i < SHOW_INITIALLY_COUNT);
		},
		draftSolutions(): IExerciseSolution[] {
			return (this.exercise.solutions ?? []).filter(s => s.state === ExerciseSolutionState.DRAFT);
		},
		nonDraftSolutions(): IExerciseSolution[] {
			return (this.exercise.solutions ?? []).filter(s => s.state !== ExerciseSolutionState.DRAFT);
		},
		editingSolution(): IExerciseSolution | null {
			if (this.editingSolutionId === null) {
				return null;
			}
			return (this.exercise.solutions ?? []).find(s => s.id == this.editingSolutionId) ?? null;
		},
	},
	components: { Btn, ExerciseSolution, ExerciseSolutionEditor, Exercise },
});
</script>

<style></style>
