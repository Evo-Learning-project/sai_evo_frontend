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
					v-for="{ exercise, highlightedSolutionIds } in processedExercises"
					:key="'thread-e-' + exercise.id"
				>
					<h4>{{ getExerciseTitle(exercise) }}</h4>
					<!-- <AbstractEventParticipationSlot :modelValue="slot" :showAnswer="false" /> -->
					<FullExercise :exercise="exercise" />
					<ExerciseSolutionContainer
						v-show="showSolutionsByExercise[exercise.id]"
						v-if="!loadingSolutionsByExercise[exercise.id]"
						class=""
						:showTitle="false"
						:allowAddSolution="false"
						:showTeacherControls="true"
						:exercise="exercise"
						:solutions="getSolutionsForExercise(exercise)"
						:showFirst="highlightedSolutionIds"
						:canLoadMore="
							!(getPaginatedSolutionsForExercise(exercise)?.isLastPage ?? true)
						"
						@loadMore="loadMore(exercise)"
					/>
					<SlotSkeleton class="mt-4" v-else />
					<div
						v-if="
							!loadingSolutionsByExercise[exercise.id] &&
							!showSolutionsByExercise[exercise.id]
						"
					>
						<Btn
							@click="showSolutionsByExercise[exercise.id] = true"
							:size="'sm'"
							class="mt-2 -ml-4"
							:variant="'primary-borderless'"
							>{{ $t("exercise_solution.reveal_solutions_1") }}
							{{ getSolutionCountForExercise(exercise) }}
							{{
								getSolutionCountForExercise(exercise) === 1
									? $t("exercise_solution.reveal_solutions_2_singular")
									: $t("exercise_solution.reveal_solutions_2_plural")
							}}</Btn
						>
					</div>
					<MinimalExercisePreviewSkeleton v-if="false" />
				</div>
			</transition-group>
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
	ExerciseSolution,
	ExerciseSolutionState,
	getFakeEventParticipationSlot,
} from "@/models";
import { defineComponent } from "@vue/runtime-core";
import ExerciseSolutionContainer from "@/components/shared/ExerciseSolution/ExerciseSolutionContainer.vue";
import { getTranslatedString as _ } from "@/i18n";

import { createNamespacedHelpers, mapState, mapActions } from "vuex";
import AbstractEventParticipationSlot from "@/components/shared/AbstractEventParticipationSlot.vue";
import { VueEternalLoading, LoadAction } from "@ts-pro/vue-eternal-loading";
import Spinner from "@/components/ui/Spinner.vue";
import ExerciseEditorWrapperSkeleton from "@/components/ui/skeletons/ExerciseEditorWrapperSkeleton.vue";
import {
	ExerciseSearchFilter,
	ExerciseSolutionSearchFilter,
	PaginatedData,
} from "@/api/interfaces";
import MinimalExercisePreviewSkeleton from "@/components/ui/skeletons/MinimalExercisePreviewSkeleton.vue";
import SlotSkeleton from "@/components/ui/skeletons/SlotSkeleton.vue";
import Btn from "@/components/ui/Btn.vue";
import FullExercise from "@/components/shared/FullExercise.vue";
import { logAnalyticsEvent } from "@/utils";
const { mapGetters } = createNamespacedHelpers("teacher");
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
			this.fetchSolutionsForNewExercises();
			logAnalyticsEvent("viewedCourseExerciseSolutions", { courseId: this.courseId });
		});
	},
	data() {
		return {
			isInitialInfiniteLoad: false,
			loadingSolutionsByExercise: {} as Record<string, boolean>,
			showSolutionsByExercise: {} as Record<string, boolean>,
		};
	},
	methods: {
		...mapActions("teacher", ["getExercises"]),
		...mapActions("shared", ["getSolutionsByExercise"]),
		getSolutionsForExercise(exercise: Exercise): ExerciseSolution[] {
			return this.paginatedSolutionsByExerciseId[exercise.id]?.data ?? [];
		},
		getPaginatedSolutionsForExercise(
			exercise: Exercise,
		): PaginatedData<ExerciseSolution> | undefined {
			return this.paginatedSolutionsByExerciseId[exercise.id];
		},
		getSolutionCountForExercise(exercise: Exercise): number {
			return this.getPaginatedSolutionsForExercise(exercise)?.count ?? 0;
		},
		async loadMore(exercise: Exercise) {
			await this.withLoading(
				async () =>
					await this.getSolutionsByExercise({
						courseId: this.courseId,
						exerciseId: exercise.id,
						fromFirstPage: false,
						filter: {
							states: [ExerciseSolutionState.SUBMITTED],
						} as ExerciseSolutionSearchFilter,
					}),
			);
		},
		getExerciseTitle(exercise: Exercise): string {
			return (exercise?.label ?? "").trim().length > 0
				? (exercise.label as string)
				: _("exercise_preview.unnamed_exercise");
		},
		fetchSolutionsForNewExercises() {
			(this.exercises as Exercise[])
				.filter(e => typeof this.paginatedSolutionsByExerciseId[e.id] === "undefined")
				.forEach(async e => {
					this.loadingSolutionsByExercise[e.id] = true;
					try {
						await this.getSolutionsByExercise({
							courseId: this.courseId,
							exerciseId: e.id,
							filter: {
								states: [ExerciseSolutionState.SUBMITTED],
							} as ExerciseSolutionSearchFilter,
						});
					} catch (e) {
						this.setErrorNotification(e);
					} finally {
						this.loadingSolutionsByExercise[e.id] = false;
					}
				});
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
				this.fetchSolutionsForNewExercises();
			} catch {
				error();
			}
		},
	},
	computed: {
		...mapGetters(["exercises"]),
		...mapState("teacher", ["paginatedExercises"]),
		...mapState("shared", ["paginatedSolutionsByExerciseId"]),
		processedExercises(): {
			exercise: Exercise;
			highlightedSolutionIds: string[];
		}[] {
			// TODO return exercises with the most important solutions shown
			return this.exercises?.map((exercise: Exercise) => ({
				exercise,
				highlightedSolutionIds: [],
			}));
		},
		remainingCount(): number {
			return (this.paginatedExercises as PaginatedData<Exercise>).count;
		},
	},
	components: {
		ExerciseSolutionContainer,
		//AbstractEventParticipationSlot,
		VueEternalLoading,
		Spinner,
		ExerciseEditorWrapperSkeleton,
		MinimalExercisePreviewSkeleton,
		SlotSkeleton,
		Btn,
		FullExercise,
	},
});
</script>

<style></style>
