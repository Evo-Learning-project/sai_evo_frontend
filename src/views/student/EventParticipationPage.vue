<template>
  <div class="flex flex-col flex-grow h-full">
    <teleport v-if="mounted" to="#main-student-header-right">
      <CloudSaveStatus
        :saving="saving"
        :hadError="savingError"
      ></CloudSaveStatus
    ></teleport>

    <div v-if="firstLoading">
      <skeleton-card :borderLess="true"></skeleton-card>
      <skeleton-card :borderLess="true"></skeleton-card>
      <skeleton-card :borderLess="true"></skeleton-card>
    </div>
    <div
      :class="{
        'flex-grow': oneExerciseAtATime,
        'mb-10 pb-10 border-b':
          index !== proxyModelValue.slots.length - 1 && !oneExerciseAtATime,
        'pb-0 border-b-0': index === proxyModelValue.slots.length - 1,
      }"
      class=""
      v-for="(slot, index) in proxyModelValue.slots"
      :key="'p-' + proxyModelValue.id + '-s-' + slot.id"
    >
      <h4>
        {{ $t("event_participation_page.exercise") }}
        {{ slot.slot_number + 1 }}
        <span v-if="oneExerciseAtATime"
          >{{ $t("event_participation_page.of") }}
          {{ proxyModelValue.last_slot_number + 1 }}
        </span>
      </h4>
      <AbstractEventParticipationSlot
        :modelValue="slot"
        @updateSelectedChoices="onChange(slot, 'selected_choices', $event)"
        @updateAnswerText="onChange(slot, 'answer_text', $event)"
        :allowEditSubmission="true"
        :saving="saving"
      ></AbstractEventParticipationSlot>
    </div>
    <div class="flex items-center w-full mt-8">
      <Btn
        class=""
        @click="onGoBack"
        v-if="goingBackAllowed"
        :disabled="!canGoBack"
        :loading="loading"
      >
        <span class="material-icons-outlined mt-0.5 mr-0.5 text-base">
          chevron_left
        </span>
        {{ $t("event_participation_page.previous_exercise") }}</Btn
      >
      <Btn
        class="ml-auto"
        @click="goingBackAllowed ? onGoForward() : confirmGoForward()"
        v-if="canGoForward"
        :loading="loading"
        >{{ $t("event_participation_page.next_exercise") }}
        <span class="material-icons-outlined mt-0.5 ml-0.5 text-base">
          chevron_right
        </span></Btn
      >
      <Btn
        class="ml-auto"
        @click="confirmTurnIn"
        v-else-if="canTurnIn"
        :variant="'success'"
      >
        <span class="material-icons-outlined mt-0.5 text-base mr-1">
          check </span
        >{{ $t("event_participation_page.turn_in") }}
      </Btn>
    </div>
    <Dialog
      :showDialog="showConfirmDialog"
      :yesText="dialogData.yesText"
      :noText="$t('dialog.default_cancel_text')"
      @yes="dialogData.onYes"
      @no="showConfirmDialog = false"
    >
      <template v-slot:title>
        {{ dialogData.title }}
      </template>
      <template v-slot:body>
        {{ dialogData.text }}
      </template>
    </Dialog>
  </div>
</template>

<script lang="ts">
import AbstractEventParticipationSlot from "@/components/shared/AbstractEventParticipationSlot.vue";
import Btn from "@/components/ui/Btn.vue";
import CloudSaveStatus from "@/components/ui/CloudSaveStatus.vue";
import Dialog from "@/components/ui/Dialog.vue";
import {
  courseIdMixin,
  eventIdMixin,
  loadingMixin,
  savingMixin,
} from "@/mixins";
import {
  EventParticipation,
  EventParticipationSlot,
  EventParticipationState,
  EventType,
} from "@/models";
import { getDebouncedForStudentText } from "@/utils";
import { defineComponent } from "@vue/runtime-core";
import { getTranslatedString as _ } from "@/i18n";
import { DialogData } from "@/interfaces";
import SkeletonCard from "@/components/ui/SkeletonCard.vue";

import { createNamespacedHelpers, mapState } from "vuex";
import { AutoSaveManager } from "@/autoSave";
import {
  EVENT_PARTICIPATION_SLOT_DEBOUNCED_FIELDS,
  EVENT_PARTICIPATION_SLOT_DEBOUNCE_TIME_MS,
} from "@/const";
const { mapActions, mapMutations } = createNamespacedHelpers("student");

export default defineComponent({
  components: {
    AbstractEventParticipationSlot,
    CloudSaveStatus,
    Btn,
    Dialog,
    SkeletonCard,
  },
  name: "EventParticipationPage",
  mixins: [courseIdMixin, eventIdMixin, savingMixin, loadingMixin],
  watch: {
    "proxyModelValue.slots"(newVal: EventParticipationSlot[]) {
      console.log("watcher", newVal);
      newVal.forEach((s) => this.instantiateSlotAutoSaveManager(s));
    },
  },
  async created() {
    this.dispatchAnswerTextUpdate = getDebouncedForStudentText(
      this.dispatchAnswerTextUpdate
    );

    await this.withFirstLoading(
      async () =>
        await this.participateInEvent({
          courseId: this.courseId,
          eventId: this.eventId,
        })
    );

    // already turned in, redirect to submission review page
    if (this.proxyModelValue.state === EventParticipationState.TURNED_IN) {
      this.$router.push({
        name:
          this.proxyModelValue.event.event_type ===
          EventType.SELF_SERVICE_PRACTICE
            ? "PracticeSummaryPage"
            : "SubmissionReviewPage",
        params: {
          participationId: this.currentEventParticipation.id,
        },
      });
    }
  },
  mounted() {
    this.mounted = true; // prevent issues with teleported component
  },
  data() {
    return {
      slotAutoSaveManagers: {} as Record<
        string,
        AutoSaveManager<EventParticipationSlot>
      >,
      saving: false,
      savingError: false,
      mounted: false,
      showConfirmDialog: false,
      dialogData: {
        title: "",
        text: "",
        yesText: "",
        onYes: () => null,
      } as DialogData,
    };
  },
  methods: {
    ...mapActions([
      "participateInEvent",
      "moveEventParticipationCurrentSlotCursorForward",
      "moveEventParticipationCurrentSlotCursorBack",
      "partialUpdateEventParticipationSlot",
      "partialUpdateEventParticipation",
    ]),
    ...mapMutations(["setCurrentEventParticipationSlot"]),
    async onGoForward() {
      this.showConfirmDialog = false;

      // assumption: going forward is only allowed when showing one slot at a time
      const currentSlot = this.proxyModelValue.slots[0];
      await this.withLoading(async () => {
        // flush queued changes before moving on to next slot
        await this.slotAutoSaveManagers[currentSlot.id].flush();
        await this.moveEventParticipationCurrentSlotCursorForward({
          courseId: this.courseId,
        });
      });
    },
    async onGoBack() {
      // assumption: going back is only allowed when showing one slot at a time
      const currentSlot = this.proxyModelValue.slots[0];
      await this.withLoading(async () => {
        // flush queued changes before moving on to next slot
        await this.slotAutoSaveManagers[currentSlot.id].flush();
        await this.moveEventParticipationCurrentSlotCursorBack({
          courseId: this.courseId,
        });
      });
    },
    async onTurnIn() {
      this.showConfirmDialog = false;
      await this.withLoading(async () => {
        // flush any pending changes to any slot(s)
        this.proxyModelValue.slots.forEach(async (s) => {
          await this.slotAutoSaveManagers[s.id].flush();
        });
        await this.partialUpdateEventParticipation({
          courseId: this.courseId,
          changes: {
            state: EventParticipationState.TURNED_IN,
          },
        });
      });

      this.$router.push({
        name:
          this.proxyModelValue.event.event_type ===
          EventType.SELF_SERVICE_PRACTICE
            ? "PracticeSummaryPage"
            : "SubmissionReviewPage",
        params: {
          participationId: this.currentEventParticipation.id,
          showSubmissionConfirmationMessage: 1, // should be `true`, but TS complains about type
        },
      });
      this.$store.commit("shared/showSuccessFeedback");
    },
    confirmGoForward() {
      this.dialogData = {
        title: _("event_participation_page.next_dialog_title"),
        text: _("event_participation_page.next_dialog_text"),
        yesText: _("event_participation_page.next_dialog_confirm_button"),
        onYes: this.onGoForward,
      };
      this.showConfirmDialog = true;
    },
    confirmTurnIn() {
      this.dialogData = {
        title: _("event_participation_page.turn_in_dialog_title"),
        text: _("event_participation_page.turn_in_dialog_text"),
        yesText: _("event_participation_page.turn_in_confirm_button"),
        onYes: this.onTurnIn,
      };
      this.showConfirmDialog = true;
    },
    async onChange(
      slot: EventParticipationSlot,
      field: keyof EventParticipationSlot,
      value: unknown
    ) {
      await this.slotAutoSaveManagers[slot.id].onChange({ field, value });
    },
    instantiateSlotAutoSaveManager(slot: EventParticipationSlot) {
      this.slotAutoSaveManagers[slot.id] =
        new AutoSaveManager<EventParticipationSlot>(
          slot,
          async (changes) =>
            await this.partialUpdateEventParticipationSlot({
              courseId: this.courseId,
              eventId: this.eventId,
              participationId: this.proxyModelValue.id,
              slotId: slot.id,
              changes,
            }),
          (changes, reverting) => {
            if (!reverting) {
              this.saving = true;
              this.savingError = false;
              this.$store.state.shared.localLoading = true;
            }
            this.setCurrentEventParticipationSlot({ ...slot, ...changes });
          },
          EVENT_PARTICIPATION_SLOT_DEBOUNCED_FIELDS,
          EVENT_PARTICIPATION_SLOT_DEBOUNCE_TIME_MS,
          undefined,
          () => (this.savingError = true),
          () => {
            this.$store.state.shared.localLoading = false;
            this.saving = false;
          },
          true
        );
    },

    // TODO get rid of these methods
    async onUpdateChoices(slot: EventParticipationSlot, newVal: string[]) {
      this.saving = true;
      this.savingError = false;
      try {
        await this.partialUpdateEventParticipationSlot({
          courseId: this.courseId,
          eventId: this.eventId,
          participationId: this.proxyModelValue.id,
          slotId: slot.id,
          changes: { selected_choices: newVal },
        });
      } catch {
        this.savingError = true;
      } finally {
        this.saving = false;
      }
    },
    async onUpdateAnswerText(slot: EventParticipationSlot, newVal: string) {
      this.saving = true;
      this.savingError = false;
      // update in-memory value
      slot.answer_text = newVal;
      try {
        await this.dispatchAnswerTextUpdate(slot, newVal);
      } catch {
        this.savingError = true;
      }
      // finally {
      //   this.saving = false
      // }
    },
    async dispatchAnswerTextUpdate(slot: EventParticipationSlot, val: string) {
      await this.partialUpdateEventParticipationSlot({
        courseId: this.courseId,
        eventId: this.eventId,
        participationId: this.proxyModelValue.id,
        slotId: slot.id,
        changes: { answer_text: val },
        mutate: false,
      });
      this.saving = false;
    },
  },
  computed: {
    ...mapState("student", ["currentEventParticipation"]),
    ...mapState("shared", ["loading"]),
    proxyModelValue: {
      get(): EventParticipation {
        return this.currentEventParticipation ?? {};
      },
      async set(val: EventParticipation) {
        // await this.onChange(val);
      },
    },
    oneExerciseAtATime(): boolean {
      return (this.proxyModelValue.event?.exercises_shown_at_a_time ?? 0) === 1;
    },
    canGoForward(): boolean {
      return (
        this.oneExerciseAtATime &&
        (this.proxyModelValue.slots?.length ?? 0) > 0 &&
        !this.proxyModelValue.slots[0].is_last
      );
    },
    canGoBack(): boolean {
      return (
        this.oneExerciseAtATime &&
        (this.proxyModelValue.slots?.length ?? 0) > 0 &&
        !this.proxyModelValue.slots[0].is_first
      );
    },
    canTurnIn(): boolean {
      return (
        !this.firstLoading &&
        (!this.oneExerciseAtATime ||
          ((this.proxyModelValue.slots?.length ?? 0) > 0 &&
            (this.proxyModelValue.slots[0].is_last ?? false))) &&
        !this.turnedIn
      );
    },
    goingBackAllowed(): boolean {
      return (
        this.oneExerciseAtATime &&
        (this.proxyModelValue.event?.allow_going_back ?? false)
      );
    },
  },
});
</script>

<style></style>
