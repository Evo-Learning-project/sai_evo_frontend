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
      class="w-full"
      v-for="solution in exercise.solutions"
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
    <div v-if="editingSolution && draftSolution">
      <ExerciseSolutionEditor
        v-model="draftSolution"
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
    // onShowSolutionEditor() {

    // },
    onClose() {
      this.editingSolution = false;
    },
    async onAddSolution() {
      this.creatingSolution = true;
      try {
        this.draftSolution ??= await createExerciseSolution(
          this.courseId,
          this.exercise.id,
          getBlankExerciseSolution(ExerciseSolutionState.DRAFT)
        );
        this.editingSolution = true;
      } catch (e) {
        setErrorNotification(e);
      } finally {
        this.creatingSolution = false;
      }
    },
  },
  data() {
    return {
      creatingSolution: false,
      editingSolution: false,
      draftSolution: null as IExerciseSolution | null,
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
  },
  components: { Btn, ExerciseSolution, ExerciseSolutionEditor, Exercise },
});
</script>

<style></style>