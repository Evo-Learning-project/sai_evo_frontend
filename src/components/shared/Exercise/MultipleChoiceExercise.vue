<template>
	<AbstractExercise v-bind="$props">
		<template #submissionControls>
			<CheckboxGroup
				v-if="exercise.exercise_type === ExerciseType.MULTIPLE_CHOICE_MULTIPLE_POSSIBLE"
				:options="exerciseChoicesAsOptions"
				v-model="selectedChoicesProxy"
				:disabled="readOnly"
			>
				<template v-slot:item="{ description }">
					<div v-if="showSolution" class="flex items-center mb-2 space-x-2">
						<p
							:class="{
								'text-success': description === 'done',
								'text-danger-dark': description === 'close',
							}"
							class="text-sm font-semibold text-muted material-icons-outlined"
						>
							{{ description }}
						</p>
						<!-- <p class="text-sm text-muted" v-if="nonUniformScores">
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
            </p> -->
					</div></template
				></CheckboxGroup
			>

			<RadioGroup
				v-else-if="exercise.exercise_type === ExerciseType.MULTIPLE_CHOICE_SINGLE_POSSIBLE"
				:options="exerciseChoicesAsOptions"
				v-model="selectedChoicesProxy"
				:disabled="readOnly"
			>
				<template v-slot:item="{ description }">
					<div v-if="showSolution" class="flex items-center mb-2 space-x-2">
						<p
							:class="{
								'text-success': description === 'done',
								'text-danger-dark': description === 'close',
							}"
							class="text-sm font-semibold text-muted material-icons-outlined"
						>
							{{ description }}
						</p>
						<!-- <p
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
            </p>-->
					</div></template
				></RadioGroup
			>
		</template>
	</AbstractExercise>
</template>

<script lang="ts">
import { EventParticipationSlotSubmission, Exercise, ExerciseChoice, ExerciseType, getEmptySubmission } from "@/models";
import { defineComponent, PropType } from "@vue/runtime-core";
import AbstractExercise from "./AbstractExercise.vue";
import CheckboxGroup from "@/components/ui/CheckboxGroup.vue";
import RadioGroup from "@/components/ui/RadioGroup.vue";
import { SelectableOption } from "@/interfaces";
import { formatExerciseText } from "@/utils";
import { exerciseProps } from "./shared";
import { getCorrectChoices } from "./utils";
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
				this.$emit("updateSubmission", ["selected_choices", typeof val === "object" ? val : [val]]);
			},
		},
		correctChoices(): string[] {
			return getCorrectChoices(this.exercise);
		},
		exerciseChoicesAsOptions(): SelectableOption[] {
			if (
				this.exercise.exercise_type !== ExerciseType.MULTIPLE_CHOICE_SINGLE_POSSIBLE &&
				this.exercise.exercise_type !== ExerciseType.MULTIPLE_CHOICE_MULTIPLE_POSSIBLE
			) {
				return [];
			}

			return (this.exercise.choices as ExerciseChoice[]).map(c => ({
				value: c.id,
				content: formatExerciseText(c.text),
				description: this.showSolution ? (this.correctChoices.includes(c.id) ? "done" : "close") : "", // TODO instead of putting it in the description, there should be an `extras` parameter
			}));
		},
	},
	components: { AbstractExercise, CheckboxGroup, RadioGroup },
});
</script>

<style></style>
