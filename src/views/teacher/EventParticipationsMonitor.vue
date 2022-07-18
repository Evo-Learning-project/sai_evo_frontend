<template>
  <div class="relative flex flex-col">
    <!-- insights button -->
    <div
      v-if="!firstLoading && resultsMode"
      class="z-50 flex flex-col mb-2 -mt-8"
    >
      <router-link class="ml-auto" :to="{ name: 'ExamStats' }">
        <Btn
          :outline="true"
          :tooltip="!showStats ? $t('help_texts.stats') : ''"
          :variant="'icon'"
          class="-mt-8 transition-transform duration-200 transform  icon-btn-primary"
        >
          <span
            id="insights-btn"
            class="transition-opacity duration-75 rounded-full  material-icons-outlined"
            >insights</span
          >
        </Btn>
      </router-link>
    </div>

    <!-- alerts -->
    <!-- event restricted alert -->
    <div
      class="flex w-full transition-all duration-200"
      v-if="event.state === EventState.RESTRICTED"
      :class="{
        'opacity-0 max-h-0 mb-0': !showRestrictedModeBanner,
        'opacity-100 max-h-96 mb-3': showRestrictedModeBanner,
      }"
    >
      <div class="w-full mb-4 banner banner-danger">
        <span class="text-yellow-900 material-icons-outlined">
          error_outline
        </span>
        <p>
          {{ $t("event_monitor.some_exams_still_open") }}
        </p>
        <Btn
          :outline="true"
          :size="'xs'"
          :variant="'icon'"
          @click="showRestrictedModeBanner = false"
        >
          <span
            class="material-icons-outlined"
            style="font-size: 17px !important; margin-right: 0 !important"
            >close</span
          ></Btn
        >
      </div>
    </div>
    <div v-if="!firstLoading && resultsMode">
      <!-- pending assessments alert -->
      <div
        v-if="!areAllParticipationsFullyAssessed(eventParticipations)"
        class="flex transition-all duration-200 banner banner-danger"
        :class="{
          'opacity-0 max-h-0 mb-0 py-0': !showThereArePendingAssessmentsBanner,
          'opacity-100 max-h-96 mb-3': showThereArePendingAssessmentsBanner,
        }"
      >
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
        <Btn
          :outline="true"
          :size="'xs'"
          :variant="'icon'"
          @click="showThereArePendingAssessmentsBanner = false"
        >
          <span
            class="material-icons-outlined"
            style="font-size: 17px !important; margin-right: 3px !important"
            >close</span
          ></Btn
        >
      </div>
      <!-- you can publish results alert -->
      <div
        v-else-if="thereAreUnpublishedAssessments"
        class="flex transition-all duration-200 banner banner-light"
        :class="{
          'opacity-0 max-h-0 mb-0 py-0': !showThereAreUnpublishedResultsBanner,
          'opacity-100 max-h-96 mb-3': showThereAreUnpublishedResultsBanner,
        }"
      >
        <span class="ml-px material-icons-outlined text-success"> task </span>
        <p>
          {{ $t("event_assessment.ready_to_publish_1") }}
          <span>{{ $t("event_results.publish_results") }}</span
          >. {{ $t("event_assessment.ready_to_publish_2") }}
        </p>
        <Btn
          :outline="true"
          :size="'xs'"
          :variant="'icon'"
          style="margin-left: auto !important"
          @click="showThereAreUnpublishedResultsBanner = false"
        >
          <span
            class="material-icons-outlined"
            style="font-size: 17px !important; margin-right: 0 !important"
            >close</span
          ></Btn
        >
      </div>
      <!-- all assessments published alert -->
      <div
        v-else
        class="flex transition-all duration-200 banner banner-success"
        :class="{
          'opacity-0 max-h-0 mb-0 py-0': !showAllAssessmentsPublishedBanner,
          'opacity-100 max-h-96 mb-3': showAllAssessmentsPublishedBanner,
        }"
      >
        <span class="text-xl material-icons-outlined"> done </span>
        <p class="">
          {{ $t("event_assessment.all_published") }}
        </p>
        <Btn
          :outline="true"
          :size="'xs'"
          :variant="'icon'"
          style="margin-left: auto !important"
          @click="showAllAssessmentsPublishedBanner = false"
        >
          <span
            class="material-icons-outlined"
            style="font-size: 17px !important; margin-right: 0 !important"
            >close</span
          ></Btn
        >
      </div>
    </div>

    <!-- stats cards -->
    <div v-if="!firstLoading && !resultsMode" class="mb-2">
      <div class="flex">
        <div class="flex w-1/3 mr-4 card shadow-elevation">
          <div class="flex items-center mx-auto">
            <span class="mr-1 material-icons icon-light">people</span>
            <p>{{ participantCount }}</p>
            <p class="ml-2 text-sm text-muted">
              {{ $t("event_monitor.stats_participants") }}
            </p>
          </div>
        </div>
        <div class="flex items-center w-1/3 mr-4 card shadow-elevation">
          <div class="flex items-center mx-auto">
            <span class="mr-1 material-icons-two-tone two-tone-success"
              >assignment_turned_in</span
            >
            <p>{{ turnedInCount }}</p>
            <p class="ml-2 text-sm text-muted">
              {{ $t("event_monitor.stats_turned_in") }}
            </p>
          </div>
        </div>
        <div class="flex items-center w-1/3 card shadow-elevation">
          <div class="flex items-center mx-auto">
            <p>{{ averageProgress }}</p>
            <p>%</p>
            <p class="ml-2 text-sm text-center text-muted">
              {{ $t("event_monitor.stats_average_progress") }}
            </p>
          </div>
        </div>
        <div class="hidden md:ml-auto banner banner-light">
          <span class="material-icons-outlined icon-light">
            assignment_returned
          </span>
          <p>
            {{ $t("event_monitor.un_turn_in_instructions") }}
            <span
              class="text-lg inline-icon text-success material-icons-outlined"
              >{{
                participationStateIcons[EventParticipationState.TURNED_IN][0]
              }}</span
            >
            <span style="margin-left: -1px">{{
              $t("event_monitor.in_column_state")
            }}</span>
          </p>
        </div>
      </div>
    </div>

    <div class="flex-grow">
      <DataTable
        :class="{
          'opacity-50': participationsData.length === 0 || firstLoading,
        }"
        :columnDefs="participationPreviewColumns"
        :rowData="firstLoading ? [] : participationsData"
        :isRowSelectable="isRowSelectable"
        :rowClassRules="getRowClassRules()"
        :getRowId="getRowId"
        @cellClicked="onCellClicked"
        @gridReady="
          gridApi = $event.api;
          columnApi = $event.columnApi;
          columnApi.autoSizeAllColumns(false);
        "
        @selectionChanged="onSelectionChanged"
      ></DataTable>
    </div>

    <!-- buttons to publish results and download participations -->
    <div v-if="!firstLoading && resultsMode" class="flex mt-4">
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

    <!-- buttons to close/open participations-->
    <div v-else-if="!firstLoading" class="flex mt-2 space-x-2">
      <Btn
        class=""
        :outline="true"
        :variant="'danger'"
        @click="onCloseSelectedExams"
        :disabled="selectedCloseableParticipations.length === 0"
      >
        <span class="mr-1 text-base material-icons-outlined"> block </span>
        {{ $t("event_monitor.close_for_selected") }}</Btn
      >

      <Btn
        class=""
        v-show="event.state === EventState.RESTRICTED"
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
      :footerBorder="dialogData.footerBorder"
      :disableOk="
        dialogData.disableOk ||
        (editingSlotDirty &&
          (editingSlotDirty.score == null ||
            editingSlotDirty.score.length == 0))
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
          <!-- TODO investigate bug if adding :showSolutionAndScores="true" here -->
          <AbstractEventParticipationSlot
            :allowEditAssessment="true"
            :showAssessmentCard="true"
            :assessmentWriteOnly="true"
            :modelValue="editingSlotDirty"
            @openFull="
              $router.push({
                name: 'ExamParticipationFull',
                params: { participationId: editingParticipationId },
              })
            "
            @updateAssessment="onUpdateSlotAssessment($event)"
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
    <Spinner
      style="z-index: 99999999"
      :variant="'dark'"
      :fast="true"
      :size="'xl'"
      class="absolute transform -translate-x-1/2 -translate-y-1/2  top-1/2 left-1/2"
      v-if="firstLoading"
    ></Spinner>
    <v-tour
      name="examInsightsTour"
      :steps="examInsightsPageTourSteps"
      :options="tourOptions"
    ></v-tour>
  </div>
</template>

<script lang="ts">
const VISITED_INSIGHTS_TOUR_KEY = "VISITED_INSIGHTS_TOUR_KEY";

/* eslint-disable @typescript-eslint/no-explicit-any */
import DataTable from "@/components/ui/DataTable.vue";
import { courseIdMixin, eventIdMixin, loadingMixin } from "@/mixins";
import {
  AssessmentVisibility,
  Event,
  EventParticipation,
  EventParticipationSlot,
  EventParticipationSlotAssessment,
  EventParticipationState,
  EventState,
  EventTemplateRule,
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
import CsvParticipationDownloader from "@/components/teacher/CsvParticipationDownloader.vue";
import SkeletonCard from "@/components/ui/SkeletonCard.vue";
import {
  examInsightsPageTourSteps,
  getEventParticipationMonitorHeaders,
  tourOptions,
} from "@/const";

import Spinner from "@/components/ui/Spinner.vue";
import {
  areAllParticipationsFullyAssessed,
  getParticipationsAverageProgress,
} from "@/reports";

export default defineComponent({
  components: {
    DataTable,
    Dialog,
    AbstractEventParticipationSlot,
    Btn,
    CsvParticipationDownloader,
    SkeletonCard,
    Spinner,
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
    await this.withFirstLoading(async () => {
      await this.getEventParticipations({
        courseId: this.courseId,
        eventId: this.eventId,
      });
      this.gridApi.refreshCells({ force: true });

      await this.getEvent({
        courseId: this.courseId,
        eventId: this.eventId,
      });
    });

    if (this.resultsMode && !(VISITED_INSIGHTS_TOUR_KEY in localStorage)) {
      setTimeout(() => (this.$tours as any)["examInsightsTour"].start(), 200);
      localStorage.setItem(VISITED_INSIGHTS_TOUR_KEY, "true");
    }

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
    // setTimeout(() => this.columnApi.autoSizeAllColumns(false), 5000);
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
      columnApi: null as any,
      selectedParticipations: [] as string[],
      showStats: false,
      saving: false,

      // dialog functions
      editingAssessmentSlotMode: false,
      publishingResultsMode: false,
      closingExamsMode: false,
      reOpeningTurnedInParticipationMode: false,
      reOpeningClosedExamsMode: false,

      // show banners
      showThereAreUnpublishedResultsBanner: true,
      showRestrictedModeBanner: true,
      showThereArePendingAssessmentsBanner: true,
      showAllAssessmentsPublishedBanner: true,

      //tour
      tourOptions,
      examInsightsPageTourSteps,

      EventParticipationState,
      participationStateIcons,
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
    areAllParticipationsFullyAssessed,
    showFeedbackAndCleanup() {
      this.$store.commit("shared/showSuccessFeedback");
      this.hideDialog();
      this.deselectAllRows();
      this.gridApi.refreshCells({ force: true });
    },
    onUpdateSlotAssessment(event: {
      slot: EventParticipationSlot;
      payload: [keyof EventParticipationSlotAssessment, any];
    }) {
      if (this.editingSlotDirty) {
        this.editingSlotDirty[event.payload[0]] = event.payload[1];
      }
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
    getRowId(data: any) {
      return data.id;
    },
    getRowClassRules() {
      return {
        "bg-success-important hover:bg-success-important": (params: RowNode) =>
          this.resultsMode &&
          params.data.visibility === AssessmentVisibility.PUBLISHED,
        "bg-danger-important hover:bg-danger-important": (params: RowNode) =>
          !this.resultsMode &&
          this.event.state === EventState.RESTRICTED &&
          !this.event.users_allowed_past_closure?.includes(
            this.eventParticipations.find(
              (p: EventParticipation) => p.id === params.data.id
            )?.user?.id
          ),
      };
    },
    onSelectionChanged() {
      // copy the id's of the selected participations
      this.selectedParticipations = this.gridApi
        ?.getSelectedNodes()
        .map((n: any) => n.data.id);
    },
    deselectAllRows() {
      this.gridApi.deselectAll();
    },
    async onCellClicked(event: CellClickedEvent) {
      // TODO refactor to have separate methods
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
        this.editingAssessmentSlotMode = true;
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
      // list of the exam and setting the exam state to RESTRICTED

      // these are the ones the exam will stay open for
      const unselectedParticipations = (
        this.eventParticipations as EventParticipation[]
      ).filter((p) => !this.selectedParticipations.includes(p.id));
      const unselectedUserIds = unselectedParticipations.map((p) => p.user.id);

      await this.withLoading(
        async () =>
          await this.partialUpdateEvent({
            courseId: this.courseId,
            eventId: this.eventId,
            mutate: true, // update local object too
            changes: {
              state: EventState.RESTRICTED,
              users_allowed_past_closure: [
                // users that were already allowed and haven't been selected now
                ...(this.event.users_allowed_past_closure ?? []).filter(
                  (i) =>
                    !this.selectedCloseableParticipations
                      .map((p) => p.user.id)
                      .includes(i)
                ),
                // unselected id's that were already allowed (unless it's the
                // first time the exam gets restricted)
                ...unselectedUserIds.filter(
                  (i) =>
                    this.event.state !== EventState.RESTRICTED ||
                    this.event.users_allowed_past_closure?.includes(i)
                ),
              ],
            },
          })
      );
      this.showFeedbackAndCleanup();
      // TODO extract
      if (this.resultsMode && !(VISITED_INSIGHTS_TOUR_KEY in localStorage)) {
        setTimeout(
          () => (this.$tours as any)["examInsightsTour"].start(),
          1000
        );
        localStorage.setItem(VISITED_INSIGHTS_TOUR_KEY, "true");
      }
    },
    async openExams() {
      // re-opening exam for a group of participants means adding those
      // participants to the `users_allowed_past_closure` list for the exam

      // these are the ones the exam will stay open for
      const selectedParticipations = (
        this.eventParticipations as EventParticipation[]
      ).filter((p) => this.selectedParticipations.includes(p.id));
      const selectedUserIds = selectedParticipations.map((p) => p.user.id);

      await this.withLoading(
        async () =>
          await this.partialUpdateEvent({
            courseId: this.courseId,
            eventId: this.eventId,
            mutate: true, // update local object
            changes: {
              users_allowed_past_closure: [
                // those that were already allowed
                ...(this.event.users_allowed_past_closure ?? []),
                ...selectedUserIds, // those added now
              ],
            },
          })
      );
      this.showFeedbackAndCleanup();
    },
    async dispatchParticipationsUpdate(
      participationIds: string[],
      changes: Partial<EventParticipation>
    ) {
      // generic method to update multiple participations at once and show feedback/error
      await this.withLoading(
        async () =>
          await this.partialUpdateEventParticipation({
            courseId: this.courseId,
            eventId: this.eventId,
            participationIds,
            changes,
          }),
        this.setErrorNotification
      );
      this.showFeedbackAndCleanup();
    },
    async publishResults() {
      await this.dispatchParticipationsUpdate(this.selectedParticipations, {
        visibility: AssessmentVisibility.PUBLISHED,
      });
    },
    async reOpenSubmission() {
      await this.dispatchParticipationsUpdate([this.editingParticipationId], {
        state: EventParticipationState.IN_PROGRESS,
      });
    },
    async dispatchAssessmentUpdate() {
      this.saving = true;
      try {
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
        this.hideDialog();
        this.$store.commit("shared/showSuccessFeedback");
        this.gridApi.refreshCells({ force: true });
      } catch (e) {
        this.setErrorNotification(e);
      } finally {
        this.saving = false;
      }
    },
    hideDialog() {
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
          footerBorder: true,
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

      if (this.saving) {
        ret.disableOk = true;
        ret.yesText = _("misc.wait");
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
      return this.event.state === EventState.CLOSED;
    },
    participantCount() {
      return this.eventParticipations?.length ?? 0;
    },
    turnedInCount() {
      return (
        this.eventParticipations?.filter(
          (p: EventParticipation) =>
            p.state === EventParticipationState.TURNED_IN
        ).length ?? 0
      );
    },
    averageProgress() {
      return getParticipationsAverageProgress(
        this.eventParticipations,
        this.event
      );
    },
    thereAreUnpublishedAssessments() {
      return this.eventParticipations.some(
        (p: EventParticipation) =>
          p.visibility != AssessmentVisibility.PUBLISHED
      );
    },
    participationPreviewColumns() {
      return getEventParticipationMonitorHeaders(
        this.resultsMode,
        this.eventParticipations
      );
    },
    participationsData() {
      if (!this.eventParticipations) {
        return [];
      }
      return this.eventParticipations.map((p: EventParticipation) => {
        const ret = {
          id: p.id,
          email: p.user?.email,
          mat: p.user?.mat,
          currentSlotCursor: p.current_slot_cursor,
          course: p.user?.course,
          fullName: p.user?.full_name,
          state: this.resultsMode ? p.assessment_progress : p.state,
          visibility: p.visibility,
          score: p.score ?? "",
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
          // event is restricted and participant isn't in the list of those still allowed
          this.event.state === EventState.RESTRICTED &&
          !this.event.users_allowed_past_closure?.includes(p.user.id)
      );
    },
  },
});
</script>
