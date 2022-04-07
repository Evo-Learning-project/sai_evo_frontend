<template>
  <div class="relative floating-label" :style="'height: ' + containerHeight + ';'">
    <label class="absolute top-2 left-1.5 origin-0 fixed-label w-full"
      ><slot></slot
    ></label>
    <div v-if="showRunButton" class="absolute z-40 top-0 right-0 mt-0.5 mr-4">
      <Btn
        :disabled="running || runCoolDown > 0"
        :variant="'success'"
        @click="$emit('run')"
      >
        <slot name="runButton"></slot>
        <!-- <span class="mr-1 ml-1 text-base material-icons"> play_arrow </span
        >{{ $t("programming_exercise.run_code") }}
        <span class="opacity-50" v-if="runCoolDown > 0">&nbsp;({{ runCoolDown }})</span>
        <span v-if="runCoolDown < 10" class="opacity-0">0</span> -->
      </Btn>
    </div>
    <div class="overflow-hidden rounded-sm">
      <MonacoEditor
        @editorDidMount="onDidMount($event)"
        @change="onChange($event)"
        :value="modelValue"
        theme="vs-dark"
        class="rounded-md"
        :options="monacoOptions"
        :style="'height: ' + editorHeight + ';'"
        :language="language"
      />
    </div>
  </div>
</template>

<script lang="ts">
import MonacoEditor from "monaco-editor-vue3";
import * as monaco from "monaco-editor";

import { defineComponent } from "@vue/runtime-core";
import { PropType } from "vue";
import { flattenDeep } from "lodash";
import Btn from "./Btn.vue";

export default defineComponent({
  name: "CodeEditor",
  components: {
    MonacoEditor,
    Btn,
  },
  props: {
    modelValue: {
      type: String,
      //required: true,
    },
    runCoolDown: {
      type: Number,
      default: 0,
    },
    running: {
      type: Boolean,
      default: false,
    },
    showRunButton: {
      type: Boolean,
      default: false,
    },
    size: {
      type: String as PropType<"sm" | "md" | "lg">,
      default: "md",
    },
    language: {
      type: String as PropType<"typescript" | "c">,
      default: "typescript",
    },
  },
  data() {
    return {
      monacoModule: null as any,
      editorInstance: null as null | monaco.editor.IStandaloneCodeEditor,
      textModel: null as null | monaco.editor.ITextModel,
      monacoOptions: {
        fontSize: 14,
        minimap: {
          scale: 2,
        },
      },
    };
  },
  methods: {
    onChange(newVal: string) {
      this.$emit("update:modelValue", newVal);
      monaco.editor.setModelMarkers(
        this.textModel as monaco.editor.ITextModel,
        "eslint",
        [
          {
            startLineNumber: 1,
            startColumn: 5,
            endLineNumber: 2,
            endColumn: 7,
            message: "Warning!",
            severity: monaco.MarkerSeverity.Error,
          },
        ]
      );
    },
    // onWillMount(monaco: any) {
    //   console.log("WILL MOUNT", monaco);
    //   this.monacoModule = monaco;
    // },
    onDidMount(event: monaco.editor.IStandaloneCodeEditor) {
      console.log("DID MOUNT", event, event.getModel());
      this.editorInstance = event;
      this.textModel = event.getModel();
    },
  },
  computed: {
    baseHeight(): number {
      switch (this.size) {
        case "sm":
          return 150;
        case "md":
          return 200;
        case "lg":
          return 480;
      }
      throw new Error("unreachable");
    },
    editorHeight(): string {
      return this.baseHeight + "px";
    },
    containerHeight(): string {
      return this.baseHeight + "px";
    },
  },
});
</script>
