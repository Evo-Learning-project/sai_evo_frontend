<template>
  <div>
    <div class="flex w-full mb-2">
      <Btn
        v-if="firstLoading || hasPrivileges([CoursePrivilege.MANAGE_EVENTS])"
        @click="onAddExam()"
        :loading="localLoading"
        class="ml-auto"
        :disabled="firstLoading"
        ><span class="mr-1 text-base material-icons-outlined">
          add_circle_outline
        </span>
        {{ $t('course_events.new_exam') }}</Btn
      >
    </div>
    <div
      v-if="!firstLoading"
      class="grid grid-cols-1 gap-4 mt-4 lg:grid-cols-2"
    >
      <EventEditorPreview
        v-for="(exam, index) in exams"
        :key="exam + '-' + index"
        :event="exam"
        @close="onClose(exam)"
      ></EventEditorPreview>
    </div>
    <div class="grid grid-cols-1 gap-4 mt-4 lg:grid-cols-2" v-else-if="false">
      <SkeletonCard :marginLess="true"></SkeletonCard>
      <SkeletonCard :marginLess="true"></SkeletonCard>
      <SkeletonCard :marginLess="true"></SkeletonCard>
      <SkeletonCard :marginLess="true"></SkeletonCard>
      <SkeletonCard :marginLess="true"></SkeletonCard>
      <SkeletonCard :marginLess="true"></SkeletonCard>
    </div>
    <div class="grid grid-cols-1 gap-4 mt-4 lg:grid-cols-2" v-else>
      <EventEditorPreviewSkeleton></EventEditorPreviewSkeleton>
      <EventEditorPreviewSkeleton></EventEditorPreviewSkeleton>
      <EventEditorPreviewSkeleton></EventEditorPreviewSkeleton>
      <EventEditorPreviewSkeleton></EventEditorPreviewSkeleton>
      <EventEditorPreviewSkeleton></EventEditorPreviewSkeleton>
      <EventEditorPreviewSkeleton></EventEditorPreviewSkeleton>
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
import { Event, EventState, CoursePrivilege, getBlankExam } from '@/models'
import Btn from '@/components/ui/Btn.vue'

import { defineComponent } from '@vue/runtime-core'
import { courseIdMixin, coursePrivilegeMixin, loadingMixin } from '@/mixins'
import SkeletonCard from '@/components/ui/SkeletonCard.vue'
import Dialog from '@/components/ui/Dialog.vue'

import { createNamespacedHelpers } from 'vuex'
import EventEditorPreviewSkeleton from '@/components/ui/skeletons/EventEditorPreviewSkeleton.vue'
const { mapActions, mapGetters } = createNamespacedHelpers('teacher')

export default defineComponent({
  components: {
    EventEditorPreview,
    Btn,
    SkeletonCard,
    Dialog,
    EventEditorPreviewSkeleton
  },
  name: 'CourseExams',
  mixins: [courseIdMixin, loadingMixin, coursePrivilegeMixin],
  async created () {
    await this.withFirstLoading(async () => await this.getEvents(this.courseId))
  },

  data () {
    return {
      CoursePrivilege,
      buttonLoading: false,
      showCloseDialog: false,
      closingExam: null as Event | null
    }
  },
  methods: {
    ...mapActions(['partialUpdateEvent', 'createEvent', 'getEvents']),
    onClose (event: Event) {
      this.showCloseDialog = true
      this.closingExam = event
    },
    async closeExam () {
      await this.withLoading(
        async () =>
          await this.partialUpdateEvent({
            courseId: this.courseId,
            eventId: this.closingExam?.id,
            mutate: true,
            changes: {
              state: EventState.CLOSED,
              users_allowed_past_closure: []
            }
          }),
        this.setErrorNotification,
        () => this.$store.commit('shared/showSuccessFeedback')
      )
      this.closingExam = null
      this.showCloseDialog = false
    },
    async onAddExam () {
      await this.withLocalLoading(async () => {
        const newExam = await this.createEvent({
          courseId: this.courseId,
          event: getBlankExam()
        })
        // redirect to exam editor for newly created exam
        this.$router.push({
          name: 'ExamEditor',
          params: { examId: newExam.id }
        })
      })
    }
  },
  computed: {
    ...mapGetters(['exams'])
  }
})
</script>

<style></style>
