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
      class="fixed bottom-0 left-0 z-20 flex flex-col w-full px-10 py-6  bg-gray-50 shadow-all-around"
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
      <div class="flex w-full pb-10 space-x-8 overflow-y-auto">
        <!-- editor section -->
        <div class="w-full">
          <TextEditor
            v-if="editorType === 'text'"
            :tall="true"
            class="mt-auto"
            :modelValue="modelValue.content"
            :placeholder="$t('exercise_solution.your_solution_placeholder')"
            @update:modelValue="onUpdate('content', $event)"
          />
          <CodeEditor
            v-else
            :modelValue="modelValue.content"
            @update:modelValue="onUpdate('content', $event)"
            :language="editorType"
          />
        </div>
        <!-- exercise section -->
        <div class="w-full overflow-y-auto">
          <slot></slot>
        </div>
      </div>
      <div
        class="flex items-center px-10 py-3 -mx-10 -mb-6 shadow-popup bg-light"
      >
        <Btn class="">{{ $t("exercise_solution.publish") }}</Btn>
        <p
          class="ml-6 text-muted"
          v-if="modelValue.state === ExerciseSolutionState.DRAFT"
        >
          ({{ $t("exercise_solution.states." + ExerciseSolutionState.DRAFT) }})
        </p>
        <CloudSaveStatus class="ml-auto" :saving="saving" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "@vue/runtime-core";
import TextEditor from "@/components/ui/TextEditor.vue";
import { ExerciseSolution, ExerciseSolutionState } from "@/models";
import Btn from "@/components/ui/Btn.vue";
import CloudSaveStatus from "@/components/ui/CloudSaveStatus.vue";
import { texMixin } from "@/mixins";
import CodeEditor from "@/components/ui/CodeEditor.vue";
export default defineComponent({
  name: "ExerciseSolutionEditor",
  mixins: [texMixin],
  props: {
    modelValue: {
      type: Object as PropType<ExerciseSolution>,
      required: true,
    },
    saving: {
      type: Boolean,
      required: true,
    },
    editorType: {
      type: String as PropType<"text" | "typescript" | "c">,
      required: true,
    },
  },
  beforeUnmount() {
    const bodyContainsOverflowHidden =
      document.body.classList.contains("overflow-y-hidden");
    if (bodyContainsOverflowHidden) {
      document.body.classList.remove("overflow-y-hidden");
    }
  },
  created() {
    // prevent scrolling of the underlying page when open
    const bodyContainsOverflowHidden =
      document.body.classList.contains("overflow-y-hidden");
    if (!bodyContainsOverflowHidden) {
      document.body.classList.add("overflow-y-hidden");
    }

    this.triggerTexRender();
  },
  methods: {
    onUpdate(key: keyof ExerciseSolution, value: unknown) {
      this.$emit("update:modelValue", { ...this.modelValue, [key]: value });
    },
  },
  data() {
    return {
      ExerciseSolutionState,
    };
  },
  computed: {},
  components: { TextEditor, Btn, CloudSaveStatus, CodeEditor },
});
</script>

<style></style>
