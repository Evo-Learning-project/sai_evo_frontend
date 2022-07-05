<template>
  <component
    :is="exerciseComponentName"
    v-bind="$props"
    @updateSubmission="$emit('updateSubmission', $event)"
  ></component>
</template>

<script lang="ts">
import {
  EventParticipationSlotSubmission,
  Exercise,
  ExerciseType,
  getEmptySubmission,
} from "@/models";
import { defineComponent, PropType } from "@vue/runtime-core";
import MultipleChoiceExercise from "./MultipleChoiceExercise.vue";
import OpenAnswerExercise from "./OpenAnswerExercise.vue";
import AttachmentExercise from "./AttachmentExercise.vue";
import AggregatedExercise from "./AggregatedExercise.vue";
import ClozeExercise from "./ClozeExercise.vue";
import ProgrammingExercise from "./ProgrammingExercise.vue";
import { exerciseProps } from "./shared";
export default defineComponent({
  name: "Exercise",
  emits: {
    updateSubmission: (
      event: Record<keyof EventParticipationSlotSubmission, any>
    ) => {
      /**
       * Emitted when the submission to this exercise changes the event contains
       * a single key which is a `keyof EventParticipationSlotSubmission`, and
       * its value is the new submission content
       */
      const validators: Record<
        keyof EventParticipationSlotSubmission,
        (val: any) => boolean
      > = {
        answer_text: (val) => typeof val === "string",
        selected_choices: (val) =>
          val &&
          Array.isArray(val) &&
          val.forEach((v) => ["string", "number"].includes(typeof v)),
        attachment: (val) => true,
        execution_results: (val) => false, // meant to be read-only
      };

      // check event is a non-null object
      if (event === null || typeof event !== "object") {
        console.warn("Invalid updateSubmission event", event);
        return false;
      }
      // check event contains a single key
      const keys = Object.keys(event);
      if (keys.length !== 1) {
        console.warn("Too many arguments in updateSubmission event", event);
        return false;
      }
      // check the single key in event is a valid submission field
      const changeKey = keys[0];
      if (!(changeKey in validators)) {
        console.warn("Invalid key in updateSubmission event", changeKey);
        return false;
      }
      // check the value for that key is valid
      if (
        !validators[changeKey as keyof EventParticipationSlotSubmission](
          event[changeKey as keyof EventParticipationSlotSubmission]
        )
      ) {
        console.warn(
          "Invalid value for key",
          changeKey,
          event[changeKey as keyof EventParticipationSlotSubmission]
        );
        return false;
      }
      return true;
    },
  },
  props: { ...exerciseProps },
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
  components: {
    MultipleChoiceExercise,
    OpenAnswerExercise,
    AttachmentExercise,
    AggregatedExercise,
    ClozeExercise,
    ProgrammingExercise,
  },
});
</script>

<style></style>
