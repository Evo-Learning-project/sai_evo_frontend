<template>
  <div>
    <h3 v-if="showExerciseLabel">{{ exercise.label }}</h3>
    <div class="mb-8" v-html="exercise.text"></div>
    <CheckboxGroup
      v-if="isMultipleChoiceMultiplePossible"
      :options="exerciseChoicesAsOptions"
      v-model="selectedChoicesProxy"
      :disabled="!allowEditSubmission"
      v-slot="{ description }"
    >
      <p class="mb-2 text-sm text-muted">{{ description }}</p>

      <!-- <div class="px-2 py-1.25px rounded-md mb-2 bg-gray-50">
        <p class="text-sm text-muted">{{ description }}</p>
      </div> -->
    </CheckboxGroup>
    <RadioGroup
      v-else-if="isMultipleChoiceSinglePossible"
      :options="exerciseChoicesAsOptions"
      v-model="selectedChoicesProxy"
      :disabled="!allowEditSubmission"
      v-slot="{ description }"
    >
      <p class="mb-2 text-sm text-muted">{{ description }}</p>
    </RadioGroup>
    <!-- TODO add text editor for other types of question -->
  </div>
</template>

<script lang="ts">
import {
  EventParticipationSlot,
  Exercise,
  ExerciseChoice,
  ExerciseType
} from '@/models'
import { defineComponent, PropType } from '@vue/runtime-core'
import CheckboxGroup from '@/components/ui/CheckboxGroup.vue'
import { SelectableOption } from '@/interfaces'
import RadioGroup from '../ui/RadioGroup.vue'
import { getTranslatedString as _ } from '@/i18n'

export default defineComponent({
  components: {
    CheckboxGroup,
    RadioGroup
  },
  name: 'AbstractEventParticipationSlot',
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
    },
    showExerciseLabel: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    exercise (): Exercise {
      return this.modelValue.exercise
    },
    isMultipleChoiceSinglePossible (): boolean {
      return (
        this.exercise.exercise_type ==
        ExerciseType.MULTIPLE_CHOICE_SINGLE_POSSIBLE
      )
    },
    isMultipleChoiceMultiplePossible (): boolean {
      return (
        this.exercise.exercise_type ==
        ExerciseType.MULTIPLE_CHOICE_MULTIPLE_POSSIBLE
      )
    },
    exerciseChoicesAsOptions (): SelectableOption[] {
      if (
        !this.isMultipleChoiceSinglePossible &&
        !this.isMultipleChoiceMultiplePossible
      ) {
        return []
      }

      return (this.exercise.choices as ExerciseChoice[]).map(c => ({
        value: c.id,
        content: c.text,
        description:
          c.score +
          ' ' +
          _(
            `exercise.choice_score_word_${
              c.score == 1 || c.score == -1 ? 'singular' : 'plural'
            }`
          )
      }))
    },
    isOpenAnswer (): boolean {
      return (
        parseInt((this.exercise?.exercise_type?.toString() ?? '') as string) ==
        ExerciseType.OPEN_ANSWER
      )
    },
    selectedChoicesProxy: {
      get () {
        return this.modelValue.selected_choices
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
