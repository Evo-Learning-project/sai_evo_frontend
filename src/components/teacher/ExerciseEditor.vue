<template>
  <card
    class="transition-shadow duration-100 bg-gray-50 focus-within:shadow-lg"
  >
    <template v-slot:header>
      <h3>{{ $t('exercise_editor.exercise_editor_title') }}</h3>
    </template>
    <template v-slot:body>
      <div class="flex flex-col space-y-6">
        <div class="flex items-center">
          <text-input v-model="exercise.label" class="w-2/5">{{
            $t('exercise_editor.exercise_label')
          }}</text-input>
          <p class="ml-auto">{{ $t('exercise_editor.exercise_type') }}</p>
          <dropdown
            v-model="exercise.exercise_type"
            class="ml-2"
            :options="exerciseTypeOptions"
          ></dropdown>
        </div>
        <text-editor v-model="exercise.text">{{
          $t('exercise_editor.exercise_text')
        }}</text-editor>
        <text-editor v-model="exercise.solution">{{
          $t('exercise_editor.exercise_solution')
        }}</text-editor>
      </div>
      <!-- Choiceful exercise types settings -->
      <div class="mt-8" v-if="isChoiceful">
        <h3>{{ $t('exercise_editor.choices_title') }}</h3>
      </div>
    </template>
  </card>
</template>

<script lang="ts">
import { getTranslatedString as _ } from '@/i18n'

import { Exercise } from '@/models'
import { ExerciseType, choicefulExerciseTypes } from '@/models'
import Card from '@/components/ui/Card.vue'
import Dropdown from '@/components/ui/Dropdown.vue'
import { defineComponent } from '@vue/runtime-core'
import TextEditor from '@/components/ui/TextEditor.vue'
import TextInput from '@/components/ui/TextInput.vue'

export default defineComponent({
  name: 'ExerciseEditor',
  components: {
    Card,
    TextEditor,
    TextInput,
    Dropdown
  },
  data () {
    return {
      exercise: {} as Exercise
    }
  },
  computed: {
    exerciseTypeOptions () {
      return [
        { name: _('exercise_editor.select_exercise_type'), value: '' },
        ...Object.keys(ExerciseType)
          .filter((key: string | number) => parseInt(key as string) == key) //(ExerciseType[key] as unknown) == 'number')
          .map(key => ({
            value: key,
            name: _('exercise_types.' + key)
          }))
      ]
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
