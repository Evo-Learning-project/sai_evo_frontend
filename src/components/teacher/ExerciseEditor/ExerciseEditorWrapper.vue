<template>
  <div class="relative my-4" :id="'editor-' + modelValue.id">
    <div style="z-index: 50" class="absolute top-0 right-0 mt-2.5 mr-1">
      <Btn
        :size="'lg'"
        :variant="'icon'"
        :tooltip="$t('misc.close')"
        @click="toggleExpand"
        v-show="showEditor"
        ><span
          class="transition-transform duration-200 ease-out transform  material-icons-outlined"
          :class="{ 'rotate-180': false && showEditor }"
        >
          close
        </span></Btn
      >
    </div>
    <div
      style="z-index: 50"
      class="absolute bottom-0 right-0 hidden mr-1 -mb-2"
      v-show="showEditor"
    >
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

    <MinimalExercisePreview
      :exercise="modelValue"
      v-show="!showEditor"
      :selectable="false"
      @edit="toggleExpand()"
      :showEdit="true"
    ></MinimalExercisePreview>

    <ExerciseEditor
      :saving="saving"
      v-if="showEditor"
      :modelValue="modelValue"
      @delete="$emit('delete')"
      @cloneExercise="onClone"
    ></ExerciseEditor>
  </div>
</template>

<script lang="ts">
import Btn from "@/components/ui/Btn.vue";

import ExerciseEditor from "@/components/teacher/ExerciseEditor/ExerciseEditor.vue";
//import ExercisePreview from "@/components/teacher/ExerciseEditor/ExercisePreview.vue";
import { Exercise } from "@/models";
import { defineComponent, PropType } from "@vue/runtime-core";
import { texMixin } from "@/mixins";
import { getTranslatedString } from "@/i18n";
import { getExerciseTitle } from "@/utils";
import MinimalExercisePreview from "./MinimalExercisePreview.vue";
export default defineComponent({
  name: "ExerciseEditorWrapper",
  components: {
    ExerciseEditor,
    // ExercisePreview,
    Btn,
    MinimalExercisePreview,
  },
  mixins: [texMixin],
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
      if (!this.showEditor) {
        this.triggerTexRender();
      }
    },
    onClone() {
      if (
        confirm(
          getTranslatedString("exercise_editor.clone_confirm") +
            " " +
            getExerciseTitle(this.modelValue) +
            "?"
        )
      ) {
        this.$emit("cloneExercise");
      }
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
