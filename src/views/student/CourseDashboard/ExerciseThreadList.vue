<template>
	<div>
		<ExerciseSearchFilters
			class="bg-transparent mb-10 rounded-sm"
			:allowFilterByState="false"
			:allowFilterByType="false"
			:full="false"
			v-model="searchFilter"
			@resetFilters="searchFilter = getBlankExerciseSearchFilters()"
		/>
		<div
			class="flex flex-col w-full mt-12 mb-12 text-center select-none"
			v-if="!firstLoading && !loading && mainStore.exercises.length === 0"
		>
			<p style="font-size: 10rem" class="material-icons-outlined opacity-10">
				search_off
			</p>
			<h2 class="opacity-40">
				{{ $t("course_exercises.no_matching_exercises") }}
			</h2>
		</div>
		<div v-if="!firstLoading">
			<div
				class="mb-14"
				v-for="exercise in mainStore.exercises"
				:key="'e-' + exercise.id"
			>
				<!-- <div class="flex w-full -mb-4">
					<div class="ml-auto">
						<Btn :variant="'icon'" :outline="true">
							<span class="material-icons text-yellow-500">star</span>
						</Btn>
					</div>
				</div> -->
				<!-- <Exercise
					:exercise="exercise"
					:readOnly="true"
					:showReadOnlyAnswer="false"
					:showPublicTags="true"
				/> -->
				<FullExercise :exercise="exercise" />
				<ExerciseSolutionContainer
					class="mt-4"
					:exercise="exercise"
					v-if="!loadingSolutionsByExercise[exercise.id]"
					v-show="
						showSolutionsByExercise[exercise.id] ||
						getSolutionCountForExercise(exercise) === 0
					"
					:solutions="mainStore.getPaginatedSolutionsByExerciseId(exercise.id).data"
					:canLoadMore="
						!mainStore.getPaginatedSolutionsByExerciseId(exercise.id).isLastPage
					"
					@loadMore="loadMore(exercise)"
				></ExerciseSolutionContainer>
				<div v-else class="w-full mt-4 h-4 mb-2 skeleton-unit"></div>

				<!-- <SlotSkeleton class="mt-4" v-else /> -->

				<div
					v-if="
						!loadingSolutionsByExercise[exercise.id] &&
						!showSolutionsByExercise[exercise.id] &&
						getSolutionCountForExercise(exercise) > 0
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
			</div>
		</div>
		<div v-else>
			<SlotSkeleton />
			<SlotSkeleton />
			<SlotSkeleton />
			<SlotSkeleton />
		</div>
		<VueEternalLoading
			v-if="!firstLoading"
			:load="onLoadMore"
			v-model:is-initial="isInitialInfiniteLoad"
		>
			<template #loading>
				<Spinner />
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
import { Exercise as IExercise } from "@/models";
import { defineComponent } from "@vue/runtime-core";
import ExerciseSolutionContainer from "@/components/shared/ExerciseSolution/ExerciseSolutionContainer.vue";
import SlotSkeleton from "@/components/ui/skeletons/SlotSkeleton.vue";
import Spinner from "@/components/ui/Spinner.vue";
import VueEternalLoading from "@ts-pro/vue-eternal-loading/src/components/VueEternalLoading/VueEternalLoading.vue";
import { LoadAction } from "@ts-pro/vue-eternal-loading";
import { getBlankExerciseSearchFilters } from "@/api/utils";
import ExerciseSearchFilters from "@/components/teacher/ExerciseSearchFilters.vue";
import Btn from "@/components/ui/Btn.vue";
import { getDebouncedForFilter, setErrorNotification } from "@/utils";
import FullExercise from "@/components/shared/FullExercise.vue";
import { mapStores } from "pinia";
import { useMainStore } from "@/stores/mainStore";
export default defineComponent({
	name: "ExerciseThreadList",
	mixins: [courseIdMixin, loadingMixin],
	props: {},
	watch: {
		searchFilter: {
			async handler() {
				await this.onFilterChange();
			},
			deep: true,
		},
	},
	async created() {
		this.onFilterChange = getDebouncedForFilter(this.onFilterChange);
		this.withFirstLoading(async () => {
			await this.mainStore.getTags({
				courseId: this.courseId,
				includeExerciseCount: false,
			});
			await this.mainStore.getExercises({
				courseId: this.courseId,
				fromFirstPage: true,
				filters: null, //{ by_popularity: true },
			});
			this.fetchSolutionsForNewExercises(true);
		});
	},
	data() {
		return {
			isInitialInfiniteLoad: false,
			loadingSolutionsByExercise: {} as Record<string, boolean>,
			showSolutionsByExercise: {} as Record<string, boolean>,
			searchFilter: getBlankExerciseSearchFilters(),
		};
	},
	methods: {
		getBlankExerciseSearchFilters,
		async onFilterChange() {
			this.isInitialInfiniteLoad = true;
			await this.withLoading(
				async () =>
					await this.mainStore.getExercises({
						courseId: this.courseId,
						fromFirstPage: true,
						filters: {
							by_popularity: true,
							...this.searchFilter,
						},
					}),
			);
			this.fetchSolutionsForNewExercises();
		},
		getSolutionCountForExercise(exercise: IExercise): number {
			return this.mainStore.getPaginatedSolutionsByExerciseId(exercise.id).count;
		},
		async loadMore(exercise: IExercise) {
			await this.withLoading(
				async () =>
					await this.mainStore.getSolutionsByExercise({
						courseId: this.courseId,
						exerciseId: exercise.id,
						fromFirstPage: false,
						filter: null,
					}),
			);
		},
		fetchSolutionsForNewExercises(force = false) {
			this.mainStore.exercises
				.filter(
					e =>
						force ||
						typeof this.mainStore.paginatedSolutionsByExerciseId[e.id] === "undefined",
				)
				.forEach(async e => {
					this.loadingSolutionsByExercise[e.id] = true;
					try {
						await this.mainStore.getSolutionsByExercise({
							courseId: this.courseId,
							exerciseId: e.id,
							fromFirstPage: true,
							filter: null,
						});
					} catch (e) {
						setErrorNotification(e);
					} finally {
						this.loadingSolutionsByExercise[e.id] = false;
					}
				});
		},
		async onLoadMore({ loaded, noMore, error }: LoadAction) {
			try {
				const moreResults = await this.mainStore.getExercises({
					courseId: this.courseId,
					fromFirstPage: false,
					filters: { by_popularity: true, ...this.searchFilter },
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
		...mapStores(useMainStore),
	},
	components: {
		SlotSkeleton,
		//Exercise,
		ExerciseSolutionContainer,
		Spinner,
		VueEternalLoading,
		ExerciseSearchFilters,
		Btn,
		FullExercise,
	},
});
</script>

<style></style>
