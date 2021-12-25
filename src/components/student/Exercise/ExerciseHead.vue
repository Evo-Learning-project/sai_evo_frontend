<template>
  <div>
    <p v-html="exercise.text"></p>
    <exercise-multiple-choice-single-possible-group
      v-if="isMultipleChoiceSinglePossible"
      :choices="exercise.choices"
      v-model="selectedChoicesProxy"
    ></exercise-multiple-choice-single-possible-group>
    <exercise-multiple-choice-multiple-possible-group
      v-else-if="isMultipleChoiceMultiplePossible"
      :choices="exercise.choices"
    ></exercise-multiple-choice-multiple-possible-group>
  </div>
</template>

<script lang="ts">
import { EventParticipationSlot, Exercise, ExerciseType } from '@/models'
import { defineComponent, PropType } from '@vue/runtime-core'
import ExerciseMultipleChoiceSinglePossibleGroup from './ExerciseMultipleChoiceSinglePossibleGroup.vue'
import ExerciseMultipleChoiceMultiplePossibleGroup from './ExerciseMultipleChoiceMultiplePossibleGroup.vue'

export default defineComponent({
  components: {
    ExerciseMultipleChoiceSinglePossibleGroup,
    ExerciseMultipleChoiceMultiplePossibleGroup
  },
  name: 'ExerciseHead',
  props: {
    exercise: {
      type: Object as PropType<Exercise>,
      required: false
    },
    readOnly: {
      type: Boolean,
      default: false
    },
    modelValue: {
      type: Object as PropType<EventParticipationSlot>,
      required: false // required to allow submission and assessment
    },
    showScores: {
      type: Boolean,
      default: false
    },
    allowEditScores: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    isMultipleChoiceSinglePossible (): boolean {
      return (
        parseInt((this.exercise?.exercise_type?.toString() ?? '') as string) ==
        ExerciseType.MULTIPLE_CHOICE_SINGLE_POSSIBLE
      )
    },
    isMultipleChoiceMultiplePossible (): boolean {
      return (
        parseInt((this.exercise?.exercise_type?.toString() ?? '') as string) ==
        ExerciseType.MULTIPLE_CHOICE_MULTIPLE_POSSIBLE
      )
    },
    isOpenAnswer (): boolean {
      return (
        parseInt((this.exercise?.exercise_type?.toString() ?? '') as string) ==
        ExerciseType.OPEN_ANSWER
      )
    },
    slot () {
      return this.modelValue
    },
    exerciseProxy (): Exercise {
      return this.slot?.exercise ?? (this.exercise as Exercise)
    },
    selectedChoicesProxy: {
      get () {
        return this.slot?.selected_choices
      },
      set (val: string[]) {
        this.$emit('update:modelValue', { selected_choices: val, ...this.slot })
      }
    }
  }
})
</script>

<style></style>
