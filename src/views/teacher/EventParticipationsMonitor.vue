<template>
  <div>
    <div class="grid grid-cols-3 gap-28">
      <Card class="shadow-sm">
        <template v-slot:header>
          <h4 class="text-center text-muted">Partecipanti</h4>
        </template>
        <template v-slot:body>
          <div class="flex items-center justify-center w-full space-x-1">
            <h1 class="mb-0">
              {{ participantCount }}
            </h1>
            <h1 class="mt-1 mb-0 material-icons-outlined">people</h1>
          </div>
        </template>
      </Card>
      <Card class="shadow-sm">
        <template v-slot:header>
          <h4 class="text-center text-muted">Partecipanti</h4>
        </template>
        <template v-slot:body>
          <div class="flex items-center justify-center w-full space-x-1">
            <h1 class="mb-0">{{ averageProgress }} %</h1>
          </div>
        </template>
      </Card>
      <Card class="shadow-sm">
        <template v-slot:header>
          <h4 class="text-center text-muted">Esami consegnati</h4>
        </template>
        <template v-slot:body>
          <div class="flex items-center justify-center w-full space-x-1">
            <h1 class="mb-0">{{ turnedInCount }}</h1>
            <h1 class="mt-1 mb-0 material-icons-outlined">
              assignment_turned_in
            </h1>
          </div>
        </template>
      </Card>
      <!-- <h3>Partecipanti</h3>
      <h3>Progresso medio</h3> -->
    </div>
    <EventParticipationPreview
      v-for="participation in eventParticipations"
      :key="'participation-' + participation.id"
      :participation="participation"
    ></EventParticipationPreview>
    <DataTable
      :columnDefs="participationPreviewColumns"
      :rowData="participationsData"
    ></DataTable>
  </div>
</template>

<script lang="ts">
import EventParticipationPreview from '@/components/teacher/EventParticipation/EventParticipationPreview.vue'
import Card from '@/components/ui/Card.vue'
import DataTable from '@/components/ui/DataTable.vue'
import { courseIdMixin, eventIdMixin } from '@/mixins'
import { Event, EventParticipation } from '@/models'
import { defineComponent } from '@vue/runtime-core'
import { mapState } from 'vuex'
import { getTranslatedString as _ } from '@/i18n'

export default defineComponent({
  components: {
    EventParticipationPreview,
    Card,
    DataTable
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
  data () {
    return {
      firstLoading: false
    }
  },
  methods: {},
  computed: {
    ...mapState(['eventParticipations']),
    event (): Event {
      return this.$store.getters.event(this.eventId)
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
    participationPreviewColumns () {
      if ((this.eventParticipations?.length ?? 0) === 0) {
        return []
      }
      let ret = [
        { field: _('event_participation_headings.email'), width: 230 },
        { field: _('event_participation_headings.full_name'), width: 180 }
      ] as {
        field: string
        type?: string
        width?: number
        sortable?: boolean
        filter?: string
        colSpan?: number
        flex?: number
      }[]
      ;(this.eventParticipations[0] as EventParticipation).slots.forEach(s =>
        ret.push({
          width: 70,
          type: 'numberColumn',
          field:
            _('event_participation_headings.exercise') +
            ' ' +
            ((s.slot_number as number) + 1)
        })
      )
      return ret
    },
    participationsData () {
      return this.eventParticipations.map((p: EventParticipation) => {
        const ret = {
          [_('event_participation_headings.email')]: p.user?.email,
          [_('event_participation_headings.full_name')]: p.user?.full_name
        }
        p.slots.forEach(
          s =>
            (ret[
              _('event_participation_headings.exercise') +
                ' ' +
                ((s.slot_number as number) + 1)
            ] = (s.score as unknown) as string)
        )
        return ret
      })
    }
  }
})
</script>

<style></style>
