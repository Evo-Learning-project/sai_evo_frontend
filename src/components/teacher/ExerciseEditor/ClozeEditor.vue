<template>
  <div class="p-3 rounded bg-gray-50">
    <ChoiceEditor
      v-for="choice in modelValue.choices"
      :key="modelValue.id + '-c-' + choice.id"
      :modelValue="choice"
      :icon-type="'radio'"
      :single-line="true"
    >
    </ChoiceEditor>
  </div>
</template>

<script lang="ts">
import { Exercise } from "@/models";
import { defineComponent, PropType } from "@vue/runtime-core";
import ChoiceEditor from "./ChoiceEditor.vue";
export default defineComponent({
  name: "ClozeEditor",
  props: {
    modelValue: {
      type: Object as PropType<Exercise>,
      required: true,
    },
  },
  methods: {},
  computed: {},
  components: { ChoiceEditor },
});
</script>

<style></style>
