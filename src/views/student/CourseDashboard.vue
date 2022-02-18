<template>
  <div class="mb-4">
    <div class="mb-8">
      <h2>{{ $t('student_course_dashboard.exams_you_participated_in') }}</h2>
      <div class="grid grid-cols-3 gap-4" v-if="!firstLoading">
        <!-- TODO distinguish between those still open and those turned in, like "Continua esercitazioni" -->
        <EventParticipationPreview
          v-for="participation in examParticipations"
          :key="'exam-participation-' + participation.id"
          :participation="participation"
        ></EventParticipationPreview>
      </div>
      <div class="grid grid-cols-3 gap-4" v-else>
        <SkeletonCard class="h-44"></SkeletonCard>
        <SkeletonCard class="h-44"></SkeletonCard>
        <SkeletonCard class="h-44"></SkeletonCard>
      </div>
    </div>

    <div>
      <h2>{{ $t('student_course_dashboard.your_practice_events') }}</h2>
      <div class="grid grid-cols-3 gap-4" v-if="!firstLoading">
        <div v-if="(currentCourse.unstarted_practice_events?.length ?? 0) > 0">
          <Card
            :margin-less="true"
            class="relative overflow-hidden text-gray-600 shadow-lg cursor-pointer h-44 bg-light"
            @mousedown="onCardMouseDown"
            @click="
              onResumePractice(currentCourse.unstarted_practice_events[0])
            "
          >
            <template v-slot:header>
              <h4 class="text-center opacity-70">
                {{ $t('student_course_dashboard.draft_practice') }}
              </h4>
            </template>
            <template v-slot:body>
              <div class="flex">
                <h1
                  class="mx-auto mt-1 text-5xl opacity-70 material-icons-outlined"
                >
                  redo
                </h1>
              </div>
            </template>
          </Card>
        </div>
        <Card
          v-else
          :margin-less="true"
          class="relative overflow-hidden text-gray-600 shadow-lg cursor-pointer h-44 bg-light"
          @mousedown="onCardMouseDown"
          @click="onCreatePractice()"
        >
          <template v-slot:header>
            <h2 class="text-center opacity-70">
              {{ $t('student_course_dashboard.new_practice') }}
            </h2>
          </template>
          <template v-slot:body>
            <div class="flex">
              <h1
                class="mx-auto -mt-1 text-5xl opacity-70 material-icons-outlined"
              >
                add_circle_outline
              </h1>
            </div>
          </template>
        </Card>
        <EventParticipationPreview
          v-for="participation in practiceParticipations"
          :key="'practice-participation-' + participation.id"
          :participation="participation"
        ></EventParticipationPreview>
      </div>
      <div class="grid grid-cols-3 gap-4" v-else>
        <SkeletonCard class="h-44"></SkeletonCard>
        <SkeletonCard class="h-44"></SkeletonCard>
        <SkeletonCard class="h-44"></SkeletonCard>
      </div>
    </div>
    <Dialog :show-dialog="!!editingEventTemplate">
      <template v-slot:title>
        {{
          isResumingUnstartedPractice
            ? $t('student_course_dashboard.resume_practice')
            : $t('student_course_dashboard.new_practice')
        }}
      </template>
      <template v-slot:body
        >Scegli come generare gli esercizi per questa esercitazione.
        <PracticeTemplateEditor
          v-if="editingEventTemplate"
          :modelValue="editingEventTemplate"
        ></PracticeTemplateEditor>
      </template>
    </Dialog>
  </div>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-extra-semi */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { courseIdMixin, loadingMixin } from '@/mixins'
import { defineComponent } from '@vue/runtime-core'
import { rippleEffect } from '@/utils'

import { mapGetters, mapActions, mapMutations, mapState } from 'vuex'
import EventParticipationPreview from '@/components/student/EventParticipationPreview.vue'
import SkeletonCard from '../../components/ui/SkeletonCard.vue'
import Card from '@/components/ui/Card.vue'
import { Event, EventTemplate, getBlankPractice } from '@/models'
import Dialog from '@/components/ui/Dialog.vue'
import PracticeTemplateEditor from '@/components/student/PracticeTemplateEditor.vue'

export default defineComponent({
  components: {
    EventParticipationPreview,
    SkeletonCard,
    Card,
    Dialog,
    PracticeTemplateEditor
  },
  name: 'CourseDashboard',
  mixins: [courseIdMixin, loadingMixin],
  async created () {
    this.firstLoading = true
    await this.getCourse({ courseId: this.courseId })
    this.firstLoading = false
  },
  data () {
    return {
      firstLoading: false
    }
  },
  methods: {
    ...mapActions('shared', ['getCourse']),
    ...mapActions('student', ['createEvent']),
    ...mapMutations('student', ['setEditingEventTemplate']),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onCardMouseDown (event: any) {
      rippleEffect(event, 'ripple-gray')
    },
    onResumePractice (event: Event) {
      this.setEditingEventTemplate(event.template)
    },
    async onCreatePractice () {
      if (this.loading) {
        return
      }
      ;(this.$store.state as any).shared.loading = true
      const newPracticeEvent = await this.createEvent({
        courseId: this.courseId,
        event: getBlankPractice()
      })
      this.setEditingEventTemplate(newPracticeEvent.template)
      ;(this.$store.state as any).shared.loading = false
    }
  },
  computed: {
    ...mapGetters('student', ['examParticipations', 'practiceParticipations']),
    ...mapGetters('shared', ['course']),
    ...mapState('student', ['editingEventTemplate']),
    currentCourse () {
      return this.course(this.courseId)
    },
    isResumingUnstartedPractice (): boolean {
      return (
        this.editingEventTemplate?.id ===
        this.currentCourse.unstarted_practice_events?.[0]?.template.id
      )
    }
  }
})
</script>

<style></style>
