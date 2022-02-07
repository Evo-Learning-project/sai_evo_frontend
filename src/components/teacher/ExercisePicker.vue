<template>
  <div class="">
    <ExerciseSearchFilters
      class="px-8 py-4 mb-4 -mx-8 bg-light"
      v-model="searchFilter"
      :full="false"
    ></ExerciseSearchFilters>

    <div v-if="!firstLoading" class="grid grid-cols-2 gap-5">
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
    <div class="grid grid-cols-2 gap-5" v-else>
      <skeleton-card :short="true"></skeleton-card>
      <skeleton-card :short="true"></skeleton-card>
      <skeleton-card :short="true"></skeleton-card>
      <skeleton-card :short="true"></skeleton-card>
      <skeleton-card :short="true"></skeleton-card>
      <skeleton-card :short="true"></skeleton-card>
    </div>
    <VueEternalLoading
      :load="onLoadMore"
      v-model:is-initial="isInitialInfiniteLoad"
    >
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
import { mapState } from 'vuex'

import { VueEternalLoading, LoadAction } from '@ts-pro/vue-eternal-loading'
import Spinner from '@/components/ui/Spinner.vue'

import { Exercise, ExerciseState, ExerciseType } from '@/models'
import { defineComponent, PropType } from '@vue/runtime-core'
import MinimalExercisePreview from '@/components/teacher/ExerciseEditor/MinimalExercisePreview.vue'
import Btn from '@/components/ui/Btn.vue'
import SkeletonCard from '../ui/SkeletonCard.vue'
import ExerciseSearchFilters from './ExerciseSearchFilters.vue'
import { SearchFilter } from '@/api/interfaces'
import { getDebouncedForFilter } from '@/utils'
import { courseIdMixin } from '@/mixins'
export default defineComponent({
  name: 'ExercisePicker',
  async created () {
    this.onFilterChange = getDebouncedForFilter(this.onFilterChange)

    this.firstLoading = true
    await this.$store.dispatch('getExercises', {
      courseId: this.courseId,
      fromFirstPage: true
    })
    this.firstLoading = false
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
    MinimalExercisePreview,
    SkeletonCard,
    VueEternalLoading,
    Spinner,
    ExerciseSearchFilters
    //Btn
  },
  data () {
    return {
      firstLoading: false,
      isInitialInfiniteLoad: false,
      searchFilter: {
        label: '',
        text: '',
        tags: [] as string[],
        exercise_types: [] as ExerciseType[],
        states: [] as ExerciseState[]
      } as SearchFilter
    }
  },
  props: {
    modelValue: {
      type: Object as PropType<string[]>,
      required: true
    },
    allowPickingDraft: {
      type: Boolean,
      default: false
    },
    alreadySelected: {
      type: Object as PropType<string[]>,
      required: true
    }
  },
  methods: {
    isExerciseDraft (exercise: Exercise): boolean {
      return !this.allowPickingDraft && exercise.state == ExerciseState.DRAFT
    },
    isSelectedInAnotherRule (exercise: Exercise): boolean {
      return (
        this.alreadySelected.includes(exercise.id) && !this.isSelected(exercise)
      )
    },
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
        console.log('calling onloadmore', this.searchFilter)
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
      } catch (e) {
        console.log('ERROR', e)
        error()
      }
    },
    async onFilterChange () {
      await this.$store.dispatch('getExercises', {
        courseId: this.courseId,
        fromFirstPage: true,
        filters: this.searchFilter
      })
    }
  },
  computed: {
    ...mapState(['exercises'])
  }
})
</script>

<style></style>
