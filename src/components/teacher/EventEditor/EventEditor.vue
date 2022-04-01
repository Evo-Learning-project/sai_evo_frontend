<template>
  <div class="">
    <transition name="fade-delay">
      <div
        v-show="!loading && examLocked"
        class="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full"
      >
        <div
          style="width: 100% !important; height: 100% !important"
          class="absolute z-10 w-full h-full transition-none bg-gray-900 opacity-50"
        ></div>
        <div
          class="fixed top-1/2 left-1/2 md:ml-14 transform -translate-x-1/2 -translate-y-1/2 text-center"
        >
          <p
            style="font-size: 10rem"
            class="material-icons-outlined opacity-50 drop-shadow-2xl filter"
          >
            {{ examLocked ? "lock" : "lock_open" }}
          </p>
          <h3
            :class="[!examLocked ? 'opacity-0' : 'opacity-80']"
            class=""
            style="text-shadow: 0.5px 0.5px 4px rgb(0 0 0 / 20%)"
          >
            {{ $t("event_editor.currently_locked_by") }}
            {{ modelValue?.locked_by?.full_name }}
          </h3>
          <p
            :class="[!examLocked ? 'opacity-0' : '']"
            style="text-shadow: 0.5px 0.5px 4px rgb(0 0 0 / 20%)"
          >
            {{ $t("event_editor.lock_stand_by") }}
          </p>
        </div>
      </div>
    </transition>
    <div class="flex w-full">
      <h3>{{ $t("event_editor.editor_title") }}</h3>
      <CloudSaveStatus class="ml-auto" :saving="saving"></CloudSaveStatus>
    </div>
    <div class="flex flex-col space-y-12">
      <EventMetaEditor
        :modelValue="modelValue"
        @updateEvent="onChange($event.field, $event.value)"
      ></EventMetaEditor>

      <EventTemplateEditor
        v-if="!loading || modelValue.id"
        :modelValue="modelValueTemplate"
        :showEditWarning="
          modelValue.state === EventState.OPEN ||
          modelValue.state === EventState.RESTRICTED
        "
      ></EventTemplateEditor>

      <EventStateEditor
        class="pb-10"
        :modelValue="modelValue"
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
import { Event, EventState, EventTemplate } from "@/models";
import { courseIdMixin, eventIdMixin, loadingMixin, savingMixin } from "@/mixins";
import Dialog from "@/components/ui/Dialog.vue";
import { getTranslatedString as _ } from "@/i18n";

import { createNamespacedHelpers, mapActions, mapState } from "vuex";
import { AutoSaveManager } from "@/autoSave";
import {
  EVENT_AUTO_SAVE_DEBOUNCED_FIELDS,
  EVENT_AUTO_SAVE_DEBOUNCE_TIME_MS,
} from "@/const";

import { subscribeToEventChanges } from "@/ws/modelSubscription";
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
  beforeRouteLeave() {
    this.ws?.close();
  },
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

    this.ws = subscribeToEventChanges(this.eventId);

    this.autoSaveManager = new AutoSaveManager<Event>(
      this.modelValue,
      async (changes) => {
        await this.partialUpdateEvent({
          courseId: this.courseId,
          eventId: this.modelValue.id,
          changes,
        });
        if (changes.state === EventState.PLANNED) {
          this.$store.commit("shared/showSuccessFeedback");
        }
      },
      (changes) => {
        this.saving = true;
        //this.$store.state.shared.localLoading = true;
        this.setEvent({
          eventId: this.eventId,
          payload: { ...this.modelValue, ...changes },
        });
      },
      EVENT_AUTO_SAVE_DEBOUNCED_FIELDS,
      EVENT_AUTO_SAVE_DEBOUNCE_TIME_MS,
      undefined,
      () => (this.savingError = true),
      () => {
        //this.$store.state.shared.localLoading = false;
        this.saving = false;
      }
    );

    if (this.modelValue.state == EventState.OPEN) {
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
      ws: null as WebSocket | null,
      EventState,
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
    ...mapState("shared", ["user"]),
    modelValue(): Event {
      return this.event(this.eventId);
    },
    modelValueTemplate(): EventTemplate {
      // return a blank object until the event has been retrieved
      return this.modelValue?.template ?? { rules: [] };
    },
    examLocked(): boolean {
      return !!this.modelValue.locked_by && this.modelValue.locked_by.id != this.user.id;
    },
  },
});
</script>

<style></style>
