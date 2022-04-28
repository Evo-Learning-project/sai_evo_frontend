<template>
  <div v-html="formattedValue"></div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import { formatExerciseText } from "@/utils";

export default defineComponent({
  name: "ProcessedTextFragment",
  props: {
    value: {
      type: String,
      required: true,
    },
  },
  methods: {},
  computed: {
    formattedValue(): string {
      return formatExerciseText(this.value);
    },
  },
});
</script>

<style></style>
