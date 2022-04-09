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
        <CodeEditor
          :language="
            exercise.exercise_type === ExerciseType.JS ? 'typescript' : 'c'
          "
          class="w-full"
          :size="'lg'"
          v-model="proxyModelValue"
          :showRunButton="true"
          :runCoolDown="runCoolDown"
          :running="executionState === 'running' || running || runCoolDown > 0"
          @run="onRun"
        >
          <template v-slot:runButton
            ><span class="ml-1 mr-1 text-base material-icons"> play_arrow </span
            >{{ $t("programming_exercise.run_code") }}
            <span class="opacity-50" v-if="runCoolDown > 0"
              >&nbsp;({{ runCoolDown }})</span
            >
            <span v-if="runCoolDown < 10" class="opacity-0">0</span></template
          >
        </CodeEditor>
        <Backdrop ref="executionResultsBackdrop" v-if="!!executionResults"
          ><template v-slot:title>
            <h5>{{ $t("programming_exercise.execution_results") }}</h5>
          </template>
          <CodeExecutionResults :slot="slot"></CodeExecutionResults>
        </Backdrop>
        <!-- <div class="absolute top-0 right-0 mt-0.5 mr-4">
          <Btn
            :disabled="executionState === 'running' || running || runCoolDown > 0"
            :variant="'success'"
            @click="onRun"
            ><span class="ml-1 mr-1 text-base material-icons"> play_arrow </span
            >{{ $t("programming_exercise.run_code") }}
            <span class="opacity-50" v-if="runCoolDown > 0"
              >&nbsp;({{ runCoolDown }})</span
            >
            <span v-if="runCoolDown < 10" class="opacity-0">0</span>
          </Btn>
        </div> -->
        <transition name="quick-bounce"
          ><div
            class="absolute bottom-0 right-0 z-50 flex items-center px-6 py-3 mb-2 mr-4 space-x-2 rounded  bg-dark text-lightText bg-opacity-90 bg-light shadow-popup"
            v-if="executionState === 'running'"
          >
            <Spinner :fast="true"></Spinner>
            <p>{{ $t("programming_exercise.running_code") }}</p>
          </div>
        </transition>
      </div>
      <div v-if="currentTab === ProgrammingExerciseTabs.TEST_CASES">
        <div
          class="my-8"
          v-for="(testcase, index) in exercise.testcases"
          :key="'t-' + testcase.id"
        >
          <h4 class="mb-1">
            {{ $t("programming_exercise.testcase") }} {{ index + 1 }}
          </h4>
          <ExerciseTestCase :test-case="testcase"></ExerciseTestCase>
        </div>
        <div v-if="exercise.testcases?.length === 0">
          <h4 class="mt-8 text-center text-muted">
            {{ $t("programming_exercise.no_testcases") }}
          </h4>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
const RUN_COOL_DOWN = 0;

import {
  programmingExerciseTabsOptions,
  ProgrammingExerciseTabs,
} from "@/const";
import { EventParticipationSlot, Exercise, ExerciseType } from "@/models";
import { defineComponent, PropType } from "@vue/runtime-core";
import SegmentedControls from "../ui/SegmentedControls.vue";
import CodeEditor from "../ui/CodeEditor.vue";
import ExerciseTestCase from "./ExerciseTestCase.vue";
//import Btn from "../ui/Btn.vue";
import { loadingMixin } from "@/mixins";
import Backdrop from "../ui/Backdrop.vue";
import CodeExecutionResults from "./CodeExecutionResults.vue";
import { SelectableOption } from "@/interfaces";
import Spinner from "../ui/Spinner.vue";
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
        newVal === "internal_error" ||
        (oldVal !== "completed" &&
          newVal === "completed" &&
          this.$refs.executionResultsBackdrop)
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
      runCoolDown: 0,
      ExerciseType,
    };
  },
  methods: {
    onRun() {
      this.$emit("runCode");
      this.runCoolDown = RUN_COOL_DOWN;
      const coolDownHandle = setInterval(() => {
        this.runCoolDown--;
        if (this.runCoolDown <= 0) {
          clearInterval(coolDownHandle);
        }
      }, 1000);
    },
  },
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
    //Btn,
    Backdrop,
    CodeExecutionResults,
    Spinner,
  },
});
</script>

<style></style>
