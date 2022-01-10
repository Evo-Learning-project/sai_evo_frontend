<template>
  <div class="relative">
    <btn
      @click="toggleExpand()"
      class="absolute right-0 mt-4 mr-4 top-4"
      :size="'sm'"
      :variant="'light'"
      ><span class="material-icons-outlined">
        {{ showEditor ? 'expand_less' : 'expand_more' }}
      </span></btn
    >
    <div v-if="selectable" class="absolute bottom-0 right-0 mb-8 mr-4">
      <toggle
        :labelOnLeft="true"
        :modelValue="isExerciseSelected"
        @update:modelValue="onUpdateSelected()"
        ><span class="text-muted">{{
          $t('exercise_wrapper.select')
        }}</span></toggle
      >
    </div>
    <exercise-preview
      v-if="!showEditor"
      :exercise="modelValue"
    ></exercise-preview>
    <exercise-editor
      :saving="saving"
      v-else
      v-model="proxyModelValue"
    ></exercise-editor>
  </div>
</template>

<script lang="ts">
import Btn from '@/components/ui/Btn.vue'
import Toggle from '@/components/ui/Toggle.vue'

import ExerciseEditor from '@/components/teacher/ExerciseEditor/ExerciseEditor.vue'
import ExercisePreview from '@/components/teacher/ExerciseEditor/ExercisePreview.vue'
import { Exercise } from '@/models'
import { defineComponent, PropType } from '@vue/runtime-core'
export default defineComponent({
  name: 'ExerciseEditorWrapper',
  components: {
    ExerciseEditor,
    ExercisePreview,
    Btn,
    Toggle
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
      saving: false
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
