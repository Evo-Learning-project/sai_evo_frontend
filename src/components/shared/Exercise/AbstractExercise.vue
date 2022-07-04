<template>
  <div>
    <slot name="exerciseText">
      <ProcessedTextFragment :value="exercise.text" />
    </slot>

    <!-- contains the input controls to answer the exercise
    (e.g. checkboxes, textareas...) -->
    <slot v-if="!readOnly" name="submissionControls"></slot>

    <!-- representation of a read-only answer given to
    the exercise (e.g. a code fragment for a programming exercise) -->
    <slot name="readOnlyAnswer"></slot>
  </div>
</template>

<script lang="ts">
import {
  EventParticipationSlot,
  Exercise,
  getFakeEventParticipationSlot,
} from "@/models";
import { defineComponent, PropType } from "@vue/runtime-core";
import ProcessedTextFragment from "@/components/ui/ProcessedTextFragment.vue";
export default defineComponent({
  name: "AbstractExercise",
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
  },
  methods: {},
  computed: {},
  components: { ProcessedTextFragment },
});
</script>

<style></style>
