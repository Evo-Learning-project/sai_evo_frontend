<template>
	<div>
		<p class="text-muted">{{ $t("exercise_solution_thread.teacher_description") }}</p>

		<div class="banner banner-light my-4" v-if="remainingCount > 0">
			<span class="material-icons-outlined icon-light"> info </span>
			<p>
				{{ $t("exercise_solution.there_are_pending_solutions_1") }}
				<strong>{{ remainingCount }}</strong>
				{{ $t("exercise_solution.there_are_pending_solutions_2") }}
			</p>
		</div>

		<div v-if="!firstLoading">
			<transition-group name="quick-bounce">
				<div
					class="my-8"
					v-for="{ slot, highlightedSolutionIds } in processedExercises"
					:key="'thread-e-' + slot.exercise.id"
				>
					<h4>{{ getExerciseTitle(slot.exercise) }}</h4>
					<AbstractEventParticipationSlot :modelValue="slot" :showAnswer="false" />
					<ExerciseSolutionContainer
						class=""
						:showTitle="false"
						:allowAddSolution="false"
						:showTeacherControls="true"
						:exercise="slot.exercise"
						:solutions="slot.exercise.solutions ?? []"
						:showFirst="highlightedSolutionIds"
						:forceShowAll="true"
					/></div
			></transition-group>
		</div>
		<div class="flex-col flex space-y-4" v-else>
			<ExerciseEditorWrapperSkeleton />
			<ExerciseEditorWrapperSkeleton />
			<ExerciseEditorWrapperSkeleton />
			<ExerciseEditorWrapperSkeleton />
		</div>

		<div
			class="flex flex-col w-full mt-12 mb-12 text-center select-none"
			v-if="!firstLoading && exercises.length === 0"
		>
			<p style="font-size: 10rem" class="material-icons-outlined opacity-10">inventory</p>
			<h2 class="opacity-40">{{ $t("exercise_solution.no_solutions_to_review") }}</h2>
		</div>

		<VueEternalLoading :load="onLoadMore" v-model:is-initial="isInitialInfiniteLoad">
			<template #loading>
				<Spinner></Spinner>
			</template>
			<template #no-more>
				<!-- &nbsp; -->
				<div class="w-full h-1 bg-gray-200 rounded-md"></div>
			</template>
		</VueEternalLoading>
	</div>
</template>

<script lang="ts">
import { courseIdMixin, loadingMixin } from "@/mixins";
import {
	EventParticipationSlot,
	Exercise,
	getFakeEventParticipationSlot,
} from "@/models";
import { defineComponent } from "@vue/runtime-core";
import ExerciseSolutionContainer from "@/components/shared/ExerciseSolution/ExerciseSolutionContainer.vue";
import { getTranslatedString as _ } from "@/i18n";

import { createNamespacedHelpers } from "vuex";
import AbstractEventParticipationSlot from "@/components/shared/AbstractEventParticipationSlot.vue";
import { VueEternalLoading, LoadAction } from "@ts-pro/vue-eternal-loading";
import Spinner from "@/components/ui/Spinner.vue";
import ExerciseEditorWrapperSkeleton from "@/components/ui/skeletons/ExerciseEditorWrapperSkeleton.vue";
import { ExerciseSearchFilter, PaginatedData } from "@/api/interfaces";
const { mapState, mapActions, mapGetters } = createNamespacedHelpers("teacher");
export default defineComponent({
	name: "CourseExerciseSolutionThreads",
	mixins: [loadingMixin, courseIdMixin],
	props: {},
	async created() {
		this.withFirstLoading(async () => {
			await this.getExercises({
				courseId: this.courseId,
				fromFirstPage: true,
				filters: { with_submitted_solutions: true } as ExerciseSearchFilter,
			});
			//await this.getTags({ courseId: this.courseId });
		});
	},
	data() {
		return {
			isInitialInfiniteLoad: false,
		};
	},
	methods: {
		...mapActions(["getExercises"]),
		getExerciseTitle(exercise: Exercise): string {
			return (exercise?.label ?? "").trim().length > 0
				? (exercise.label as string)
				: _("exercise_preview.unnamed_exercise");
		},
		async onLoadMore({ loaded, noMore, error }: LoadAction) {
			try {
				const moreResults = await this.getExercises({
					courseId: this.courseId,
					fromFirstPage: false,
					filters: { with_submitted_solutions: true } as ExerciseSearchFilter,
				});
				if (!moreResults) {
					noMore();
				} else {
					loaded();
				}
			} catch {
				error();
			}
		},
	},
	computed: {
		...mapGetters(["exercises"]),
		...mapState(["paginatedExercises"]),
		processedExercises(): {
			slot: EventParticipationSlot;
			highlightedSolutionIds: string[];
		}[] {
			// TODO return exercises with the most important solutions shown
			return this.exercises?.map((e: Exercise) => ({
				slot: getFakeEventParticipationSlot(e),
				highlightedSolutionIds: [],
			}));
		},
		remainingCount(): number {
			return (this.paginatedExercises as PaginatedData<Exercise>).count;
		},
	},
	components: {
		ExerciseSolutionContainer,
		AbstractEventParticipationSlot,
		VueEternalLoading,
		Spinner,
		ExerciseEditorWrapperSkeleton,
	},
});
</script>

<style></style>
