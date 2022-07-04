<template>
  <Component :is="exerciseComponentName" v-bind="$props"></Component>
</template>

<script lang="ts">
import {
  EventParticipationSlot,
  Exercise,
  ExerciseType,
  getFakeEventParticipationSlot,
} from "@/models";
import { defineComponent, PropType } from "@vue/runtime-core";
export default defineComponent({
  name: "Exercise",
  props: {
    exercise: {
      type: Object as PropType<Exercise>,
      required: true,
    },
    slot: {
      type: Object as PropType<EventParticipationSlot>,
      default: getFakeEventParticipationSlot,
    },
    readOnly: {
      type: Boolean,
      default: false,
    },
    showSolution: {
      type: Boolean,
      default: false,
    },
  },
  methods: {},
  computed: {
    exerciseComponentName(): string {
      const componentNames: Record<ExerciseType, string> = {
        [ExerciseType.MULTIPLE_CHOICE_MULTIPLE_POSSIBLE]:
          "MultipleChoiceExercise",
        [ExerciseType.MULTIPLE_CHOICE_SINGLE_POSSIBLE]:
          "MultipleChoiceExercise",
        [ExerciseType.OPEN_ANSWER]: "OpenAnswerExercise",
        [ExerciseType.JS]: "ProgrammingExercise",
        [ExerciseType.C]: "ProgrammingExercise",
        [ExerciseType.ATTACHMENT]: "AttachmentExercise",
        [ExerciseType.AGGREGATED]: "AggregatedExercise",
        [ExerciseType.COMPLETION]: "ClozeExercise",
      };

      return componentNames[this.exercise.exercise_type as ExerciseType];
    },
  },
});
</script>

<style></style>
