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
        <div class="flex items-end justify-between h-full">
          <router-link
            :to="{
              name: 'AssessmentReviewPage',
              params: {
                participationId: participation.id,
                examId: participation.event.id,
                courseId: courseId
              }
            }"
            ><Btn v-if="participation.assessment_available">{{
              $t('student_course_dashboard.view_assessment')
            }}</Btn></router-link
          >
          <router-link
            :to="{
              name: 'SubmissionReviewPage',
              params: {
                participationId: participation.id,
                examId: participation.event.id,
                courseId: courseId
              }
            }"
            ><Btn
              :outline="true"
              :class="{ 'mx-auto': !participation.assessment_available }"
              >{{ $t('student_course_dashboard.review_submission') }}</Btn
            ></router-link
          >
        </div>
      </template>
    </Card>
  </div>
</template>

<script lang="ts">
import { EventParticipation, EventType } from '@/models'
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
  computed: {},
  components: { Card, Timestamp, Btn }
})
</script>

<style></style>
