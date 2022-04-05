<template>
  <div>
    <div class="mx-auto md:w-2/5">
      <SegmentedControls
        v-model="currentTab"
        :options="filteredTabsOptions"
      ></SegmentedControls>
    </div>
    <div class="mt-4">
      <div
        class="user-content"
        v-if="currentTab === ProgrammingExerciseTabs.TEXT"
        v-html="exercise.text"
      ></div>
      <div
        v-else-if="currentTab === ProgrammingExerciseTabs.EDITOR"
        class="relative flex"
      >
        <CodeEditor class="w-full" :size="'lg'" v-model="proxyModelValue"></CodeEditor>
        <Backdrop ref="executionResultsBackdrop" v-if="!!executionResults"
          ><template v-slot:title>
            <h5>{{ $t("programming_exercise.execution_results") }}</h5>
          </template>
          <CodeExecutionResults :slot="slot"></CodeExecutionResults>
        </Backdrop>
        <div class="absolute top-0 right-0 mt-0.5 mr-4">
          <Btn :loading="running" :variant="'success'" @click="$emit('runCode')"
            ><span class="mr-1 text-base material-icons"> play_arrow </span
            >{{ $t("programming_exercise.run_code") }}</Btn
          >
        </div>
        <transition name="quick-bounce"
          ><div
            class="z-50 bg-dark text-lightText bg-opacity-90 absolute bottom-0 right-0 mr-4 mb-2 rounded bg-light shadow-popup p-4"
            v-if="executionState === 'running'"
          >
            Esecuzione codice in corso
          </div>
          <!-- TODO div in bottom right that shows "executing..."-->
        </transition>
      </div>
      <div v-if="currentTab === ProgrammingExerciseTabs.TEST_CASES">
        <div
          class="my-8"
          v-for="(testcase, index) in exercise.testcases"
          :key="'t-' + testcase.id"
        >
          <h4 class="mb-1">{{ $t("programming_exercise.testcase") }} {{ index + 1 }}</h4>
          <ExerciseTestCase :test-case="testcase"></ExerciseTestCase>
        </div>
        <div v-if="exercise.testcases?.length === 0">
          <h4 class="text-muted text-center mt-8">
            {{ $t("programming_exercise.no_testcases") }}
          </h4>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { programmingExerciseTabsOptions, ProgrammingExerciseTabs } from "@/const";
import { EventParticipationSlot, Exercise } from "@/models";
import { defineComponent, PropType } from "@vue/runtime-core";
import SegmentedControls from "../ui/SegmentedControls.vue";
import CodeEditor from "../ui/CodeEditor.vue";
import ExerciseTestCase from "./ExerciseTestCase.vue";
import Btn from "../ui/Btn.vue";
import { loadingMixin } from "@/mixins";
import Backdrop from "../ui/Backdrop.vue";
import CodeExecutionResults from "./CodeExecutionResults.vue";
import { SelectableOption } from "@/interfaces";
export default defineComponent({
  name: "ProgrammingExercise",
  mixins: [loadingMixin],
  watch: {
    // executionResults(newVal) {
    //   console.log("changed execution results", newVal);
    //   if (this.$refs.executionResultsBackdrop) {
    //     (this.$refs.executionResultsBackdrop as any).expanded = true;
    //   }
    // },
    executionState(newVal, oldVal) {
      //console.log(this.executionResults, "ex");
      if (
        oldVal !== "completed" &&
        newVal === "completed" &&
        this.$refs.executionResultsBackdrop
      ) {
        (this.$refs.executionResultsBackdrop as any).expanded = true;
      }
    },
  },
  props: {
    exercise: {
      type: Object as PropType<Exercise>,
      required: true,
    },
    slot: {
      type: Object as PropType<EventParticipationSlot>,
      required: true,
    },
    modelValue: {
      type: String,
      required: true,
    },
    executionResults: {
      type: Object as PropType<Record<string, string>>,
      required: false,
    },
    running: {
      type: Boolean,
    },
    showEditor: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      ProgrammingExerciseTabs,
      programmingExerciseTabsOptions,
      currentTab: ProgrammingExerciseTabs.TEXT,
      showExecutingMessage: false,
    };
  },
  methods: {},
  computed: {
    proxyModelValue: {
      get(): string {
        return this.modelValue;
      },
      set(newVal: string) {
        this.$emit("update:modelValue", newVal);
      },
    },
    filteredTabsOptions(): SelectableOption[] {
      return this.programmingExerciseTabsOptions.filter(
        (o) => this.showEditor || o.value !== ProgrammingExerciseTabs.EDITOR
      );
    },
    executionState() {
      return this.executionResults?.state;
    },
  },
  components: {
    SegmentedControls,
    CodeEditor,
    ExerciseTestCase,
    Btn,
    Backdrop,
    CodeExecutionResults,
  },
});
</script>

<style></style>
