<template>
	<div>
		<div v-if="firstLoading">
			<MinimalExercisePreviewSkeleton />
		</div>
		<div v-else-if="exercise">
			<!-- <AbstractEventParticipationSlot :modelValue="slot" /> -->
			<FullExercise :exercise="exercise" />
			<ExerciseSolutionContainer
				:exercise="exercise"
				:solutions="exerciseSolutions"
				:showFirst="solutionId ? [solutionId] : []"
				:forceShowAll="true"
				:showTeacherControls="true"
				:allowAddSolution="false"
				:showTitle="false"
				:canLoadMore="!(exercisePaginatedSolutions?.isLastPage ?? true)"
				@loadMore="loadMore()"
			/>
		</div>
	</div>
</template>

<script lang="ts">
import {
	EventParticipationSlot,
	Exercise,
	ExerciseSolution,
	getBlankExercise,
	getFakeEventParticipationSlot,
} from "@/models";
import { defineComponent, PropType } from "@vue/runtime-core";
import AbstractEventParticipationSlot from "@/components/shared/AbstractEventParticipationSlot.vue";
import ExerciseSolutionContainer from "@/components/shared/ExerciseSolution/ExerciseSolutionContainer.vue";
import { mapActions, mapGetters, mapState } from "vuex";
import { courseIdMixin, loadingMixin } from "@/mixins";
import MinimalExercisePreviewSkeleton from "@/components/ui/skeletons/MinimalExercisePreviewSkeleton.vue";
import { PaginatedData } from "@/api";
export default defineComponent({
	name: "DetailExerciseSolutionThreads",
	props: {},
	mixins: [courseIdMixin, loadingMixin],
	async created() {
		await this.withFirstLoading(async () => {
			await this.getExercisesById({
				courseId: this.courseId,
				exerciseIds: [this.exerciseId],
				replace: true,
			});
			await this.getSolutionsByExercise({
				courseId: this.courseId,
				exerciseId: this.exerciseId,
				fromFirstPage: true,
			});
		});
	},
	methods: {
		...mapActions("teacher", ["getExercisesById"]),
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
		...mapGetters("teacher", ["exercises"]),
		...mapState("shared", ["paginatedSolutionsByExerciseId"]),
		exercise(): Exercise | undefined {
			return (this.exercises as Exercise[]).find(
				e => e.id == (this.exerciseId as string),
			);
		},
		exercisePaginatedSolutions(): PaginatedData<ExerciseSolution> | undefined {
			return this.paginatedSolutionsByExerciseId[this.exerciseId];
		},
		exerciseSolutions(): ExerciseSolution[] {
			return this.exercisePaginatedSolutions?.data ?? [];
		},
		exerciseId() {
			return this.$route.params.exerciseId as string;
		},
		solutionId() {
			return this.$route.params.solutionId;
		},
	},
	components: {
		//AbstractEventParticipationSlot,
		ExerciseSolutionContainer,
		MinimalExercisePreviewSkeleton,
	},
});
</script>

<style></style>
