<template>
  <div>
    <p v-html="exercise.text"></p>
    <checkbox-group
      v-if="isMultipleChoiceMultiplePossible"
      :choices="exercise.choices"
      v-model="selectedChoicesProxy"
    ></checkbox-group>
  </div>
</template>

<script lang="ts">
import { EventParticipationSlot, Exercise, ExerciseType } from '@/models'
import { defineComponent, PropType } from '@vue/runtime-core'
import CheckboxGroup from '@/components/ui/CheckboxGroup.vue'

export default defineComponent({
  components: {
    CheckboxGroup
  },
  name: 'EventParticipationSlot',
  props: {
    modelValue: {
      type: Object as PropType<EventParticipationSlot>,
      required: true
    },
    allowEditScores: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    slot (): EventParticipationSlot {
      return this.modelValue
    },
    exercise (): Exercise {
      return this.slot.exercise
    },
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
    selectedChoicesProxy: {
      get () {
        return this.slot?.selected_choices
      },
      set (val: string[]) {
        this.$emit('updateSelectedChoices', { selected_choices: val })
      }
    }
  }
})
</script>

<style></style>
