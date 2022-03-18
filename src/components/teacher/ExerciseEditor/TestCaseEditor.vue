<template>
  <div
    class="flex flex-col py-3 mb-12 space-y-2  md:flex-row md:space-x-4 md:space-y-4"
  >
    <span
      class="row-span-2 my-auto text-lg cursor-move  material-icons-outlined opacity-70"
    >
      drag_indicator
    </span>
    <div class="grid w-full grid-cols-6 gap-5 md:grid-cols-12">
      <div class="col-span-6">
        <SegmentedControls
          :modelValue="modelValue.testcase_type"
          @update:modelValue="onUpdate('testcase_type', $event)"
          :options="testcaseTypeOptions"
          >{{ $t("exercise_editor.testcase_type") }}</SegmentedControls
        >
      </div>
      <CodeEditor
        class="col-span-6 md:row-span-2"
        :size="'sm'"
        :modelValue="modelValue.code"
        @update:modelValue="onUpdate('code', $event)"
        ><div class="flex w-full">
          <p class="mr-auto">{{ $t("exercise_editor.testcase_code") }}</p>
          <div
            v-if="
              modelValue.testcase_type === ExerciseTestCaseType.HIDDEN ||
              modelValue.testcase_type === ExerciseTestCaseType.SHOW_TEXT_ONLY
            "
            class="flex items-center ml-8 space-x-2 text-danger-dark"
          >
            <span class="mr-2 text-sm material-icons-outlined"
              >visibility_off</span
            >{{ $t("exercise_editor.hidden_to_students") }}
          </div>
        </div></CodeEditor
      >
      <TextEditor
        class="col-span-6"
        :modelValue="modelValue.text"
        @update:modelValue="onUpdate('text', $event)"
        ><div class="flex w-full">
          <p class="mr-auto">{{ $t("exercise_editor.testcase_text") }}</p>
          <div
            v-if="modelValue.testcase_type === ExerciseTestCaseType.HIDDEN"
            class="flex items-center ml-8 space-x-2 text-danger-dark"
          >
            <span class="mr-2 text-sm material-icons-outlined"
              >visibility_off</span
            >{{ $t("exercise_editor.hidden_to_students") }}
          </div>
        </div></TextEditor
      >
    </div>
  </div>
</template>

<script lang="ts">
import { ExerciseTestCase, ExerciseTestCaseType } from "@/models";
import { defineComponent, PropType } from "@vue/runtime-core";
import TextEditor from "@/components/ui/TextEditor.vue";
import CodeEditor from "@/components/ui/CodeEditor.vue";
import SegmentedControls from "@/components/ui/SegmentedControls.vue";
import { testcaseTypeOptions } from "@/const";

export default defineComponent({
  name: "TestCaseEditor",
  props: {
    modelValue: {
      type: Object as PropType<ExerciseTestCase>,
      required: true,
    },
  },
  components: {
    TextEditor,
    CodeEditor,
    SegmentedControls,
  },
  data() {
    return {
      testcaseTypeOptions,
      ExerciseTestCaseType,
    };
  },
  methods: {
    onUpdate(field: keyof ExerciseTestCase, value: unknown) {
      this.$emit("testCaseUpdate", { field, value });
    },
  },
});
</script>

<style></style>
