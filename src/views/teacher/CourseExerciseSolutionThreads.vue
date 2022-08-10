<template>
	<div>
		<p class="text-muted">{{ $t("exercise_solution_thread.teacher_description") }}</p>

		<div
			class="mt-6"
			v-for="{ slot, highlightedSolutionIds } in processedExercises"
			:key="'thread-e-' + slot.exercise.id"
		>
			<h4>{{ getExerciseTitle(slot.exercise) }}</h4>
			<AbstractEventParticipationSlot :modelValue="slot" />
			<ExerciseSolutionContainer
				class=""
				:showTitle="false"
				:allowAddSolution="false"
				:showTeacherControls="true"
				:exercise="slot.exercise"
				:showFirst="highlightedSolutionIds"
			>
			</ExerciseSolutionContainer>
		</div>
	</div>
</template>

<script lang="ts">
import { courseIdMixin, loadingMixin } from "@/mixins";
import {
	EventParticipationSlot,
	Exercise,
	getFakeEventParticipationSlot,
} from "@/models";
import { defineComponent, PropType } from "@vue/runtime-core";
import ExerciseSolutionContainer from "@/components/shared/ExerciseSolution/ExerciseSolutionContainer.vue";
import { getTranslatedString as _ } from "@/i18n";

import { createNamespacedHelpers } from "vuex";
import AbstractEventParticipationSlot from "@/components/shared/AbstractEventParticipationSlot.vue";
import MinimalExercisePreview from "@/components/teacher/ExerciseEditor/MinimalExercisePreview.vue";
const { mapState, mapActions } = createNamespacedHelpers("teacher");
export default defineComponent({
	name: "CourseExerciseSolutionThreads",
	mixins: [loadingMixin, courseIdMixin],
	props: {},
	async created() {
		this.withFirstLoading(async () => {
			await this.getExercises({
				courseId: this.courseId,
				fromFirstPage: true,
			});
			//await this.getTags({ courseId: this.courseId });
		});
	},
	methods: {
		...mapActions(["getExercises"]),
		getExerciseTitle(exercise: Exercise): string {
			return (exercise?.label ?? "").trim().length > 0
				? (exercise.label as string)
				: _("exercise_preview.unnamed_exercise");
		},
	},
	computed: {
		...mapState(["exercises"]),
		processedExercises(): {
			slot: EventParticipationSlot;
			highlightedSolutionIds: string[];
		}[] {
			// TODO return exercises with the most important solutions shown
			return this.exercises.map((e: Exercise) => ({
				slot: getFakeEventParticipationSlot(e),
				highlightedSolutionIds: [],
			}));
		},
	},
	components: {
		ExerciseSolutionContainer,
		AbstractEventParticipationSlot,
	},
});
</script>

<style></style>
