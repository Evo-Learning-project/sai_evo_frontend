<template>
  <div>
    <div class="w-2/5 mx-auto">
      <SegmentedControls
        v-model="currentTab"
        :options="programmingExerciseTabsOptions"
      ></SegmentedControls>
    </div>
    <div class="mt-7">
      <div
        class="user-content"
        v-if="currentTab === ProgrammingExerciseTabs.TEXT"
        v-html="exercise.text"
      ></div>
      <div
        v-else-if="currentTab === ProgrammingExerciseTabs.EDITOR"
        class="relative flex"
      >
        <CodeEditor
          class="w-full"
          :size="'lg'"
          v-model="proxyModelValue"
        ></CodeEditor>
        <div class="absolute top-0 right-0 mt-0.5 mr-4">
          <Btn :variant="'success'"
            ><span class="mr-1 text-base material-icons"> play_arrow </span
            >{{ $t("programming_exercise.run_code") }}</Btn
          >
        </div>
      </div>
      <div v-if="currentTab === ProgrammingExerciseTabs.TEST_CASES">
        <div
          class="my-8"
          v-for="(testcase, index) in exercise.testcases"
          :key="'t-' + testcase.id"
        >
          <h4 class="mb-1">
            {{ $t("programming_exercise.testcase") }} {{ index + 1 }}
          </h4>
          <ExerciseTestCase :test-case="testcase"></ExerciseTestCase>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  programmingExerciseTabsOptions,
  ProgrammingExerciseTabs,
} from "@/const";
import { Exercise } from "@/models";
import { defineComponent, PropType } from "@vue/runtime-core";
import SegmentedControls from "../ui/SegmentedControls.vue";
import CodeEditor from "../ui/CodeEditor.vue";
import ExerciseTestCase from "./ExerciseTestCase.vue";
import Btn from "../ui/Btn.vue";
export default defineComponent({
  name: "ProgrammingExercise",
  props: {
    exercise: {
      type: Object as PropType<Exercise>,
      required: true,
    },
    modelValue: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      ProgrammingExerciseTabs,
      programmingExerciseTabsOptions,
      currentTab: ProgrammingExerciseTabs.TEXT,
    };
  },
  methods: {},
  computed: {
    proxyModelValue: {
      get(): string {
        return this.modelValue;
      },
      set(newVal: string) {
        this.$emit("update:modelValue", newVal);
      },
    },
  },
  components: { SegmentedControls, CodeEditor, ExerciseTestCase, Btn },
});
</script>

<style></style>
