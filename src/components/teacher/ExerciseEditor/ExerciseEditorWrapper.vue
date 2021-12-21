<template>
  <div class="relative">
    <btn
      @click="toggleExpand()"
      class="absolute top-0 right-0 mt-4 mr-4"
      :size="'sm'"
      :variant="'light'"
      ><span class="material-icons-outlined">
        {{ showEditor ? 'expand_less' : 'expand_more' }}
      </span></btn
    >
    <exercise-preview
      v-if="!showEditor"
      :exercise="modelValue"
    ></exercise-preview>
    <exercise-editor v-else v-model="proxyModelValue"></exercise-editor>
  </div>
</template>

<script lang="ts">
import Btn from '@/components/ui/Btn.vue'

import ExerciseEditor from '@/components/teacher/ExerciseEditor/ExerciseEditor.vue'
import ExercisePreview from '@/components/teacher/ExerciseEditor/ExercisePreview.vue'
import { Exercise } from '@/models'
import { defineComponent, PropType } from '@vue/runtime-core'
export default defineComponent({
  name: 'ExerciseEditorWrapper',
  components: {
    ExerciseEditor,
    ExercisePreview,
    Btn
  },
  props: {
    modelValue: {
      type: Object as PropType<Exercise>,
      required: true
    }
  },
  data () {
    return {
      showEditor: false
    }
  },
  methods: {
    toggleExpand () {
      this.showEditor = !this.showEditor
    }
  },
  computed: {
    proxyModelValue: {
      get (): Exercise {
        return this.modelValue
      },
      set (val: Exercise) {
        this.$emit('update:modelValue', val)
      }
    }
  }
})
</script>

<style></style>
