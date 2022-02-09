<template>
  <div class="flex flex-col">
    <div class="mb-2" v-if="halfClosed">
      <Card class="bg-light">
        <template v-slot:body>
          <div class="flex items-center space-x-3">
            <div>
              <div class="text-yellow-900 bg-yellow-500 icon-surrounding">
                <span class="ml-px material-icons-outlined">
                  priority_high
                </span>
              </div>
            </div>
            <p class="">
              {{ $t('event_monitor.some_exams_still_open') }}
            </p>
          </div>
        </template>
      </Card>
    </div>
    <div class="mb-2" v-if="!firstLoading && resultsMode">
      <Card class="bg-light">
        <template v-slot:body>
          <div class="flex space-x-3">
            <div>
              <div
                v-if="resultsMode && thereArePartialAssessments"
                class="text-yellow-900 bg-yellow-500 icon-surrounding"
              >
                <span class="ml-px material-icons-outlined">
                  pending_actions
                </span>
              </div>
              <div
                v-else-if="thereAreUnpublishedAssessments"
                class="bg-success-light text-success-dark icon-surrounding"
              >
                <span class="ml-px material-icons-outlined">
                  task
                </span>
              </div>
              <div
                v-else
                class="bg-success-light text-success-dark icon-surrounding"
              >
                <span class="ml-px material-icons-outlined">
                  done
                </span>
              </div>
            </div>
            <div
              v-if="resultsMode && thereArePartialAssessments"
              class="flex flex-wrap items-center"
            >
              <p class="">
                {{
                  $t('event_assessment.some_exams_require_manual_assessment')
                }}
              </p>
              <div class="flex flex-wrap items-center space-x-1">
                <p>
                  {{
                    $t('event_assessment.exams_awaiting_assessment_are_marked')
                  }}
                </p>
                <span class="text-lg text-yellow-900 material-icons-outlined"
                  >pending_actions</span
                >.
              </div>
            </div>

            <p v-else-if="thereAreUnpublishedAssessments">
              {{ $t('event_assessment.ready_to_publish_1') }}
              <em>{{ $t('event_results.publish_results') }}</em
              >.
              {{ $t('event_assessment.ready_to_publish_2') }}
            </p>
            <p class="my-auto" v-else>
              {{ $t('event_assessment.all_published') }}
            </p>
          </div>
        </template>
      </Card>
    </div>
    <div class="grid grid-cols-3 gap-12" v-if="!resultsMode && !firstLoading">
      <Card class="shadow-sm">
        <template v-slot:header>
          <h4 class="text-center text-muted">Partecipanti</h4>
        </template>
        <template v-slot:body>
          <div class="flex items-center justify-center w-full space-x-1">
            <h2 class="mb-0">
              {{ participantCount }}
            </h2>
            <h2 class="mt-1 mb-0 material-icons-outlined">people</h2>
          </div>
        </template>
      </Card>
      <Card class="shadow-sm">
        <template v-slot:header>
          <h4 class="text-center text-muted">Partecipanti</h4>
        </template>
        <template v-slot:body>
          <div class="flex items-center justify-center w-full space-x-1">
            <h2 class="mb-0">{{ averageProgress }} %</h2>
          </div>
        </template>
      </Card>
      <Card class="shadow-sm">
        <template v-slot:header>
          <h4 class="text-center text-muted">Esami consegnati</h4>
        </template>
        <template v-slot:body>
          <div class="flex items-center justify-center w-full space-x-1">
            <h2 class="mb-0">{{ turnedInCount }}</h2>
            <h2 class="mt-1 mb-0 material-icons-outlined">
              assignment_turned_in
            </h2>
          </div>
        </template>
      </Card>
    </div>
    <div class="flex-grow">
      <DataTable
        v-if="!firstLoading"
        :columnDefs="participationPreviewColumns"
        :rowData="participationsData"
        :isRowSelectable="isRowSelectable"
        :getRowClass="getRowClass"
        @cellClicked="onCellClicked"
        @gridReady="gridApi = $event.api"
        @selectionChanged="onSelectionChanged"
      ></DataTable>
      <div v-else>
        <SkeletonCard :borderLess="true"></SkeletonCard>
        <SkeletonCard :borderLess="true"></SkeletonCard>
        <SkeletonCard :borderLess="true"></SkeletonCard>
      </div>
    </div>

    <Btn
      v-if="resultsMode"
      class="mt-8 mr-auto"
      :variant="'success'"
      @click="onPublish"
      :disabled="selectedParticipations.length == 0"
    >
      <span class="mr-1 text-base material-icons-outlined">
        done
      </span>
      {{ $t('event_results.publish_results') }}</Btn
    >
    <Btn
      v-else-if="!firstLoading"
      class="mt-8 mr-auto"
      :variant="'danger'"
      @click="onCloseSelectedExams"
      :disabled="selectedParticipations.length == 0"
    >
      <span class="mr-1 text-base material-icons-outlined">
        block
      </span>
      {{ $t('event_monitor.close_for_selected') }}</Btn
    >
    <Dialog
      :warning="!resultsMode && !editingSlot"
      :large="!!editingSlot"
      :showDialog="showDialog"
      @no="hideDialog()"
      @yes="dialogData.onYes()"
      :noText="dialogData.noText"
      :yesText="dialogData.yesText"
      :dismissible="!editingSlot"
      :disableOk="
        editingSlotDirty &&
          (editingSlotDirty.score == null || editingSlotDirty.score.length == 0)
      "
    >
      <template v-if="editingSlot" v-slot:title>
        {{ $t('event_assessment.assess') }}
        {{ $t('event_assessment.exercise') }} {{ editingSlot.slot_number + 1 }}
        {{ $t('misc.for') }}
        {{ editingFullName }}
      </template>
      <template v-else-if="dialogData.title?.length > 0" v-slot:title>{{
        dialogData.title
      }}</template>
      <template v-slot:body>
        <!-- editing an assessment slot -->
        <div class="text-darkText" v-if="editingSlot">
          <AbstractEventParticipationSlot
            :allowEditScores="true"
            v-model="editingSlotDirty"
          ></AbstractEventParticipationSlot>
        </div>
        <!-- publishing selected assessments -->
        <div v-else-if="resultsMode">
          {{ $t('event_results.publish_confirm_text') }}
        </div>

        <!-- re-opening a turned in participation-->
        <div v-else-if="!!editingParticipationId">
          {{
            $t('event_monitor.un_turn_in_text') +
              selectedParticipation?.user?.full_name +
              '?'
          }}
        </div>

        <!-- closing exam for selected participants -->
        <div v-else>
          <p>
            {{ $t('event_monitor.close_for_selected_text_1') }}
            <strong>{{ selectedParticipations.length }}</strong>
            {{
              selectedParticipations.length === 1
                ? $t('misc.participant')
                : $t('misc.participants')
            }}.
          </p>
          <p v-if="selectedParticipations.length < eventParticipations.length">
            {{ $t('event_monitor.close_for_selected_text_2') }}
            <strong>{{
              eventParticipations.length - selectedParticipations.length
            }}</strong>
            {{
              eventParticipations.length - selectedParticipations.length === 1
                ? $t('misc.participant')
                : $t('misc.participants')
            }}.
          </p>
        </div>
      </template>
    </Dialog>
  </div>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */

//import EventParticipationPreview from '@/components/teacher/EventParticipation/EventParticipationPreview.vue'
import Card from '@/components/ui/Card.vue'
import DataTable from '@/components/ui/DataTable.vue'
import { courseIdMixin, eventIdMixin, loadingMixin } from '@/mixins'
import {
  AssessmentVisibility,
  Event,
  EventParticipation,
  EventParticipationSlot,
  EventParticipationState,
  EventState,
  ParticipationAssessmentProgress
} from '@/models'
import { defineComponent } from '@vue/runtime-core'
import { mapState } from 'vuex'
import { getTranslatedString as _ } from '@/i18n'
import {
  CellClickedEvent,
  ColDef,
  RowClassParams,
  RowNode
} from 'ag-grid-community'
import { icons as assessmentStateIcons } from '@/assets/assessmentStateIcons'
import { icons as participationStateIcons } from '@/assets/participationStateIcons'
import Dialog from '@/components/ui/Dialog.vue'
import AbstractEventParticipationSlot from '@/components/shared/AbstractEventParticipationSlot.vue'
import { DialogData } from '@/interfaces'
import SkeletonCard from '@/components/ui/SkeletonCard.vue'
import Btn from '@/components/ui/Btn.vue'

export default defineComponent({
  components: {
    //EventParticipationPreview,
    Card,
    DataTable,
    Dialog,
    AbstractEventParticipationSlot,
    SkeletonCard,
    Btn
  },
  name: 'EventParticipationsMonitor',
  props: {
    refreshData: {
      type: Boolean,
      default: true
    },
    allowEditParticipations: {
      type: Boolean,
      default: false
    }
  },
  mixins: [courseIdMixin, eventIdMixin, loadingMixin],
  async created () {
    this.firstLoading = true
    await this.$store.dispatch('getEventParticipations', {
      courseId: this.courseId,
      eventId: this.eventId
    })
    await this.$store.dispatch('getEvent', {
      courseId: this.courseId,
      eventId: this.eventId
    })
    this.firstLoading = false
  },
  data () {
    return {
      firstLoading: false,
      //showDialog: false,
      // dialogData: {
      //   title: '',
      //   noText: _('dialog.default_cancel_text'),
      //   yesText: ''
      // } as DialogData,
      editingSlot: null as EventParticipationSlot | null,
      editingSlotDirty: null as EventParticipationSlot | null,
      editingFullName: '',
      editingParticipationId: '',
      gridApi: null as any,
      selectedParticipations: [] as string[],

      // dialog functions
      // TODO make dialogData be a computed based on these flags to avoid setting it manually inside of methods
      editingAssessmentSlotMode: false,
      publishingResultsMode: false,
      closingExamsMode: false,
      reOpeningTurnedInParticipationMode: false
    }
  },
  methods: {
    isRowSelectable (row: RowNode) {
      /**
       * Used by ag grid to determine whether the row is selectable
       */
      if (this.resultsMode) {
        return (
          row.data.state == ParticipationAssessmentProgress.FULLY_ASSESSED &&
          row.data.visibility != AssessmentVisibility.PUBLISHED
        )
      }
      return true

      // return !this.event.users_allowed_past_closure?.includes(
      //   this.eventParticipations.find(
      //     (p: EventParticipation) =>
      //       p.id === (row.data as EventParticipation).id
      //   )?.user?.id
      // )
    },
    getRowClass (row: RowClassParams) {
      if (this.resultsMode) {
        return (row.data as EventParticipation).visibility ==
          AssessmentVisibility.PUBLISHED
          ? ['bg-success-important', 'hover:bg-success-important']
          : ''
      }
      return this.event.state === EventState.CLOSED &&
        !this.event.users_allowed_past_closure?.includes(
          this.eventParticipations.find(
            (p: EventParticipation) =>
              p.id === (row.data as EventParticipation).id
          )?.user?.id
        )
        ? ['bg-danger-important', 'hover:bg-danger-important']
        : ''
    },
    onSelectionChanged () {
      // copy the id's of the selected participations
      this.selectedParticipations = this.gridApi
        ?.getSelectedNodes()
        .map((n: any) => n.data.id)
    },
    onCellClicked (event: CellClickedEvent) {
      // edit assessment slot
      if (event.colDef.field?.startsWith('slot') && this.resultsMode) {
        this.editingSlot = event.value
        this.editingSlotDirty = JSON.parse(JSON.stringify(this.editingSlot))
        this.editingFullName = event.data.fullName
        this.editingParticipationId = event.data.id
        this.editingAssessmentSlotMode = true

        //this.showDialog = true
        // this.dialogData.onYes = this.dispatchAssessmentUpdate
        // this.dialogData.yesText = _('event_assessment.confirm_assessment')

        // this.dialogData.noText = _('dialog.default_cancel_text')
      }
      // change turned in status
      else if (event.colDef.field === 'state' && !this.resultsMode) {
        this.editingParticipationId = event.data.id
        this.reOpeningTurnedInParticipationMode = true

        // this.dialogData.title = ''
        // this.dialogData.warning = false
        // //this.showDialog = true
        // this.dialogData.noText = _('dialog.default_no_text')
        // this.dialogData.yesText = _('dialog.default_yes_text')
        // TODO onyes
      }
    },
    onCloseSelectedExams () {
      this.closingExamsMode = true

      //this.showDialog = true
      // this.dialogData.title = _('event_monitor.close_for_selected')
      // this.dialogData.yesText =
      //   _('misc.close') +
      //   ' ' +
      //   this.selectedParticipations.length +
      //   ' ' +
      //   (this.selectedParticipations.length === 1
      //     ? _('misc.exam')
      //     : _('misc.exams'))
      // this.dialogData.noText = _('dialog.default_cancel_text')
      // this.dialogData.onYes = this.closeExams
    },
    onPublish () {
      this.publishingResultsMode = true

      //this.showDialog = true
      // this.dialogData.onYes = this.publishResults
      // this.dialogData.yesText = _('event_results.publish')
      // this.dialogData.noText = _('dialog.default_cancel_text')
    },
    async closeExams () {
      const unselectedParticipations = (this
        .eventParticipations as EventParticipation[]).filter(
        p => !this.selectedParticipations.includes(p.id)
      )
      const unselectedUserIds = unselectedParticipations.map(p => p.user?.id)
      await this.withLoading(
        async () =>
          await this.$store.dispatch('partialUpdateEvent', {
            courseId: this.courseId,
            eventId: this.eventId,
            mutate: true,
            changes: {
              state: EventState.CLOSED,
              users_allowed_past_closure: unselectedUserIds
            }
          })
      )
      this.$store.commit('showSuccessFeedback')
      this.hideDialog()
      this.gridApi.refreshCells({ force: true })
    },
    async publishResults () {
      await this.withLoading(
        async () =>
          await this.$store.dispatch('partialUpdateEventParticipation', {
            courseId: this.courseId,
            eventId: this.eventId,
            participationIds: this.selectedParticipations,
            changes: {
              visibility: AssessmentVisibility.PUBLISHED
            }
          })
      )
      this.$store.commit('showSuccessFeedback')
      this.hideDialog()
      this.gridApi.refreshCells({ force: true })
    },
    async dispatchAssessmentUpdate () {
      await this.withLoading(async () => {
        await this.$store.dispatch('partialUpdateEventParticipationSlot', {
          courseId: this.courseId,
          eventId: this.eventId,
          participationId: this.editingParticipationId,
          slotId: this.editingSlot?.id,
          changes: {
            score: this.editingSlotDirty?.score,
            comment: this.editingSlotDirty?.comment
          }
        })
        await this.$store.dispatch('getEventParticipation', {
          courseId: this.courseId,
          eventId: this.eventId,
          participationId: this.editingParticipationId
        })
      })
      this.hideDialog()
      this.gridApi.refreshCells({ force: true })
    },
    hideDialog () {
      //this.showDialog = false
      this.editingSlot = null
      this.editingSlotDirty = null
      this.editingFullName = ''
      this.editingParticipationId = ''
      this.showDialog = false
    }
  },
  computed: {
    ...mapState(['eventParticipations']),
    showDialog: {
      get () {
        return (
          this.editingAssessmentSlotMode ||
          this.publishingResultsMode ||
          this.closingExamsMode ||
          this.reOpeningTurnedInParticipationMode
        )
      },
      set (val: boolean) {
        if (!val) {
          this.editingAssessmentSlotMode = false
          this.publishingResultsMode = false
          this.closingExamsMode = false
          this.reOpeningTurnedInParticipationMode = false
        }
      }
    },
    dialogData (): DialogData {
      let ret = {} as DialogData
      const defaultData = {
        onNo: this.hideDialog,
        noText: _('dialog.default_cancel_text')
      } as DialogData

      if (this.editingAssessmentSlotMode) {
        ret = {
          onYes: this.dispatchAssessmentUpdate,
          yesText: _('event_assessment.confirm_assessment')
        }
      }

      if (this.publishingResultsMode) {
        ret = {
          onYes: this.publishResults,
          yesText: _('event_results.publish'),
          noText: _('dialog.default_cancel_text')
        }
      }

      if (this.closingExamsMode) {
        ret = {
          title: _('event_monitor.close_for_selected'),
          yesText:
            _('misc.close') +
            ' ' +
            this.selectedParticipations.length +
            ' ' +
            (this.selectedParticipations.length === 1
              ? _('misc.exam')
              : _('misc.exams')),
          noText: _('dialog.default_cancel_text'),
          onYes: this.closeExams
        }

        if (this.reOpeningTurnedInParticipationMode) {
          ret = {
            title: '',
            warning: false,
            noText: _('dialog.default_no_text'),
            yesText: _('dialog.default_yes_text')
          }
        }
      }
      return { ...defaultData, ...ret }
    },
    selectedParticipation () {
      return this.eventParticipations.find(
        (p: EventParticipation) => p.id == this.editingParticipationId
      )
    },
    event (): Event {
      return this.$store.getters.event(this.eventId)
    },
    resultsMode () {
      return (
        this.event.state === EventState.CLOSED &&
        (this.event.users_allowed_past_closure?.length ?? -1) === 0
      )
    },
    halfClosed () {
      return (
        this.event.state === EventState.CLOSED &&
        (this.event.users_allowed_past_closure?.length ?? 0) > 0
      )
    },
    participantCount () {
      return this.eventParticipations?.length ?? 0
    },
    averageProgress () {
      return 25.5
    },
    turnedInCount () {
      return 3
    },
    thereArePartialAssessments () {
      return this.eventParticipations.some(
        (p: EventParticipation) =>
          p.assessment_progress ==
          ParticipationAssessmentProgress.PARTIALLY_ASSESSED
      )
    },
    thereAreUnpublishedAssessments () {
      return this.eventParticipations.some(
        (p: EventParticipation) =>
          p.visibility != AssessmentVisibility.PUBLISHED
      )
    },
    participationPreviewColumns (): ColDef[] {
      if ((this.eventParticipations?.length ?? 0) === 0) {
        return []
      }
      let ret = [
        { field: 'id', hide: true },
        { field: 'visibility', hide: true },
        ...(this.resultsMode
          ? [
              {
                field: 'state', // assessment progress
                width: 80,
                headerName: _('event_participation_headings.state'),
                cellRenderer: (params: any) =>
                  `<span class="${
                    params.value ==
                    ParticipationAssessmentProgress.PARTIALLY_ASSESSED
                      ? 'text-yellow-900'
                      : 'text-success'
                  } pt-2 ml-1 text-lg material-icons-outlined">${
                    assessmentStateIcons[
                      params.value as ParticipationAssessmentProgress
                    ]
                  }</span>`
              }
            ]
          : []),
        ...(!this.resultsMode
          ? [
              {
                field: 'state', // participation state (in progress / turned in)
                width: 80,
                headerName: _('event_participation_headings.state'),
                cellRenderer: (params: any) =>
                  `<div class=" ag-selectable-cell">
                  <span title="${_(
                    'event_participation_states.' + params.value
                  )}" class="mx-auto ${
                    params.value == EventParticipationState.IN_PROGRESS
                      ? 'text-muted'
                      : 'text-success'
                  } text-lg material-icons-outlined">${
                    participationStateIcons[
                      params.value as EventParticipationState
                    ]
                  }</span></div>`
              }
            ]
          : []),
        {
          field: 'email',
          headerName: _('event_participation_headings.email'),
          width: 230,
          cellRenderer: (params: any) => params.value,
          checkboxSelection: true,
          headerCheckboxSelection: true,
          headerCheckboxSelectionFilteredOnly: true
        },
        {
          field: 'fullName',
          headerName: _('misc.full_name'),
          flex: 1
        }
      ] as ColDef[]
      ;(this.eventParticipations[0] as EventParticipation).slots.forEach(s =>
        ret.push({
          width: 100,
          cellClassRules: {
            //'bg-danger bg-opacity-30': '!x'
          },
          type: 'numericColumn',
          field: 'slot-' + ((s.slot_number as number) + 1),
          headerName:
            _('event_participation_headings.exercise') +
            ' ' +
            ((s.slot_number as number) + 1),
          cellRenderer: (params: any) =>
            `<div class="ml-4 -mr-2 ag-selectable-cell ${params.value.score ??
              'transition-opacity duration-75 hover:opacity-100 opacity-70 '}">` +
            `<span class="mx-auto ${params.value.score ??
              'text-lg text-yellow-900 material-icons-outlined'}">
                  ${params.value.score ?? 'pending_actions'}
                </span>` +
            `</div>`
        })
      )
      return ret
    },
    participationsData () {
      return this.eventParticipations.map((p: EventParticipation) => {
        const ret = {
          id: p.id,
          email: p.user?.email,
          fullName: p.user?.full_name,
          state: this.resultsMode ? p.assessment_progress : p.state,
          visibility: p.visibility
        } as Record<string, unknown>
        p.slots.forEach(
          s => (ret['slot-' + ((s.slot_number as number) + 1)] = s) //s.score ?? '-')
        )
        return ret
      })
    }
  }
})
</script>

<style></style>
