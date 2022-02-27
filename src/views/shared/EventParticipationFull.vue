<template>
  <div>
    <Card
      :hoverable="false"
      v-if="showSubmissionConfirmationMessage"
      class="mb-8 shadow-md bg-light"
    >
      <template v-slot:header
        ><div class="flex items-center space-x-4">
          <div>
            <div class="icon-surrounding bg-success-light text-success-dark">
              <span class="material-icons-outlined"> check </span>
            </div>
          </div>
          <p class="">{{ $t("event_participation_page.turned_in_text") }}</p>
        </div>
      </template></Card
    >
    <div class="px-6 py-6 rounded-md bg-gray-50" v-if="!firstLoading">
      <div class="flex mb-12">
        <div class="" v-if="showAssessment && !firstLoading">
          <div class="px-6 py-3 rounded bg-light shadow-elevation">
            <h4 class="text-muted">
              {{ $t("misc.score") }}: <strong>{{ participation.score }}</strong>
            </h4>
          </div>
        </div>
        <div class="ml-auto text-sm">
          <div class="flex space-x-1">
            <p class="text-muted">
              {{ $t("event_participation_page.begin_timestamp") }}:
            </p>
            <Timestamp :value="participation.begin_timestamp"></Timestamp>
          </div>
          <div class="flex space-x-1" v-if="participation.end_timestamp">
            <p class="text-muted">
              {{ $t("event_participation_page.turn_in_timestamp") }}:
            </p>
            <Timestamp :value="participation.end_timestamp"></Timestamp>
          </div>
        </div>
      </div>
      <div
        :class="{
          'mb-0 border-b-0': index === participation.slots.length - 1,
          'mb-16': index !== participation.slots.length - 1,
        }"
        class=""
        v-for="(slot, index) in participation.slots"
        :key="'p-' + participation.id + '-s-' + slot.id"
      >
        <h3 class="mb-1">
          {{ $t("event_participation_page.exercise") }}
          {{ slot.slot_number + 1 }}
        </h3>
        <AbstractEventParticipationSlot
          :modelValue="slot"
          :allowEditScores="allowEditScores"
          :showScores="showScores"
          :showAssessment="showAssessment"
        ></AbstractEventParticipationSlot>
      </div>
    </div>
    <div v-else>
      <SkeletonCard :borderLess="true"></SkeletonCard>
      <SkeletonCard :borderLess="true"></SkeletonCard>
      <SkeletonCard :borderLess="true"></SkeletonCard>
    </div>
  </div>
</template>

<script lang="ts">
import { courseIdMixin, eventIdMixin, loadingMixin } from "@/mixins";
import { defineComponent } from "@vue/runtime-core";
import AbstractEventParticipationSlot from "@/components/shared/AbstractEventParticipationSlot.vue";

import { createNamespacedHelpers } from "vuex";
import SkeletonCard from "../../components/ui/SkeletonCard.vue";
import Card from "@/components/ui/Card.vue";
import { EventParticipationState, EventState } from "@/models";
import Timestamp from "@/components/ui/Timestamp.vue";
const { mapState, mapActions } = createNamespacedHelpers("student");

export default defineComponent({
  name: "EventParticipationFull",
  mixins: [eventIdMixin, courseIdMixin, loadingMixin],
  props: {
    showScores: {
      type: Boolean,
      default: false,
    },
    allowEditScores: {
      type: Boolean,
      default: false,
    },
    showAssessment: {
      type: Boolean,
      default: false,
    },
    showSubmissionConfirmationMessage: {
      // should be boolean only, but it's passed via route params and TS complains about boolean params
      type: [Boolean, String],
      default: false,
    },
  },
  components: { AbstractEventParticipationSlot, SkeletonCard, Card, Timestamp },
  async created() {
    this.firstLoading = true;
    await this.getEventParticipation({
      courseId: this.courseId,
      eventId: this.eventId,
      participationId: this.participationId,
    });
    this.firstLoading = false;

    // participation is still in progress and exam is
    // still open, redirect to participation page
    if (
      this.participation.state !== EventParticipationState.TURNED_IN &&
      this.participation.event.state === EventState.OPEN
    ) {
      this.$router.push({
        name: "ExamParticipationPage",
        params: {
          examId: this.eventId,
        },
      });
    }
  },
  data() {
    return {
      firstLoading: false,
    };
  },
  methods: {
    ...mapActions(["getEventParticipation"]),
  },
  computed: {
    ...mapState({ participation: "currentEventParticipation" }),
    participationId(): string {
      return this.$router.currentRoute.value.params.participationId as string;
    },
  },
});
</script>

<style></style>
