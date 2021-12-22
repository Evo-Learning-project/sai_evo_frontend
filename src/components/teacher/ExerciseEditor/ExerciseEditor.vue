<template>
  <card
    class="transition-shadow duration-100 focus-within:shadow-lg"
    :class="{ 'bg-gray-50': isDraft }"
  >
    <template v-slot:header>
      <h3>
        {{ $t('exercise_editor.exercise_editor_title') }}
        <span v-if="isDraft" class="text-muted"
          >({{ $t('exercise_editor.draft_notice') }})</span
        >
      </h3>
    </template>
    <template v-slot:body>
      <div class="flex flex-col space-y-6">
        <div class="flex flex-col items-start my-4 space-x-8 md:flex-row">
          <div class="w-full mr-auto md:w-4/12">
            <text-input v-model="exercise.label">{{
              $t('exercise_editor.exercise_label')
            }}</text-input>
          </div>
          <div class="self-start w-1/2 mr-auto md:w-3/12">
            <radio-group
              :id="'exercise_state_' + elementId"
              :options="exerciseStateOptions"
              v-model="exercise.state"
            >
              {{ $t('exercise_editor.exercise_state') }}
            </radio-group>
          </div>
          <div class="flex flex-col ml-auto md:flex-row md:w-5/12">
            <radio-group
              class="w-full"
              :id="'exercise_type_' + elementId"
              :options="exerciseTypeOptions"
              v-model="exercise.exercise_type"
            >
              {{ $t('exercise_editor.exercise_type') }}
            </radio-group>
            <!--              :modelValue="exercise.exercise_type"
              @update:modelValue="onExerciseTypeChange($event)"-->
          </div>
        </div>
        <text-editor v-model="exercise.text">{{
          $t('exercise_editor.exercise_text')
        }}</text-editor>
        <!-- TODO show code editor if the exercise type is js -->
        <text-editor v-model="exercise.solution">{{
          $t('exercise_editor.exercise_solution')
        }}</text-editor>
        <tag-input
          v-model="exercise.tags"
          :allow-edit-tags="true"
          :placeholder="$t('exercise_editor.exercise_tags')"
        ></tag-input>
      </div>
      <!-- Multiple-choice exercise types settings -->
      <div class="mt-8" v-if="isMultipleChoice">
        <h3 class="mb-8">{{ $t('exercise_editor.choices_title') }}</h3>
        <choice-editor
          v-for="(choice, index) in exercise.choices"
          :key="elementId + '-choice-' + index"
          v-model="exercise.choices[index]"
        ></choice-editor>
        <btn @click="onAddChoice()" :size="'sm'"
          ><span class="mr-1 text-base material-icons-outlined">
            add_circle_outline
          </span>
          {{ $t('exercise_editor.new_choice') }}</btn
        >
        <!-- Js exercise settings -->

        <!-- Completion exercise settings -->

        <!-- Aggregated exercise settings -->
      </div>
    </template>
  </card>
</template>

<script lang="ts">
import { getTranslatedString as _ } from '@/i18n'
import { icons as exerciseTypesIcons } from '@/assets/exerciseTypesIcons'
import { icons as exerciseStatesIcons } from '@/assets/exerciseStatesIcons'
import { v4 as uuid4 } from 'uuid'
import RadioGroup from '@/components/ui/RadioGroup.vue'

import { getBlankChoice, Exercise, ExerciseState } from '@/models'
import { ExerciseType, multipleChoiceExerciseTypes } from '@/models'
import Card from '@/components/ui/Card.vue'
//import Dropdown from '@/components/ui/Dropdown.vue'
import { defineComponent } from '@vue/runtime-core'
import TextEditor from '@/components/ui/TextEditor.vue'
import TextInput from '@/components/ui/TextInput.vue'
import Btn from '@/components/ui/Btn.vue'
import TagInput from '@/components/ui/TagInput.vue'

import ChoiceEditor from '@/components/teacher/ExerciseEditor/ChoiceEditor.vue'

export default defineComponent({
  name: 'ExerciseEditor',
  components: {
    Card,
    TextEditor,
    TextInput,
    //Dropdown
    RadioGroup,
    ChoiceEditor,
    Btn,
    TagInput
  },
  props: ['modelValue'],
  watch: {
    serializedModelValue (newVal: string) {
      this.$emit('update:modelValue', JSON.parse(newVal))
    }
  },
  created () {
    this.elementId = uuid4()
    this.exercise = this.modelValue
  },
  data () {
    return {
      exercise: {} as Exercise,
      elementId: ''
    }
  },
  methods: {
    // onExerciseTypeChange (newVal: ExerciseType) {
    //   if (!confirm('Are you sure?')) return
    //   this.exercise.exercise_type = newVal
    // }
    onAddChoice () {
      this.exercise.choices?.push(getBlankChoice())
    }
  },
  computed: {
    serializedExercise () {
      return JSON.stringify(this.exercise)
    },
    exerciseTypeOptions () {
      return ((Object.keys(ExerciseType) as unknown[]) as ExerciseType[])
        .filter((key: string | number) => parseInt(key as string) == key) //(ExerciseType[key] as unknown) == 'number')
        .map(key => ({
          icons: exerciseTypesIcons[key],
          value: key,
          content: _('exercise_types.' + key)
        }))
    },
    exerciseStateOptions () {
      return ((Object.keys(ExerciseState) as unknown[]) as ExerciseState[])
        .filter((key: string | number) => parseInt(key as string) == key) //(ExerciseType[key] as unknown) == 'number')
        .map(key => ({
          icons: exerciseStatesIcons[key],
          value: key,
          content: _('exercise_states.' + key),
          description: _('exercise_states_descriptions.' + key)
        }))
    },
    isMultipleChoice (): boolean {
      return multipleChoiceExerciseTypes.includes(
        parseInt((this.exercise.exercise_type?.toString() ?? '') as string)
      )
    },
    isDraft (): boolean {
      return this.exercise.state == ExerciseState.DRAFT
    }
  }
})
</script>

<style></style>
