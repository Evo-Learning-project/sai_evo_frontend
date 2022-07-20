<template>
  <div class="">
    <transition name="fade-delay">
      <div
        style="z-index: 49"
        v-show="!loading && examLocked"
        class="fixed top-0 left-0 flex items-center justify-center w-full h-full "
      >
        <div
          style="width: 100% !important; height: 100% !important"
          class="absolute z-10 w-full h-full transition-none bg-gray-900 opacity-50 "
        ></div>
        <div
          class="fixed z-50 w-full px-6 py-4 text-center transform -translate-x-1/2 -translate-y-1/2 rounded  md:w-max top-1/2 left-1/2 md:ml-14"
        >
          <p
            style="font-size: 10rem"
            class="opacity-50 material-icons-outlined text-lightText"
          >
            {{ examLocked ? "lock" : "lock_open" }}
          </p>
          <h3
            :class="[!examLocked ? 'opacity-0' : 'opacity-100']"
            class="pt-1 mx-auto rounded-t  md:bg-transparent text-lightText md:px-2"
            style="text-shadow: 0.5px 0.5px 4px rgb(0 0 0 / 50%)"
          >
            {{ $t("event_editor.currently_locked_by") }}
            {{ modelValue?.locked_by?.full_name }}
          </h3>
          <p
            :class="[!examLocked ? 'opacity-0' : 'opacity-100']"
            class="pb-1 rounded-b  md:bg-transparent text-lightText md:mx-2 md:px-2"
            style="text-shadow: 0.5px 0.5px 4px rgb(0 0 0 / 50%)"
          >
            {{ $t("event_editor.lock_stand_by") }}
          </p>
        </div>
      </div>
    </transition>
    <div class="flex w-full">
      <h2 class="mb-0">{{ $t("event_editor.editor_title") }}</h2>
      <CloudSaveStatus
        class="ml-auto"
        :saving="saving"
        :hadError="savingError"
      ></CloudSaveStatus>
    </div>
    <div class="flex flex-col">
      <EventMetaEditor
        :modelValue="modelValue"
        class="mb-12"
        @updateEvent="onChange($event.field, $event.value)"
      ></EventMetaEditor>

      <div class="flex flex-col mb-12">
        <EventTemplateEditor
          class=""
          :randomRuleOrder="modelValue.randomize_rule_order"
          v-if="!loading"
          :modelValue="modelValueTemplate"
          :showEditWarning="
            modelValue.state === EventState.OPEN ||
            modelValue.state === EventState.RESTRICTED
          "
          @templateChanged="invalidateExamples()"
          @saving="saving = true"
          @doneSaving="saving = false"
          ><template #afterRules>
            <h4>{{ $t("event_editor.max_grade") }}</h4>
            <div class="ml-2">
              <span v-if="!editingMaxScore" class="text-lg text-muted">{{
                computedMaxScore
              }}</span>
              <NumberInput v-else v-model="dirtyMaxScore">{{
                $t("event_editor.max_grade")
              }}</NumberInput>
            </div>
            <Btn
              v-if="!editingMaxScore"
              :variant="'icon'"
              :outline="true"
              class="hidden ml-2"
              @click="onEditMaxScore"
              ><span class="material-icons">edit</span></Btn
            >
            <div v-else>
              <Btn
                :variant="'icon'"
                :outline="true"
                class="ml-2"
                @click="onSaveMaxScore"
                ><span class="material-icons">done</span></Btn
              >
              <Btn
                :variant="'icon'"
                :outline="true"
                class=""
                @click="editingMaxScore = false"
                ><span class="material-icons">close</span></Btn
              >
            </div></template
          ></EventTemplateEditor
        >
        <Toggle
          class="mt-3 md:ml-auto md:-mt-7.5"
          :label-on-left="true"
          :modelValue="modelValue.randomize_rule_order"
          @update:modelValue="onChange('randomize_rule_order', $event)"
        >
          {{ $t("event_template_editor.randomize_rule_order") }}
        </Toggle>
        <div class="mt-8 banner banner-light" v-if="usedRandomization">
          <span
            class="material-icons-two-tone"
            style="
              filter: invert(80%) sepia(67%) saturate(1803%) hue-rotate(348deg)
                brightness(80%) contrast(96%);
            "
          >
            tips_and_updates
          </span>
          <div
            class="flex flex-col w-full space-y-2  md:items-center md:space-y-0 md:flex-row"
          >
            <p class="mr-2 lg:mr-0">
              {{ $t("event_editor.tip_you_used_randomization") }}
            </p>
            <Btn
              class="w-1/2 -mr-3 lg:-mr-2 lg:w-max md:ml-auto"
              :outline="true"
              @click="getInstances"
              :disabled="loadingExamples"
            >
              {{
                loadingExamples
                  ? $t("event_editor.generating_examples")
                  : $t("event_editor.generate_examples")
              }}
            </Btn>
          </div>
          <EventInstancesPreview
            @hide="showInstancesDialog = false"
            :show="showInstancesDialog"
            :instances="instances"
          ></EventInstancesPreview>
        </div>
      </div>
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
import CloudSaveStatus from "@/components/ui/CloudSaveStatus.vue";
import { defineComponent, provide } from "@vue/runtime-core";
import {
  Event,
  EventState,
  EventTemplate,
  EventTemplateRuleType,
  Exercise,
} from "@/models";
import {
  courseIdMixin,
  eventIdMixin,
  loadingMixin,
  savingMixin,
} from "@/mixins";
import Dialog from "@/components/ui/Dialog.vue";
import { getTranslatedString as _ } from "@/i18n";

import { createNamespacedHelpers, mapActions, mapState } from "vuex";
import { AutoSaveManager } from "@/autoSave";
import {
  EVENT_AUTO_SAVE_DEBOUNCED_FIELDS,
  EVENT_AUTO_SAVE_DEBOUNCE_TIME_MS,
} from "@/const";

import { subscribeToEventChanges } from "@/ws/modelSubscription";
import Toggle from "@/components/ui/Toggle.vue";
import Btn from "@/components/ui/Btn.vue";
import { getEventInstances } from "@/api/events";
import EventInstancesPreview from "./EventInstancesPreview.vue";
const { mapGetters, mapMutations } = createNamespacedHelpers("teacher");
import useVuelidate from "@vuelidate/core";
import { eventValidation } from "@/validation/models";
import NumberInput from "@/components/ui/NumberInput.vue";
import { roundToTwoDecimals } from "@/utils";

export default defineComponent({
  setup() {
    const v = useVuelidate();
    provide("v$", v);
    return { v$: v };
  },
  validations() {
    return {
      modelValue: eventValidation,
    };
  },
  name: "EventEditor",
  components: {
    EventMetaEditor,
    EventTemplateEditor,
    CloudSaveStatus,
    EventStateEditor,
    Dialog,
    Toggle,
    Btn,
    EventInstancesPreview,
    NumberInput,
  },
  mixins: [courseIdMixin, eventIdMixin, loadingMixin, savingMixin],
  props: [],
  beforeRouteLeave() {
    document.removeEventListener("keydown", this.doSave);
    this.ws?.close();
  },
  mounted() {
    document.addEventListener("keydown", this.doSave);
  },
  beforeDestroy() {
    document.removeEventListener("keydown", this.doSave);
  },
  async created() {
    await this.withLoading(async () => {
      await this.getTags({ courseId: this.courseId });
      await this.getEvent({
        courseId: this.courseId,
        eventId: this.eventId,
      });
      //? is it necessary?
      await this.getExercises({ courseId: this.courseId });
    }, this.setPageWideError);

    this.ws = await subscribeToEventChanges(this.eventId);

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
        this.savingError = false;
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
      instances: [] as Exercise[][],
      showInstancesDialog: false,
      loadingExamples: false,
      editingMaxScore: false,
      dirtyMaxScore: null as null | number,
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
    invalidateExamples() {
      this.instances = [];
    },
    onEditMaxScore() {
      this.dirtyMaxScore = this.modelValue.max_score ?? 0;
      this.editingMaxScore = true;
    },
    async onSaveMaxScore() {
      await this.onChange("max_score", this.dirtyMaxScore);
      this.editingMaxScore = false;
      // TODO implement re-setting the rules' max_score
    },
    async onChange(field: keyof Event, value: unknown) {
      if (field === "randomize_rule_order") {
        this.invalidateExamples();
      }
      await this.autoSaveManager?.onChange({ field, value });
    },
    async getInstances() {
      if (this.instances.length === 0) {
        this.loadingExamples = true;
        const amount = 5; // TODO implement
        this.instances = await getEventInstances(
          this.courseId,
          this.eventId,
          amount
        );
        this.loadingExamples = false;
      }
      this.showInstancesDialog = true;
    },
    doSave(e: KeyboardEvent) {
      if (!(e.keyCode === 83 && (e.ctrlKey || e.metaKey))) {
        return;
      }
      e.preventDefault();
      if (this.autoSaveManager?.isPending()) {
        this.autoSaveManager.flush();
      } else {
        // fake save as a placebo for the user
        this.saving = true;
        this.$nextTick(() => (this.saving = false));
      }
    },
  },
  computed: {
    ...mapGetters(["event"]),
    ...mapState("shared", ["user"]),
    modelValue(): Event {
      return this.event(this.eventId);
    },
    computedMaxScore(): number {
      return roundToTwoDecimals(
        (this.modelValue.template?.rules ?? [])
          .map((r) => r.weight * r.amount)
          .reduce((a, b) => a + b, 0)
      );
    },
    modelValueTemplate(): EventTemplate {
      // return a blank object until the event has been retrieved
      return this.modelValue?.template ?? { rules: [] };
    },
    usedRandomization(): boolean {
      return (
        ((this.modelValue.randomize_rule_order ?? false) ||
          this.modelValue.template?.rules.some(
            (r) =>
              r.rule_type === EventTemplateRuleType.TAG_BASED ||
              (r.rule_type === EventTemplateRuleType.ID_BASED &&
                (r.exercises?.length ?? 0) > 1)
          )) ??
        false
      );
    },
    examLocked(): boolean {
      return (
        !!this.modelValue.locked_by &&
        this.modelValue.locked_by.id != this.user.id
      );
    },
  },
});
</script>

<style></style>
