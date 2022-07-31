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
      <Btn :variant="'primary'" class="" :size="'sm'" :outline="true">
        <span class="mr-2 text-base material-icons">reviews</span>
        {{ $t("exercise_solution.propose_solution") }}</Btn
      >
    </div>
    <Btn v-else :variant="'primary'" class="mt-4" :size="'sm'" :outline="true">
      <span class="mr-2 text-base material-icons">reviews</span>
      {{ $t("exercise_solution.propose_solution") }}</Btn
    >
  </div>
</template>

<script lang="ts">
import { Exercise } from "@/models";
import { defineComponent, PropType } from "@vue/runtime-core";
import Btn from "@/components/ui/Btn.vue";
import ExerciseSolution from "./ExerciseSolution.vue";
export default defineComponent({
  name: "ExerciseSolutionContainer",
  props: {
    exercise: {
      type: Object as PropType<Exercise>,
      required: true,
    },
  },
  methods: {},
  computed: {},
  components: { Btn, ExerciseSolution },
});
</script>

<style></style>
