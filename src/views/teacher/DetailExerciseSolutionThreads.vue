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
				:canLoadMore="!exercisePaginatedSolutions.isLastPage"
				@loadMore="loadMore()"
			/>
		</div>
	</div>
</template>

<script lang="ts">
import { ExerciseSolution } from "@/models";
import { defineComponent } from "@vue/runtime-core";
import ExerciseSolutionContainer from "@/components/shared/ExerciseSolution/ExerciseSolutionContainer.vue";
import { courseIdMixin, loadingMixin } from "@/mixins";
import MinimalExercisePreviewSkeleton from "@/components/ui/skeletons/MinimalExercisePreviewSkeleton.vue";
import { PaginatedData } from "@/api";
import { mapStores } from "pinia";
import { useMainStore } from "@/stores/mainStore";
export default defineComponent({
	name: "DetailExerciseSolutionThreads",
	props: {},
	mixins: [courseIdMixin, loadingMixin],
	async created() {
		await this.withFirstLoading(async () => {
			await this.mainStore.getExercisesById({
				courseId: this.courseId,
				exerciseIds: [this.exerciseId],
				replace: true,
			});
			await this.mainStore.getSolutionsByExercise({
				courseId: this.courseId,
				exerciseId: this.exerciseId,
				fromFirstPage: true,
				filter: null,
			});
		});
	},
	methods: {
		async loadMore() {
			await this.withLoading(
				async () =>
					await this.mainStore.getSolutionsByExercise({
						courseId: this.courseId,
						exerciseId: this.exerciseId,
						fromFirstPage: false,
						filter: null,
					}),
			);
		},
	},
	computed: {
		...mapStores(useMainStore),
		exercise() {
			return this.mainStore.exercises.find(e => e.id == this.exerciseId);
		},
		exercisePaginatedSolutions(): PaginatedData<ExerciseSolution> {
			return this.mainStore.getPaginatedSolutionsByExerciseId(this.exerciseId);
		},
		exerciseSolutions(): ExerciseSolution[] {
			return this.exercisePaginatedSolutions.data;
		},
		exerciseId() {
			return this.$route.params.exerciseId as string;
		},
		solutionId() {
			return this.$route.params.solutionId;
		},
	},
	components: {
		ExerciseSolutionContainer,
		MinimalExercisePreviewSkeleton,
	},
});
</script>

<style></style>
