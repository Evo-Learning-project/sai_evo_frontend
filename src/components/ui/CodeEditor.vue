<template>
  <div
    class="relative floating-label"
    :style="'height: ' + containerHeight + ';'"
  >
    <label class="absolute top-2 left-1.5 origin-0 fixed-label"
      ><slot></slot
    ></label>
    <div class="overflow-hidden rounded-sm">
      <MonacoEditor
        @editorDidMount="onDidMount($event)"
        @editorWillMount="onWillMount()"
        @change="onChange($event)"
        v-show="true || showEditor"
        :value="modelValue"
        theme="vs-dark"
        class="rounded-md"
        :style="'height: ' + editorHeight + ';'"
        language="typescript"
      />
    </div>
  </div>
</template>

<script lang="ts">
import MonacoEditor from "monaco-editor-vue3";

import { defineComponent } from "@vue/runtime-core";
import { PropType } from "vue";
import { flattenDeep } from "lodash";

export default defineComponent({
  name: "CodeEditor",
  components: {
    MonacoEditor,
  },
  props: {
    modelValue: {
      type: String,
      //required: true,
    },
    size: {
      type: String as PropType<"sm" | "md" | "lg">,
      default: "md",
    },
  },
  mounted() {
    //setTimeout(() => (this.showEditor = true), 3000);
  },
  data() {
    return {
      code: "const noop = () => {}",
      showEditor: false,
    };
  },
  methods: {
    onChange(newVal: string) {
      // console.log("ON CHANGE", newVal);
      this.$emit("update:modelValue", newVal);
    },
    onWillMount() {
      console.log("will mount");
    },
    onDidMount(event: any) {
      console.log("did mount", event);
      this.showEditor = true;
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
          return 300;
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
