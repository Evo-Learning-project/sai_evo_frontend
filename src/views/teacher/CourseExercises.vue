<template>
	<div>
		<div>
			<ExerciseSearchFilters
				v-model="searchFilter"
				@resetFilters="searchFilter = getBlankExerciseSearchFilters()"
			></ExerciseSearchFilters>
		</div>

		<div v-if="canCreateAndEditExercises" class="flex items-center w-full mt-8 mb-6">
			<Btn @click="onAddExercise()" :loading="localLoading" class="ml-auto"
				><span class="mr-1 text-base material-icons-outlined"> add </span>
				{{ $t("course_exercises.new_exercise") }}</Btn
			>
			<Btn
				class="ml-2"
				@click="onGenerateExercises()"
				:loading="localLoading"
				:outline="true"
			>
				<span class="mr-1 text-base material-icons-outlined"> bolt </span>
				Genera esercizi
			</Btn>
			<DropdownMenu
				class="-mr-4"
				:expanded="dropdownExpanded"
				@toggleExpanded="dropdownExpanded = !dropdownExpanded"
				:placement="'right'"
			>
				<div class="-mx-5 -my-2.5">
					<Btn
						:outline="true"
						class="px-8 pt-2 pb-2"
						:variant="'transparent'"
						@click="onExportExercises()"
					>
						<div class="flex items-center align-top">
							<span class="mr-2 material-icons-outlined"> file_download </span>
							{{ $t("course_exercises.export_exercises") }}
						</div>
					</Btn>
					<Btn
						:outline="true"
						class="px-8 pt-2 pb-2"
						:variant="'transparent'"
						@click="showExerciseImporter = true"
					>
						<div class="flex items-center align-top">
							<span class="mr-2 material-icons-outlined"> file_upload </span>
							{{ $t("course_exercises.import_exercises") }}
						</div>
					</Btn>
				</div>
			</DropdownMenu>
		</div>
		<transition name="bounce">
			<GenerateExercisePrompt
				@confirm="onCreateMockExercises"
				v-if="showGenerateExercisePrompt"
			/>
		</transition>
		<div v-if="!firstLoading">
			<transition-group name="quick-bounce">
				<ExerciseEditorWrapper
					v-for="exercise in mainStore.exercises"
					:key="'course-' + courseId + '-exercise-' + exercise.id"
					:exercise="exercise"
					:ref="'course-' + courseId + '-exercise-' + exercise.id"
					:id="'course-' + courseId + '-exercise-' + exercise.id"
					@delete="onDeleteExercise(exercise)"
					@cloneExercise="onCloneExercise(exercise)"
					:editable="canCreateAndEditExercises"
			/></transition-group>
		</div>
		<div class="flex flex-col space-y-4" v-else>
			<ExerciseEditorWrapperSkeleton />
			<ExerciseEditorWrapperSkeleton />
			<ExerciseEditorWrapperSkeleton />
			<ExerciseEditorWrapperSkeleton />
		</div>
		<div
			class="flex flex-col w-full mt-12 mb-12 text-center select-none"
			v-if="!firstLoading && mainStore.exercises.length === 0 && emptyFilters"
		>
			<p style="font-size: 10rem" class="material-icons-outlined opacity-10">topic</p>
			<h2 class="opacity-40">{{ $t("course_exercises.no_exercises") }}</h2>
		</div>
		<div
			class="flex flex-col w-full mt-12 mb-12 text-center select-none"
			v-else-if="!firstLoading && mainStore.exercises.length === 0"
		>
			<p style="font-size: 10rem" class="material-icons-outlined opacity-10">
				search_off
			</p>
			<h2 class="opacity-40">
				{{ $t("course_exercises.no_matching_exercises") }}
			</h2>
		</div>
		<VueEternalLoading :load="onLoadMore" v-model:is-initial="isInitialInfiniteLoad">
			<template #loading>
				<Spinner />
			</template>
			<template #no-more>
				<!-- &nbsp; -->
				<div class="w-full h-1 bg-gray-200 rounded-md"></div>
			</template>
		</VueEternalLoading>
		<Dialog
			:showDialog="showDialog"
			:confirm-only="dialogData.confirmOnly"
			@yes="dialogData.onYes?.()"
			@no="dialogData.onNo?.()"
			:yes-text="dialogData.yesText"
			:no-text="dialogData.noText"
		>
			<template v-slot:title> {{ dialogData.title }}</template>
			<template v-slot:body> {{ dialogData.text }} </template>
		</Dialog>

		<Dialog
			:show-dialog="showExerciseImporter"
			@no="showExerciseImporter = false"
			@yes="
				importedExercises.length === 0 ? (showExerciseImporter = false) : onImportDone()
			"
			:dismissible="false"
			:footerBorder="true"
			:confirmOnly="importedExercises.length === 0"
			:noText="$t('dialog.default_cancel_text')"
			:disableOk="importLoading"
			:yesText="
				importedExercises.length === 0
					? $t('dialog.default_cancel_text')
					: importLoading
					? $t('exercise_import.importing')
					: $t('exercise_import.import')
			"
			:fullWidth="true"
		>
			<template v-slot:title>
				{{ $t("course_exercises.import_exercises_title") }}</template
			>
			<template v-slot:body>
				<ExerciseImporter
					@updateExercises="importedExercises = $event"
					class="mt-4 text-darkText"
				></ExerciseImporter>
			</template>
		</Dialog>
	</div>
</template>

<script lang="ts">
// ! TODO test, this requires migrating ExerciseEditor first
import { getTranslatedString as _ } from "@/i18n";
import { icons as exerciseTypesIcons } from "@/assets/exerciseTypesIcons";
import { icons as exerciseStatesIcons } from "@/assets/exerciseStatesIcons";
import {
	CoursePrivilege,
	Exercise,
	ExerciseState,
	ExerciseType,
	getBlankExercise,
} from "@/models";

import { VueEternalLoading, LoadAction } from "@ts-pro/vue-eternal-loading";
import { DialogData, SelectableOption } from "@/interfaces";
import Btn from "@/components/ui/Btn.vue";
import ExerciseEditorWrapper from "@/components/teacher/ExerciseEditor/ExerciseEditorWrapper.vue";
import { defineComponent } from "@vue/runtime-core";
import Spinner from "@/components/ui/Spinner.vue";
import ExerciseSearchFilters from "@/components/teacher/ExerciseSearchFilters.vue";
import {
	forceFileDownload,
	getClonedExercise,
	getDebouncedForFilter,
	setErrorNotification,
} from "@/utils";
import { courseIdMixin, coursePrivilegeMixin, loadingMixin } from "@/mixins";
import ExerciseEditorWrapperSkeleton from "@/components/ui/skeletons/ExerciseEditorWrapperSkeleton.vue";
import { getBlankExerciseSearchFilters, isEmptyFilter } from "@/api/utils";
import Dialog from "@/components/ui/Dialog.vue";
import ExerciseImporter from "@/components/teacher/ExerciseImporter.vue";
import DropdownMenu from "@/components/ui/DropdownMenu.vue";
import { getExercises } from "@/api";
import { mapStores } from "pinia";
import { useMainStore } from "@/stores/mainStore";
import { useMetaStore } from "@/stores/metaStore";
import GenerateExercisePrompt from "../../components/demo/GenerateExercisePrompt.vue";
import { mockExercises } from "../../components/demo/mock";
export default defineComponent({
	name: "CourseExercises",
	props: {
		modelValue: Array,
		value: {
			default: null,
		},
		options: Array,
	},
	mixins: [courseIdMixin, loadingMixin, coursePrivilegeMixin],
	watch: {
		searchFilter: {
			async handler() {
				this.isInitialInfiniteLoad = true;
				await this.onFilterChange();
			},
			deep: true,
		},
	},
	components: {
		ExerciseEditorWrapper,
		VueEternalLoading,
		Btn,
		Spinner,
		ExerciseSearchFilters,
		ExerciseEditorWrapperSkeleton,
		Dialog,
		ExerciseImporter,
		DropdownMenu,
		GenerateExercisePrompt,
	},
	async created() {
		this.onFilterChange = getDebouncedForFilter(this.onFilterChange);
		this.withFirstLoading(async () => {
			await this.mainStore.getExercises({
				courseId: this.courseId,
				fromFirstPage: true,
				filters: null,
			});
			await this.mainStore.getTags({
				courseId: this.courseId,
				includeExerciseCount: false,
			});
		});
	},
	mounted() {
		setTimeout(() => {
			if (this.$route.hash) {
				// TODO refactor and also handle possibility of editing exercises that are not in view
				const expandId = this.$route.hash.split(/#editor-(.*)/)[1];

				const editorRef: any =
					this.$refs["course-" + this.courseId + "-exercise-" + expandId]?.[0];
				if (editorRef) {
					editorRef.showEditor = true;
				}
			}
		}, 500);
	},
	data() {
		return {
			isInitialInfiniteLoad: false,
			expandResultFilter: true,
			searchFilter: getBlankExerciseSearchFilters(),
			showDialog: false,
			dialogData: {} as DialogData,
			showExerciseImporter: false,
			importedExercises: [] as Exercise[],
			importLoading: false,
			dropdownExpanded: false,
			showGenerateExercisePrompt: false,
		};
	},
	methods: {
		async onCreateMockExercises() {
			await this.withLoading(async () => {
				await this.mainStore.createMockExercises(mockExercises);
				this.metaStore.showSuccessFeedback();
				this.showGenerateExercisePrompt = false;
			}, setErrorNotification);
		},
		getBlankExerciseSearchFilters,
		async onGenerateExercises() {
			this.showGenerateExercisePrompt = true;
		},
		async onExportExercises() {
			await this.withLoading(async () => {
				const MAX_PAGE_SIZE = 999999;
				const exercises = (await getExercises(this.courseId, 1, null, MAX_PAGE_SIZE))
					.data;
				forceFileDownload({ data: JSON.stringify(exercises, null, 4) }, "exercises.json");
			}, setErrorNotification);
		},
		async onFilterChange() {
			await this.withLoading(
				async () =>
					await this.mainStore.getExercises({
						courseId: this.courseId,
						fromFirstPage: true,
						filters: this.searchFilter,
					}),
			);
		},
		async onImportDone() {
			await this.withLoading(
				async () => {
					this.importLoading = true;
					await this.mainStore.bulkCreateExercises({
						courseId: this.courseId,
						exercises: this.importedExercises,
					});
					this.importLoading = false;
					this.metaStore.showSuccessFeedback();
					this.importedExercises = [];
					this.showExerciseImporter = false;
				},
				e => {
					setErrorNotification(e);
					this.importLoading = false;
				},
			);
		},
		async onLoadMore({ loaded, noMore, error }: LoadAction) {
			try {
				const moreResults = await this.mainStore.getExercises({
					courseId: this.courseId,
					fromFirstPage: false,
					filters: this.searchFilter,
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
		async onCloneExercise(exercise: Exercise) {
			const newExercise = await this.onAddExercise(getClonedExercise(exercise));
			// show notification
			this.metaStore.showSuccessFeedback();
			// open new editor
			document
				.getElementById("course-" + this.courseId + "-exercise-" + newExercise.id)
				?.scrollIntoView();
		},
		async onAddExercise(cloned?: Exercise): Promise<Exercise> {
			const wrapperFunc = cloned ? this.withLoading : this.withLocalLoading;
			return (await wrapperFunc(async () => {
				const newExercise = await this.mainStore.createExercise({
					courseId: this.courseId,
					exercise: cloned ?? getBlankExercise(),
				});

				const editorRef: any =
					this.$refs["course-" + this.courseId + "-exercise-" + newExercise.id]?.[0];
				editorRef.showEditor = true;

				return newExercise;
			})) as Exercise;
		},
		async onDeleteExercise(exercise: Exercise) {
			this.showDialog = true;
			if (exercise.state !== ExerciseState.DRAFT) {
				this.dialogData = {
					confirmOnly: true,
					text: _("course_exercises.cannot_delete_nondraft"),
					onYes: () => (this.showDialog = false),
				};
			} else {
				this.dialogData = {
					confirmOnly: false,
					text: _("course_exercises.confirm_delete_exercise"),
					onYes: async () => {
						await this.mainStore.deleteExercise({
							courseId: this.courseId,
							exerciseId: exercise.id,
						});
						this.showDialog = false;
					},
					onNo: () => (this.showDialog = false),
					yesText: _("misc.delete"),
					noText: _("dialog.default_cancel_text"),
					title: _("course_exercises.confirm_delete_exercise_title"),
				};
			}
		},
	},
	computed: {
		...mapStores(useMainStore, useMetaStore),
		emptyFilters() {
			return isEmptyFilter(this.searchFilter);
		},
		tagsOptions() {
			return this.mainStore.tags.map(t => ({
				value: t.name,
				content: t.name,
			}));
		},
		exerciseTypeOptions(): SelectableOption[] {
			return (Object.keys(ExerciseType) as unknown[] as ExerciseType[])
				.filter((key: string | number) => parseInt(key as string) == key) //(ExerciseType[key] as unknown) == 'number')
				.map(key => ({
					icons: exerciseTypesIcons[key],
					value: key,
					content: _("exercise_types." + key),
				}));
		},
		exerciseStateOptions(): SelectableOption[] {
			return (Object.keys(ExerciseState) as unknown[] as ExerciseState[])
				.filter((key: string | number) => parseInt(key as string) == key) //(ExerciseType[key] as unknown) == 'number')
				.map(key => ({
					icons: exerciseStatesIcons[key],
					value: key,
					content: _("exercise_states." + key),
					description: _("exercise_states_descriptions." + key),
				}));
		},
		canCreateAndEditExercises() {
			return this.hasPrivileges([CoursePrivilege.MANAGE_EXERCISES]);
		},
	},
});
</script>
