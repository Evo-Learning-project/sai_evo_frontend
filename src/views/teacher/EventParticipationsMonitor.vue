<template>
  <div class="flex flex-col">
    <div v-if="resultsMode && thereArePartialAssessment" class="mb-8">
      <Card class="bg-light">
        <template v-slot:body>
          <div class="flex space-x-3">
            <div>
              <div class="text-yellow-900 bg-yellow-500 icon-surrounding">
                <span class="ml-px material-icons-outlined">
                  pending_actions
                </span>
              </div>
            </div>
            <div class="flex flex-wrap items-center">
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
        :isRowSelectable="isParticipationPublishable"
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
      class="mt-8 mr-auto"
      :variant="'success'"
      :disabled="selectedParticipations.length == 0"
    >
      <span class="mr-1 text-base material-icons-outlined">
        done
      </span>
      Pubblica risultati</Btn
    >

    <Dialog
      :large="true"
      :showDialog="showDialog"
      @no="onDialogNo()"
      @yes="onDialogYes()"
      :noText="dialogData.noText"
      :yesText="dialogData.yesText"
      :dismissible="false"
    >
      <template v-slot:title>
        {{ $t('event_assessment.assess') }}
        {{ $t('event_assessment.exercise') }} {{ editingSlot.slot_number + 1 }}
        {{ $t('misc.for') }}
        {{ editingFullName }}
      </template>
      <template v-slot:body>
        <div class="text-darkText">
          <AbstractEventParticipationSlot
            v-if="editingSlot"
            :allowEditScores="true"
            v-model="editingSlotDirty"
          ></AbstractEventParticipationSlot>
          <!-- :modelValue="editingSlot"
            @update:modelValue="editingSlotDirty = $event" -->
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
import { courseIdMixin, eventIdMixin } from '@/mixins'
import {
  AssessmentVisibility,
  Event,
  EventParticipation,
  EventParticipationSlot,
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
  RowNode,
  SelectionChangedEvent
} from 'ag-grid-community'
import { icons as assessmentStateIcons } from '@/assets/assessmentStateIcons'
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
  mixins: [courseIdMixin, eventIdMixin],
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
  watch: {
    loading (newVal) {
      // TODO Make mixin
      this.$store.state.loading = newVal
    }
  },
  data () {
    return {
      firstLoading: false,
      loading: false,
      showDialog: false,
      dialogData: {
        title: 'Esercizio 1 Samuele Bonini',
        noText: _('dialog.default_cancel_text'),
        yesText: _('event_assessment.confirm_assessment')
      } as DialogData,
      editingSlot: null as EventParticipationSlot | null,
      editingSlotDirty: null as EventParticipationSlot | null,
      editingFullName: '',
      editingParticipationId: '',
      gridApi: null as any,
      selectedParticipations: [] as string[]
    }
  },
  methods: {
    isParticipationPublishable (row: RowNode) {
      /**
       * Used by ag grid to determine whether the row is selectable
       * (grid selection is currently used to publish assessments)
       */
      return row.data.state == ParticipationAssessmentProgress.FULLY_ASSESSED
    },
    getRowClass (row: RowClassParams) {
      console.log('ROWDATA', row.data)
      return (row.data as EventParticipation).visibility ==
        AssessmentVisibility.PUBLISHED
        ? ['bg-success-important', 'hover:bg-success-important']
        : ''
    },
    onSelectionChanged () {
      // copy the id's of the selected participations
      this.selectedParticipations = this.gridApi
        ?.getSelectedNodes()
        .map((n: any) => n.data.id)
    },
    onCellClicked (event: CellClickedEvent) {
      //console.log('cell clicked', event, event.value)
      if (!event.colDef.field?.startsWith('slot')) {
        return
      }
      this.showDialog = true
      this.editingSlot = event.value
      this.editingSlotDirty = JSON.parse(JSON.stringify(this.editingSlot))
      this.editingFullName = event.data.fullName
      this.editingParticipationId = event.data.id
    },
    async onDialogYes () {
      this.loading = true
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
      this.hideDialog()
      this.loading = false
      this.gridApi.refreshCells({ force: true })
    },
    onDialogNo () {
      this.hideDialog()
    },
    hideDialog () {
      this.showDialog = false
      this.editingSlot = null
      this.editingSlotDirty = null
      this.editingFullName = ''
      this.editingParticipationId = ''
    }
  },
  computed: {
    ...mapState(['eventParticipations']),
    event (): Event {
      return this.$store.getters.event(this.eventId)
    },
    resultsMode () {
      return this.event.state == EventState.CLOSED
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
    thereArePartialAssessment () {
      return this.eventParticipations.some(
        (p: EventParticipation) =>
          p.assessment_progress ==
          ParticipationAssessmentProgress.PARTIALLY_ASSESSED
      )
    },
    participationPreviewColumns () {
      if ((this.eventParticipations?.length ?? 0) === 0) {
        return []
      }
      let ret = [
        { field: 'id', hide: true },
        { field: 'visibility', hide: true },
        {
          field: 'state',
          width: 80,
          headerName: _('event_participation_headings.state'),
          cellRenderer: (params: any) =>
            `<span class="${
              params.value == ParticipationAssessmentProgress.PARTIALLY_ASSESSED
                ? 'text-yellow-900'
                : 'text-success'
            } pt-2 ml-1 text-lg material-icons-outlined">${
              assessmentStateIcons[
                params.value as ParticipationAssessmentProgress
              ]
            }</span>`
        },
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
          headerName: _('event_participation_headings.full_name'),
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
            `<div class="flex items-center h-full ml-4 rounded-md cursor-pointer hover:bg-gray-200 ${params
              .value.score ??
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
          state: p.assessment_progress,
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
