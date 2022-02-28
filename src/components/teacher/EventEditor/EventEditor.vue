<template>
  <div class="">
    <div class="flex w-full">
      <h3>{{ $t("event_editor.editor_title") }}</h3>
      <CloudSaveStatus class="ml-auto" :saving="saving"></CloudSaveStatus>
    </div>
    <div class="flex flex-col space-y-12">
      <EventMetaEditor
        :modelValue="proxyModelValue"
        @updateEvent="onChange($event.field, $event.value)"
      ></EventMetaEditor>

      <EventTemplateEditor
        :modelValue="proxyModelValueTemplate"
      ></EventTemplateEditor>

      <EventStateEditor
        class="pb-10"
        :modelValue="proxyModelValue"
        @update:modelValue="onChange('state', $event)"
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
        {{ $t("event_editor.editing_open_event_title") }}
      </template>
      <template v-slot:body>
        {{ $t("event_editor.editing_open_event_body") }}
      </template>
    </Dialog>
  </div>
  <!-- <collapsible-panel-group class="hidden"></collapsible-panel-group> -->
</template>

<script lang="ts">
import EventMetaEditor from "@/components/teacher/EventEditor/EventMetaEditor.vue";
import EventStateEditor from "@/components/teacher/EventEditor/EventStateEditor.vue";
import EventTemplateEditor from "@/components/teacher/EventTemplateEditor/EventTemplateEditor.vue";
//import CollapsiblePanelGroup from '@/components/ui/CollapsiblePanelGroup.vue'
import CloudSaveStatus from "@/components/ui/CloudSaveStatus.vue";
import { defineComponent } from "@vue/runtime-core";
import { getDebouncedForEditor } from "@/utils";
import { Event, EventState, EventTemplate } from "@/models";
import {
  courseIdMixin,
  eventIdMixin,
  loadingMixin,
  savingMixin,
} from "@/mixins";
import Dialog from "@/components/ui/Dialog.vue";
import { getTranslatedString as _ } from "@/i18n";

import { createNamespacedHelpers, mapActions } from "vuex";
import { AutoSaveManager } from "@/autoSave";
import {
  EVENT_AUTO_SAVE_DEBOUNCED_FIELDS,
  EVENT_AUTO_SAVE_DEBOUNCE_TIME_MS,
} from "@/const";
const { mapGetters, mapMutations } = createNamespacedHelpers("teacher");

export default defineComponent({
  name: "EventEditor",
  components: {
    EventMetaEditor,
    //CollapsiblePanelGroup,
    EventTemplateEditor,
    CloudSaveStatus,
    EventStateEditor,
    Dialog,
  },
  mixins: [courseIdMixin, eventIdMixin, loadingMixin, savingMixin],
  props: [],
  async created() {
    await this.withLoading(async () => {
      await this.getTags(this.courseId);
      await this.getEvent({
        courseId: this.courseId,
        eventId: this.eventId,
      });
      //? is it necessary?
      await this.getExercises({ courseId: this.courseId });
    }, this.setPageWideError);

    this.autoSaveManager = new AutoSaveManager<Event>(
      this.proxyModelValue,
      async (changes) => {
        await this.partialUpdateEvent({
          courseId: this.courseId,
          eventId: this.proxyModelValue.id,
          changes,
        });
        if (changes.state === EventState.PLANNED) {
          this.$store.commit("shared/showSuccessFeedback");
        }
      },
      (changes) => {
        this.saving = true;
        this.$store.state.shared.localLoading = true;
        this.setEvent({
          eventId: this.eventId,
          payload: { ...this.proxyModelValue, ...changes },
        });
      },
      EVENT_AUTO_SAVE_DEBOUNCED_FIELDS,
      EVENT_AUTO_SAVE_DEBOUNCE_TIME_MS,
      undefined,
      () => (this.savingError = true),
      () => {
        this.$store.state.shared.localLoading = false;
        this.saving = false;
      }
    );

    if (this.proxyModelValue.state == EventState.OPEN) {
      this.showConfirmationDialog = true;
    }
  },
  data() {
    return {
      saving: false,
      savingError: false,
      stateSaving: false,
      showConfirmationDialog: false,
      autoSaveManager: null as AutoSaveManager<Event> | null,
    };
  },
  methods: {
    ...mapActions("shared", ["getTags"]),
    ...mapActions("teacher", [
      "getEvent",
      "getExercises",
      "partialUpdateEvent",
      "updateEvent",
    ]),
    ...mapMutations(["setEvent"]),
    async onChange(field: keyof Event, value: unknown) {
      await this.autoSaveManager?.onChange({ field, value });
    },
  },
  computed: {
    ...mapGetters(["event"]),
    proxyModelValue: {
      get(): Event {
        return this.event(this.eventId);
      },
      async set(val: Event) {
        // await this.onChange(val);
      },
    },
    proxyModelValueTemplate(): EventTemplate {
      // return a blank object until the event has been retrieved
      return this.proxyModelValue?.template ?? { rules: [] };
    },
  },
});
</script>

<style></style>
