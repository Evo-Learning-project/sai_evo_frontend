<template>
  <div>
    <!--filters-->
    <card class="relative mb-12 shadow-md bg-gray-50">
      <template v-slot:header
        ><div class="flex items-center mb-2 space-x-4">
          <h3>{{ $t('filter_results.title') }}</h3>
          <p
            :class="{
              'opacity-100 delay-300':
                !expandResultFilter && areThereActiveFilters,
              'delay-0 opacity-0': expandResultFilter || !areThereActiveFilters
            }"
            class="transition-opacity text-muted duration-0"
          >
            ({{ $t('filter_results.there_are_active_filters') }})
          </p>
        </div></template
      ><template v-slot:body>
        <btn
          @btnClick="expandResultFilter = !expandResultFilter"
          class="absolute top-0 right-0 mt-4 mr-4"
          :size="'sm'"
          :variant="'light'"
          ><span class="material-icons-outlined">
            {{ expandResultFilter ? 'expand_less' : 'expand_more' }}
          </span></btn
        >
        <div
          class="overflow-y-hidden duration-300 ease-in-out transition-max-height"
          :class="{
            'max-h-0': !expandResultFilter,
            'max-h-screen': expandResultFilter
          }"
        >
          <chipset :options="tagsOptions" v-model="resultFilter.tags"></chipset>
          <chipset
            :options="exerciseTypeOptions"
            v-model="resultFilter.types"
          ></chipset>
          <chipset
            :options="exerciseStateOptions"
            v-model="resultFilter.states"
          ></chipset>
          <!-- <tag-input
            class="md:mt-1"
            v-model="resultFilter.tags"
            :placeholder="$t('filter_results.filter_by_tag')"
          ></tag-input> -->
          <div class="flex w-full">
            <btn @btnClick="applyFilters()" class="mt-4 ml-auto">{{
              $t('filter_results.title')
            }}</btn>
          </div>
        </div>
      </template></card
    >
  </div>
  <div class="flex w-full mb-2">
    <btn @btnClick="onAddExercise()" :loading="loading" class="ml-auto"
      ><span class="mr-1 text-base material-icons-outlined">
        add_circle_outline
      </span>
      {{ $t('course_exercises.new_exercise') }}</btn
    >
  </div>
  <div v-if="!firstLoading">
    <exercise-editor-wrapper
      v-for="(exercise, index) in exercises"
      :key="'course-' + courseId + '-exercise-' + exercise.id"
      v-model="exercises[index]"
      :ref="'course-' + courseId + '-exercise-' + exercise.id"
    ></exercise-editor-wrapper>
  </div>
  <div v-else>
    <skeleton-card class="pb-10"></skeleton-card>
    <skeleton-card class="pb-10"></skeleton-card>
    <skeleton-card class="pb-10"></skeleton-card>
    <skeleton-card class="pb-10"></skeleton-card>
  </div>
  <VueEternalLoading :load="onLoadMore">
    <template #loading>
      <spinner></spinner>
    </template>
    <template #no-more>
      &nbsp;
      <!-- <div class="w-full h-1 bg-gray-200 rounded-md"></div> -->
    </template>
  </VueEternalLoading>
</template>

<script lang="ts">
import { getTranslatedString as _ } from '@/i18n'
import { icons as exerciseTypesIcons } from '@/assets/exerciseTypesIcons'
import { icons as exerciseStatesIcons } from '@/assets/exerciseStatesIcons'
import {
  Exercise,
  ExerciseState,
  ExerciseType,
  getBlankExercise,
  Tag
} from '@/models'

import { VueEternalLoading, LoadAction } from '@ts-pro/vue-eternal-loading'

import Btn from '@/components/ui/Btn.vue'
import Chipset from '@/components/ui/Chipset.vue'
import Card from '@/components/ui/Card.vue'
//import TagInput from '@/components/ui/TagInput.vue'
import ExerciseEditorWrapper from '@/components/teacher/ExerciseEditor/ExerciseEditorWrapper.vue'
import { defineComponent } from '@vue/runtime-core'
import SkeletonCard from '@/components/ui/SkeletonCard.vue'
import Spinner from '@/components/ui/Spinner.vue'
export default defineComponent({
  name: 'CourseExercises',
  props: {
    modelValue: Array,
    value: {
      default: null
    },
    options: Array
  },
  components: {
    ExerciseEditorWrapper,
    Chipset,
    VueEternalLoading,
    Card,
    Btn,
    SkeletonCard,
    Spinner
  },
  async created () {
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
      expandResultFilter: true,
      resultFilter: {
        types: [] as ExerciseType[],
        tags: [] as Tag[],
        states: [] as ExerciseState[]
      },
      loading: false,
      firstLoading: false
    }
  },
  methods: {
    async onLoadMore ({ loaded, noMore, error }: LoadAction) {
      try {
        const moreResults = await this.$store.dispatch('getExercises', {
          courseId: this.courseId,
          fromFirstPage: false
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
      console.log('dispatching')
      this.loading = true
      const newExercise = await this.$store.dispatch('createExercise', {
        courseId: this.courseId,
        exercise: getBlankExercise()
      })
      this.loading = false
      ;(this.$refs[
        'course-' + this.courseId + '-exercise-' + newExercise.id
      ] as { showEditor: boolean }).showEditor = true
    },
    applyFilters () {
      1
    }
  },
  computed: {
    areThereActiveFilters () {
      return (
        this.resultFilter.types.length > 0 || this.resultFilter.tags.length > 0
      )
    },
    courseId (): string {
      return this.$route.params.courseId as string
    },
    exercises (): Exercise[] {
      return this.$store.getters.exercises
    },
    tags (): Tag[] {
      return [{ name: 'tag1' }, { name: 'tag2' }, { name: 'tag3' }]
    },
    tagsOptions () {
      return this.tags.map(t => ({
        value: t.name,
        content: t.name
      }))
    },
    exerciseTypeOptions () {
      return ((Object.keys(ExerciseType) as unknown[]) as ExerciseType[])
        .filter((key: string | number) => parseInt(key as string) == key) //(ExerciseType[key] as unknown) == 'number')
        .map(key => ({
          icons: exerciseTypesIcons[key],
          value: key,
          content: _('exercise_types.' + key)
        }))
    },
    exerciseStateOptions () {
      return ((Object.keys(ExerciseState) as unknown[]) as ExerciseState[])
        .filter((key: string | number) => parseInt(key as string) == key) //(ExerciseType[key] as unknown) == 'number')
        .map(key => ({
          icons: exerciseStatesIcons[key],
          value: key,
          content: _('exercise_states.' + key),
          description: _('exercise_states_descriptions.' + key)
        }))
    },
    selectedExercises () {
      return this.$store.getters.selectedExercises
    }
  }
})
</script>
