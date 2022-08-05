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
      v-for="solution in nonDraftSolutions"
      :key="'e-' + exercise.id + '-solution-' + solution.id"
      :solution="solution"
      :exercise="exercise"
    />
    <div
      class="flex items-center space-x-4"
      v-if="(exercise.solutions ?? []).length === 0"
    >
      <p class="text-muted">
        {{ $t("exercise_solution.no_solutions_call_to_action") }}
      </p>
      <Btn
        @click="onAddSolution()"
        :variant="'primary'"
        class=""
        :size="'sm'"
        :outline="true"
      >
        <span class="mr-2 text-base material-icons">reviews</span>
        {{ $t("exercise_solution.propose_solution") }}</Btn
      >
    </div>
    <Btn
      @click="onAddSolution()"
      v-else
      :variant="'primary'"
      class="mt-4"
      :size="'sm'"
      :outline="true"
    >
      <span class="mr-2 text-base material-icons">reviews</span>
      {{ $t("exercise_solution.propose_solution") }}</Btn
    >
    <div v-if="editingSolution && solutionBeingEdited">
      <ExerciseSolutionEditor
        :saving="saving"
        :savingError="savingError"
        :modelValue="solutionBeingEdited"
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
import { courseIdMixin } from "@/mixins";
import { setErrorNotification } from "@/utils";
import Exercise from "../Exercise/Exercise.vue";
import { AutoSaveManager } from "@/autoSave";
import { mapActions } from "vuex";
import {
  EXERCISE_SOLUTION_AUTO_SAVE_DEBOUNCE_FIELDS,
  EXERCISE_SOLUTION_AUTO_SAVE_DEBOUNCE_TIME_MS,
} from "@/const";
export default defineComponent({
  name: "ExerciseSolutionContainer",
  props: {
    exercise: {
      type: Object as PropType<IExercise>,
      required: true,
    },
  },
  mixins: [courseIdMixin],
  methods: {
    ...mapActions("shared", ["getTags", "updateExerciseChild"]),
    onClose() {
      this.editingSolution = false;
    },
    async onDraftSolutionChange<K extends keyof IExerciseSolution>(
      key: K,
      value: IExerciseSolution[K]
    ) {
      console.log("changes", { key, value });
      await this.autoSaveManager?.onChange({ field: key, value });
    },
    instantiateAutoSaveManager() {
      this.autoSaveManager ??= new AutoSaveManager<IExerciseSolution>(
        this.solutionBeingEdited as IExerciseSolution,
        async (changes) => {
          await this.updateExerciseChild({
            childType: "solution",
            courseId: this.courseId,
            exerciseId: this.exercise.id,
            payload: { ...this.solutionBeingEdited, ...changes },
            reFetch: false,
          });
          if (changes.state === ExerciseSolutionState.SUBMITTED) {
            this.onDraftSolutionSubmitted();
          }
        },
        (changes) => {
          this.saving = true;
          this.savingError = false;
          this.solutionBeingEdited = this.solutionBeingEdited
            ? { ...this.solutionBeingEdited, ...changes }
            : null;
        },
        EXERCISE_SOLUTION_AUTO_SAVE_DEBOUNCE_FIELDS,
        EXERCISE_SOLUTION_AUTO_SAVE_DEBOUNCE_TIME_MS,
        undefined,
        () => (this.savingError = true),
        () => (this.saving = false)
      );
    },
    async onAddSolution() {
      this.creatingSolution = true;
      try {
        this.editingSolution = true;
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
        this.solutionBeingEdited = this.draftSolutions[0];
      } else {
        this.solutionBeingEdited = await createExerciseSolution(
          this.courseId,
          this.exercise.id,
          getBlankExerciseSolution(ExerciseSolutionState.DRAFT)
        );
      }
      return true;
    },
    onDraftSolutionSubmitted() {
      this.solutionBeingEdited = null;
      this.editingSolution = false;
      this.$store.commit("shared/showSuccessFeedback");
    },
  },
  data() {
    return {
      saving: false,
      savingError: false,
      creatingSolution: false,
      editingSolution: false,
      solutionBeingEdited: null as IExerciseSolution | null,
      autoSaveManager: null as AutoSaveManager<IExerciseSolution> | null,
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
    draftSolutions(): IExerciseSolution[] {
      return (this.exercise.solutions ?? []).filter(
        (s) => s.state === ExerciseSolutionState.DRAFT
      );
    },
    nonDraftSolutions(): IExerciseSolution[] {
      return (this.exercise.solutions ?? []).filter(
        (s) => s.state !== ExerciseSolutionState.DRAFT
      );
    },
  },
  components: { Btn, ExerciseSolution, ExerciseSolutionEditor, Exercise },
});
</script>

<style></style>
