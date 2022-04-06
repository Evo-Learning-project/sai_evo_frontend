<template>
  <div>
    <div
      class="px-4 pt-1 bg-danger bg-opacity-5"
      v-if="slot.execution_results?.state === 'internal_error'"
    >
      {{ $t("programming_exercise.internal_error") }}
    </div>
    <div v-if="slot.execution_results?.tests">
      <div v-if="slot.execution_results.tests.length === 0">
        <p class="px-4 text-muted">
          {{ $t("programming_exercise.results_ok_but_no_testcases") }}
        </p>
      </div>
      <div
        v-for="(test, index) in slot.execution_results.tests"
        :key="'details-' + test.id"
        :class="[test.passed ? 'bg-success' : 'bg-danger']"
        class="px-6 py-6 -mx-2 bg-opacity-5"
      >
        <div class="flex items-center mb-2 space-x-3">
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
        </div>

        <ExerciseTestCase
          :small="true"
          :test-case="exerciseTestCase(test.id)"
        ></ExerciseTestCase>
        <div v-if="!test.passed" class="mt-3">
          <p class="mb-1 text-muted">
            {{ $t("programming_exercise.test_failed_with_error") }}:
          </p>
          <CodeFragment :value="test.error" :small="true"></CodeFragment>
        </div>
      </div>
    </div>
    <div
      class="px-4 pt-1 bg-danger bg-opacity-5"
      v-else-if="!!slot.execution_results && slot.execution_results.execution_error"
    >
      <p class="mb-1 text-muted">{{ $t("programming_exercise.code_errored") }}:</p>
      <CodeFragment :value="slot.execution_results?.execution_error"></CodeFragment>
    </div>
    <div
      class="px-4 pt-1 bg-danger bg-opacity-5"
      v-else-if="!!slot.execution_results && slot.execution_results.compilation_errors"
    >
      <p class="mb-1 text-muted">{{ $t("programming_exercise.compilation_errored") }}:</p>
      <CodeFragment :value="slot.execution_results?.compilation_errors"></CodeFragment>
    </div>
  </div>
</template>

<script lang="ts">
import { EventParticipationSlot } from "@/models";
import { defineComponent, PropType } from "@vue/runtime-core";
import ExerciseTestCase from "./ExerciseTestCase.vue";
import CodeFragment from "../ui/CodeFragment.vue";
export default defineComponent({
  name: "CodeExecutionResults",
  props: {
    slot: {
      type: Object as PropType<EventParticipationSlot>,
      required: true,
    },
  },
  methods: {},
  computed: {
    exerciseTestCase() {
      return (id: string) => this.slot.exercise.testcases?.find((t) => t.id == id);
    },
  },
  components: { ExerciseTestCase, CodeFragment },
});
</script>

<style></style>
