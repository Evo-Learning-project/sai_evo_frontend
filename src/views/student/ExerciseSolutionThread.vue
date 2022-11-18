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
			:canLoadMore="!paginatedExerciseSolutions.isLastPage"
		/>
	</div>
	<SkeletonCard v-else />
</template>

<script lang="ts">
import { getFakeEventParticipationSlot } from "@/models";
import { defineComponent } from "@vue/runtime-core";
import { courseIdMixin, loadingMixin } from "@/mixins";
import ExerciseSolutionContainer from "@/components/shared/ExerciseSolution/ExerciseSolutionContainer.vue";
import SkeletonCard from "@/components/ui/SkeletonCard.vue";
import FullExercise from "@/components/shared/FullExercise.vue";
import { mapStores } from "pinia";
import { useMainStore } from "@/stores/mainStore";
export default defineComponent({
	name: "ExerciseSolutionThread",
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
			return this.mainStore.getExerciseById(this.exerciseId);
		},
		paginatedExerciseSolutions() {
			return this.mainStore.getPaginatedSolutionsByExerciseId(this.exerciseId);
		},
		exerciseSolutions() {
			return this.paginatedExerciseSolutions.data;
		},
		solutionId() {
			return this.$route.params.solutionId as string;
		},
		exerciseId() {
			return this.$route.params.exerciseId as string;
		},
		slot() {
			return getFakeEventParticipationSlot(this.exercise);
		},
	},
	components: {
		ExerciseSolutionContainer,
		SkeletonCard,
		FullExercise,
	},
});
</script>

<style></style>
