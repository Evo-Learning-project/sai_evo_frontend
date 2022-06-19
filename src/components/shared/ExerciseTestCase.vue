<template>
  <div class="flex flex-col space-y-4" :class="{ 'text-sm': small }">
    <div
      class="w-full mb-4 user-content"
      :class="[small ? 'py-2.5 mt-2' : '']"
      v-if="!!testCase.text && showDescription"
      v-html="testCase.text"
    ></div>
    <CodeFragment
      :small="small"
      class="w-full"
      v-if="!!testCase.code"
      :value="testCase.code"
    ></CodeFragment>
    <div
      v-if="!!testCase.stdin"
      :class="[!!testCase.text ? 'md:w-1/2 w-full' : 'w-full']"
      class="flex flex-col"
    >
      <div class="text-xs text-muted">
        {{ $t("programming_exercise.testcase_stdin") }}
      </div>
      <CodeFragment :small="small" :value="testCase.stdin"></CodeFragment>
    </div>
    <div
      v-if="!!testCase.expected_stdout"
      :class="[!!testCase.text ? 'md:w-1/2 w-full' : 'w-full']"
      class="flex flex-col"
    >
      <div class="text-xs text-muted">
        {{ $t("programming_exercise.testcase_expected_stdout") }}
      </div>
      <CodeFragment
        :small="small"
        :value="testCase.expected_stdout"
      ></CodeFragment>
    </div>
  </div>
</template>

<script lang="ts">
import { ExerciseTestCase } from "@/models";
import { defineComponent, PropType } from "@vue/runtime-core";
import CodeFragment from "../ui/CodeFragment.vue";
export default defineComponent({
  name: "ExerciseTestCase",
  props: {
    testCase: {
      type: Object as PropType<ExerciseTestCase>,
      required: true,
    },
    small: {
      type: Boolean,
      default: false,
    },
    showDescription: {
      type: Boolean,
      default: true,
    },
  },
  methods: {},
  computed: {},
  components: { CodeFragment },
});
</script>

<style></style>
