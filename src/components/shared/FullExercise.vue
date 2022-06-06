<template>
  <AbstractEventParticipationSlot
    :showExerciseLabel="true"
    :modelValue="exerciseWrapperSlot"
  ></AbstractEventParticipationSlot>
</template>

<script lang="ts">
import {
  EventParticipationSlot,
  Exercise,
  getFakeEventParticipationSlot,
} from "@/models";
import { defineComponent, PropType } from "@vue/runtime-core";
import AbstractEventParticipationSlot from "@/components/shared/AbstractEventParticipationSlot.vue"; // A read-only fake EventParticipationSlot as a wrapper to show an exercise
export default defineComponent({
  name: "FullExercise",
  props: {
    exercise: {
      type: Object as PropType<Exercise>,
      required: true,
    },
  },
  components: {
    AbstractEventParticipationSlot,
  },
  computed: {
    exerciseWrapperSlot(): EventParticipationSlot {
      return getFakeEventParticipationSlot(this.exercise);
    },
  },
});
</script>

<style></style>
