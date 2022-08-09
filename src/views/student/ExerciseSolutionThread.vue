<template>
	<div v-if="!firstLoading">
		<AbstractEventParticipationSlot :modelValue="slot" />
		<ExerciseSolutionContainer
			:exercise="exercise"
			:showFirst="solutionId"
		></ExerciseSolutionContainer>
	</div>
	<SkeletonCard v-else />
</template>

<script lang="ts">
import { Exercise, getFakeEventParticipationSlot } from "@/models";
import { defineComponent, PropType } from "@vue/runtime-core";
import AbstractEventParticipationSlot from "@/components/shared/AbstractEventParticipationSlot.vue";
import { courseIdMixin, loadingMixin } from "@/mixins";
import ExerciseSolutionContainer from "@/components/shared/ExerciseSolution/ExerciseSolutionContainer.vue";
import { getExercisesById } from "@/api/exercises";
export default defineComponent({
	name: "ExerciseSolutionThread",
	props: {},
	mixins: [courseIdMixin, loadingMixin],
	async created() {
		await this.withFirstLoading(
			async () =>
				(this.exercise = (await getExercisesById(this.courseId, [this.exerciseId]))[0]),
		);
	},
	data() {
		return {
			exercise: null as Exercise | null,
		};
	},
	methods: {},
	computed: {
		solutionId() {
			return this.$route.params.solutionId as string;
		},
		exerciseId() {
			return this.$route.params.exerciseId as string;
		},
		slot() {
			if (this.exercise === null) {
				return null;
			}
			return getFakeEventParticipationSlot(this.exercise);
		},
	},
	components: { AbstractEventParticipationSlot, ExerciseSolutionContainer },
});
</script>

<style></style>
