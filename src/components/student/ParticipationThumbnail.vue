<template>
  <div class="overflow-hidden pointer-events-none select-none">
    <div
      style="filter: blur(0px)"
      class="relative w-full overflow-hidden h-8.5rem md:h-15rem"
    >
      <div
        class="absolute top-0 bottom-0 w-full bg-transparent"
        style="height: 100%; z-index: 999999"
      ></div>
      <AbstractEventParticipationSlot
        v-if="participation.slots[0]"
        :model-value="participation.slots[0]"
        :allow-edit-submission="true"
        class="thumbnail-slot -z-1"
      >
        <h5 class="mb-0">Esercizio 1</h5></AbstractEventParticipationSlot
      >
      <AbstractEventParticipationSlot
        v-if="participation.slots[1]"
        :model-value="participation.slots[1]"
        :allow-edit-submission="true"
        class="my-3 thumbnail-slot"
      >
        <h5 class="mb-0">Esercizio 2</h5></AbstractEventParticipationSlot
      >

      <AbstractEventParticipationSlot
        v-if="participation.slots[2]"
        :model-value="participation.slots[2]"
        :allow-edit-submission="true"
        class="thumbnail-slot"
      >
        <h5 class="mb-0">Esercizio 3</h5></AbstractEventParticipationSlot
      >
    </div>
  </div>
</template>

<script lang="ts">
import { EventParticipation } from "@/models";
import { defineComponent, PropType } from "@vue/runtime-core";
import AbstractEventParticipationSlot from "../shared/AbstractEventParticipationSlot.vue";
export default defineComponent({
  name: "ParticipationThumbnail",
  props: {
    participation: {
      type: Object as PropType<EventParticipation>,
      required: true,
    },
  },
  methods: {},
  computed: {},
  components: { AbstractEventParticipationSlot },
});
</script>

<style></style>
