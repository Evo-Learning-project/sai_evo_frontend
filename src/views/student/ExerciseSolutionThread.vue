<template>
	<!-- <h2>{{ $t("exercise_solution_thread.thread_title") }}</h2> -->
	<div class="mt-4" v-if="!firstLoading">
		<FullExercise :exercise="exercise" />
		<ExerciseSolutionContainer
			class="mt-8"
			:exercise="exercise"
			:solutions="exerciseSolutions"
			:showFirst="solutionId ? [solutionId] : []"
			:standalone="true"
			@loadMore="loadMore()"
			:canLoadMore="!(paginatedExerciseSolutions?.isLastPage ?? true)"
		/>
	</div>
	<SkeletonCard v-else />
</template>

<script lang="ts">
import {
	Exercise as IExercise,
	ExerciseSolution,
	getFakeEventParticipationSlot,
} from "@/models";
import { defineComponent, PropType } from "@vue/runtime-core";
import AbstractEventParticipationSlot from "@/components/shared/AbstractEventParticipationSlot.vue";
import { courseIdMixin, loadingMixin } from "@/mixins";
import ExerciseSolutionContainer from "@/components/shared/ExerciseSolution/ExerciseSolutionContainer.vue";
import { mapActions, mapGetters, mapState } from "vuex";
import SkeletonCard from "@/components/ui/SkeletonCard.vue";
import Exercise from "@/components/shared/Exercise/Exercise.vue";
import { PaginatedData } from "@/api";
import Btn from "@/components/ui/Btn.vue";
import FullExercise from "@/components/shared/FullExercise.vue";
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
				fromFirstPage: true,
			});
		});
	},
	methods: {
		...mapActions("student", ["getExercises"]),
		...mapActions("shared", ["getSolutionsByExercise"]),
		async loadMore() {
			await this.withLoading(
				async () =>
					await this.getSolutionsByExercise({
						courseId: this.courseId,
						exerciseId: this.exerciseId,
						fromFirstPage: false,
					}),
			);
		},
	},
	computed: {
		...mapGetters("student", ["exercises"]),
		...mapState("shared", ["paginatedSolutionsByExerciseId"]),
		exercise(): IExercise | undefined {
			return (this.exercises as IExercise[]).find(
				e => e.id == (this.exerciseId as string),
			);
		},
		paginatedExerciseSolutions(): PaginatedData<ExerciseSolution> | undefined {
			return this.paginatedSolutionsByExerciseId[this.exerciseId];
		},
		exerciseSolutions(): ExerciseSolution[] {
			return this.paginatedExerciseSolutions?.data ?? [];
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
	components: {
		//AbstractEventParticipationSlot,
		ExerciseSolutionContainer,
		SkeletonCard,
		// Exercise,
		FullExercise,
	},
});
</script>

<style></style>
