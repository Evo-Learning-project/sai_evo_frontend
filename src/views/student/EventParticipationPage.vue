<template>
  <div class="flex flex-col flex-grow h-full">
    <teleport v-if="mounted" to="#main-student-header-right">
      <CloudSaveStatus :saving="saving"></CloudSaveStatus
    ></teleport>
    <div
      :class="{
        'flex-grow': oneExerciseAtATime,
        'mb-auto': !oneExerciseAtATime
      }"
      class=""
      v-for="slot in proxyModelValue.slots"
      :key="'p-' + proxyModelValue.id + '-s-' + slot.id"
    >
      <h4>
        {{ $t('event_participation_page.exercise') }}
        {{ slot.slot_number + 1 }}
        <span v-if="oneExerciseAtATime"
          >{{ $t('event_participation_page.of') }}
          {{ proxyModelValue.last_slot_number }}
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
        @btnClick="onGoBack"
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
        @btnClick="goingBackAllowed ? onGoForward() : confirmGoForward()"
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
        @btnClick="confirmTurnIn"
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
import { courseIdMixin, eventIdMixin } from '@/mixins'
import {
  EventParticipation,
  EventParticipationSlot,
  EventParticipationState
} from '@/models'
import { getDebouncedForStudentText } from '@/utils'
import { defineComponent } from '@vue/runtime-core'
//import { mapState } from 'vuex'
import { getTranslatedString as _ } from '@/i18n'
import { DialogData } from '@/interfaces'

export default defineComponent({
  components: {
    AbstractEventParticipationSlot,
    CloudSaveStatus,
    Btn,
    Dialog
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
      mounted: false,
      firstLoading: false,
      loading: false,
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
    async onGoForward () {
      this.loading = true
      this.showConfirmDialog = false
      await this.$store.dispatch(
        'moveEventParticipationCurrentSlotCursorForward',
        { courseId: this.courseId }
      )
      this.loading = false
    },
    async onGoBack () {
      this.loading = true
      await this.$store.dispatch(
        'moveEventParticipationCurrentSlotCursorBack',
        {
          courseId: this.courseId
        }
      )
      this.loading = false
    },
    async onTurnIn () {
      this.showConfirmDialog = false
      this.loading = true
      await this.$store.dispatch('partialUpdateEventParticipation', {
        courseId: this.courseId,
        changes: {
          state: EventParticipationState.TURNED_IN
        }
      })
      this.loading = false
    },
    confirmGoForward () {
      console.log('confirm')
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
      await this.$store.dispatch('partialUpdateEventParticipationSlot', {
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
      await this.$store.dispatch('partialUpdateEventParticipationSlot', {
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
    proxyModelValue: {
      get (): EventParticipation {
        return this.$store.state.eventParticipation ?? {}
      },
      async set (val: EventParticipation) {
        await this.onChange(val)
      }
    },
    oneExerciseAtATime (): boolean {
      return (this.proxyModelValue.event?.exercises_shown_at_a_time ?? 0) == 1
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
            (this.proxyModelValue.slots[0].is_last ?? false)))
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
