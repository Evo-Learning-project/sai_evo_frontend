<template>
  <card
    class="transition-shadow duration-100 focus-within:shadow-lg"
    :class="{ 'bg-gray-50': isDraft }"
  >
    <template v-slot:header>
      <div class="flex">
        <h3>
          {{ $t('exercise_editor.exercise_editor_title') }}
          <span v-if="isDraft" class="text-muted"
            >({{ $t('exercise_editor.draft_notice') }})</span
          >
        </h3>
        <div
          v-if="saving"
          class="flex items-center ml-auto mr-8 space-x-1 text-muted"
        >
          <spinner :size="'sm'"></spinner>
          <p class="text-sm">{{ $t('exercise_editor.saving') }}</p>
        </div>
        <div
          v-else-if="showSaved"
          class="flex items-center ml-auto mr-8 space-x-1 text-muted"
        >
          <span class="text-base material-icons-outlined">
            cloud_done
          </span>
          <p class="text-sm">{{ $t('exercise_editor.saved') }}</p>
        </div>
      </div>
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
          :modelValue="exercise.choices[index]"
          @update:modelValue="onChoiceUpdate(index, $event)"
        ></choice-editor>
        <!--v-model="exercise.choices[index]"-->
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

import {
  getBlankChoice,
  Exercise,
  ExerciseState,
  ExerciseChoice
} from '@/models'
import { ExerciseType, multipleChoiceExerciseTypes } from '@/models'
import Card from '@/components/ui/Card.vue'
import Spinner from '@/components/ui/Spinner.vue'
//import Dropdown from '@/components/ui/Dropdown.vue'
import { defineComponent, PropType } from '@vue/runtime-core'
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
    TagInput,
    Spinner
  },
  props: {
    modelValue: {
      type: Object as PropType<Exercise>,
      required: true
    }
    // saving: {
    //   type: Boolean,
    //   default: false
    // }
  },
  watch: {
    async serializedBaseExerciseFields (newVal: string, oldVal: string) {
      //this.$emit('update:modelValue', JSON.parse(newVal))
      //this.$emit('update', JSON.parse(newVal))
      if (oldVal !== '{}') {
        await this.onChange(JSON.parse(newVal) as Exercise)
      }
    },
    saving (newVal: boolean, oldVal: boolean) {
      if (!newVal && oldVal) {
        // done saving
        this.showSaved = true
        setTimeout(() => (this.showSaved = false), 5000)
      }
    }
  },
  created () {
    this.elementId = uuid4()
    this.exercise = this.modelValue
  },
  data () {
    return {
      exercise: {} as Exercise,
      elementId: '',
      showSaved: false,
      saving: false
    }
  },
  methods: {
    // onExerciseTypeChange (newVal: ExerciseType) {
    //   if (!confirm('Are you sure?')) return
    //   this.exercise.exercise_type = newVal
    // }
    async onAddChoice () {
      //this.exercise.choices?.push(getBlankChoice())
      await this.$store.dispatch('addExerciseChoice', {
        courseId: this.courseId,
        exerciseId: this.exercise.id,
        choice: getBlankChoice()
      })
    },
    async onChange (newVal: Exercise) {
      this.saving = true
      await this.$store.dispatch('updateExercise', {
        courseId: this.courseId,
        exercise: newVal
      })
      this.saving = false
    },
    async onChoiceUpdate (index: number, newVal: ExerciseChoice) {
      // eslint-disable-next-line @typescript-eslint/no-extra-semi
      ;(this.exercise.choices as ExerciseChoice[])[index] = newVal

      this.saving = true
      await this.$store.dispatch('updateExerciseChoice', {
        courseId: this.courseId,
        exerciseId: this.exercise.id,
        choice: newVal
      })
      this.saving = false
    }
  },
  computed: {
    serializedExercise () {
      return JSON.stringify(this.exercise)
    },
    serializedBaseExerciseFields () {
      const { id, text, exercise_type, solution, state, label } = this.exercise
      return JSON.stringify({ id, text, exercise_type, solution, state, label })
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
    },
    courseId (): string {
      return this.$route.params.id as string
    }
  }
})
</script>

<style></style>
