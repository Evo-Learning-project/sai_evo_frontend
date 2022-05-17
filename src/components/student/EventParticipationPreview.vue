<template>
  <div>
    <Card
      :class="{
        'bg-primary-light bg-opacity-0': isParticipable,
        'md:h-23rem h-64':
          participation.event.event_type === EventType.SELF_SERVICE_PRACTICE,
        'h-44':
          participation.event.event_type !== EventType.SELF_SERVICE_PRACTICE,
      }"
    >
      <!-- 334 x 371 -->
      <template v-slot:header>
        <h3 class="text-center" v-if="participation.event.name.length > 0">
          {{ participation.event.name }}
        </h3>
        <div class="flex mx-auto font-medium text-muted">
          <p class="mx-auto space-x-1">
            <span class="hidden inline-icon material-icons-outlined light-icon">
              event
            </span>
            <Timestamp
              :value="participation.begin_timestamp"
              :date-only="true"
            ></Timestamp>
          </p>
        </div>
      </template>
      <template v-slot:body>
        <div class="flex flex-col h-full">
          <div
            v-if="false && isParticipable"
            class="chip mx-auto chip-primary mb-0 pt-0.5"
          >
            <span class="material-icons-outlined text-base mr-1 mt-1.25px">
              update
            </span>
            {{ $t("student_course_dashboard.pending") }}
          </div>
          <img class="hidden my-4" src="../../../public/thumb.png" />

          <div
            class="flex hidden mx-auto"
            v-if="
              participation.event.event_type ===
                EventType.SELF_SERVICE_PRACTICE &&
              participation.assessment_available
            "
          >
            <p class="mt-4 text-lg text-center">
              <span
                class="text-4xl font-semibold"
                :class="{
                  'text-success':
                    participation.score >= participation.max_score * 0.6,
                  'text-yellow-700':
                    participation.score >= participation.max_score / 2 &&
                    participation.score < participation.max_score * 0.6,
                  'text-danger-dark':
                    participation.score < participation.max_score / 2,
                }"
                >{{
                  Number.isInteger(parseFloat(participation.score))
                    ? parseInt(participation.score)
                    : participation.score
                }}</span
              ><span class="ml-1 text-muted"
                >/{{ participation.max_score }}
              </span>
            </p>
            <Tooltip
              class="mt-auto mb-2.5 -mr-6 opacity-40 hover:opacity-100"
              :textCode="'practice_score'"
            ></Tooltip>
          </div>
          <div
            class=""
            v-if="
              participation.event.event_type === EventType.SELF_SERVICE_PRACTICE
            "
          >
            <ParticipationThumbnail
              :participation="participation"
            ></ParticipationThumbnail>
          </div>
          <div
            v-if="
              participation.event.event_type === EventType.SELF_SERVICE_PRACTICE
            "
            class="h-0 -mx-4 border-b md:-mx-5"
          ></div>
          <div class="flex items-center mt-auto">
            <div class="" v-if="isParticipable">
              <router-link
                class="order-12 md:mt-6 xl:mt-0 xl:order-1"
                :to="{
                  name:
                    participation.event.event_type ===
                    EventType.SELF_SERVICE_PRACTICE
                      ? 'PracticeParticipationPage'
                      : 'ExamParticipationPage',
                  params: {
                    examId: participation.event.id,
                    courseId: courseId,
                  },
                }"
              >
                <Btn :variant="'primary'" :outline="false" :size="'sm'">
                  <span class="mr-2 text-lg material-icons-outlined">
                    update
                  </span>
                  {{ $t("student_course_dashboard.resume") }}
                </Btn>
              </router-link>
            </div>
            <div class="flex w-full -mt-0.5" v-else>
              <router-link
                :class="{
                  'mx-auto':
                    false &&
                    participation.event.event_type ===
                      EventType.SELF_SERVICE_PRACTICE,
                  'mr-auto':
                    false &&
                    participation.event.event_type !==
                      EventType.SELF_SERVICE_PRACTICE,
                }"
                v-if="participation.assessment_available"
                :to="{
                  name:
                    participation.event.event_type ===
                    EventType.SELF_SERVICE_PRACTICE
                      ? 'PracticeSummaryPage'
                      : 'AssessmentReviewPage',
                  params: {
                    participationId: participation.id,
                    examId: participation.event.id,
                    courseId: courseId,
                  },
                }"
              >
                <Btn :size="'sm'" :variant="'primary-borderless'">
                  {{
                    participation.event.event_type ===
                    EventType.SELF_SERVICE_PRACTICE
                      ? $t("student_course_dashboard.practice_summary")
                      : $t("student_course_dashboard.view_assessment")
                  }}</Btn
                >
              </router-link>
              <router-link
                v-if="
                  participation.event.event_type !==
                  EventType.SELF_SERVICE_PRACTICE
                "
                :to="{
                  name: 'SubmissionReviewPage',
                  params: {
                    participationId: participation.id,
                    examId: participation.event.id,
                    courseId: courseId,
                  },
                }"
                :class="{
                  'mx-auto': false && !participation.assessment_available,
                }"
              >
                <Btn :size="'sm'" :variant="'primary-borderless'">{{
                  $t("student_course_dashboard.review_submission")
                }}</Btn>
              </router-link>
            </div>
            <Btn v-if="false" :variant="'icon'" :outline="true" class="ml-auto"
              ><span class="material-icons">bookmark</span></Btn
            >
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
import Tooltip from "../ui/Tooltip.vue";
import ParticipationThumbnail from "./ParticipationThumbnail.vue";

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
    Tooltip,
    ParticipationThumbnail,
  },
});
</script>

<style></style>
