<template>
  <div class="flex items-start space-x-8">
    <div
      class="user-content"
      :class="[!!testCase.code ? 'w-1/2' : 'w-full']"
      v-if="!!testCase.text"
      v-html="testCase.text"
    ></div>
    <CodeFragment
      :class="[!!testCase.text ? 'w-1/2' : 'w-full']"
      v-if="!!testCase.code"
      :value="testCase.code"
    ></CodeFragment>
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
  },
  methods: {},
  computed: {},
  components: { CodeFragment },
});
</script>

<style></style>
