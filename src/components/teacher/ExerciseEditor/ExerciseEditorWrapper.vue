<template>
  <div class="relative my-4" :id="'editor-' + modelValue.id">
    <div style="z-index: 50" class="absolute top-0 right-0 mt-2 mr-3">
      <Btn :size="'lg'" :variant="'icon'" @click="showEditor = !showEditor"
        ><span
          class="transition-transform duration-200 ease-out transform material-icons-outlined"
          :class="{ 'rotate-180': showEditor }"
        >
          {{ false && showEditor ? "expand_less" : "expand_more" }}
        </span></Btn
      >
    </div>
    <div style="z-index: 50" class="absolute bottom-0 right-0 mt-2 mr-3">
      <Btn
        class="mb-4"
        :outline="true"
        :size="'lg'"
        :variant="'icon'"
        @click="$emit('delete')"
        ><span class="text-xl text-danger-dark material-icons-outlined">
          delete
        </span></Btn
      >
    </div>
    <div
      class="transition-transform duration-200 transform"
      :class="{ 'scale-0': false && showEditor }"
    >
      <ExercisePreview v-show="!showEditor" :exercise="modelValue"></ExercisePreview>
    </div>
    <!-- <div
      class="transition-all duration-200 transform"
      :class="{
        '': !showEditor,
        '': showEditor,
      }"
    > -->
    <ExerciseEditor
      :saving="saving"
      v-if="showEditor"
      :modelValue="modelValue"
    ></ExerciseEditor>
    <!-- </div> -->
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
