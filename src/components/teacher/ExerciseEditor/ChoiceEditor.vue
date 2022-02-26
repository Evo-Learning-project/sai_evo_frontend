<template>
  <div class="flex py-3 my-3">
    <span
      class="my-auto mr-2 text-lg cursor-move material-icons-outlined opacity-70"
    >
      drag_indicator
    </span>
    <TextEditor
      class="w-4/5 md:mr-4"
      :modelValue="modelValue.text"
      @update:modelValue="onUpdate('text', $event)"
      >{{ $t('exercise_editor.choice_text') }}</TextEditor
    >
    <NumberInput
      class="mb-auto"
      :modelValue="modelValue.score"
      @update:modelValue="onUpdate('score', $event)"
      >{{ $t('exercise_editor.choice_score') }}</NumberInput
    >
  </div>
</template>

<script lang="ts">
import { ExerciseChoice } from '@/models'
import { defineComponent, PropType } from '@vue/runtime-core'
import TextEditor from '@/components/ui/TextEditor.vue'
import NumberInput from '@/components/ui/NumberInput.vue'

export default defineComponent({
  name: 'ChoiceEditor',
  props: {
    modelValue: {
      type: Object as PropType<ExerciseChoice>,
      required: true
    }
  },
  components: {
    TextEditor,
    NumberInput
  },
  methods: {
    onUpdate (field: keyof ExerciseChoice, value: unknown) {
      this.$emit('choiceUpdate', { field, value })
    }
  }
})
</script>

<style></style>
