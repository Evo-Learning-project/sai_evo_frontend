<template>
	<component
		:is="exerciseComponentName"
		v-bind="$props"
		@updateSubmission="$emit('updateSubmission', $event)"
		@runCode="$emit('runCode')"
		@blur="$emit('blur')"
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
import { texMixin } from "@/mixins";
export default defineComponent({
	name: "Exercise",
	mixins: [texMixin],
	created() {
		this.triggerTexRender();
	},
	emits: {
		blur: null,
		updateSubmission: (payload: [keyof EventParticipationSlotSubmission, any]) => {
			/**
			 * Emitted when the submission to this exercise changes
			 */
			const validators: Record<
				keyof EventParticipationSlotSubmission,
				(val: any) => boolean
			> = {
				answer_text: val => typeof val === "string",
				selected_choices: val =>
					val &&
					Array.isArray(val) &&
					val.every(v => ["string", "number"].includes(typeof v)),
				attachment: val => true,
				execution_results: val => false, // meant to be read-only
			};
			if (!(payload[0] in validators)) {
				console.warn("Invalid key in updateSubmission event", payload[0]);
				return false;
			}
			// check the value for that key is valid
			if (!validators[payload[0]](payload[1])) {
				console.warn("Invalid value for key", payload[0], payload[1]);
				return false;
			}
			return true;
		},
		runCode: null,
	},
	props: { ...exerciseProps },
	methods: {},
	computed: {
		exerciseComponentName(): string {
			const componentNames: Record<ExerciseType, string> = {
				[ExerciseType.MULTIPLE_CHOICE_MULTIPLE_POSSIBLE]: "MultipleChoiceExercise",
				[ExerciseType.MULTIPLE_CHOICE_SINGLE_POSSIBLE]: "MultipleChoiceExercise",
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
