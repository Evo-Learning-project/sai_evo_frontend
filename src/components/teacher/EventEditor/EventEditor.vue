<template>
  <div class="">
    <div class="flex w-full">
      <h3>{{ $t('event_editor.editor_title') }}</h3>
      <CloudSaveStatus class="ml-auto" :saving="saving"></CloudSaveStatus>
    </div>
    <div class="flex flex-col space-y-12">
      <EventMetaEditor v-model="proxyModelValue"></EventMetaEditor>

      <EventTemplateEditor
        :modelValue="proxyModelValueTemplate"
      ></EventTemplateEditor>

      <EventStateEditor
        class="pb-10"
        :modelValue="proxyModelValue"
        @update:modelValue="onStateUpdate($event)"
        :saving="stateSaving"
      ></EventStateEditor>
    </div>

    <Dialog
      :yesText="$t('misc.edit')"
      :noText="$t('dialog.default_cancel_text')"
      :showDialog="showConfirmationDialog"
      :warning="true"
      @yes="showConfirmationDialog = false"
      @no="$router.push({ name: 'CourseExams', params: { courseId } })"
    >
      <template v-slot:title>
        {{ $t('event_editor.editing_open_event_title') }}
      </template>
      <template v-slot:body>
        {{ $t('event_editor.editing_open_event_body') }}
      </template>
    </Dialog>
  </div>
  <!-- <collapsible-panel-group class="hidden"></collapsible-panel-group> -->
</template>

<script lang="ts">
import EventMetaEditor from '@/components/teacher/EventEditor/EventMetaEditor.vue'
import EventStateEditor from '@/components/teacher/EventEditor/EventStateEditor.vue'
import EventTemplateEditor from '@/components/teacher/EventTemplateEditor/EventTemplateEditor.vue'
//import CollapsiblePanelGroup from '@/components/ui/CollapsiblePanelGroup.vue'
import CloudSaveStatus from '@/components/ui/CloudSaveStatus.vue'
import { defineComponent } from '@vue/runtime-core'
import { getDebouncedForEditor } from '@/utils'
import { Event, EventState } from '@/models'
import {
  courseIdMixin,
  eventIdMixin,
  loadingMixin,
  savingMixin
} from '@/mixins'
import Dialog from '@/components/ui/Dialog.vue'
import { getTranslatedString as _ } from '@/i18n'

import { createNamespacedHelpers } from 'vuex'
const {
  mapState,
  mapGetters,
  mapActions,
  mapMutations
} = createNamespacedHelpers('teacher')

export default defineComponent({
  name: 'EventEditor',
  components: {
    EventMetaEditor,
    //CollapsiblePanelGroup,
    EventTemplateEditor,
    CloudSaveStatus,
    EventStateEditor,
    Dialog
  },
  mixins: [courseIdMixin, eventIdMixin, loadingMixin, savingMixin],
  props: [],
  async created () {
    // wrap update method in a debounce
    this.dispatchUpdate = getDebouncedForEditor(this.dispatchUpdate)

    await this.withLoading(async () => {
      await this.getTags(this.courseId)
      await this.getEvent({
        courseId: this.courseId,
        eventId: this.eventId
      })
      //? is it necessary?
      await this.getExercises({ courseId: this.courseId })
    })

    if (this.proxyModelValue.state == EventState.OPEN) {
      this.showConfirmationDialog = true
    }
  },
  data () {
    return {
      saving: false,
      stateSaving: false,
      showConfirmationDialog: false
    }
  },
  methods: {
    ...mapActions([
      'getTags',
      'getEvent',
      'getExercises',
      'partialUpdateEvent',
      'updateEvent'
    ]),
    ...mapMutations(['setEvent']),
    async onStateUpdate (newVal: EventState) {
      this.stateSaving = true
      this.setEvent({
        eventId: this.eventId,
        event: { ...this.proxyModelValue, state: newVal }
      })

      await this.partialUpdateEvent({
        courseId: this.courseId,
        eventId: this.proxyModelValue.id,
        changes: { state: newVal }
      })
      this.stateSaving = false
      if (newVal === EventState.PLANNED) {
        this.$store.commit('shared/showSuccessFeedback')
      }
    },
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
      this.setEvent({ eventId: this.eventId, event: newVal })

      // persist update to server
      this.saving = true
      this.dispatchUpdate(newVal)
    },
    async dispatchUpdate (newVal: Event) {
      await this.updateEvent({
        courseId: this.courseId,
        event: newVal
      })
      this.saving = false
    }
  },
  computed: {
    ...mapGetters(['event']),
    proxyModelValue: {
      get (): Event {
        return this.event(this.eventId)
      },
      async set (val: Event) {
        await this.onChange(val)
      }
    },
    proxyModelValueTemplate () {
      // return a blank object until the event has been retrieved
      return this.proxyModelValue?.template ?? {}
    }
  }
})
</script>

<style></style>
