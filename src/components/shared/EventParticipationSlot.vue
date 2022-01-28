<template>
  <div>
    <p v-html="exercise.text"></p>
    <CheckboxGroup
      v-if="isMultipleChoiceMultiplePossible"
      :choices="exercise.choices"
      v-model="selectedChoicesProxy"
    ></CheckboxGroup>
    <!-- TODO add radio group and text editor for other types of question -->
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
    },
    allowEditSubmission: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    // TODO get rid of this and use modelValue
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
        // TODO probably check if a new value has been added or removed by
        // TODO comparing with current modelValue and emit a specific event
        this.$emit('updateSelectedChoices', { selected_choices: val })
      }
    }
  }
})
</script>

<style></style>
