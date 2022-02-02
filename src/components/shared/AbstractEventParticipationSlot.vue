<template>
  <div>
    <h3 v-if="showExerciseLabel">{{ exercise.label }}</h3>
    <div class="mb-8" v-html="exercise.text"></div>
    <CheckboxGroup
      v-if="isMultipleChoiceMultiplePossible"
      :options="exerciseChoicesAsOptions"
      v-model="selectedChoicesProxy"
      :disabled="!allowEditSubmission || saving"
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
      :disabled="!allowEditSubmission || saving"
      v-slot="{ description }"
    >
      <p class="mb-2 text-sm text-muted">{{ description }}</p>
    </RadioGroup>
    <TextEditor
      :disabled="!allowEditSubmission"
      v-else-if="isOpenAnswer"
      v-model="answerTextProxy"
    >
      {{
        allowEditSubmission
          ? $t('event_participation_slot.text_answer_label')
          : $t('event_assessment.text_answer_label')
      }}
    </TextEditor>
    <div v-if="allowEditScores" class="mt-8">
      <h3>{{ $t('event_assessment.your_assessment') }}</h3>
      <div class="mt-4">
        <NumberInput
          class="w-1/2 mb-4"
          :modelValue="modelValue.score"
          @update:modelValue="emitUpdate('score', $event)"
          >{{ $t('event_assessment.assigned_score') }}
        </NumberInput>
        <TextEditor
          class="w-full"
          :modelValue="modelValue.comment"
          @update:modelValue="emitUpdate('comment', $event)"
          >{{ $t('event_assessment.comment_for_student') }}</TextEditor
        >
      </div>
    </div>
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
import TextEditor from '../ui/TextEditor.vue'
import NumberInput from '../ui/NumberInput.vue'

export default defineComponent({
  components: {
    CheckboxGroup,
    RadioGroup,
    TextEditor,
    NumberInput
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
    },
    showScores: {
      type: Boolean,
      default: false
    },
    saving: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    emitUpdate (key: keyof EventParticipationSlot, value: unknown) {
      console.log(key, value)
      this.$emit('update:modelValue', {
        ...this.modelValue,
        [key]: value
      })
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
        ...(this.showScores && {
          description:
            c.score +
            ' ' +
            _(
              `exercise.choice_score_word_${
                c.score == 1 || c.score == -1 ? 'singular' : 'plural'
              }`
            )
        })
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
      set (val: string | string[]) {
        this.$emit(
          'updateSelectedChoices',
          typeof val === 'object' ? val : [val]
        )
      }
    },
    answerTextProxy: {
      get () {
        return this.modelValue.answer_text
      },
      set (val: string) {
        this.$emit('updateAnswerText', val)
      }
    }
  }
})
</script>

<style></style>
