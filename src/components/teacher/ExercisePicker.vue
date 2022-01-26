<template>
  <div>
    <ExerciseSearchFilters
      class="bg-light -mx-8 px-8 mb-4 py-4"
      w-full
    ></ExerciseSearchFilters>

    <div v-if="!firstLoading" class="grid grid-cols-2 gap-5">
      <MinimalExercisePreview
        :selectable="true"
        v-for="(exercise, index) in exercises"
        :key="'course-' + courseId + '-exercise-' + index"
        :exercise="exercise"
        @selection="onSelection(exercise)"
        :highlighted="isSelected(exercise)"
      ></MinimalExercisePreview>
    </div>
    <div class="grid grid-cols-2 gap-5" v-else>
      <skeleton-card :short="true"></skeleton-card>
      <skeleton-card :short="true"></skeleton-card>
      <skeleton-card :short="true"></skeleton-card>
      <skeleton-card :short="true"></skeleton-card>
      <skeleton-card :short="true"></skeleton-card>
      <skeleton-card :short="true"></skeleton-card>
    </div>
    <VueEternalLoading :load="onLoadMore">
      <template #loading>
        <spinner></spinner>
      </template>
      <template #no-more>
        &nbsp;
        <!-- <div class="mt-4 mb-12 w-full h-1 bg-gray-200 rounded-md"></div> -->
      </template>
    </VueEternalLoading>
  </div>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-unused-vars */
import { VueEternalLoading, LoadAction } from '@ts-pro/vue-eternal-loading'
import Spinner from '@/components/ui/Spinner.vue'

import { Exercise } from '@/models'
import { defineComponent, PropType } from '@vue/runtime-core'
import MinimalExercisePreview from '@/components/teacher/ExerciseEditor/MinimalExercisePreview.vue'
import Btn from '@/components/ui/Btn.vue'
import SkeletonCard from '../ui/SkeletonCard.vue'
import ExerciseSearchFilters from './ExerciseSearchFilters.vue'
export default defineComponent({
  name: 'ExercisePicker',
  async created () {
    this.firstLoading = true
    await this.$store.dispatch('getExercises', {
      courseId: this.courseId,
      fromFirstPage: true
    })
    this.firstLoading = false
  },
  components: {
    MinimalExercisePreview,
    SkeletonCard,
    VueEternalLoading,
    Spinner,
    ExerciseSearchFilters
  },
  data () {
    return {
      firstLoading: false
    }
  },
  props: {
    modelValue: {
      type: Object as PropType<string[]>,
      required: true
    }
  },
  methods: {
    onSelection (exercise: Exercise) {
      const index = this.modelValue.findIndex(e => e == exercise.id)
      if (index === -1) {
        this.$emit('addExercise', exercise)
      } else {
        this.$emit('removeExercise', exercise)
      }
    },
    isSelected (exercise: Exercise): boolean {
      return this.modelValue.find(e => e == exercise.id) != null
    },
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
    }
  },
  computed: {
    courseId (): string {
      return this.$route.params.courseId as string
    },
    exercises (): Exercise[] {
      return this.$store.getters.exercises
    }
  }
})
</script>

<style></style>
