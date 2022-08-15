<template>
	<!-- <h2>{{ $t("exercise_solution_thread.thread_title") }}</h2> -->
	<div class="mt-4" v-if="!firstLoading">
		<AbstractEventParticipationSlot :modelValue="slot" />
		<ExerciseSolutionContainer
			class="mt-8"
			:exercise="exercise"
			:solutions="exerciseSolutions"
			:showFirst="[solutionId]"
			:standalone="true"
		></ExerciseSolutionContainer>
	</div>
	<SkeletonCard v-else />
</template>

<script lang="ts">
import { Exercise, ExerciseSolution, getFakeEventParticipationSlot } from "@/models";
import { defineComponent, PropType } from "@vue/runtime-core";
import AbstractEventParticipationSlot from "@/components/shared/AbstractEventParticipationSlot.vue";
import { courseIdMixin, loadingMixin } from "@/mixins";
import ExerciseSolutionContainer from "@/components/shared/ExerciseSolution/ExerciseSolutionContainer.vue";
import { mapActions, mapGetters, mapState } from "vuex";
import SkeletonCard from "@/components/ui/SkeletonCard.vue";
export default defineComponent({
	name: "ExerciseSolutionThread",
	props: {},
	mixins: [courseIdMixin, loadingMixin],
	async created() {
		await this.withFirstLoading(async () => {
			await this.getExercises({
				courseId: this.courseId,
				exerciseIds: [this.exerciseId],
			});
			await this.getSolutionsByExercise({
				courseId: this.courseId,
				exerciseId: this.exerciseId,
			});
		});
	},
	methods: {
		...mapActions("student", ["getExercises"]),
		...mapActions("shared", ["getSolutionsByExercise"]),
	},
	computed: {
		...mapGetters("student", ["exercises"]),
		...mapState("shared", ["paginatedSolutionsByExerciseId"]),
		exercise(): Exercise | undefined {
			return (this.exercises as Exercise[]).find(
				e => e.id == (this.exerciseId as string),
			);
		},
		exerciseSolutions(): ExerciseSolution[] {
			return this.paginatedSolutionsByExerciseId[this.exerciseId]?.data ?? [];
		},

		solutionId() {
			return this.$route.params.solutionId as string;
		},
		exerciseId() {
			return this.$route.params.exerciseId as string;
		},
		slot() {
			if (typeof this.exercise === "undefined") {
				return null;
			}
			return getFakeEventParticipationSlot(this.exercise);
		},
	},
	components: { AbstractEventParticipationSlot, ExerciseSolutionContainer, SkeletonCard },
});
</script>

<style></style>
