<template>
  <Exercise :exercise="exercise" :readOnly="true"></Exercise>
</template>

<script lang="ts">
import {
  EventParticipationSlot,
  Exercise as IExercise,
  getFakeEventParticipationSlot,
} from "@/models";
import { defineComponent, PropType } from "@vue/runtime-core";
import Exercise from "./Exercise/Exercise.vue"; // A read-only fake EventParticipationSlot as a wrapper to show an exercise
export default defineComponent({
  name: "FullExercise",
  props: {
    exercise: {
      type: Object as PropType<IExercise>,
      required: true,
    },
  },
  components: {
    Exercise,
  },
  computed: {
    exerciseWrapperSlot(): EventParticipationSlot {
      return getFakeEventParticipationSlot(this.exercise);
    },
  },
});
</script>

<style></style>
