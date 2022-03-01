<template>
  <div class="flex space-x-4">
    <span
      class="row-span-2 my-auto text-lg cursor-move  material-icons-outlined opacity-70"
    >
      drag_indicator
    </span>
    <div class="grid w-full grid-cols-12 gap-5">
      <div class="col-span-6">
        <SegmentedControls
          :modelValue="modelValue.testcase_type"
          @update:modelValue="onUpdate('testcase_type', $event)"
          :options="testcaseTypeOptions"
          >{{ $t("exercise_editor.testcase_type") }}</SegmentedControls
        >
      </div>
      <CodeEditor
        class="col-span-6 row-span-2"
        :size="'sm'"
        :modelValue="modelValue.code"
        @update:modelValue="onUpdate('code', $event)"
        >{{ $t("exercise_editor.testcase_code") }}</CodeEditor
      >
      <TextEditor
        class="col-span-6"
        :modelValue="modelValue.text"
        @update:modelValue="onUpdate('text', $event)"
        >{{ $t("exercise_editor.testcase_text") }}</TextEditor
      >
    </div>
  </div>
</template>

<script lang="ts">
import { ExerciseTestCase } from "@/models";
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
