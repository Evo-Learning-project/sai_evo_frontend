<template>
  <div>
    <div class="flex w-full mb-2">
      <Btn @btnClick="onAddExam()" :loading="buttonLoading" class="ml-auto"
        ><span class="mr-1 text-base material-icons-outlined">
          add_circle_outline
        </span>
        {{ $t('course_events.new_exam') }}</Btn
      >
    </div>
    <div v-if="!firstLoading" class="grid grid-cols-2 gap-4 mt-4">
      <EventEditorPreview
        v-for="(exam, index) in exams"
        :key="exam + '-' + index"
        :event="exam"
        @close="onClose(exam)"
      ></EventEditorPreview>
    </div>
    <div class="grid grid-cols-2 gap-4 mt-4" v-else>
      <SkeletonCard :marginLess="true"></SkeletonCard>
      <SkeletonCard :marginLess="true"></SkeletonCard>
      <SkeletonCard :marginLess="true"></SkeletonCard>
      <SkeletonCard :marginLess="true"></SkeletonCard>
      <SkeletonCard :marginLess="true"></SkeletonCard>
      <SkeletonCard :marginLess="true"></SkeletonCard>
    </div>
    <Dialog
      :warning="true"
      :showDialog="showCloseDialog"
      @no="showCloseDialog = false"
      @yes="closeExam()"
      :yesText="$t('course_events.close_for_everyone')"
      :noText="$t('dialog.default_cancel_text')"
    >
      <template v-slot:title>
        {{ $t('course_events.close_exam_for_everyone_title') }}
      </template>
      <template v-slot:body>
        <p>
          {{ $t('course_events.close_exam_for_everyone_body_1') }}
          <strong>{{ closingExam.name }}</strong>
          &nbsp;<em>{{
            $t('course_events.close_exam_for_everyone_body_2')
          }}</em>
          {{ $t('course_events.close_exam_for_everyone_body_3') }}
          <em>{{ $t('event_preview.monitor') }}</em
          >.
        </p>
      </template>
    </Dialog>
  </div>
</template>

<script lang="ts">
import EventEditorPreview from '@/components/teacher/EventEditor/EventEditorPreview.vue'
import { Event, EventState, getBlankExam } from '@/models'
import Btn from '@/components/ui/Btn.vue'

import { defineComponent } from '@vue/runtime-core'
import { courseIdMixin, loadingMixin } from '@/mixins'
import SkeletonCard from '@/components/ui/SkeletonCard.vue'
import Dialog from '@/components/ui/Dialog.vue'
export default defineComponent({
  components: {
    EventEditorPreview,
    Btn,
    SkeletonCard,
    Dialog
  },
  name: 'CourseExams',
  mixins: [courseIdMixin, loadingMixin],
  async created () {
    this.firstLoading = true
    await this.$store.dispatch('getEvents', this.courseId)
    this.firstLoading = false
  },

  data () {
    return {
      firstLoading: false,
      buttonLoading: false,
      showCloseDialog: false,
      closingExam: null as Event | null
    }
  },
  methods: {
    onClose (event: Event) {
      this.showCloseDialog = true
      this.closingExam = event
    },
    async closeExam () {
      await this.withLoading(
        async () =>
          await this.$store.dispatch('partialUpdateEvent', {
            courseId: this.courseId,
            eventId: this.closingExam?.id,
            mutate: true,
            changes: {
              state: EventState.CLOSED,
              users_allowed_past_closure: []
            }
          })
      )
      this.closingExam = null
      this.showCloseDialog = false
      this.$store.commit('showSuccessFeedback')
    },
    async onAddExam () {
      this.buttonLoading = true
      const newExam = await this.$store.dispatch('createEvent', {
        courseId: this.courseId,
        event: getBlankExam()
      })
      this.buttonLoading = false

      // redirect to exam editor for newly created exam
      this.$router.push({
        name: 'ExamEditor',
        params: { examId: newExam.id }
      })
    }
  },
  computed: {
    exams (): Event[] {
      return this.$store.getters.exams
    }
  }
})
</script>

<style></style>
