<template>
  <event-template-editor></event-template-editor>
  <div class="hidden">
    <!-- !!! -->
    <!-- <template v-slot:header> -->
    <!-- TODO different title depending on event type -->
    <h3>{{ $t('event_editor.editor_title') }}</h3>
    <!-- </template> -->

    <!-- <template v-slot:body> -->
    <event-meta-editor v-model="proxyModelValue"></event-meta-editor>
    <!-- </template> -->
  </div>
  <collapsible-panel-group class="hidden"></collapsible-panel-group>
</template>

<script lang="ts">
import EventMetaEditor from '@/components/teacher/EventEditor/EventMetaEditor.vue'
import EventTemplateEditor from '@/components/teacher/EventTemplateEditor/EventTemplateEditor.vue'
import CollapsiblePanelGroup from '@/components/ui/CollapsiblePanelGroup.vue'
// import Card from '@/components/ui/Card.vue'
import { defineComponent } from '@vue/runtime-core'

export default defineComponent({
  name: 'EventEditor',
  components: {
    EventMetaEditor,
    CollapsiblePanelGroup,
    EventTemplateEditor
    //Card
  },
  props: ['modelValue'],
  computed: {
    proxyModelValue: {
      get () {
        return this.modelValue
      },
      set (val: Event) {
        this.$emit('update:modelValue', val)
      }
    }
  }
})
</script>

<style></style>
