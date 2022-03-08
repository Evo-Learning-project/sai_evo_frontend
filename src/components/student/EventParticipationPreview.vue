<template>
  <div>
    <Card
      :class="{
        'bg-primary bg-opacity-10 ': isParticipable,
      }"
      :margin-less="true"
      class="h-44"
    >
      <template v-slot:header>
        <p class="text-sm font-medium text-center uppercase text-muted">
          <Timestamp :value="participation.begin_timestamp" :date-only="true"></Timestamp>
        </p>
        <h4 class="text-center" v-if="participation.event.name.length > 0">
          {{ participation.event.name }}
        </h4>
      </template>
      <template v-slot:body>
        <div class="flex flex-col h-full">
          <div
            class=""
            v-if="
              participation.event.event_type === EventType.SELF_SERVICE_PRACTICE &&
              participation.assessment_available
            "
          >
            <p class="text-lg text-center">
              <span
                class="text-4xl font-semibold"
                :class="{
                  'text-success': participation.score >= participation.max_score * 0.6,
                  'text-yellow-700':
                    participation.score >= participation.max_score / 2 &&
                    participation.score < participation.max_score * 0.6,
                  'text-danger-dark': participation.score < participation.max_score / 2,
                }"
                >{{ participation.score }}</span
              ><span class="ml-1 text-muted">/{{ participation.max_score }}</span>
            </p>
          </div>
          <div
            class="flex flex-col items-center w-full mt-auto xl:justify-between xl:flex-row xl:space-y-0"
            v-if="isParticipable"
          >
            <router-link
              class="order-12 mt-6 xl:mt-0 xl:order-1"
              :to="{
                name:
                  participation.event.event_type === EventType.SELF_SERVICE_PRACTICE
                    ? 'PracticeParticipationPage'
                    : 'ExamParticipationPage',
                params: {
                  examId: participation.event.id,
                  courseId: courseId,
                },
              }"
            >
              <Btn>
                <span class="text-base material-icons-outlined"> meeting_room </span>
                {{ $t("student_course_dashboard.resume") }}
              </Btn>
            </router-link>
            <div
              class="chip mx-0 order-1 xl:order-2 border-primary bg-primary bg-opacity-20 text-primary mb-0 pt-0.5"
            >
              <span class="material-icons-outlined text-base mr-1 mt-1.25px">
                more_horiz
              </span>
              {{ $t("student_course_dashboard.pending") }}
            </div>
          </div>
          <div class="flex w-full mt-auto" v-else>
            <router-link
              :class="{
                'mx-auto':
                  participation.event.event_type === EventType.SELF_SERVICE_PRACTICE,
                'mr-auto':
                  participation.event.event_type !== EventType.SELF_SERVICE_PRACTICE,
              }"
              v-if="participation.assessment_available"
              :to="{
                name:
                  participation.event.event_type === EventType.SELF_SERVICE_PRACTICE
                    ? 'PracticeSummaryPage'
                    : 'AssessmentReviewPage',
                params: {
                  participationId: participation.id,
                  examId: participation.event.id,
                  courseId: courseId,
                },
              }"
            >
              <Btn
                ><span class="mr-2 text-base material-icons-outlined">
                  assignment_turned_in </span
                >{{
                  participation.event.event_type === EventType.SELF_SERVICE_PRACTICE
                    ? $t("student_course_dashboard.practice_summary")
                    : $t("student_course_dashboard.view_assessment")
                }}</Btn
              >
            </router-link>
            <router-link
              v-if="participation.event.event_type !== EventType.SELF_SERVICE_PRACTICE"
              :to="{
                name: 'SubmissionReviewPage',
                params: {
                  participationId: participation.id,
                  examId: participation.event.id,
                  courseId: courseId,
                },
              }"
              :class="{ 'mx-auto': !participation.assessment_available }"
            >
              <Btn :outline="true">{{
                $t("student_course_dashboard.review_submission")
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
  EventType,
} from "@/models";
import { defineComponent, PropType } from "@vue/runtime-core";
import Card from "../ui/Card.vue";
import Timestamp from "../ui/Timestamp.vue";
import Btn from "../ui/Btn.vue";
import { courseIdMixin } from "@/mixins";

export default defineComponent({
  name: "EventParticipationPreview",
  props: {
    participation: {
      type: Object as PropType<EventParticipation>,
      required: true,
    },
  },
  mixins: [courseIdMixin],
  data() {
    return {
      EventType,
    };
  },
  computed: {
    isParticipable(): boolean {
      return (
        this.participation.event.state === EventState.OPEN &&
        this.participation.state === EventParticipationState.IN_PROGRESS
      );
    },
  },
  components: {
    Card,
    Timestamp,
    Btn,
  },
});
</script>

<style></style>
