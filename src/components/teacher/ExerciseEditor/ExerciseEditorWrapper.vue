<template>
  <div class="relative my-2">
    <div class="absolute top-0 right-0 mt-2 mr-2">
      <btn :size="'sm'" :variant="'light'" @btnClick="showEditor = !showEditor"
        ><span class="material-icons-outlined">
          {{ showEditor ? 'expand_less' : 'expand_more' }}
        </span></btn
      >
    </div>
    <exercise-preview
      v-show="!showEditor"
      :exercise="modelValue"
    ></exercise-preview>
    <exercise-editor
      :saving="saving"
      v-show="showEditor"
      v-model="proxyModelValue"
      @update="onUpdate($event)"
    ></exercise-editor>
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
    },
    selectable: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      showEditor: false,
      saving: false,
      dialog: false
    }
  },
  created () {
    setTimeout(() => (this.saving = true), 5000)
    setTimeout(() => (this.saving = false), 7500)
  },
  methods: {
    toggleExpand () {
      this.showEditor = !this.showEditor
    },
    onUpdateSelected () {
      this.$store.commit('toggleSelectedExercise', this.modelValue)
    },
    onDialog () {
      console.log('on dialog')
    },
    onUpdate (value: unknown) {
      console.log('on update')
      console.log(value)
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
    },
    isExerciseSelected (): boolean {
      return this.$store.getters.selectedExercises
        .map((e: Exercise) => e.id)
        .includes(this.modelValue.id)
    }
  }
})
</script>

<style></style>
