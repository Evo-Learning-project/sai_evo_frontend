<template>
  <div
    style="z-index: 1000"
    class="fixed top-0 left-0 flex items-center justify-center w-full h-full"
  >
    <div
      style="width: 100vw !important; height: 100vh !important"
      class="fixed z-10 w-full h-full transition-none bg-gray-900 opacity-80"
    ></div>
    <div
      style="min-height: 24rem; max-height: 40rem"
      class="fixed bottom-0 left-0 z-20 flex flex-col w-full px-10 py-6  bg-gray-50"
    >
      <div class="flex items-center w-full mb-8">
        <h3>{{ $t("exercise_solution.propose_solution_title") }}</h3>
        <Btn
          :variant="'icon'"
          class="ml-auto"
          :outline="true"
          @click="$emit('close')"
          :tooltip="$t('misc.close')"
          ><span class="material-icons-outlined">close</span></Btn
        >
      </div>
      <div class="flex w-full space-x-8 overflow-y-auto">
        <!-- editor section -->
        <div class="w-full">
          <TextEditor
            :tall="true"
            class="mt-auto"
            :modelValue="modelValue.content"
            @update:modelValue="onUpdate('content', $event)"
          ></TextEditor>
        </div>
        <!-- exercise section -->
        <div class="w-full overflow-y-auto">
          <slot></slot>
        </div>
      </div>
      <div
        class="flex items-center px-10 py-3 -mx-10 -mb-6 shadow-popup bg-light"
      >
        <Btn class="mr-auto">Pubblica</Btn>
        <CloudSaveStatus :saving="saving" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "@vue/runtime-core";
import TextEditor from "@/components/ui/TextEditor.vue";
import { ExerciseSolution } from "@/models";
import Btn from "@/components/ui/Btn.vue";
import CloudSaveStatus from "@/components/ui/CloudSaveStatus.vue";
export default defineComponent({
  name: "ExerciseSolutionEditor",
  props: {
    modelValue: {
      type: Object as PropType<ExerciseSolution>,
      required: true,
    },
    saving: {
      type: Boolean,
      required: true,
    },
  },
  methods: {
    onUpdate(key: keyof ExerciseSolution, value: unknown) {
      this.$emit("update:modelValue", { ...this.modelValue, [key]: value });
    },
  },
  // data() {},
  computed: {},
  components: { TextEditor, Btn, CloudSaveStatus },
});
</script>

<style></style>
