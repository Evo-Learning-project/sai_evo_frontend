<template
  ><div>
    <Card :hoverable="false" class="mb-4 -mt-2 shadow-md bg-light">
      <template v-slot:body>
        <ExerciseSearchFilters v-model="searchFilter"></ExerciseSearchFilters>
      </template>
    </Card>

    <div class="flex w-full mt-12 mb-6">
      <Btn @click="onAddExercise()" :loading="localLoading" class="ml-auto"
        ><span class="mr-1 text-base material-icons-outlined">
          add_circle_outline
        </span>
        {{ $t('course_exercises.new_exercise') }}</Btn
      >
    </div>
    <div v-if="!firstLoading">
      <ExerciseEditorWrapper
        v-for="(exercise, index) in exercises"
        :key="'course-' + courseId + '-exercise-' + exercise.id"
        v-model="exercises[index]"
        :ref="'course-' + courseId + '-exercise-' + exercise.id"
      ></ExerciseEditorWrapper>
    </div>
    <div v-else>
      <ExerciseEditorWrapperSkeleton></ExerciseEditorWrapperSkeleton>
      <ExerciseEditorWrapperSkeleton></ExerciseEditorWrapperSkeleton>
      <ExerciseEditorWrapperSkeleton></ExerciseEditorWrapperSkeleton>
      <ExerciseEditorWrapperSkeleton></ExerciseEditorWrapperSkeleton>
    </div>
    <div
      class="flex flex-col w-full mt-12 mb-12 text-center select-none"
      v-if="!firstLoading && exercises.length === 0"
    >
      <p style="font-size: 10rem" class="material-icons-outlined opacity-10">
        topic
      </p>
      <h2 class="opacity-40">{{ $t('course_exercises.no_exercises') }}</h2>
    </div>
    <VueEternalLoading
      :load="onLoadMore"
      v-model="isInitialInfiniteLoad"
    >
      <template #loading>
        <spinner></spinner>
      </template>
      <template #no-more>
        <!-- &nbsp; -->
        <div class="w-full h-1 bg-gray-200 rounded-md"></div>
      </template>
    </VueEternalLoading>
  </div>
</template>

<script lang="ts">
import { createNamespacedHelpers, mapActions } from 'vuex'
const { mapState } = createNamespacedHelpers('teacher')
import { getTranslatedString as _ } from '@/i18n'
import { icons as exerciseTypesIcons } from '@/assets/exerciseTypesIcons'
import { icons as exerciseStatesIcons } from '@/assets/exerciseStatesIcons'
import { ExerciseState, ExerciseType, getBlankExercise, Tag } from '@/models'

import { VueEternalLoading, LoadAction } from '@ts-pro/vue-eternal-loading'
import { SelectableOption } from '@/interfaces'
import Btn from '@/components/ui/Btn.vue'
// import Chipset from '@/components/ui/Chipset.vue'
import Card from '@/components/ui/Card.vue'
//import TagInput from '@/components/ui/TagInput.vue'
import ExerciseEditorWrapper from '@/components/teacher/ExerciseEditor/ExerciseEditorWrapper.vue'
import { defineComponent } from '@vue/runtime-core'
import Spinner from '@/components/ui/Spinner.vue'
import ExerciseSearchFilters from '@/components/teacher/ExerciseSearchFilters.vue'
import { SearchFilter } from '@/api/interfaces'
import { getDebouncedForFilter } from '@/utils'
import { courseIdMixin, loadingMixin } from '@/mixins'
import ExerciseEditorWrapperSkeleton from '@/components/ui/skeletons/ExerciseEditorWrapperSkeleton.vue'
export default defineComponent({
  name: 'CourseExercises',
  props: {
    modelValue: Array,
    value: {
      default: null
    },
    options: Array
  },
  mixins: [courseIdMixin, loadingMixin],
  watch: {
    searchFilter: {
      async handler () {
        await this.onFilterChange()
        this.isInitialInfiniteLoad = true
      },
      deep: true
    }
  },
  components: {
    ExerciseEditorWrapper,
    //Chipset,
    VueEternalLoading,
    Card,
    Btn,
    Spinner,
    ExerciseSearchFilters,
    ExerciseEditorWrapperSkeleton
  },
  async created () {
    this.onFilterChange = getDebouncedForFilter(this.onFilterChange)

    this.withFirstLoading(async () => {
      await this.getExercises({
        courseId: this.courseId,
        fromFirstPage: true
      })
      await this.getTags(this.courseId)
    })
  },
  data () {
    return {
      isInitialInfiniteLoad: false,
      expandResultFilter: true,
      searchFilter: {
        label: '',
        text: '',
        tags: [] as string[],
        exercise_types: [] as ExerciseType[],
        states: [] as ExerciseState[]
      } as SearchFilter
    }
  },
  methods: {
    ...mapActions('teacher', ['getExercises', 'createExercise']),
    ...mapActions('shared', ['getTags']),
    async onFilterChange () {
      await this.getExercises({
        courseId: this.courseId,
        fromFirstPage: true,
        filters: this.searchFilter
      })
    },
    async onLoadMore ({ loaded, noMore, error }: LoadAction) {
      try {
        const moreResults = await this.getExercises({
          courseId: this.courseId,
          fromFirstPage: false,
          filters: this.searchFilter
        })
        if (!moreResults) {
          noMore()
        } else {
          loaded()
        }
      } catch {
        error()
      }
    },
    async onAddExercise () {
      await this.withLocalLoading(async () => {
        const newExercise = await this.createExercise({
          courseId: this.courseId,
          exercise: getBlankExercise()
        })
        ;(this.$refs[
          'course-' + this.courseId + '-exercise-' + newExercise.id
        ] as { showEditor: boolean }).showEditor = true
      })
    }
  },
  computed: {
    // tags (): Tag[] {
    //   return [{ name: 'tag1' }, { name: 'tag2' }, { name: 'tag3' }]
    // },
    tagsOptions () {
      return this.tags.map((t: Tag) => ({
        value: t.name,
        content: t.name
      }))
    },
    exerciseTypeOptions (): SelectableOption[] {
      return ((Object.keys(ExerciseType) as unknown[]) as ExerciseType[])
        .filter((key: string | number) => parseInt(key as string) == key) //(ExerciseType[key] as unknown) == 'number')
        .map(key => ({
          icons: exerciseTypesIcons[key],
          value: key,
          content: _('exercise_types.' + key)
        }))
    },
    exerciseStateOptions (): SelectableOption[] {
      return ((Object.keys(ExerciseState) as unknown[]) as ExerciseState[])
        .filter((key: string | number) => parseInt(key as string) == key) //(ExerciseType[key] as unknown) == 'number')
        .map(key => ({
          icons: exerciseStatesIcons[key],
          value: key,
          content: _('exercise_states.' + key),
          description: _('exercise_states_descriptions.' + key)
        }))
    },
    ...mapState(['exercises', 'tags'])
  }
})
</script>
