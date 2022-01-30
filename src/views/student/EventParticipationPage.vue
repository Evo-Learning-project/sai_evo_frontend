<template>
  <div>
    <teleport v-if="mounted" to="#main-student-header-right">
      <CloudSaveStatus :saving="saving"></CloudSaveStatus
    ></teleport>
    <div
      class="mb-10"
      v-for="(slot, index) in proxyModelValue.slots"
      :key="'p-' + proxyModelValue.id + '-s-' + slot.id"
    >
      <h4>{{ $t('event_participation_page.exercise') }} {{ index + 1 }}</h4>
      <AbstractEventParticipationSlot
        :modelValue="slot"
        @updateSelectedChoices="onUpdateChoices(slot, $event)"
        @updateAnswerText="onUpdateAnswerText(slot, $event)"
        :allowEditSubmission="true"
        :saving="saving"
      ></AbstractEventParticipationSlot>
    </div>
  </div>
</template>

<script lang="ts">
import AbstractEventParticipationSlot from '@/components/shared/AbstractEventParticipationSlot.vue'
import CloudSaveStatus from '@/components/ui/CloudSaveStatus.vue'
import { courseIdMixin, eventIdMixin } from '@/mixins'
import { EventParticipation, EventParticipationSlot } from '@/models'
import { getDebouncedForStudentText } from '@/utils'
import { defineComponent } from '@vue/runtime-core'
//import { mapState } from 'vuex'

export default defineComponent({
  components: {
    AbstractEventParticipationSlot,
    CloudSaveStatus
  },
  name: 'EventParticipationPage',
  mixins: [courseIdMixin, eventIdMixin],
  async created () {
    this.dispatchAnswerTextUpdate = getDebouncedForStudentText(
      this.dispatchAnswerTextUpdate
    )
    await this.$store.dispatch('participateInEvent', {
      courseId: this.courseId,
      eventId: this.eventId
    })
  },
  mounted () {
    this.mounted = true // prevent issues with teleported component
  },

  data () {
    return {
      saving: false,
      mounted: false
    }
  },
  methods: {
    async onChange (newVal: EventParticipation) {
      console.log(newVal)
    },
    async onUpdateChoices (slot: EventParticipationSlot, newVal: string[]) {
      console.log('CHANGE CHOICES', slot.id, newVal)
      this.saving = true
      await this.$store.dispatch('partialUpdateEventSubmissionSlot', {
        courseId: this.courseId,
        eventId: this.eventId,
        slotId: slot.id,
        changes: { selected_choices: newVal }
      })
      this.saving = false
    },
    async onUpdateAnswerText (slot: EventParticipationSlot, newVal: string) {
      this.saving = true
      slot.answer_text = newVal
      await this.dispatchAnswerTextUpdate(slot, newVal)
    },
    async dispatchAnswerTextUpdate (slot: EventParticipationSlot, val: string) {
      await this.$store.dispatch('partialUpdateEventSubmissionSlot', {
        courseId: this.courseId,
        eventId: this.eventId,
        slotId: slot.id,
        changes: { answer_text: val },
        mutate: false
      })
      this.saving = false
    }
  },
  computed: {
    //...mapState(['eventParticipation']),
    proxyModelValue: {
      get (): EventParticipation {
        return this.$store.state.eventParticipation ?? {}
      },
      async set (val: EventParticipation) {
        await this.onChange(val)
      }
    }
  }
})
</script>

<style></style>
