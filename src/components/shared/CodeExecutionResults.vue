<template>
  <div>{{ slot.execution_results }}</div>
</template>

<script lang="ts">
import { EventParticipationSlot } from "@/models";
import { defineComponent, PropType } from "@vue/runtime-core";
export default defineComponent({
  name: "CodeExecutionResults",
  props: {
    slot: {
      type: Object as PropType<EventParticipationSlot>,
      required: true,
    },
  },
  methods: {},
  computed: {},
});
</script>

<style></style>
