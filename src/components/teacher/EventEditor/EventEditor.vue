<template>
  <div class="">
    <h3>{{ $t('event_editor.editor_title') }}</h3>
    <event-meta-editor v-model="event"></event-meta-editor>

    <div class="my-24"></div>

    <event-template-editor></event-template-editor>
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
    eventId (): string {
      return this.$route.params.examId as string
    },
    event (): Event {
      return this.$store.getters.event(this.eventId)
    },
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
