<template
  ><div>
    <Card class="mb-4 -mt-2 shadow-md bg-light">
      <template v-slot:body>
        <ExerciseSearchFilters v-model="searchFilter"></ExerciseSearchFilters>
      </template>
    </Card>

    <div class="flex w-full mb-2">
      <btn @click="onAddExercise()" :loading="loading" class="ml-auto"
        ><span class="mr-1 text-base material-icons-outlined">
          add_circle_outline
        </span>
        {{ $t('course_exercises.new_exercise') }}</btn
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
      <SkeletonCard></SkeletonCard>
      <SkeletonCard></SkeletonCard>
      <SkeletonCard></SkeletonCard>
      <SkeletonCard></SkeletonCard>
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
  </div>
</template>

<script lang="ts">
import { createNamespacedHelpers } from 'vuex'
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
import SkeletonCard from '@/components/ui/SkeletonCard.vue'
import Spinner from '@/components/ui/Spinner.vue'
import ExerciseSearchFilters from '@/components/teacher/ExerciseSearchFilters.vue'
import { SearchFilter } from '@/api/interfaces'
import { getDebouncedForFilter } from '@/utils'
import { courseIdMixin } from '@/mixins'
export default defineComponent({
  name: 'CourseExercises',
  props: {
    modelValue: Array,
    value: {
      default: null
    },
    options: Array
  },
  mixins: [courseIdMixin],
  watch: {
    searchFilter: {
      async handler (val: SearchFilter) {
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
    SkeletonCard,
    Spinner,
    ExerciseSearchFilters
  },
  async created () {
    this.onFilterChange = getDebouncedForFilter(this.onFilterChange)

    this.firstLoading = true
    await this.$store.dispatch('getExercises', {
      courseId: this.courseId,
      fromFirstPage: true
    })
    await this.$store.dispatch('getTags', this.courseId)
    this.firstLoading = false
  },
  data () {
    return {
      isInitialInfiniteLoad: false,
      expandResultFilter: true,
      loading: false,
      firstLoading: false,
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
    async onFilterChange () {
      await this.$store.dispatch('getExercises', {
        courseId: this.courseId,
        fromFirstPage: true,
        filters: this.searchFilter
      })
    },
    async onLoadMore ({ loaded, noMore, error }: LoadAction) {
      try {
        const moreResults = await this.$store.dispatch('getExercises', {
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
      this.loading = true
      const newExercise = await this.$store.dispatch('createExercise', {
        courseId: this.courseId,
        exercise: getBlankExercise()
      })
      this.loading = false
      ;(this.$refs[
        'course-' + this.courseId + '-exercise-' + newExercise.id
      ] as { showEditor: boolean }).showEditor = true
    }
  },
  computed: {
    tags (): Tag[] {
      return [{ name: 'tag1' }, { name: 'tag2' }, { name: 'tag3' }]
    },
    tagsOptions () {
      return this.tags.map(t => ({
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
    ...mapState(['exercises'])
  }
})
</script>
