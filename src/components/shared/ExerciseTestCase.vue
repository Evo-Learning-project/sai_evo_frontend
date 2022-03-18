<template>
  <div
    class="flex flex-col items-start md:space-y-0 md:space-x-8 md:flex-row"
    :class="{ 'text-sm': small }"
  >
    <div
      class="user-content"
      :class="[
        !!testCase.code ? 'md:w-1/2 md:mb-0 mb-2' : 'w-full',
        small ? 'py-2.5' : '',
      ]"
      v-if="!!testCase.text"
      v-html="testCase.text"
    ></div>
    <CodeFragment
      :small="small"
      :class="[!!testCase.text ? 'md:w-1/2 w-full' : 'w-full']"
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
    small: {
      type: Boolean,
      default: false,
    },
  },
  methods: {},
  computed: {},
  components: { CodeFragment },
});
</script>

<style></style>
