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
			<div
				class="mb-14"
				v-for="exercise in mainStore.exercises"
				:key="'e-' + exercise.id"
			>
				<FullExercise :exercise="exercise" />
				<ExerciseSolutionContainer
					class="mt-4"
					:showTitle="false"
					:forceShowAll="true"
					:exercise="exercise"
					v-if="!loadingSolutionsByExercise[exercise.id]"
					:solutions="mainStore.getPaginatedSolutionsByExerciseId(exercise.id).data"
					:allowAddSolution="false"
					:showExerciseThreadLink="true"
				></ExerciseSolutionContainer>
				<SlotSkeleton v-else />
			</div>
			<div
				v-if="mainStore.exercises.length === 0"
				class="flex flex-col items-center w-full mx-auto mt-28"
			>
				<p style="font-size: 10rem" class="material-icons-outlined opacity-10">
					bookmark
				</p>
				<h2 class="opacity-40">{{ $t("misc.no_favorites") }}</h2>
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
				<Spinner />
			</template>
			<template #no-more> &nbsp; </template>
		</VueEternalLoading>
	</div>
</template>

<script lang="ts">
import { ExerciseSearchFilter, ExerciseSolutionSearchFilter } from "@/api";
import { courseIdMixin, loadingMixin } from "@/mixins";
import { defineComponent } from "@vue/runtime-core";
import ExerciseSolutionContainer from "@/components/shared/ExerciseSolution/ExerciseSolutionContainer.vue";
import SlotSkeleton from "@/components/ui/skeletons/SlotSkeleton.vue";
import Spinner from "@/components/ui/Spinner.vue";
import VueEternalLoading from "@ts-pro/vue-eternal-loading/src/components/VueEternalLoading/VueEternalLoading.vue";
import { LoadAction } from "@ts-pro/vue-eternal-loading";
import { getBlankExerciseSearchFilters } from "@/api/utils";
import FullExercise from "@/components/shared/FullExercise.vue";
import { logAnalyticsEvent } from "@/utils";
import { mapStores } from "pinia";
import { useMainStore } from "@/stores/mainStore";
export default defineComponent({
	name: "FavoriteContentsList",
	mixins: [courseIdMixin, loadingMixin],
	props: {},
	async created() {
		this.withFirstLoading(async () => {
			await this.mainStore.getTags({
				courseId: this.courseId,
				includeExerciseCount: false,
			});
			await this.mainStore.getExercises({
				courseId: this.courseId,
				fromFirstPage: true,
				filters: { with_bookmarked_solutions: true } as ExerciseSearchFilter,
			});
			this.fetchSolutionsForNewExercises(true);
		});
		logAnalyticsEvent("viewedSavedContent", { courseId: this.courseId });
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
		getBlankExerciseSearchFilters,
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
				const moreResults = await this.mainStore.getExercises({
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
		...mapStores(useMainStore),
	},
	components: {
		SlotSkeleton,
		// Exercise,
		ExerciseSolutionContainer,
		Spinner,
		VueEternalLoading,
		FullExercise,
	},
});
</script>

<style></style>
