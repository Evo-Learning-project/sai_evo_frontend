<template>
  <div class="flex flex-col">
    <div class="mb-4" v-if="event.state === EventState.RESTRICTED">
      <div class="banner banner-danger">
        <span class="text-yellow-900 material-icons-outlined">
          error_outline
        </span>
        <p>
          {{ $t("event_monitor.some_exams_still_open") }}
        </p>
      </div>
    </div>
    <div class="mb-4" v-if="!loading && resultsMode">
      <div v-if="thereArePartialAssessments" class="banner banner-danger">
        <span class="ml-px text-yellow-900 material-icons-outlined">
          pending_actions
        </span>
        <p class="">
          {{ $t("event_assessment.some_exams_require_manual_assessment") }}

          {{ $t("event_assessment.exams_awaiting_assessment_are_marked") }}
          <span
            class="text-base text-yellow-900  inline-icon material-icons-outlined"
            >pending_actions</span
          >.
        </p>
      </div>
      <div
        v-else-if="thereAreUnpublishedAssessments"
        class="banner banner-light"
      >
        <span class="ml-px material-icons-outlined text-success"> task </span>
        <p>
          {{ $t("event_assessment.ready_to_publish_1") }}
          <em>{{ $t("event_results.publish_results") }}</em
          >. {{ $t("event_assessment.ready_to_publish_2") }}
        </p>
      </div>
      <div class="banner banner-success" v-else>
        <span class="text-xl material-icons-outlined"> done </span>
        <p class="">
          {{ $t("event_assessment.all_published") }}
        </p>
      </div>
    </div>
    <div class="flex-grow">
      <DataTable
        :class="{ 'opacity-50': participationsData.length === 0 }"
        :columnDefs="participationPreviewColumns"
        :rowData="participationsData"
        :isRowSelectable="isRowSelectable"
        :getRowClass="getRowClass"
        @cellClicked="onCellClicked"
        @gridReady="gridApi = $event.api"
        @selectionChanged="onSelectionChanged"
      ></DataTable>
    </div>
    <div v-if="resultsMode" class="flex mt-8">
      <Btn
        :variant="'success'"
        @click="onPublish"
        :disabled="selectedParticipations.length == 0"
      >
        <span class="mr-1 text-base material-icons-outlined"> done </span>
        {{ $t("event_results.publish_results") }}</Btn
      >
      <CsvParticipationDownloader class="ml-auto"></CsvParticipationDownloader>
    </div>

    <div v-else-if="!loading" class="flex mt-8 space-x-2">
      <Btn
        class=""
        :variant="'danger'"
        @click="onCloseSelectedExams"
        :disabled="selectedCloseableParticipations.length === 0"
      >
        <span class="mr-1 text-base material-icons-outlined"> block </span>
        {{ $t("event_monitor.close_for_selected") }}</Btn
      >

      <Btn
        class=""
        :variant="'primary'"
        :outline="true"
        @click="onOpenSelectedExams"
        :disabled="selectedOpenableParticipations.length === 0"
      >
        <span class="mr-1 text-base material-icons-outlined"> undo </span>
        {{ $t("event_monitor.open_for_selected") }}</Btn
      >
    </div>
    <Dialog
      :warning="!resultsMode && !editingSlot"
      :large="!!editingSlot"
      :showDialog="showDialog"
      @no="dialogData.onNo?.()"
      @yes="dialogData.onYes?.()"
      :noText="dialogData.noText"
      :yesText="dialogData.yesText"
      :dismissible="!editingSlot"
      :disableOk="
        editingSlotDirty &&
        (editingSlotDirty.score == null || editingSlotDirty.score.length == 0)
      "
    >
      <template v-if="editingSlot" v-slot:title>
        {{ $t("event_assessment.assess") }}
        {{ $t("event_assessment.exercise") }}
        {{ (editingSlot?.slot_number ?? 0) + 1 }}
        {{ $t("misc.for") }}
        {{ editingFullName }}
      </template>
      <template v-else-if="dialogData.title?.length > 0" v-slot:title>{{
        dialogData.title
      }}</template>
      <template v-slot:body>
        <!-- editing an assessment slot -->
        <div class="text-darkText" v-if="editingSlot">
          <AbstractEventParticipationSlot
            :allowEditAssessment="true"
            @download="onAttachmentDownload(editingSlotDirty)"
            @openFull="
              $router.push({
                name: 'ExamParticipationFull',
                params: { participationId: editingParticipationId },
              })
            "
            v-model="editingSlotDirty"
            v-if="!localLoading && editingSlotDirty"
          ></AbstractEventParticipationSlot>
          <div v-else>
            <SkeletonCard :borderLess="true"></SkeletonCard>
            <SkeletonCard :borderLess="true"></SkeletonCard>
          </div>
        </div>
        <!-- publishing selected assessments -->
        <div v-else-if="resultsMode">
          {{ $t("event_results.publish_confirm_text") }}
        </div>

        <!-- re-opening a turned in participation-->
        <div v-else-if="!!editingParticipationId">
          {{
            $t("event_monitor.un_turn_in_text") +
            selectedParticipation?.user?.full_name +
            "?"
          }}
        </div>

        <!-- closing exam for selected participants -->
        <div v-else-if="closingExamsMode">
          <p>
            {{ $t("event_monitor.close_for_selected_text_1") }}
            <strong>{{ selectedCloseableParticipations.length }}</strong>
            {{
              selectedCloseableParticipations.length === 1
                ? $t("misc.participant")
                : $t("misc.participants")
            }}.
          </p>
          <!-- <p
            v-if="
              selectedCloseableParticipations.length <
                eventParticipations.length
            "
          >
            {{ $t('event_monitor.close_for_selected_text_2') }}
            <strong>{{
              eventParticipations.length -
                selectedCloseableParticipations.length
            }}</strong>
            {{
              eventParticipations.length -
                selectedCloseableParticipations.length ===
              1
                ? $t('misc.participant')
                : $t('misc.participants')
            }}.
          </p> -->
        </div>
        <!-- re-opening closed exams -->
        <div v-else>
          <p>
            {{ $t("event_monitor.open_for_selected_text") }}
            <strong>{{ selectedOpenableParticipations.length }}</strong>
            {{
              selectedOpenableParticipations.length === 1
                ? $t("misc.participant")
                : $t("misc.participants")
            }}.
          </p>
        </div>
      </template>
    </Dialog>
  </div>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */
import DataTable from "@/components/ui/DataTable.vue";
import { courseIdMixin, eventIdMixin, loadingMixin } from "@/mixins";
import {
  AssessmentVisibility,
  Event,
  EventParticipation,
  EventParticipationSlot,
  EventParticipationState,
  EventState,
  ParticipationAssessmentProgress,
} from "@/models";
import { defineComponent } from "@vue/runtime-core";

import { createNamespacedHelpers } from "vuex";
const { mapState, mapActions } = createNamespacedHelpers("teacher");

import { getTranslatedString as _ } from "@/i18n";
import {
  CellClickedEvent,
  ColDef,
  RowClassParams,
  RowNode,
} from "ag-grid-community";
import { icons as assessmentStateIcons } from "@/assets/assessmentStateIcons";
import { icons as participationStateIcons } from "@/assets/participationStateIcons";
import Dialog from "@/components/ui/Dialog.vue";
import AbstractEventParticipationSlot from "@/components/shared/AbstractEventParticipationSlot.vue";
import { DialogData } from "@/interfaces";
import Btn from "@/components/ui/Btn.vue";
import { downloadEventParticipationSlotAttachment } from "@/api/events";
import CsvParticipationDownloader from "@/components/teacher/CsvParticipationDownloader.vue";
import SkeletonCard from "@/components/ui/SkeletonCard.vue";

export default defineComponent({
  components: {
    DataTable,
    Dialog,
    AbstractEventParticipationSlot,
    Btn,
    CsvParticipationDownloader,
    SkeletonCard,
  },
  name: "EventParticipationsMonitor",
  props: {
    refreshData: {
      type: Boolean,
      default: true,
    },
    allowEditParticipations: {
      type: Boolean,
      default: false,
    },
  },
  mixins: [courseIdMixin, eventIdMixin, loadingMixin],
  async created() {
    await this.withLoading(async () => {
      await this.getEventParticipations({
        courseId: this.courseId,
        eventId: this.eventId,
      });
      await this.getEvent({
        courseId: this.courseId,
        eventId: this.eventId,
      });
    });

    if (this.refreshData) {
      this.refreshHandle = setInterval(
        async () =>
          await this.getEventParticipations({
            courseId: this.courseId,
            eventId: this.eventId,
          }),
        10000
      );
    }
  },
  beforeRouteLeave() {
    if (this.refreshHandle != null) {
      clearInterval(this.refreshHandle);
    }
  },
  data() {
    return {
      refreshHandle: null as number | null,
      EventState,
      editingSlot: null as EventParticipationSlot | null,
      editingSlotDirty: null as EventParticipationSlot | null,
      editingFullName: "",
      editingParticipationId: "",
      gridApi: null as any,
      selectedParticipations: [] as string[],

      // dialog functions
      editingAssessmentSlotMode: false,
      publishingResultsMode: false,
      closingExamsMode: false,
      reOpeningTurnedInParticipationMode: false,
      reOpeningClosedExamsMode: false,
    };
  },
  methods: {
    ...mapActions([
      "getEvent",
      "partialUpdateEvent",
      "getEventParticipation",
      "getEventParticipations",
      "partialUpdateEventParticipation",
      "partialUpdateEventParticipationSlot",
      "getEventParticipationSlot",
    ]),
    async onAttachmentDownload(slot: EventParticipationSlot) {
      // TODO refactor as another component is using this method as well
      await this.withLoading(
        async () =>
          await downloadEventParticipationSlotAttachment(
            this.courseId,
            this.eventId,
            this.editingParticipationId,
            slot.id
          )
      );
    },
    isRowSelectable(row: RowNode) {
      /**
       * Used by ag grid to determine whether the row is selectable
       */
      if (this.resultsMode) {
        return (
          row.data.state == ParticipationAssessmentProgress.FULLY_ASSESSED &&
          row.data.visibility != AssessmentVisibility.PUBLISHED
        );
      }
      return true;
    },
    getRowClass(row: RowClassParams) {
      if (this.resultsMode) {
        return (row.data as EventParticipation).visibility ==
          AssessmentVisibility.PUBLISHED
          ? ["bg-success-important", "hover:bg-success-important"]
          : "";
      }
      return this.event.state === EventState.RESTRICTED &&
        !this.event.users_allowed_past_closure?.includes(
          this.eventParticipations.find(
            (p: EventParticipation) =>
              p.id === (row.data as EventParticipation).id
          )?.user?.id
        )
        ? ["bg-danger-important", "hover:bg-danger-important"]
        : "";
    },
    onSelectionChanged() {
      // copy the id's of the selected participations
      this.selectedParticipations = this.gridApi
        ?.getSelectedNodes()
        .map((n: any) => n.data.id);
    },
    async onCellClicked(event: CellClickedEvent) {
      // open full participation
      if (event.colDef.field === "email") {
        this.$router.push({
          name: "ExamParticipationFull",
          params: { participationId: event.data.id },
        });
      }
      // edit assessment slot
      else if (event.colDef.field?.startsWith("slot") && this.resultsMode) {
        this.editingSlot = event.value;
        this.editingParticipationId = event.data.id;

        await this.withLocalLoading(
          async () =>
            await this.getEventParticipationSlot({
              courseId: this.courseId,
              slotId: this.editingSlot?.id,
              participationId: this.editingParticipationId,
              eventId: this.eventId,
            })
        );

        // deep copy slot to prevent affecting the original one while editing
        this.editingSlotDirty = JSON.parse(JSON.stringify(this.editingSlot));
        this.editingFullName = event.data.fullName;
        this.editingAssessmentSlotMode = true;
      }
      // change turned in status
      else if (
        event.colDef.field === "state" &&
        !this.resultsMode &&
        event.data.state == EventParticipationState.TURNED_IN
      ) {
        this.editingParticipationId = event.data.id;
        this.reOpeningTurnedInParticipationMode = true;
      }
    },
    onCloseSelectedExams() {
      this.closingExamsMode = true;
    },
    onOpenSelectedExams() {
      this.reOpeningClosedExamsMode = true;
    },
    onPublish() {
      this.publishingResultsMode = true;
    },
    async closeExams() {
      // closing exams only for a group of participant means putting all of the
      // participants except those ones inside the `users_allowed_past_closure`
      // list of the exam and setting the exam state to CLOSED
      const unselectedParticipations = (
        this.eventParticipations as EventParticipation[]
      ).filter((p) => !this.selectedParticipations.includes(p.id)); // these are the ones the exam will stay open for
      const unselectedUserIds = unselectedParticipations.map((p) => p.user.id);
      await this.withLoading(
        async () =>
          await this.partialUpdateEvent({
            courseId: this.courseId,
            eventId: this.eventId,
            mutate: true,
            changes: {
              state: EventState.RESTRICTED,
              users_allowed_past_closure: [
                // id's that were in the list and haven't been selected
                ...(this.event.users_allowed_past_closure ?? []).filter(
                  (i) =>
                    !this.selectedCloseableParticipations
                      .map((p) => p.user.id)
                      .includes(i)
                ),
                // unselected id's
                ...unselectedUserIds.filter((i) =>
                  this.event.users_allowed_past_closure?.includes(i)
                ),
              ],
            },
          })
      );
      this.$store.commit("shared/showSuccessFeedback");
      this.hideDialog();
      this.gridApi.refreshCells({ force: true });
    },
    async openExams() {
      // re-opening exam for a group of participants means adding those
      // participants to the `users_allowed_past_closure` list for the exam

      const selectedParticipations = (
        this.eventParticipations as EventParticipation[]
      ).filter((p) => this.selectedParticipations.includes(p.id)); // these are the ones the exam will stay open for

      const selectedUserIds = selectedParticipations.map((p) => p.user.id);
      await this.withLoading(
        async () =>
          await this.partialUpdateEvent({
            courseId: this.courseId,
            eventId: this.eventId,
            mutate: true,
            changes: {
              users_allowed_past_closure: [
                ...(this.event.users_allowed_past_closure ?? []),
                ...selectedUserIds,
              ],
            },
          })
      );
      this.$store.commit("shared/showSuccessFeedback");
      this.hideDialog();
      this.gridApi.refreshCells({ force: true });
    },
    async publishResults() {
      await this.withLoading(
        async () =>
          await this.partialUpdateEventParticipation({
            courseId: this.courseId,
            eventId: this.eventId,
            participationIds: this.selectedParticipations,
            changes: {
              visibility: AssessmentVisibility.PUBLISHED,
            },
          }),
        this.setErrorNotification,
        () => this.$store.commit("shared/showSuccessFeedback")
      );
      this.hideDialog();
      this.gridApi.refreshCells({ force: true });
    },
    async reOpenSubmission() {
      await this.withLoading(async () => {
        await this.partialUpdateEventParticipation({
          courseId: this.courseId,
          eventId: this.eventId,
          changes: {
            state: EventParticipationState.IN_PROGRESS,
          },
          participationIds: [this.editingParticipationId],
        });
      });
      this.hideDialog();
      this.$store.commit("shared/showSuccessFeedback");
      this.gridApi.refreshCells({ force: true });
    },
    async dispatchAssessmentUpdate() {
      await this.withLoading(async () => {
        await this.partialUpdateEventParticipationSlot({
          courseId: this.courseId,
          eventId: this.eventId,
          participationId: this.editingParticipationId,
          slotId: this.editingSlot?.id,
          changes: {
            score: this.editingSlotDirty?.score,
            comment: this.editingSlotDirty?.comment,
          },
        });
        await this.getEventParticipation({
          courseId: this.courseId,
          eventId: this.eventId,
          participationId: this.editingParticipationId,
        });
      }, this.setErrorNotification);
      this.hideDialog();
      this.gridApi.refreshCells({ force: true });
    },
    hideDialog() {
      //this.showDialog = false
      this.editingSlot = null;
      this.editingSlotDirty = null;
      this.editingFullName = "";
      this.editingParticipationId = "";
      this.showDialog = false;
      this.selectedParticipations = [];
    },
  },
  computed: {
    ...mapState(["eventParticipations"]),
    showDialog: {
      get() {
        return (
          this.editingAssessmentSlotMode ||
          this.publishingResultsMode ||
          this.closingExamsMode ||
          this.reOpeningTurnedInParticipationMode ||
          this.reOpeningClosedExamsMode
        );
      },
      set(val: boolean) {
        if (!val) {
          this.editingAssessmentSlotMode = false;
          this.publishingResultsMode = false;
          this.closingExamsMode = false;
          this.reOpeningTurnedInParticipationMode = false;
          this.reOpeningClosedExamsMode = false;
        }
      },
    },
    dialogData(): DialogData {
      let ret = {} as DialogData;
      const defaultData = {
        onNo: this.hideDialog,
        noText: _("dialog.default_cancel_text"),
      } as DialogData;

      if (this.reOpeningTurnedInParticipationMode) {
        ret = {
          title: "",
          warning: false,
          noText: _("dialog.default_no_text"),
          yesText: _("dialog.default_yes_text"),
          onYes: this.reOpenSubmission,
        };
      }

      if (this.editingAssessmentSlotMode) {
        ret = {
          onYes: this.dispatchAssessmentUpdate,
          yesText: _("event_assessment.confirm_assessment"),
        };
      }

      if (this.publishingResultsMode) {
        ret = {
          onYes: this.publishResults,
          yesText: _("event_results.publish"),
          noText: _("dialog.default_cancel_text"),
        };
      }

      if (this.closingExamsMode) {
        ret = {
          title: _("event_monitor.close_for_selected"),
          yesText:
            _("misc.close") +
            " " +
            this.selectedCloseableParticipations.length +
            " " +
            (this.selectedCloseableParticipations.length === 1
              ? _("misc.exam")
              : _("misc.exams")),
          noText: _("dialog.default_cancel_text"),
          onYes: this.closeExams,
        };
      }

      if (this.reOpeningClosedExamsMode) {
        ret = {
          title: _("event_monitor.open_for_selected"),
          yesText:
            _("misc.reopen") +
            " " +
            this.selectedOpenableParticipations.length +
            " " +
            (this.selectedOpenableParticipations.length === 1
              ? _("misc.exam")
              : _("misc.exams")),
          noText: _("dialog.default_cancel_text"),
          onYes: this.openExams,
        };
      }
      return { ...defaultData, ...ret };
    },
    selectedParticipation() {
      return this.eventParticipations.find(
        (p: EventParticipation) => p.id == this.editingParticipationId
      );
    },
    event(): Event {
      return this.$store.getters["teacher/event"](this.eventId);
    },
    resultsMode() {
      return (
        this.event.state === EventState.CLOSED
        // &&
        // (this.event.users_allowed_past_closure?.length ?? -1) === 0
      );
    },
    participantCount() {
      return this.eventParticipations?.length ?? 0;
    },
    averageProgress() {
      return 25.5;
    },
    turnedInCount() {
      return 3;
    },
    thereArePartialAssessments() {
      return this.eventParticipations.some(
        (p: EventParticipation) =>
          p.assessment_progress ==
          ParticipationAssessmentProgress.PARTIALLY_ASSESSED
      );
    },
    thereAreUnpublishedAssessments() {
      return this.eventParticipations.some(
        (p: EventParticipation) =>
          p.visibility != AssessmentVisibility.PUBLISHED
      );
    },
    participationPreviewColumns(): ColDef[] {
      if ((this.eventParticipations?.length ?? 0) === 0) {
        return [];
      }
      let ret = [
        { field: "id", hide: true },
        { field: "visibility", hide: true },
        {
          field: "email",
          headerName: _("event_participation_headings.email"),
          width: 300,
          cellRenderer: (params: any) =>
            `<div class="flex items-center space-x-1">
            <span class="p-2 mr-2 text-sm ag-selectable-cell material-icons-outlined">launch</span>
            ${params.value}</div>`,
          checkboxSelection: true,
          headerCheckboxSelection: true,
          headerCheckboxSelectionFilteredOnly: true,
        },
        ...(this.resultsMode
          ? [
              {
                field: "state", // assessment progress
                width: 80,
                headerName: _("event_participation_headings.state"),
                cellRenderer: (params: any) =>
                  `<span class="${
                    params.value ==
                    ParticipationAssessmentProgress.PARTIALLY_ASSESSED
                      ? "text-yellow-900"
                      : "text-success"
                  } pt-2 ml-1 text-lg material-icons-outlined">${
                    assessmentStateIcons[
                      params.value as ParticipationAssessmentProgress
                    ]
                  }</span>`,
              },
            ]
          : []),
        ...(!this.resultsMode
          ? [
              {
                field: "state", // participation state (in progress / turned in)
                width: 90,
                headerName: _(
                  "event_participation_headings.participation_state"
                ),
                cellRenderer: (params: any) =>
                  `<div title="${_(
                    "event_participation_states." + params.value
                  )}" class=" ag-selectable-cell">
                  <span  class="mx-auto ${
                    params.value == EventParticipationState.IN_PROGRESS
                      ? "text-muted"
                      : "text-success"
                  } text-lg material-icons-outlined">${
                    participationStateIcons[
                      params.value as EventParticipationState
                    ]
                  }</span></div>`,
              },
            ]
          : []),
        {
          field: "fullName",
          headerName: _("misc.full_name"),
          flex: 1,
        },
      ] as ColDef[];
      (this.eventParticipations[0] as EventParticipation).slots.forEach((s) =>
        ret.push({
          width: 100,
          cellClassRules: {
            //'bg-danger bg-opacity-30': '!x'
          },
          type: "numericColumn",
          field: "slot-" + ((s.slot_number as number) + 1),
          headerName:
            _("event_participation_headings.exercise") +
            " " +
            ((s.slot_number as number) + 1),
          cellRenderer: (params: any) =>
            `<div class="ml-10 -mr-2 ag-selectable-cell ${
              params.value.score ??
              "transition-opacity duration-75 hover:opacity-100 opacity-70 "
            }">` +
            `<span class="mx-auto ${
              params.value.score ??
              "text-lg text-yellow-900 material-icons-outlined"
            }">
                  ${params.value.score ?? "pending_actions"}
                </span>` +
            `</div>`,
        })
      );
      return ret;
    },
    participationsData() {
      if (!this.eventParticipations) {
        return [];
      }
      return this.eventParticipations.map((p: EventParticipation) => {
        const ret = {
          id: p.id,
          email: p.user?.email,
          fullName: p.user?.full_name,
          state: this.resultsMode ? p.assessment_progress : p.state,
          visibility: p.visibility,
        } as Record<string, unknown>;
        p.slots.forEach(
          (s) => (ret["slot-" + ((s.slot_number as number) + 1)] = s) //s.score ?? '-')
        );
        return ret;
      });
    },
    selectedCloseableParticipations(): EventParticipation[] {
      return this.eventParticipations.filter(
        (p: EventParticipation) =>
          this.selectedParticipations.includes(p.id) && // participation is selected
          (this.event.state === EventState.OPEN || // event is open for everyone or...
            //... event is still open for this participant
            this.event.users_allowed_past_closure?.includes(p.user.id))
      );
    },
    selectedOpenableParticipations(): EventParticipation[] {
      return this.eventParticipations.filter(
        (p: EventParticipation) =>
          this.selectedParticipations.includes(p.id) && // participation is selected
          // if event isn't closed, no participation can be opened as they all already are
          this.event.state === EventState.RESTRICTED &&
          // event is closed and participant isn't in the list of those still allowed
          !this.event.users_allowed_past_closure?.includes(p.user.id)
      );
    },
  },
});
</script>
