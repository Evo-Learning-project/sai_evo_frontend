<template>
  <div>
    <div
      class="relative z-10 rounded-t-sm light-input bg-light"
      :class="{ 'opacity-80': disabled }"
    >
      <!-- TODO! make this just a textarea for students-->
      <div class="z-10 ql-editor-container tex2jax_ignore">
        <quill-editor
          :options="editorOptions"
          :value="modelValue"
          :disabled="disabled || internalDisabled"
          @change="onEditorChange($event)"
          @ready="onEditorReady($event)"
          v-if="!showBaseEditor"
        />
        <textarea
          class="py-3.5 px-3.5 bg-transparent rounded-t-sm outline-none"
          v-else
          rows="8"
          @input="$emit('update:modelValue', $event.target.value)"
          :value="modelValue"
        ></textarea>
      </div>
      <label
        class="absolute -z-1 top-2 left-2 origin-0 ql-floating-label"
        :class="{ 'fixed-label': modelValue?.length > 0 }"
      >
        <slot></slot>
      </label>
    </div>
    <div class="flex w-full hide-in-thumbnail">
      <p
        v-if="showBaseEditor"
        style="font-size: 12px"
        class="ml-auto text-sm text-muted"
      >
        {{ $t("misc.using_base_editor") }}
      </p>
      <Btn
        @click="toggleBaseEditor()"
        :size="'xs'"
        :class="[showBaseEditor ? 'ml-2' : 'ml-auto']"
        :variant="'primary-borderless'"
      >
        <p class="text-sm" style="font-weight: 400; font-size: 11px">
          {{
            showBaseEditor
              ? $t("misc.show_full_editor")
              : $t("misc.having_troubles_with_editor")
          }}
        </p></Btn
      >
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import { quillEditor } from "vue3-quill";
import Btn from "./Btn.vue";
export default defineComponent({
  name: "TextEditor",
  props: ["modelValue", "disabled"],
  components: {
    quillEditor,
    Btn,
  },
  mounted() {
    // prevent auto-focusing of quill editor
    this.$nextTick(() => (this.internalDisabled = false));
  },
  data() {
    return {
      showBaseEditor: false,
      instance: null as any,
      content: "",
      internalDisabled: true,
      editorOptions: {
        theme: "snow",
        placeholder: "",
        modules: {
          toolbar: [
            ["bold", "italic", "underline", "strike"],
            ["code-block"],
            //[{ header: 1 }, { header: 2 }],
            [{ list: "ordered" }, { list: "bullet" }],
            //[{ script: 'sub' }, { script: 'super' }],
            //[{ indent: '-1' }, { indent: '+1' }],
            //[{ direction: 'rtl' }],
            // [{ size: ['small', false, 'large', 'huge'] }],
            // [{ header: [1, 2, 3, 4, 5, 6, false] }],
            // [{ color: [] }, { background: [] }],
            // [{ font: [] }],
            // [{ align: [] }],
            // ['clean'],
            [
              "image",
              //'video'
            ],
          ],
        },
      },
    };
  },
  methods: {
    toggleBaseEditor() {
      this.showBaseEditor = !this.showBaseEditor;
    },
    onEditorChange({ quill, html, text }: unknown) {
      //console.log("editor change!", quill, html, text);
      this.content = html;
      this.$emit("update:modelValue", html);
    },
    onEditorReady(quill: any) {
      this.$emit("ready", quill);
      quill.on("selection-change", this.onSelectionChange);
      this.instance = quill;
    },
    onSelectionChange(event: any) {
      console.log(event);
      if (event) {
        this.$emit("selectionChange", {
          fullText: this.instance.getText(),
          text: this.instance.getText(event.index - 5, event.length + 10),
          range: event,
        });
      }
    },
  },
});
</script>

<style>
/* .ql-container {
  font-size: inherit !important;
}

.ql-editor-container:focus-within {
  border-bottom: 2px solid #303f9f !important;
}

.ql-editor-container {
  display: flex;
  flex-direction: column;
  border-bottom: 2px solid rgb(229, 231, 235) !important;
}
.ql-editor {
  z-index: 10 !important;
  box-sizing: border-box;
  line-height: 1.42;
  height: 100%;
  outline: none;
  overflow-y: auto;
  padding: 12px 15px;
  -o-tab-size: 4;
  tab-size: 4;
  -moz-tab-size: 4;
  text-align: left;
  white-space: pre-wrap;
  word-wrap: break-word;
  font-family: "Source Sans Pro", "Helvetica Neue", "Helvetica", "Arial",
    sans-serif !important;
}
.ql-container.ql-snow {
  border: 0 !important; /*1px solid #ccc;
}

.ql-container.ql-snow:focus-within {
  border: 1px solid #303f9f;
}
.ql-toolbar.ql-snow {
  order: 12 !important;
  border: 0 !important; /* 1px solid #ccc !important;
  box-sizing: border-box;
  font-family: "Source Sans Pro", "Helvetica Neue", "Helvetica", "Arial",
    sans-serif !important;
  padding: 8px;
} */
</style>
