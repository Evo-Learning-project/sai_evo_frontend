<template>
	<div>
		<!-- <ExerciseSearchFilters
			class="bg-light px-8 mb-8 pb-3 pt-6"
			:allowFilterByState="false"
			:allowFilterByType="false"
			:full="false"
			v-model="searchFilter"
			@resetFilters="searchFilter = getBlankExerciseSearchFilters()"
		></ExerciseSearchFilters> -->
		<div v-if="!firstLoading">
			<div class="mb-14" v-for="exercise in exercises" :key="'e-' + exercise.id">
				<!-- <div class="flex w-full -mb-4">
					<div class="ml-auto">
						<Btn :variant="'icon'" :outline="true">
							<span class="material-icons text-yellow-500">star</span>
						</Btn>
					</div>
				</div> -->
				<Exercise
					:exercise="exercise"
					:readOnly="true"
					:showReadOnlyAnswer="false"
					:showPublicTags="true"
				/>
				<!-- TODO handle cloze exercises -->
				<!-- TODO handle pagination-->
				<ExerciseSolutionContainer
					class="mt-4"
					:showTitle="false"
					:forceShowAll="true"
					:exercise="exercise"
					v-if="!loadingSolutionsByExercise[exercise.id]"
					:solutions="getSolutionsForExercise(exercise)"
					:allowAddSolution="false"
					:showExerciseThreadLink="true"
				></ExerciseSolutionContainer>
				<SlotSkeleton v-else />
			</div>
		</div>
		<div v-else>
			<SlotSkeleton />
			<SlotSkeleton />
			<SlotSkeleton />
			<SlotSkeleton />
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
import { ExerciseSearchFilter, ExerciseSolutionSearchFilter } from "@/api";
import { courseIdMixin, loadingMixin } from "@/mixins";
import { Exercise as IExercise, ExerciseSolution } from "@/models";
import { defineComponent, PropType } from "@vue/runtime-core";
import { mapActions, mapGetters, mapState } from "vuex";
import Exercise from "@/components/shared/Exercise/Exercise.vue";
import ExerciseSolutionContainer from "@/components/shared/ExerciseSolution/ExerciseSolutionContainer.vue";
import SlotSkeleton from "@/components/ui/skeletons/SlotSkeleton.vue";
import Spinner from "@/components/ui/Spinner.vue";
import VueEternalLoading from "@ts-pro/vue-eternal-loading/src/components/VueEternalLoading/VueEternalLoading.vue";
import { LoadAction } from "@ts-pro/vue-eternal-loading";
import { getBlankExerciseSearchFilters } from "@/api/utils";
import ExerciseSearchFilters from "@/components/teacher/ExerciseSearchFilters.vue";
import Btn from "@/components/ui/Btn.vue";
export default defineComponent({
	name: "FavoriteContentsList",
	mixins: [courseIdMixin, loadingMixin],
	props: {},
	async created() {
		this.withFirstLoading(async () => {
			await this.getTags({ courseId: this.courseId });
			await this.getExercises({
				courseId: this.courseId,
				fromFirstPage: true,
				filters: { with_bookmarked_solutions: true } as ExerciseSearchFilter,
			});
			this.fetchSolutionsForNewExercises();
		});
	},
	data() {
		return {
			isInitialInfiniteLoad: false,
			loadingSolutionsByExercise: {} as Record<string, boolean>,
			showSolutionsByExercise: {} as Record<string, boolean>,
			//searchFilter: getBlankExerciseSearchFilters(),
		};
	},
	methods: {
		...mapActions("teacher", ["getExercises"]),
		...mapActions("shared", ["getSolutionsByExercise", "getTags"]),
		getBlankExerciseSearchFilters,
		getSolutionsForExercise(exercise: IExercise): ExerciseSolution[] {
			return this.paginatedSolutionsByExerciseId[exercise.id]?.data ?? [];
		},
		getSolutionCountForExercise(exercise: IExercise): number {
			return this.paginatedSolutionsByExerciseId[exercise.id]?.count ?? 0;
		},
		fetchSolutionsForNewExercises() {
			(this.exercises as IExercise[])
				.filter(e => typeof this.paginatedSolutionsByExerciseId[e.id] === "undefined")
				.forEach(async e => {
					this.loadingSolutionsByExercise[e.id] = true;
					try {
						await this.getSolutionsByExercise({
							courseId: this.courseId,
							exerciseId: e.id,
							filter: { bookmarked: true } as ExerciseSolutionSearchFilter,
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
					filters: { with_bookmarked_solutions: true } as ExerciseSearchFilter,
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
		...mapGetters("teacher", ["exercises"]),
		...mapState("teacher", ["paginatedExercises"]),
		...mapState("shared", ["paginatedSolutionsByExerciseId"]),
	},
	components: {
		SlotSkeleton,
		Exercise,
		ExerciseSolutionContainer,
		Spinner,
		VueEternalLoading,
		//ExerciseSearchFilters,
		//Btn,
	},
});
</script>

<style></style>