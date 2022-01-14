<template>
  <div class="grid grid-cols-2 gap-5">
    <!-- <btn
      :variant="'transparent'"
      v-for="(exercise, index) in exercises"
      :key="'course-' + courseId + '-exercise-' + index"
    >
      <template v-slot:content>
        <minimal-exercise-preview
          v-for="(exercise, index) in exercises"
          :key="'course-' + courseId + '-exercise-' + index"
          :exercise="exercise"
        ></minimal-exercise-preview
      ></template>
    </btn> -->
    <minimal-exercise-preview
      v-for="(exercise, index) in exercises"
      :key="'course-' + courseId + '-exercise-' + index"
      :exercise="exercise"
      @selection="onSelection(exercise)"
      :highlighted="isSelected(exercise)"
    ></minimal-exercise-preview>
  </div>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-unused-vars */

import { Exercise } from '@/models'
import { defineComponent, PropType } from '@vue/runtime-core'
import MinimalExercisePreview from '@/components/teacher/ExerciseEditor/MinimalExercisePreview.vue'
import Btn from '@/components/ui/Btn.vue'
export default defineComponent({
  name: 'ExercisePicker',
  created () {
    this.$store.dispatch('getExercises', this.courseId)
  },
  components: {
    MinimalExercisePreview
    //Btn
  },
  props: {
    modelValue: {
      type: Object as PropType<Exercise[]>,
      required: true
    }
  },
  methods: {
    onSelection (exercise: Exercise) {
      const index = this.modelValue.findIndex(e => e.id == exercise.id)
      if (index === -1) {
        this.$emit('addExercise', exercise)
      } else {
        this.$emit('removeExercise', exercise)
      }
    },
    isSelected (exercise: Exercise): boolean {
      return this.modelValue.find(e => e.id == exercise.id) != null
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
