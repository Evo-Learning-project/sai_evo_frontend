<template>
  <div>
    <Card
      :hoverable="false"
      v-if="showSubmissionConfirmationMessage"
      class="mb-8 shadow-md bg-light"
    >
      <!-- FIXME review shadow (make a shadow specifically for banners like this?)-->
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
    <div
      class="mb-4 items-start flex space-x-0.5 md:space-x-2"
      v-if="!firstLoading && allowEditScores"
    >
      <router-link :to="{ name: 'ExamProgress' }"
        ><Btn :outline="true" :variant="'icon'"
          ><span class="material-icons-outlined">arrow_back</span></Btn
        ></router-link
      >
      <h3 class="mt-1.25px">
        {{ $t("event_assessment.viewing_participation_of") }}
        {{ participation.user.full_name }}
      </h3>
    </div>
    <div class="px-2 py-6 rounded-md md:px-6 bg-gray-50" v-if="!firstLoading">
      <div class="flex flex-col space-y-2 md:flex-row md:space-y-0">
        <div class="" v-if="showAssessment && !firstLoading">
          <div
            class="px-6 rounded bg-light shadow-elevation-2"
            :class="{ 'py-3': !showEditScore, 'py-8': showEditScore }"
          >
            <div class="items-center flex space-x-2" v-if="!showEditScore">
              <p class="text-muted">
                {{ $t("misc.score") }}:
                <strong>{{ participation.score }}</strong>
              </p>
              <Btn
                v-if="allowEditScores"
                :outline="true"
                :variant="'icon'"
                @click="onShowEditScore()"
                ><span class="text-gray-600 material-icons-outlined text-lg"
                  >edit</span
                ></Btn
              >
            </div>
            <div class="flex flex-col space-y-4" v-else>
              <NumberInput v-model="dirtyScore">{{
                $t("event_assessment.overall_score")
              }}</NumberInput>
              <div>
                <Btn
                  class="mr-2"
                  :outline="false"
                  :variant="'primary'"
                  :loading="assessmentLoading"
                  @click="onHideEditScore()"
                >
                  {{ $t("event_assessment.confirm_assessment") }}
                </Btn>
                <Btn
                  :outline="true"
                  :disabled="assessmentLoading"
                  :variant="'primary'"
                  @click="onHideEditScore(true)"
                >
                  {{ $t("dialog.default_cancel_text") }}
                </Btn>
              </div>
            </div>
          </div>
        </div>
        <div class="text-sm md:ml-auto">
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
        class="flex space-x-2 items-start mt-2 md:w-3/5"
        v-if="allowEditScores && someSlotsPending"
      >
        <span class="text-xl material-icons-outlined text-yellow-900"
          >pending_actions</span
        >
        <p class="text-danger-dark text-muted">
          {{ $t("event_assessment.some_slots_pending") }}
        </p>
      </div>
      <div
        :class="{
          'mt-12': index === 0,
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
          @updateAssessment="onSlotUpdateAssessment(slot, $event)"
          :allowEditScores="allowEditScores"
          :showScores="showScores"
          :showAssessment="showAssessment"
          :showAssessmentControls="slotsAssessmentControlsVisibility[slot.id] ?? false"
          @setAssessmentControlsVisibility="
            slotsAssessmentControlsVisibility[slot.id] = $event
          "
          :assessmentLoading="slotsAssessmentLoading[slot.id] ?? false"
        ></AbstractEventParticipationSlot>
      </div>
    </div>
    <div class="px-6 py-6 rounded-md bg-gray-50" v-else>
      <SlotSkeleton></SlotSkeleton>
      <SlotSkeleton></SlotSkeleton>
      <SlotSkeleton></SlotSkeleton>
      <SlotSkeleton></SlotSkeleton>
    </div>
  </div>
</template>

<script lang="ts">
import { courseIdMixin, eventIdMixin, loadingMixin } from "@/mixins";
import { defineComponent } from "@vue/runtime-core";
import AbstractEventParticipationSlot from "@/components/shared/AbstractEventParticipationSlot.vue";

import { createNamespacedHelpers, mapActions } from "vuex";
import Card from "@/components/ui/Card.vue";
import {
  EventParticipation,
  EventParticipationSlot,
  EventParticipationState,
  EventState,
} from "@/models";
import Timestamp from "@/components/ui/Timestamp.vue";
import SlotSkeleton from "@/components/ui/skeletons/SlotSkeleton.vue";
import Btn from "@/components/ui/Btn.vue";
import NumberInput from "../../components/ui/NumberInput.vue";
const { mapState, mapMutations } = createNamespacedHelpers("student");

export default defineComponent({
  name: "EventParticipationFull",
  mixins: [eventIdMixin, courseIdMixin, loadingMixin],
  props: {
    showScores: {
      type: Boolean,
      default: true,
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
  components: {
    AbstractEventParticipationSlot,
    Card,
    Timestamp,
    SlotSkeleton,
    Btn,
    NumberInput,
  },
  async created() {
    await this.withFirstLoading(
      async () =>
        await this.getEventParticipation({
          courseId: this.courseId,
          eventId: this.eventId,
          participationId: this.participationId,
        })
    );

    // participation is still in progress and exam is
    // still open, redirect to participation page
    if (
      !this.allowEditScores && // not in teacher mode
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
      slotsAssessmentControlsVisibility: {} as Record<string, boolean>,
      slotsAssessmentLoading: {} as Record<string, boolean>,
      showEditScore: false,
      dirtyScore: undefined as number | undefined,
    };
  },
  methods: {
    ...mapActions("student", [
      "getEventParticipation",
      "partialUpdateEventParticipation",
    ]),
    ...mapActions("teacher", ["partialUpdateEventParticipationSlot"]),
    ...mapMutations(["setCurrentEventParticipationSlot"]),
    onShowEditScore() {
      this.dirtyScore = this.participation.score;
      this.showEditScore = true;
    },
    async onHideEditScore(discard = false) {
      if (discard) {
        this.showEditScore = false;
        return;
      }
      await this.withLocalLoading(
        async () =>
          await this.partialUpdateEventParticipation({
            courseId: this.courseId,
            changes: {
              score: this.dirtyScore,
            },
          })
      );
      this.showEditScore = false;
    },
    async onSlotUpdateAssessment(
      slot: EventParticipationSlot,
      assessment: { score: number; comment: string }
    ) {
      this.slotsAssessmentLoading[slot.id] = true;
      try {
        const updatedSlot = await this.partialUpdateEventParticipationSlot({
          courseId: this.courseId,
          eventId: this.eventId,
          participationId: this.participation.id,
          slotId: slot.id,
          changes: assessment,
          mutate: false,
        });
        // re-fetch participation to register any updates (e.g. the score property)
        await this.getEventParticipation({
          courseId: this.courseId,
          eventId: this.eventId,
          participationId: this.participationId,
        });
        //this.setCurrentEventParticipationSlot(updatedSlot);
        this.slotsAssessmentControlsVisibility[slot.id] = false;
      } catch (e) {
        this.setErrorNotification(e);
      } finally {
        this.slotsAssessmentLoading[slot.id] = false;
      }
    },
  },
  computed: {
    ...mapState({ participation: "currentEventParticipation" }),
    participationId(): string {
      return this.$router.currentRoute.value.params.participationId as string;
    },
    someSlotsPending(): boolean {
      return (
        (this.participation as EventParticipation | undefined)?.slots.some(
          (s) => s.score === null
        ) ?? true
      );
    },
  },
});
</script>

<style></style>
