<template>
  <div class="relative my-4">
    <div class="absolute top-0 right-0 z-50 mt-2 mr-2">
      <Btn :size="'sm'" :variant="'light'" @click="showEditor = !showEditor"
        ><span class="material-icons-outlined">
          {{ showEditor ? 'expand_less' : 'expand_more' }}
        </span></Btn
      >
    </div>
    <ExercisePreview
      v-show="!showEditor"
      :exercise="modelValue"
    ></ExercisePreview>
    <ExerciseEditor
      :saving="saving"
      v-show="showEditor"
      v-model="proxyModelValue"
    ></ExerciseEditor>
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
  //created () {},
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
