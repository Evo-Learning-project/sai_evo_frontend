<template>
	<div>
		<div v-if="firstLoading">
			<MinimalExercisePreviewSkeleton />
		</div>
		<div v-else-if="exercise">
			<AbstractEventParticipationSlot :modelValue="slot" />
			<ExerciseSolutionContainer
				:exercise="exercise"
				:solutions="exercise.solutions ?? []"
				:showFirst="solutionId ? [solutionId] : []"
			/>
		</div>
	</div>
</template>

<script lang="ts">
import {
	EventParticipationSlot,
	Exercise,
	getBlankExercise,
	getFakeEventParticipationSlot,
} from "@/models";
import { defineComponent, PropType } from "@vue/runtime-core";
import AbstractEventParticipationSlot from "@/components/shared/AbstractEventParticipationSlot.vue";
import ExerciseSolutionContainer from "@/components/shared/ExerciseSolution/ExerciseSolutionContainer.vue";
import { mapActions, mapGetters } from "vuex";
import { courseIdMixin, loadingMixin } from "@/mixins";
import MinimalExercisePreviewSkeleton from "@/components/ui/skeletons/MinimalExercisePreviewSkeleton.vue";
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
	},
	computed: {
		...mapGetters("teacher", ["exercises"]),
		exercise(): Exercise | undefined {
			return (this.exercises as Exercise[]).find(
				e => e.id == (this.exerciseId as string),
			);
		},
		slot(): EventParticipationSlot | undefined {
			return typeof this.exercise === "undefined"
				? undefined
				: getFakeEventParticipationSlot(this.exercise);
		},
		exerciseId() {
			return this.$route.params.exerciseId;
		},
		solutionId() {
			return this.$route.params.solutionId;
		},
	},
	components: {
		AbstractEventParticipationSlot,
		ExerciseSolutionContainer,
		MinimalExercisePreviewSkeleton,
	},
});
</script>

<style></style>
