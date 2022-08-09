<template>
	<!-- <Exercise :exercise="exercise" :readOnly="true"></Exercise> -->
	<AbstractEventParticipationSlot
		:modelValue="exerciseWrapperSlot"
		:allowEditAssessment="false"
		:allowEditSubmission="false"
	/>
</template>

<script lang="ts">
import {
	EventParticipationSlot,
	Exercise as IExercise,
	getFakeEventParticipationSlot,
} from "@/models";
import { defineComponent, PropType } from "@vue/runtime-core";
import Exercise from "./Exercise/Exercise.vue";
import AbstractEventParticipationSlot from "./AbstractEventParticipationSlot.vue"; // A read-only fake EventParticipationSlot as a wrapper to show an exercise
export default defineComponent({
	name: "FullExercise",
	props: {
		exercise: {
			type: Object as PropType<IExercise>,
			required: true,
		},
	},
	components: {
		// Exercise,
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
