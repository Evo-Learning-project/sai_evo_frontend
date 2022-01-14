<template>
  <div class="flex my-6">
    <text-editor class="w-4/5 md:mr-4" v-model="choice.text">{{
      $t('exercise_editor.choice_text')
    }}</text-editor>
    <number-input class="mb-auto" v-model="choice.score">{{
      $t('exercise_editor.choice_score')
    }}</number-input>
  </div>
</template>

<script lang="ts">
import { ExerciseChoice } from '@/models'
import { defineComponent } from '@vue/runtime-core'
import TextEditor from '@/components/ui/TextEditor.vue'
import NumberInput from '@/components/ui/NumberInput.vue'

export default defineComponent({
  name: 'ChoiceEditor',
  props: ['modelValue'],
  components: {
    TextEditor,
    NumberInput
  },
  created () {
    this.choice = this.modelValue
  },
  watch: {
    serializedModelValue (newVal: string, oldVal: string) {
      if (oldVal !== '{}') {
        this.$emit('update:modelValue', JSON.parse(newVal))
      }
    }
  },
  data () {
    return {
      choice: {} as ExerciseChoice
    }
  },
  computed: {
    serializedModelValue () {
      return JSON.stringify(this.choice)
    }
  }
})
</script>

<style></style>
