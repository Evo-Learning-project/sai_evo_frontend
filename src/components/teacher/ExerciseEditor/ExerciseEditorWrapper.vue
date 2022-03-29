<template>
  <div class="relative my-4" :id="'editor-' + modelValue.id">
    <div class="absolute top-0 right-0 z-20 mt-2 mr-3">
      <Btn :size="'lg'" :variant="'icon'" @click="showEditor = !showEditor"
        ><span
          class="material-icons-outlined transform transition-transform duration-200 ease-out"
          :class="{ 'rotate-180': showEditor }"
        >
          {{ false && showEditor ? "expand_less" : "expand_more" }}
        </span></Btn
      >
    </div>
    <div
      class="transform transition-transform duration-200"
      :class="{ 'scale-0': false && showEditor }"
    >
      <ExercisePreview v-show="!showEditor" :exercise="modelValue"></ExercisePreview>
    </div>
    <div
      class="transform transition-all duration-200 overflow-y-hidden"
      :class="{
        '': !showEditor,
        '': showEditor,
      }"
    >
      <ExerciseEditor
        :saving="saving"
        v-if="showEditor"
        :modelValue="modelValue"
      ></ExerciseEditor>
    </div>
  </div>
</template>

<script lang="ts">
import Btn from "@/components/ui/Btn.vue";

import ExerciseEditor from "@/components/teacher/ExerciseEditor/ExerciseEditor.vue";
import ExercisePreview from "@/components/teacher/ExerciseEditor/ExercisePreview.vue";
import { Exercise } from "@/models";
import { defineComponent, PropType } from "@vue/runtime-core";
export default defineComponent({
  name: "ExerciseEditorWrapper",
  components: {
    ExerciseEditor,
    ExercisePreview,
    Btn,
  },
  props: {
    modelValue: {
      type: Object as PropType<Exercise>,
      required: true,
    },
    selectable: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      showEditor: false,
      saving: false,
      dialog: false,
    };
  },
  //created () {},
  methods: {
    toggleExpand() {
      this.showEditor = !this.showEditor;
    },
  },
  computed: {
    // proxyModelValue: {
    //   get (): Exercise {
    //     return this.modelValue
    //   },
    //   set (val: Exercise) {
    //     this.$emit('update:modelValue', val)
    //   }
    // }
  },
});
</script>

<style></style>
