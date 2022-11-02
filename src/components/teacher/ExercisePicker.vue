<template>
	<div class="">
		<ExerciseSearchFilters
			class="px-8 pt-6 pb-2 mb-6 -mx-4 md:-mx-8 bg-light"
			v-model="searchFilter"
			@resetFilters="searchFilter = getBlankExerciseSearchFilters()"
			:full="false"
		></ExerciseSearchFilters>

		<div v-if="!firstLoading" class="grid gap-5 md:grid-cols-2">
			<MinimalExercisePreview
				:selectable="true"
				:selectionDisabled="
					isExerciseDraft(exercise) || isSelectedInAnotherRule(exercise)
				"
				:selectButtonTitle="
					isExerciseDraft(exercise)
						? $t('exercise_picker.cannot_pick_draft')
						: isSelectedInAnotherRule(exercise)
						? $t('exercise_picker.already_selected')
						: ''
				"
				v-for="(exercise, index) in exercises"
				:key="'course-' + courseId + '-exercise-' + index"
				:exercise="exercise"
				@selection="onSelection(exercise)"
				:highlighted="isSelected(exercise)"
			></MinimalExercisePreview>
		</div>
		<div class="grid gap-5 md:grid-cols-2" v-else>
			<MinimalExercisePreviewSkeleton></MinimalExercisePreviewSkeleton>
			<MinimalExercisePreviewSkeleton></MinimalExercisePreviewSkeleton>
			<MinimalExercisePreviewSkeleton></MinimalExercisePreviewSkeleton>
			<MinimalExercisePreviewSkeleton></MinimalExercisePreviewSkeleton>
			<MinimalExercisePreviewSkeleton></MinimalExercisePreviewSkeleton>
			<MinimalExercisePreviewSkeleton></MinimalExercisePreviewSkeleton>
		</div>
		<div
			v-if="!firstLoading && exercises.length === 0 && emptyFilter"
			class="flex flex-col space-y-4"
		>
			<!-- TODO make nicer empty state -->
			<p class="text-muted">
				{{ $t("exercise_picker.no_available_exercises") }}
			</p>
			<router-link class="mx-auto link" :to="{ name: 'CourseExercises' }"
				><Btn :variant="'primary-borderless'">{{
					$t("exercise_picker.go_to_exercises")
				}}</Btn></router-link
			>
		</div>
		<div
			v-else-if="!firstLoading && exercises.length === 0"
			class="flex flex-col space-y-4"
		>
			<p class="mx-auto text-muted">
				{{ $t("course_exercises.no_matching_exercises") }}.
			</p>
			<router-link class="mx-auto link" :to="{ name: 'CourseExercises' }"
				><Btn :variant="'primary-borderless'">{{
					$t("exercise_picker.go_to_exercises")
				}}</Btn></router-link
			>
		</div>
		<VueEternalLoading :load="onLoadMore" v-model:is-initial="isInitialInfiniteLoad">
			<template #loading>
				<spinner></spinner>
				<!-- <Btn @click="onLoadMore()">Carica di più</Btn> -->
			</template>
			<template #no-more>
				<!-- &nbsp; -->
				<div class="w-full h-1 mt-4 mb-12 bg-gray-200 rounded-md"></div>
			</template>
		</VueEternalLoading>
	</div>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-unused-vars */
import { createNamespacedHelpers } from "vuex";
const { mapState, mapActions, mapGetters } = createNamespacedHelpers("teacher");

import { VueEternalLoading, LoadAction } from "@ts-pro/vue-eternal-loading";
import Spinner from "@/components/ui/Spinner.vue";

import { Exercise, ExerciseState, ExerciseType } from "@/models";
import { defineComponent, PropType } from "@vue/runtime-core";
import MinimalExercisePreview from "@/components/teacher/ExerciseEditor/MinimalExercisePreview.vue";
import Btn from "@/components/ui/Btn.vue";
import ExerciseSearchFilters from "./ExerciseSearchFilters.vue";
import { ExerciseSearchFilter } from "@/api/interfaces";
import { getDebouncedForFilter } from "@/utils";
import { courseIdMixin } from "@/mixins";
import MinimalExercisePreviewSkeleton from "../ui/skeletons/MinimalExercisePreviewSkeleton.vue";
import { getBlankExerciseSearchFilters, isEmptyFilter } from "@/api/utils";
export default defineComponent({
	name: "ExercisePicker",
	async created() {
		this.onFilterChange = getDebouncedForFilter(this.onFilterChange);

		// this.firstLoading = true;
		// await this.getExercises({
		//   courseId: this.courseId,
		//   fromFirstPage: true,
		// });
		// this.firstLoading = false;
	},
	mixins: [courseIdMixin],
	watch: {
		searchFilter: {
			async handler(val: ExerciseSearchFilter) {
				this.isInitialInfiniteLoad = true;
				await this.onFilterChange();
			},
			deep: true,
		},
	},
	components: {
		MinimalExercisePreview,
		VueEternalLoading,
		Spinner,
		ExerciseSearchFilters,
		Btn,
		MinimalExercisePreviewSkeleton,
	},
	data() {
		return {
			firstLoading: false,
			isInitialInfiniteLoad: false,
			searchFilter: {
				label: "",
				text: "",
				tags: [] as string[],
				exercise_types: [] as ExerciseType[],
				states: [] as ExerciseState[],
			} as ExerciseSearchFilter,
		};
	},
	props: {
		modelValue: {
			type: Object as PropType<string[]>,
			required: true,
		},
		allowPickingDraft: {
			type: Boolean,
			default: false,
		},
		alreadySelected: {
			type: Object as PropType<string[]>,
			required: true,
		},
	},
	methods: {
		...mapActions(["getExercises"]),
		isExerciseDraft(exercise: Exercise): boolean {
			return !this.allowPickingDraft && exercise.state == ExerciseState.DRAFT;
		},
		isSelectedInAnotherRule(exercise: Exercise): boolean {
			return this.alreadySelected.includes(exercise.id) && !this.isSelected(exercise);
		},
		onSelection(exercise: Exercise) {
			const index = this.modelValue.findIndex(e => e == exercise.id);
			if (index === -1) {
				this.$emit("addExercise", exercise);
			} else {
				this.$emit("removeExercise", exercise);
			}
		},
		isSelected(exercise: Exercise): boolean {
			return this.modelValue.find(e => e == exercise.id) != null;
		},
		async onLoadMore({ loaded, noMore, error }: LoadAction) {
			try {
				const moreResults = await this.getExercises({
					courseId: this.courseId,
					fromFirstPage: false,
					filters: this.searchFilter,
				});
				if (!moreResults) {
					noMore();
				} else {
					loaded();
				}
			} catch (e) {
				console.error("Error loading more exercises", e);
				error();
			}
		},
		async onFilterChange() {
			await this.getExercises({
				courseId: this.courseId,
				fromFirstPage: true,
				filters: this.searchFilter,
			});
		},
		getBlankExerciseSearchFilters,
	},
	computed: {
		...mapGetters(["exercises"]),
		emptyFilter() {
			return isEmptyFilter(this.searchFilter);
		},
	},
});
</script>

<style></style>
