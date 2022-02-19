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
        'pb-0 border-b-0': index === proxyModelValue.slots.length - 1
      }"
      class=""
      v-for="(slot, index) in proxyModelValue.slots"
      :key="'p-' + proxyModelValue.id + '-s-' + slot.id"
    >
      <h4>
        {{ $t('event_participation_page.exercise') }}
        {{ slot.slot_number + 1 }}
        <span v-if="oneExerciseAtATime"
          >{{ $t('event_participation_page.of') }}
          {{ proxyModelValue.last_slot_number + 1 }}
        </span>
      </h4>
      <AbstractEventParticipationSlot
        :modelValue="slot"
        @updateSelectedChoices="onUpdateChoices(slot, $event)"
        @updateAnswerText="onUpdateAnswerText(slot, $event)"
        :allowEditSubmission="true"
        :saving="saving"
      ></AbstractEventParticipationSlot>
    </div>
    <div class="flex w-full mt-8">
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
        {{ $t('event_participation_page.previous_exercise') }}</Btn
      >
      <Btn
        class="ml-auto"
        @click="goingBackAllowed ? onGoForward() : confirmGoForward()"
        v-if="canGoForward"
        :disabled="saving"
        :loading="loading"
        >{{ $t('event_participation_page.next_exercise') }}
        <span class="material-icons-outlined mt-0.5 ml-0.5 text-base">
          chevron_right
        </span></Btn
      >
      <Btn
        class="ml-auto"
        @click="confirmTurnIn"
        v-else-if="canTurnIn"
        :variant="'success'"
        >{{ $t('event_participation_page.turn_in') }}
        <span class="material-icons-outlined mt-0.5 text-base ml-1">
          check
        </span></Btn
      >
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
import AbstractEventParticipationSlot from '@/components/shared/AbstractEventParticipationSlot.vue'
import Btn from '@/components/ui/Btn.vue'
import CloudSaveStatus from '@/components/ui/CloudSaveStatus.vue'
import Dialog from '@/components/ui/Dialog.vue'
import {
  courseIdMixin,
  eventIdMixin,
  loadingMixin,
  savingMixin
} from '@/mixins'
import {
  EventParticipation,
  EventParticipationSlot,
  EventParticipationState,
  EventType
} from '@/models'
import { getDebouncedForStudentText } from '@/utils'
import { defineComponent } from '@vue/runtime-core'
import { getTranslatedString as _ } from '@/i18n'
import { DialogData } from '@/interfaces'
import SkeletonCard from '@/components/ui/SkeletonCard.vue'

import { createNamespacedHelpers, mapState } from 'vuex'
const { mapActions } = createNamespacedHelpers('student')

export default defineComponent({
  components: {
    AbstractEventParticipationSlot,
    CloudSaveStatus,
    Btn,
    Dialog,
    SkeletonCard
  },
  name: 'EventParticipationPage',
  mixins: [courseIdMixin, eventIdMixin, savingMixin, loadingMixin],
  async created () {
    this.dispatchAnswerTextUpdate = getDebouncedForStudentText(
      this.dispatchAnswerTextUpdate
    )

    this.firstLoading = true
    await this.participateInEvent({
      courseId: this.courseId,
      eventId: this.eventId
    })
    this.firstLoading = false

    // already turned in, redirect to submission review page
    if (this.proxyModelValue.state === EventParticipationState.TURNED_IN) {
      this.$router.push({
        name:
          this.proxyModelValue.event.event_type ===
          EventType.SELF_SERVICE_PRACTICE
            ? 'PracticeSummaryPage'
            : 'SubmissionReviewPage',
        params: {
          participationId: this.currentEventParticipation.id
        }
      })
    }
  },
  mounted () {
    this.mounted = true // prevent issues with teleported component
  },
  data () {
    return {
      saving: false,
      savingError: false,
      mounted: false,
      firstLoading: false,
      showConfirmDialog: false,
      dialogData: {
        title: '',
        text: '',
        yesText: '',
        onYes: () => null
      } as DialogData
    }
  },
  methods: {
    ...mapActions([
      'participateInEvent',
      'moveEventParticipationCurrentSlotCursorForward',
      'moveEventParticipationCurrentSlotCursorBack',
      'partialUpdateEventParticipationSlot',
      'partialUpdateEventParticipation'
    ]),
    async onGoForward () {
      this.showConfirmDialog = false
      await this.withLoading(
        async () =>
          await this.moveEventParticipationCurrentSlotCursorForward({
            courseId: this.courseId
          })
      )
    },
    async onGoBack () {
      await this.withLoading(
        async () =>
          await this.moveEventParticipationCurrentSlotCursorBack({
            courseId: this.courseId
          })
      )
    },
    async onTurnIn () {
      this.showConfirmDialog = false
      this.withLoading(
        async () =>
          await this.partialUpdateEventParticipation({
            courseId: this.courseId,
            changes: {
              state: EventParticipationState.TURNED_IN
            }
          })
      )

      this.$router.push({
        name:
          this.proxyModelValue.event.event_type ===
          EventType.SELF_SERVICE_PRACTICE
            ? 'PracticeSummaryPage'
            : 'SubmissionReviewPage',
        params: {
          participationId: this.currentEventParticipation.id,
          showSubmissionConfirmationMessage: 1 // should be `true`, but TS complains about type
        }
      })
      this.$store.commit('shared/showSuccessFeedback')
    },
    confirmGoForward () {
      this.dialogData = {
        title: _('event_participation_page.next_dialog_title'),
        text: _('event_participation_page.next_dialog_text'),
        yesText: _('event_participation_page.next_dialog_confirm_button'),
        onYes: this.onGoForward
      }
      this.showConfirmDialog = true
    },
    confirmTurnIn () {
      this.dialogData = {
        title: _('event_participation_page.turn_in_dialog_title'),
        text: _('event_participation_page.turn_in_dialog_text'),
        yesText: _('event_participation_page.turn_in_confirm_button'),
        onYes: this.onTurnIn
      }
      this.showConfirmDialog = true
    },
    async onChange (newVal: EventParticipation) {
      console.log(newVal)
    },
    async onUpdateChoices (slot: EventParticipationSlot, newVal: string[]) {
      this.saving = true
      this.savingError = false
      try {
        await this.partialUpdateEventParticipationSlot({
          courseId: this.courseId,
          eventId: this.eventId,
          participationId: this.proxyModelValue.id,
          slotId: slot.id,
          changes: { selected_choices: newVal }
        })
      } catch {
        this.savingError = true
      } finally {
        this.saving = false
      }
    },
    async onUpdateAnswerText (slot: EventParticipationSlot, newVal: string) {
      this.saving = true
      this.savingError = false
      // update in-memory value
      slot.answer_text = newVal
      try {
        await this.dispatchAnswerTextUpdate(slot, newVal)
      } catch {
        this.savingError = true
      }
      // finally {
      //   this.saving = false
      // }
    },
    async dispatchAnswerTextUpdate (slot: EventParticipationSlot, val: string) {
      await this.partialUpdateEventParticipationSlot({
        courseId: this.courseId,
        eventId: this.eventId,
        participationId: this.proxyModelValue.id,
        slotId: slot.id,
        changes: { answer_text: val },
        mutate: false
      })
      this.saving = false
    }
  },
  computed: {
    ...mapState('student', ['currentEventParticipation']),
    ...mapState('shared', ['loading']),
    proxyModelValue: {
      get (): EventParticipation {
        return this.currentEventParticipation ?? {}
      },
      async set (val: EventParticipation) {
        await this.onChange(val)
      }
    },
    oneExerciseAtATime (): boolean {
      return (this.proxyModelValue.event?.exercises_shown_at_a_time ?? 0) === 1
    },
    canGoForward (): boolean {
      return (
        this.oneExerciseAtATime &&
        (this.proxyModelValue.slots?.length ?? 0) > 0 &&
        !this.proxyModelValue.slots[0].is_last
      )
    },
    canGoBack (): boolean {
      return (
        this.oneExerciseAtATime &&
        (this.proxyModelValue.slots?.length ?? 0) > 0 &&
        !this.proxyModelValue.slots[0].is_first
      )
    },
    canTurnIn (): boolean {
      return (
        !this.firstLoading &&
        (!this.oneExerciseAtATime ||
          ((this.proxyModelValue.slots?.length ?? 0) > 0 &&
            (this.proxyModelValue.slots[0].is_last ?? false))) &&
        !this.turnedIn
      )
    },
    goingBackAllowed (): boolean {
      return (
        this.oneExerciseAtATime &&
        (this.proxyModelValue.event?.allow_going_back ?? false)
      )
    }
  }
})
</script>

<style></style>
