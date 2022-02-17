<template>
  <div>
    <Card :margin-less="true" class="h-44">
      <template v-slot:header>
        <p class="text-sm font-medium text-center uppercase text-muted">
          <Timestamp
            :value="participation.begin_timestamp"
            :date-only="true"
          ></Timestamp>
        </p>
        <h4 class="text-center" v-if="participation.event.name.length > 0">
          {{ participation.event.name }}
        </h4>
      </template>
      <template v-slot:body>
        <div class="flex items-end h-full">
          <div class="flex justify-between w-full" v-if="isParticipable">
            <router-link
              :to="{
                name: 'ExamParticipationPage',
                params: {
                  examId: participation.event.id,
                  courseId: courseId
                }
              }"
            >
              <Btn :outline="true"
                ><span class="text-base mr-1.5 material-icons-outlined">
                  meeting_room
                </span>
                {{ $t('student_course_dashboard.resume') }}</Btn
              >
            </router-link>
            <div
              class="chip animate-pulse border-primary bg-primary bg-opacity-20 text-primary mb-0 pt-0.5"
            >
              <span class="material-icons-outlined text-base mr-1 mt-1.25px">
                more_horiz
              </span>
              {{ $t('student_course_dashboard.pending') }}
            </div>
          </div>
          <div class="flex w-full" v-else>
            <router-link
              class="mr-auto"
              v-if="participation.assessment_available"
              :to="{
                name: 'AssessmentReviewPage',
                params: {
                  participationId: participation.id,
                  examId: participation.event.id,
                  courseId: courseId
                }
              }"
            >
              <Btn
                ><span class="material-icons-outlined text-base mr-2">
                  assignment_turned_in </span
                >{{ $t('student_course_dashboard.view_assessment') }}</Btn
              >
            </router-link>
            <router-link
              :to="{
                name: 'SubmissionReviewPage',
                params: {
                  participationId: participation.id,
                  examId: participation.event.id,
                  courseId: courseId
                }
              }"
              :class="{ 'ml-auto': !participation.assessment_available }"
            >
              <Btn :outline="true">{{
                $t('student_course_dashboard.review_submission')
              }}</Btn>
            </router-link>
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>

<script lang="ts">
import {
  EventParticipation,
  EventParticipationState,
  EventState,
  EventType
} from '@/models'
import { defineComponent, PropType } from '@vue/runtime-core'
import Card from '../ui/Card.vue'
import Timestamp from '../ui/Timestamp.vue'
import Btn from '../ui/Btn.vue'
import { courseIdMixin } from '@/mixins'

export default defineComponent({
  name: 'EventParticipationPreview',
  props: {
    participation: {
      type: Object as PropType<EventParticipation>,
      required: true
    }
  },
  mixins: [courseIdMixin],
  data () {
    return {
      EventType
    }
  },
  computed: {
    isParticipable (): boolean {
      // TODO handle half-closure
      return (
        this.participation.event.state === EventState.OPEN &&
        this.participation.state === EventParticipationState.IN_PROGRESS
      )
    }
  },
  components: {
    Card,
    Timestamp,
    Btn
  }
})
</script>

<style></style>
