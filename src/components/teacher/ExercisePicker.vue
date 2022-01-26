<template>
  <div>
    <div v-if="!firstLoading" class="grid grid-cols-2 gap-5">
      <MinimalExercisePreview
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
  </div>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-unused-vars */

import { Exercise } from '@/models'
import { defineComponent, PropType } from '@vue/runtime-core'
import MinimalExercisePreview from '@/components/teacher/ExerciseEditor/MinimalExercisePreview.vue'
import Btn from '@/components/ui/Btn.vue'
import SkeletonCard from '../ui/SkeletonCard.vue'
export default defineComponent({
  name: 'ExercisePicker',
  async created () {
    this.firstLoading = true
    await this.$store.dispatch('getExercises', this.courseId)
    this.firstLoading = false
  },
  components: {
    MinimalExercisePreview,
    SkeletonCard
    //Btn
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
