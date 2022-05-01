<template>
  <div>
    <Card
      :hoverable="false"
      :border-less="true"
      class="mb-4 -mt-2 card-filled shadow-elevation"
    >
      <template v-slot:body>
        <ExerciseSearchFilters
          v-model="searchFilter"
          @resetFilters="searchFilter = getBlankExerciseSearchFilters()"
        ></ExerciseSearchFilters>
      </template>
    </Card>

    <div class="flex w-full mt-12 mb-6">
      <Btn @click="onAddExercise()" :loading="localLoading" class="ml-auto"
        ><span class="mr-1 text-base material-icons-outlined"> add </span>
        {{ $t("course_exercises.new_exercise") }}</Btn
      >
    </div>
    <div v-if="!firstLoading">
      <transition-group name="bounce">
        <ExerciseEditorWrapper
          v-for="(exercise, index) in exercises"
          :key="'course-' + courseId + '-exercise-' + exercise.id"
          v-model="exercises[index]"
          :ref="'course-' + courseId + '-exercise-' + exercise.id"
          :id="'course-' + courseId + '-exercise-' + exercise.id"
          @delete="onDeleteExercise(exercise)"
          @cloneExercise="onCloneExercise(exercise)"
        ></ExerciseEditorWrapper
      ></transition-group>
    </div>
    <div v-else>
      <ExerciseEditorWrapperSkeleton></ExerciseEditorWrapperSkeleton>
      <ExerciseEditorWrapperSkeleton></ExerciseEditorWrapperSkeleton>
      <ExerciseEditorWrapperSkeleton></ExerciseEditorWrapperSkeleton>
      <ExerciseEditorWrapperSkeleton></ExerciseEditorWrapperSkeleton>
    </div>
    <div
      class="flex flex-col w-full mt-12 mb-12 text-center select-none"
      v-if="!firstLoading && exercises.length === 0 && emptyFilters"
    >
      <p style="font-size: 10rem" class="material-icons-outlined opacity-10">
        topic
      </p>
      <h2 class="opacity-40">{{ $t("course_exercises.no_exercises") }}</h2>
    </div>
    <div
      class="flex flex-col w-full mt-12 mb-12 text-center select-none"
      v-else-if="!firstLoading && exercises.length === 0"
    >
      <p style="font-size: 10rem" class="material-icons-outlined opacity-10">
        search_off
      </p>
      <h2 class="opacity-40">
        {{ $t("course_exercises.no_matching_exercises") }}
      </h2>
    </div>
    <VueEternalLoading
      :load="onLoadMore"
      v-model:is-initial="isInitialInfiniteLoad"
    >
      <template #loading>
        <spinner></spinner>
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
  </div>
</template>

<script lang="ts">
import { createNamespacedHelpers, mapActions } from "vuex";
const { mapState } = createNamespacedHelpers("teacher");
import { getTranslatedString as _ } from "@/i18n";
import { icons as exerciseTypesIcons } from "@/assets/exerciseTypesIcons";
import { icons as exerciseStatesIcons } from "@/assets/exerciseStatesIcons";
import {
  Exercise,
  ExerciseState,
  ExerciseType,
  getBlankExercise,
  Tag,
} from "@/models";

import { VueEternalLoading, LoadAction } from "@ts-pro/vue-eternal-loading";
import { DialogData, SelectableOption } from "@/interfaces";
import Btn from "@/components/ui/Btn.vue";
import Card from "@/components/ui/Card.vue";
import ExerciseEditorWrapper from "@/components/teacher/ExerciseEditor/ExerciseEditorWrapper.vue";
import { defineComponent } from "@vue/runtime-core";
import Spinner from "@/components/ui/Spinner.vue";
import ExerciseSearchFilters from "@/components/teacher/ExerciseSearchFilters.vue";
import { ExerciseSearchFilter } from "@/api/interfaces";
import { getClonedExercise, getDebouncedForFilter } from "@/utils";
import { courseIdMixin, loadingMixin } from "@/mixins";
import ExerciseEditorWrapperSkeleton from "@/components/ui/skeletons/ExerciseEditorWrapperSkeleton.vue";
import { getBlankExerciseSearchFilters, isEmptyFilter } from "@/api/utils";
import Dialog from "@/components/ui/Dialog.vue";
export default defineComponent({
  name: "CourseExercises",
  props: {
    modelValue: Array,
    value: {
      default: null,
    },
    options: Array,
  },
  mixins: [courseIdMixin, loadingMixin],
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
    Card,
    Btn,
    Spinner,
    ExerciseSearchFilters,
    ExerciseEditorWrapperSkeleton,
    Dialog,
  },
  async created() {
    this.onFilterChange = getDebouncedForFilter(this.onFilterChange);
    this.withFirstLoading(async () => {
      await this.getExercises({
        courseId: this.courseId,
        fromFirstPage: true,
      });
      await this.getTags(this.courseId);
    });
  },
  mounted() {
    setTimeout(() => {
      if (this.$route.hash) {
        const expandId = this.$route.hash.split(/#editor-(.*)/)[1];
        const editorRef = this.$refs[
          "course-" + this.courseId + "-exercise-" + expandId
        ] as {
          showEditor: boolean;
        };
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
    };
  },
  methods: {
    ...mapActions("teacher", [
      "getExercises",
      "createExercise",
      "deleteExercise",
    ]),
    ...mapActions("shared", ["getTags"]),
    getBlankExerciseSearchFilters,
    async onFilterChange() {
      await this.withLoading(
        async () =>
          await this.getExercises({
            courseId: this.courseId,
            fromFirstPage: true,
            filters: this.searchFilter,
          })
      );
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
      } catch {
        error();
      }
    },
    async onCloneExercise(exercise: Exercise) {
      const newExercise = await this.onAddExercise(getClonedExercise(exercise));
      // show notification
      this.$store.commit("shared/showSuccessFeedback");
      // open new editor
      document
        .getElementById(
          "course-" + this.courseId + "-exercise-" + newExercise.id
        )
        ?.scrollIntoView();
    },
    async onAddExercise(cloned?: Exercise): Promise<Exercise> {
      const wrapperFunc = cloned ? this.withLoading : this.withLocalLoading;
      return (await wrapperFunc(async () => {
        const newExercise = await this.createExercise({
          courseId: this.courseId,
          exercise: cloned ?? getBlankExercise(),
        });
        (
          this.$refs[
            "course-" + this.courseId + "-exercise-" + newExercise.id
          ] as {
            showEditor: boolean;
          }
        ).showEditor = true;
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
            await this.deleteExercise({
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
    emptyFilters() {
      return isEmptyFilter(this.searchFilter);
    },
    tagsOptions() {
      return this.tags.map((t: Tag) => ({
        value: t.name,
        content: t.name,
      }));
    },
    exerciseTypeOptions(): SelectableOption[] {
      return (Object.keys(ExerciseType) as unknown[] as ExerciseType[])
        .filter((key: string | number) => parseInt(key as string) == key) //(ExerciseType[key] as unknown) == 'number')
        .map((key) => ({
          icons: exerciseTypesIcons[key],
          value: key,
          content: _("exercise_types." + key),
        }));
    },
    exerciseStateOptions(): SelectableOption[] {
      return (Object.keys(ExerciseState) as unknown[] as ExerciseState[])
        .filter((key: string | number) => parseInt(key as string) == key) //(ExerciseType[key] as unknown) == 'number')
        .map((key) => ({
          icons: exerciseStatesIcons[key],
          value: key,
          content: _("exercise_states." + key),
          description: _("exercise_states_descriptions." + key),
        }));
    },
    ...mapState(["exercises", "tags"]),
  },
});
</script>
