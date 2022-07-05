<template>
  <AbstractExercise v-bind="$props">
    <template #submissionControls>
      <CheckboxGroup
        v-if="
          exercise.exercise_type ===
          ExerciseType.MULTIPLE_CHOICE_MULTIPLE_POSSIBLE
        "
        :options="exerciseChoicesAsOptions"
        v-model="selectedChoicesProxy"
        :disabled="readOnly"
      >
        <template v-slot:item="{ description }">
          <div v-if="showSolution" class="flex items-center mb-2 space-x-2">
            <p
              :class="{
                'text-success': description?.[0] === 'done',
                'text-danger-dark': description?.[0] === 'close',
              }"
              class="text-sm font-semibold text-muted material-icons-outlined"
            >
              {{ description?.[0] }}
            </p>
            <p class="text-sm text-muted" v-if="nonUniformScores">
              {{ description?.[1] }}
              {{
                $t(
                  `exercise.choice_score_word_${
                    parseFloat(description?.[1] ?? "") == 1 ||
                    parseFloat(description?.[1] ?? "") == -1
                      ? "singular"
                      : "plural"
                  }`
                )
              }}
            </p>
          </div></template
        ></CheckboxGroup
      >

      <RadioGroup
        v-else-if="
          exercise.exercise_type ===
          ExerciseType.MULTIPLE_CHOICE_SINGLE_POSSIBLE
        "
        :options="exerciseChoicesAsOptions"
        v-model="selectedChoicesProxy"
        :disabled="readOnly"
      >
        <template v-slot:item="{ description }">
          <div v-if="showSolution" class="flex items-center mb-2 space-x-2">
            <p
              :class="{
                'text-success': description?.[0] === 'done',
                'text-danger-dark': description?.[0] === 'close',
              }"
              class="text-sm font-semibold text-muted material-icons-outlined"
            >
              {{ description?.[0] }}
            </p>
            <p
              :id="description?.[3] ?? ''"
              class="text-sm text-muted"
              v-if="nonUniformScores"
            >
              {{ description?.[1] }}
              {{
                $t(
                  `exercise.choice_score_word_${
                    parseFloat(description?.[1] ?? "") == 1 ||
                    parseFloat(description?.[1] ?? "") == -1
                      ? "singular"
                      : "plural"
                  }`
                )
              }}
            </p>
          </div></template
        ></RadioGroup
      >
    </template>
  </AbstractExercise>
</template>

<script lang="ts">
import {
  EventParticipationSlotSubmission,
  Exercise,
  ExerciseChoice,
  ExerciseType,
  getEmptySubmission,
} from "@/models";
import { defineComponent, PropType } from "@vue/runtime-core";
import AbstractExercise from "./AbstractExercise.vue";
import CheckboxGroup from "@/components/ui/CheckboxGroup.vue";
import RadioGroup from "@/components/ui/RadioGroup.vue";
import { SelectableOption } from "@/interfaces";
import { formatExerciseText } from "@/utils";
import { exerciseProps } from "./shared";
export default defineComponent({
  name: "MultipleChoiceExercise",
  props: {
    ...exerciseProps,
  },
  data() {
    return {
      ExerciseType,
    };
  },
  methods: {},
  computed: {
    selectedChoicesProxy: {
      get() {
        return this.submission.selected_choices;
      },
      set(val: string | string[]) {
        this.$emit("updateSubmission", {
          selected_choices: typeof val === "object" ? val : [val],
        });
      },
    },
    exerciseChoicesAsOptions(): SelectableOption[] {
      if (
        this.exercise.exercise_type !==
          ExerciseType.MULTIPLE_CHOICE_SINGLE_POSSIBLE &&
        this.exercise.exercise_type !==
          ExerciseType.MULTIPLE_CHOICE_MULTIPLE_POSSIBLE
      ) {
        return [];
      }

      return (this.exercise.choices as ExerciseChoice[]).map((c) => ({
        value: c.id,
        content: formatExerciseText(c.text),
        ...(this.showSolution &&
        String(c.score_selected ?? "").length > 0 &&
        String(c.score_unselected ?? "").length > 0
          ? {
              description: [
                (this.exercise.correct_choices ?? []).length > 0
                  ? this.exercise.correct_choices?.includes(c.id)
                    ? "done"
                    : "close"
                  : "",
                String(c.score_selected),
                String(c.score_unselected),
                c.id,
              ],
            }
          : {}),
      }));
    },
    nonUniformScores(): boolean {
      // Returns whether all choices aside from the correct
      // ones have the same score_selected
      const nonCorrectChoices = (
        this.exercise.choices as ExerciseChoice[]
      ).filter((c) => !this.exercise.correct_choices?.includes(c.id));

      return nonCorrectChoices.some(
        (c) => c.score_selected != nonCorrectChoices[0].score_selected
      );
    },
  },
  components: { AbstractExercise, CheckboxGroup, RadioGroup },
});
</script>

<style></style>
