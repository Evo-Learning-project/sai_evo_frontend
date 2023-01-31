<template>
	<div>
		<div class="flex items-center space-x-4">
			<h4 v-if="showTitle">{{ $t("exercise_solution.proposed_solutions_title") }}</h4>
			<!-- <Btn :variant="'primary'" :size="'sm'" :outline="true">
            <span class="mr-2 text-base material-icons">reviews</span>
            {{ $t("exercise_solution.propose_solution") }}</Btn
          > -->
		</div>
		<ExerciseSolution
			class="w-full my-4"
			v-for="solution in shownSolutions"
			:publishing="publishing"
			:key="'e-' + exercise.id + '-solution-' + solution.id"
			:solution="solution"
			:exercise="exercise"
			:forceExpanded="standalone"
			:showTeacherControls="showTeacherControls"
			@updateState="onSolutionStateUpdate(solution, $event)"
			@editSolution="onEditSolution(solution)"
			@deleteSolution="onDeleteSolution(solution)"
		/>
		<div
			class="flex md:flex-row items-center md:space-y-0 space-y-2 flex-col md:space-x-4"
			v-if="solutions.length === 0"
		>
			<p class="text-muted">
				{{ $t("exercise_solution.no_solutions_call_to_action") }}
			</p>
			<Btn
				@click="onAddSolution()"
				:variant="'primary'"
				class="w-full md:w-max"
				:size="'sm'"
				:outline="true"
			>
				<span class="mr-2 text-base material-icons">reviews</span>
				{{ $t("exercise_solution.propose_solution") }}
			</Btn>
		</div>
		<div class="flex flex-col">
			<Btn
				@click="onShowMore()"
				:size="'xs'"
				:variant="'primary-borderless'"
				class="mr-auto -ml-1"
				v-if="canShowMore"
			>
				{{ $t("exercise_solution.load_more_solutions") }}
				<!-- ({{ nonDraftSolutions.length }}) -->
			</Btn>
			<Btn
				@click="onAddSolution()"
				v-if="solutions.length > 0 && allowAddSolution"
				:variant="'primary'"
				class="mt-4 md:mr-auto w-full md:w-max"
				:size="'sm'"
				:outline="true"
			>
				<span class="mr-2 text-base material-icons">reviews</span>
				{{ $t("exercise_solution.propose_solution") }}
			</Btn>
			<router-link
				:to="threadPermalink"
				v-if="showExerciseThreadLink && solutions.length > 0"
				class="mt-4"
			>
				<Btn :size="'xs'" class="-ml-1" :variant="'primary-borderless'">
					{{ $t("exercise_solution.go_to_exercise_thread") }}
				</Btn>
			</router-link>
		</div>

		<div v-if="editingSolutionId !== null || editingSolutionDeepCopy !== null">
			<ExerciseSolutionEditor
				:publishing="publishing"
				:saving="saving"
				:savingError="savingError"
				:modelValue="editingSolution ?? editingSolutionDeepCopy"
				@updateSolution="onDraftSolutionChange($event.key, $event.value)"
				@close="onClose()"
				:editorType="solutionType"
				:exercise="exercise"
			/>
		</div>
	</div>
</template>

<script lang="ts">
const SHOW_INITIALLY_COUNT = 1;
import { getExerciseThreadRoute } from "./utils";

import {
	Exercise as IExercise,
	ExerciseSolution as IExerciseSolution,
	ExerciseSolutionState,
	getBlankExerciseSolution,
	ProgrammingExerciseType,
	programmingExerciseTypeToLanguageId,
} from "@/models";
import { defineComponent, PropType } from "@vue/runtime-core";
import Btn from "@/components/ui/Btn.vue";
import ExerciseSolution from "./ExerciseSolution.vue";
import ExerciseSolutionEditor from "./ExerciseSolutionEditor.vue";
import { courseIdMixin, loadingMixin, savingMixin } from "@/mixins";
import { logAnalyticsEvent, setErrorNotification } from "@/utils";
import { AutoSaveManager } from "@/autoSave";
import {
	EXERCISE_SOLUTION_AUTO_SAVE_DEBOUNCE_FIELDS,
	EXERCISE_SOLUTION_AUTO_SAVE_DEBOUNCE_TIME_MS,
} from "@/const";
import { getTranslatedString } from "@/i18n";
import { mapStores } from "pinia";
import { useMetaStore } from "@/stores/metaStore";
import { useMainStore } from "@/stores/mainStore";
export default defineComponent({
	name: "ExerciseSolutionContainer",
	props: {
		exercise: {
			type: Object as PropType<IExercise>,
			required: true,
		},
		solutions: {
			type: Array as PropType<IExerciseSolution[]>,
			required: true,
		},
		canLoadMore: {
			type: Boolean,
			default: false,
		},
		showFirst: {
			type: Array as PropType<string[]>,
			required: false,
		},
		standalone: {
			type: Boolean,
			default: false,
		},
		showTeacherControls: {
			type: Boolean,
			default: false,
		},
		showTitle: {
			type: Boolean,
			default: true,
		},
		allowAddSolution: {
			type: Boolean,
			default: true,
		},
		forceShowAll: {
			type: Boolean,
			default: false,
		},
		showExerciseThreadLink: {
			type: Boolean,
			default: false,
		},
		allowShowMore: {
			type: Boolean,
			default: true,
		},
		initialEditorContent: {
			type: String,
			default: "",
		},
	},
	mixins: [courseIdMixin, savingMixin, loadingMixin],
	methods: {
		onClose() {
			this.editingSolutionId = null;
			this.editingSolutionDeepCopy = null;
			this.autoSaveManager = null;
		},
		onShowMore() {
			if (!this.showAll && !this.forceShowAll) {
				this.showAll = true;
			} else {
				this.$emit("loadMore");
			}
		},
		async onDraftSolutionChange<K extends keyof IExerciseSolution>(
			key: K,
			value: IExerciseSolution[K],
		) {
			await this.autoSaveManager?.onChange({ [key]: value });
		},
		async onSolutionStateUpdate(
			solution: IExerciseSolution,
			newState: ExerciseSolutionState,
		) {
			this.instantiateAutoSaveManager(solution, true);
			this.publishing = true;
			try {
				logAnalyticsEvent("updatedExerciseSolutionState", {
					courseId: this.courseId,
					state: newState,
				});
				await this.autoSaveManager?.onChange({ state: newState });
			} catch (e) {
				setErrorNotification(e);
			} finally {
				this.autoSaveManager = null;
				this.publishing = false;
			}
		},
		instantiateLocalOnlyAutoSaveManager() {
			this.autoSaveManager = new AutoSaveManager<IExerciseSolution>(
				this.editingSolutionDeepCopy as IExerciseSolution,
				async changes => {
					if ("state" in changes) {
						await this.onDoneEditing();
					}
				},
				changes => {
					if (this.editingSolutionDeepCopy !== null) {
						this.editingSolutionDeepCopy = {
							...this.editingSolutionDeepCopy,
							...changes,
						};
					}
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
		instantiateAutoSaveManager(forSolution?: IExerciseSolution, revertOnFailure = false) {
			const solution = forSolution ?? (this.editingSolution as IExerciseSolution);
			this.autoSaveManager = new AutoSaveManager<IExerciseSolution>(
				solution,
				async changes => {
					if ("state" in changes) {
						this.publishing = true;
					}
					await this.mainStore.updateExerciseSolution({
						courseId: this.courseId,
						exerciseId: this.exercise.id,
						solution: { ...solution, ...changes },
					});
					if ("state" in changes) {
						this.onSolutionStateChange();
					}
				},
				changes => {
					this.saving = true;
					this.savingError = false;
					this.mainStore.setExerciseSolution({
						exerciseId: this.exercise.id,
						payload: {
							...solution,
							...changes,
						},
					});
				},
				EXERCISE_SOLUTION_AUTO_SAVE_DEBOUNCE_FIELDS,
				EXERCISE_SOLUTION_AUTO_SAVE_DEBOUNCE_TIME_MS,
				undefined,
				e => {
					this.savingError = true;
					setErrorNotification(e);
				},
				() => {
					this.saving = false;
					this.publishing = false;
				},
				revertOnFailure,
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
			//this.editingSolutionId = solution.id;
			this.editingSolutionDeepCopy = JSON.parse(JSON.stringify(solution));
			this.instantiateLocalOnlyAutoSaveManager();
		},
		async onDeleteSolution(solution: IExerciseSolution) {
			if (!confirm(getTranslatedString("exercise_solution.confirm_deletion"))) {
				return;
			}
			await this.withLoading(
				async () =>
					await this.mainStore.deleteExerciseSolution({
						courseId: this.courseId,
						exerciseId: this.exercise.id,
						solutionId: solution.id,
					}),
				setErrorNotification,
			);
		},
		async editDraftSolution(): Promise<boolean> {
			if (this.editingSolution !== null) {
				return false;
			}
			if (this.draftSolutions.length > 0) {
				this.editingSolutionId = this.draftSolutions[0].id;
			} else {
				const newSolution = await this.mainStore.createExerciseSolution({
					courseId: this.courseId,
					exerciseId: this.exercise.id,
					solution: getBlankExerciseSolution(
						ExerciseSolutionState.DRAFT,
						this.initialEditorContent,
					),
				});
				this.editingSolutionId = newSolution.id;
			}
			return true;
		},
		onSolutionStateChange() {
			this.editingSolutionId = null;
			this.autoSaveManager = null;
			this.metaStore.showSuccessFeedback();
		},
		async onDoneEditing() {
			this.publishing = true;
			try {
				await this.mainStore.updateExerciseSolution({
					courseId: this.courseId,
					exerciseId: this.exercise.id,
					solution: this.editingSolutionDeepCopy as IExerciseSolution,
				});
				this.mainStore.setExerciseSolution({
					exerciseId: this.exercise.id,
					payload: this.editingSolutionDeepCopy as IExerciseSolution,
				});
				this.editingSolutionId = null;
				this.editingSolutionDeepCopy = null;
				this.autoSaveManager = null;
				this.metaStore.showSuccessFeedback();
			} catch (e) {
				setErrorNotification(e);
			} finally {
				this.publishing = false;
			}
		},
	},
	data() {
		return {
			saving: false,
			savingError: false,
			creatingSolution: false,
			publishing: false,
			editingSolutionId: null as string | null,
			autoSaveManager: null as AutoSaveManager<IExerciseSolution> | null,
			showAll: false,
			editingSolutionDeepCopy: null as IExerciseSolution | null,
			SHOW_INITIALLY_COUNT,
		};
	},
	computed: {
		...mapStores(useMetaStore, useMainStore),
		canShowMore() {
			return (
				this.allowShowMore &&
				(this.canLoadMore || this.shownSolutions.length < this.nonDraftSolutions.length)
			);
		},
		shownSolutions(): IExerciseSolution[] {
			const ret = [...this.nonDraftSolutions];
			if (this.showFirst) {
				ret.sort((a, _) =>
					(this.showFirst ?? []).map(s => String(s)).includes(String(a.id)) ? -1 : 0,
				);
			}
			return ret.filter(
				(_, i) => this.showAll || this.forceShowAll || i < SHOW_INITIALLY_COUNT,
			);
		},
		draftSolutions(): IExerciseSolution[] {
			return this.solutions.filter(s => s.state === ExerciseSolutionState.DRAFT);
		},
		nonDraftSolutions(): IExerciseSolution[] {
			return (this.solutions ?? []).filter(s => s.state !== ExerciseSolutionState.DRAFT);
		},
		editingSolution(): IExerciseSolution | null {
			if (this.editingSolutionId === null) {
				return null;
			}
			return (this.solutions ?? []).find(s => s.id == this.editingSolutionId) ?? null;
		},
		threadPermalink() {
			return this.$router.resolve(
				getExerciseThreadRoute(this.courseId, this.exercise.id),
			);
		},
		solutionType() {
			const code =
				programmingExerciseTypeToLanguageId[
					this.exercise.exercise_type as ProgrammingExerciseType
				];
			return code ?? "text";
		},
	},
	components: {
		Btn,
		ExerciseSolution,
		ExerciseSolutionEditor,
	},
});
</script>

<style></style>
