<template>
  <div
    class="overflow-hidden rounded-sm"
    :style="'height: ' + editorHeight + ';'"
  >
    <MonacoEditor
      @editorDidMount="onDidMount($event)"
      @editorWillMount="onWillMount()"
      @change="onChange($event)"
      v-show="true || showEditor"
      theme="vs-dark"
      class="rounded-md"
      :style="'height: ' + editorHeight + ';'"
      language="typescript"
    />
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
      console.log("ON CHANGE", newVal);
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
    editorHeight(): string {
      switch (this.size) {
        case "sm":
          return "100px";
        case "md":
          return "200px";
        case "lg":
          return "300px";
      }
      throw new Error("unreachable");
    },
  },
});
</script>
