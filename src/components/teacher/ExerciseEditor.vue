<template>
  <card
    class="transition-shadow duration-100 focus-within:shadow-lg bg-gray-50"
  >
    <template v-slot:header>
      <h3>{{ $t('exercise_editor.exercise_editor_title') }}</h3>
    </template>
    <template v-slot:body>
      <div class="flex flex-col space-y-6">
        <div class="flex flex-col md:flex-row">
          <text-input
            v-model="exercise.label"
            class="w-full mb-auto md:w-2/5"
            >{{ $t('exercise_editor.exercise_label') }}</text-input
          >
          <div class="flex flex-col mt-2 ml-auto md:flex-row">
            <label
              :for="'exercise_type_' + elementId"
              class="mt-2 select-none md:mr-2"
            >
              {{ $t('exercise_editor.exercise_type') }}
            </label>
            <!-- <dropdown
              :id="'exercise_type_' + elementId"
              v-model="exercise.exercise_type"
              :options="exerciseTypeOptions"
            ></dropdown> -->
            <radio-group
              :id="'exercise_type_' + elementId"
              :options="exerciseTypeOptions"
              v-model="exercise.exercise_type"
            ></radio-group>
            <!--              :modelValue="exercise.exercise_type"
              @update:modelValue="onExerciseTypeChange($event)"-->
          </div>
        </div>
        <text-editor v-model="exercise.text">{{
          $t('exercise_editor.exercise_text')
        }}</text-editor>
        <text-editor v-model="exercise.solution">{{
          $t('exercise_editor.exercise_solution')
        }}</text-editor>
        <tag-input
          v-model="exercise.tags"
          :allow-edit-tags="true"
          :placeholder="$t('exercise_editor.exercise_tags')"
        ></tag-input>
      </div>
      <!-- Choiceful exercise types settings -->
      <div class="mt-8" v-if="isChoiceful">
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
      </div>
    </template>
  </card>
</template>

<script lang="ts">
import { getTranslatedString as _ } from '@/i18n'
import { v4 as uuid4 } from 'uuid'
import RadioGroup from '@/components/ui/RadioGroup.vue'

import { blankChoice, Exercise } from '@/models'
import { ExerciseType, choicefulExerciseTypes } from '@/models'
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
  created () {
    this.elementId = uuid4()
  },
  data () {
    return {
      exercise: {
        exercise_type: ExerciseType.MULTIPLE_CHOICE_SINGLE_POSSIBLE,
        choices: [
          { text: 'abc', score: 1.5 },
          { text: 'def', score: 0.5 }
        ],
        tags: [{ name: 'abc' }, { name: 'def' }]
      } as Exercise,
      elementId: ''
    }
  },
  methods: {
    // onExerciseTypeChange (newVal: ExerciseType) {
    //   if (!confirm('Are you sure?')) return
    //   this.exercise.exercise_type = newVal
    // }
    onAddChoice () {
      this.exercise.choices?.push(blankChoice)
    }
  },
  computed: {
    exerciseTypeOptions () {
      return Object.keys(ExerciseType)
        .filter((key: string | number) => parseInt(key as string) == key) //(ExerciseType[key] as unknown) == 'number')
        .map(key => ({
          value: key,
          content: _('exercise_types.' + key)
        }))
    },
    isChoiceful (): boolean {
      return choicefulExerciseTypes.includes(
        parseInt((this.exercise.exercise_type?.toString() ?? '') as string)
      )
    }
  }
})
</script>

<style></style>
