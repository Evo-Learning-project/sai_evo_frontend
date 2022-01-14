<template>
  <div class="relative z-10 rounded-t-sm bg-light">
    <div class="z-10 ql-editor-container">
      <quill-editor
        :options="editorOptions"
        :value="modelValue"
        @change="onEditorChange($event)"
      />
    </div>
    <label
      class="absolute -z-1 top-2 left-3 origin-0"
      :class="{ 'fixed-label': modelValue?.length > 0 }"
      ><slot></slot
    ></label>
  </div>
  <!--
            v-model:value="state.content"
      :options="state.editorOption"
      :disabled="state.disabled"
      @blur="onEditorBlur($event)"
      @focus="onEditorFocus($event)"
      @ready="onEditorReady($event)"
      @change="onEditorChange($event)"
    -->
</template>

<script lang="ts">
import { defineComponent } from '@vue/runtime-core'
import { quillEditor } from 'vue3-quill'
export default defineComponent({
  name: 'TextEditor',
  props: ['modelValue'],
  components: {
    quillEditor
  },
  data () {
    return {
      content: '',
      editorOptions: {
        theme: 'snow',
        placeholder: '',
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            ['code-block'],
            //[{ header: 1 }, { header: 2 }],
            [{ list: 'ordered' }, { list: 'bullet' }],
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
              'image'
              //'video'
            ]
          ]
        }
      }
    }
  },
  methods: {
    onEditorChange ({ quill, html, text }: unknown) {
      //console.log('editor change!', quill, html, text)
      this.content = html
      this.$emit('update:modelValue', html)
    }
  }
})
</script>

<style>
.ql-container {
  font-size: inherit !important;
}

.ql-editor-container:focus-within {
  border-bottom: 2px solid rgb(72, 91, 202) !important;
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
}
.ql-container.ql-snow {
  border: 0 !important; /*1px solid #ccc;*/
}

.ql-container.ql-snow,
.ql-toolbar.ql-snow {
  /* background-color: rgb(243, 244, 246); */
}

.ql-container.ql-snow:focus-within {
  border: 1px solid rgb(72, 91, 202);
}
.ql-toolbar.ql-snow {
  order: 12 !important;
  border: 0 !important; /* 1px solid #ccc !important; */
  box-sizing: border-box;
  font-family: 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif;
  padding: 8px;
}
</style>
