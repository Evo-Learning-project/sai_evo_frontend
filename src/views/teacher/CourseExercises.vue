<template>
  <div><!--filters--></div>
  <exercise-editor-wrapper
    v-for="(exercise, index) in exercises"
    :key="'course-' + courseId + '-exercise-' + index"
    v-model="exercises[index]"
  ></exercise-editor-wrapper>
</template>

<script lang="ts">
import { Exercise, getBlankExercise } from '@/models'
import ExerciseEditorWrapper from '@/components/teacher/ExerciseEditor/ExerciseEditorWrapper.vue'
import { defineComponent } from '@vue/runtime-core'

export default defineComponent({
  name: 'CourseExercises',
  components: {
    ExerciseEditorWrapper
  },
  computed: {
    courseId (): string {
      // TODO implement
      return 'abc'
    },
    exercises (): Exercise[] {
      return [getBlankExercise(), getBlankExercise(), getBlankExercise()]
      //return this.$store.getters.exercises
    }
  }
})
</script>

<style></style>
