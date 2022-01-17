<template>
  <div class="">
    <div class="flex w-full">
      <h3>{{ $t('event_editor.editor_title') }}</h3>
      <CloudSaveStatus class="ml-auto" :saving="saving"></CloudSaveStatus>
    </div>
    <EventMetaEditor v-model="proxyModelValue"></EventMetaEditor>

    <div class="my-24"></div>

    <EventTemplateEditor></EventTemplateEditor>
  </div>
  <collapsible-panel-group class="hidden"></collapsible-panel-group>
</template>

<script lang="ts">
import EventMetaEditor from '@/components/teacher/EventEditor/EventMetaEditor.vue'
import EventTemplateEditor from '@/components/teacher/EventTemplateEditor/EventTemplateEditor.vue'
import CollapsiblePanelGroup from '@/components/ui/CollapsiblePanelGroup.vue'
import CloudSaveStatus from '@/components/ui/CloudSaveStatus.vue'
import { defineComponent } from '@vue/runtime-core'
import { getDebounced } from '@/utils'

export default defineComponent({
  name: 'EventEditor',
  components: {
    EventMetaEditor,
    CollapsiblePanelGroup,
    EventTemplateEditor,
    CloudSaveStatus
  },
  props: [],
  async created () {
    // wrap update method in a debounce
    this.dispatchUpdate = getDebounced(this.dispatchUpdate)

    this.$store.commit('setLoading', true)
    await this.$store.dispatch('getEvent', {
      courseId: this.courseId,
      eventId: this.eventId
    })
    this.$store.commit('setLoading', false)
  },
  data () {
    return {
      saving: false
    }
  },
  methods: {
    async onChange (newVal: Event) {
      const stringifiedNewVal = JSON.stringify(this.proxyModelValue)
      // prevents triggering auto-save upon first entering the page
      if (
        !this.proxyModelValue ||
        stringifiedNewVal === '{}' ||
        stringifiedNewVal === JSON.stringify(newVal)
      ) {
        return
      }

      // update the in-memory object corresponding to this event
      this.$store.commit('setEvent', { eventId: this.eventId, event: newVal })

      // persist update to server
      // TODO throttle
      this.saving = true
      this.dispatchUpdate(newVal)
    },
    async dispatchUpdate (newVal: Event) {
      console.log('CALLED')
      await this.$store.dispatch('updateEvent', {
        courseId: this.courseId,
        event: newVal
      })
      this.saving = false
    }
  },
  computed: {
    courseId (): string {
      return this.$route.params.courseId as string
    },
    eventId (): string {
      return this.$route.params.examId as string
    },
    proxyModelValue: {
      get () {
        return this.$store.getters.event(this.eventId)
      },
      async set (val: Event) {
        await this.onChange(val)
      }
    }
  }
})
</script>

<style></style>
