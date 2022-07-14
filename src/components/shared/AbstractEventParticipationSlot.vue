<template>
  <div :class="{ 'pl-4': subSlot }">
    <div class="w-full">
      <!-- heading, above the exercise text -->
      <div v-if="$slots.default" class="flex flex-wrap items-center">
        <div class="mb-0.5 mr-4">
          <!-- used to indicate the slot number, e.g. "Exercise 1" -->
          <slot></slot>
        </div>
      </div>

      <!--container for exercise and assessment -->
      <div
        :class="{
          'flex flex-col space-y-4': allowEditAssessment || showAssessmentCard,
          'md:flex-row md:space-x-8 md:space-y-0': true || !subSlot,
        }"
      >
        <!-- exercise -->
        <Exercise
          :exercise="exercise"
          :submission="submission"
          :readOnly="!allowEditSubmission"
          :showLabel="showExerciseLabel"
          :showSolution="showSolutionAndScores"
          :showPublicTags="showTags"
          @updateSubmission="onUpdateSubmission($event)"
          @runCode="$emit('runCode', modelValue)"
          @blur="$emit('blur', modelValue)"
          class="w-full"
          v-if="exercise.exercise_type !== ExerciseType.COMPLETION"
        />
        <!-- cloze exercise requires special treatment; might need
        to improve on this eventually -->
        <ClozeExercise
          v-else
          class="w-full"
          @updateSubmission="$emit('updateSubmission', $event)"
          :slot="modelValue"
          :showScores="showSolutionAndScores"
          :readOnly="!allowEditSubmission"
        />

        <!-- assessment card-->
        <div class="w-1/2" v-if="showAssessmentCard">
          <ParticipationSlotAssessment
            :assessment="assessment"
            :readOnly="!allowEditAssessment"
            :expanded="assessmentExpanded"
            :writeOnly="assessmentWriteOnly"
            @toggleExpanded="setAssessmentExpanded($event)"
            @save="onSaveAssessment($event)"
            @updateAssessment="onUpdateAssessment($event)"
            :loading="assessmentLoading"
          >
            <template #scoreTitle>
              {{
                !isProgrammingExercise
                  ? $t("misc.score")
                  : $t("misc.passed_tests")
              }}
            </template>
          </ParticipationSlotAssessment>
        </div>
        <!-- end assessment card -->
      </div>

      <!-- seen at - answered at info -->
      <div
        class="flex flex-col mt-4 space-y-1 text-sm  md:space-y-0 md:flex-row md:space-x-4"
        v-if="
          allowEditAssessment && (modelValue.seen_at || modelValue.answered_at)
        "
      >
        <div class="flex items-center" v-if="modelValue.seen_at">
          <span class="mr-1 text-sm material-icons-outlined text-muted">
            visibility
          </span>
          <span class="text-muted"
            >{{ $t("event_assessment.exercise_seen_at") }}&nbsp;</span
          >
          <Timestamp :value="modelValue.seen_at"></Timestamp>
        </div>
        <div class="flex items-center" v-if="modelValue.answered_at">
          <span class="mr-1 text-sm material-icons-outlined text-muted">
            question_answer
          </span>
          <span class="text-muted"
            >{{ $t("event_assessment.exercise_answered_at") }}&nbsp;</span
          ><Timestamp :value="modelValue.answered_at"></Timestamp>
        </div>
      </div>

      <!-- sub-slots -->
      <div
        class="mt-8 sub-slot-container"
        v-if="exercise.exercise_type === ExerciseType.AGGREGATED"
      >
        <!-- aggregated exercise -->
        <div
          v-for="(subSlot, index) in modelValue.sub_slots"
          :key="modelValue.id + '-sub-slot-' + subSlot.id"
          :class="{ 'mb-8': index !== modelValue.sub_slots.length - 1 }"
        >
          <AbstractEventParticipationSlot
            :subSlot="true"
            :modelValue="subSlot"
            :allowEditAssessment="allowEditAssessment"
            :allowEditSubmission="allowEditSubmission"
            :showAssessmentCard="showAssessmentCard"
            :showSolutionAndScores="showSolutionAndScores"
            :assessmentControlsVisibility="assessmentControlsVisibility"
            @runCode="$emit('runCode', $event)"
            @setAssessmentExpanded="$emit('setAssessmentExpanded', $event)"
            @updateAssessment="$emit('updateAssessment', $event)"
            @updateSubmission="$emit('updateSubmission', $event)"
            @blur="$emit('blur', $event)"
            @saveAssessment="$emit('saveAssessment', $event)"
          >
            <h4 class="text-lg">
              {{ $t("event_participation_page.exercise") }}
              {{ modelValue.slot_number + 1 }}.{{ subSlot.slot_number + 1 }}
            </h4>
          </AbstractEventParticipationSlot>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  EventParticipationSlot,
  EventParticipationSlotAssessment,
  EventParticipationSlotSubmission,
  Exercise as IExercise,
  ExerciseType,
  programmingExerciseTypes,
} from "@/models";
import { defineComponent, PropType } from "@vue/runtime-core";
import { getTranslatedString as _ } from "@/i18n";
import Timestamp from "../ui/Timestamp.vue";
import { texMixin } from "@/mixins";
import Exercise from "./Exercise/Exercise.vue";
import ParticipationSlotAssessment from "./ParticipationSlotAssessment.vue";
import { isOpenAnswerExercise, isProgrammingExercise } from "./Exercise/utils";
import ClozeExercise from "./Exercise/ClozeExercise.vue";

export default defineComponent({
  components: {
    Timestamp,
    Exercise,
    ParticipationSlotAssessment,
    ClozeExercise,
  },
  emits: {
    blur(slot: EventParticipationSlot) {
      return true;
    },
    saveAssessment(payload: {
      slot: EventParticipationSlot;
      changes: { score: number | null; comment: string };
    }) {
      return true;
    },
    updateSubmission(payload: {
      slot: EventParticipationSlot;
      payload: [keyof EventParticipationSlotSubmission, any];
    }) {
      return true;
    },
    updateAssessment(payload: {
      slot: EventParticipationSlot;
      payload: [keyof EventParticipationSlotAssessment, any];
    }) {
      return true;
    },
    setAssessmentExpanded(payload: {
      slot: EventParticipationSlot;
      payload: boolean;
    }) {
      return true;
    },
    runCode(slot: EventParticipationSlot) {
      return true;
    },
  },
  name: "AbstractEventParticipationSlot",
  props: {
    modelValue: {
      type: Object as PropType<EventParticipationSlot>,
      required: true,
    },
    subSlot: {
      type: Boolean,
      default: false,
    },
    allowEditAssessment: {
      // should be used when accessing as a teacher to assess the slot
      type: Boolean,
      default: false,
    },
    allowEditSubmission: {
      // whether user should be able to edit the submission fields (answer text, selected choices etc.)
      // to be used by students during the participation to an event
      type: Boolean,
      default: false,
    },
    showExerciseLabel: {
      // whether the exercise label (i.e. name of the exercise) should be displayed
      // to be used when displaying the exercise preview
      type: Boolean,
      default: false,
    },
    showSolutionAndScores: {
      // whether the exercises' solutions and choices' scores should be displayed
      // to be used when reviewing a participation to a practice event
      type: Boolean,
      default: false,
    },
    showAssessmentCard: {
      // whether the card with teacher assessment fields (scores and comments) should be displayed.
      // to be used when assessments are made available and a student displays them
      type: Boolean,
      default: false,
    },
    assessmentWriteOnly: {
      // whether the assessment controls should be displayed "stand-alone",
      // without the ability to collapse them and show the current assessment
      type: Boolean,
      default: false,
    },
    assessmentControlsVisibility: {
      // whether the card containing the input fields to assess the slot should be displayed.
      // to be used when accessing a full participation as a teacher and the user is editing
      // the assessment fields of the slot (i.e. clicked on edit button)
      type: Object as PropType<Record<string, boolean>>, // Boolean,
      default: () => {},
    },
    assessmentLoading: {
      // used when dispatching changes to the assessment slots, to disable the button
      // until the action has succeeded
      type: Boolean,
      default: false,
    },
    saving: {
      type: Boolean,
      default: false,
    },
    running: {
      // whether code for the submission is being run on the server
      type: Boolean,
    },
    showTags: {
      type: Boolean,
      default: false,
    },
  },
  mixins: [texMixin],
  created() {
    this.triggerTexRender();
  },
  methods: {
    onUpdateSubmission(change: [keyof EventParticipationSlotSubmission, any]) {
      this.$emit("updateSubmission", {
        slot: this.modelValue,
        payload: change,
      });
    },
    onUpdateAssessment(change: [keyof EventParticipationSlotAssessment, any]) {
      this.$emit("updateAssessment", {
        slot: this.modelValue,
        payload: change,
      });
    },
    setAssessmentExpanded(value: boolean) {
      this.$emit("setAssessmentExpanded", {
        slot: this.modelValue,
        payload: value,
      });
    },
    onSaveAssessment(changes: { score: number | null; comment: string }) {
      this.$emit("saveAssessment", {
        slot: this.modelValue,
        changes,
      });
    },
  },
  data() {
    return {
      ExerciseType,
    };
  },
  computed: {
    exercise(): IExercise {
      return this.modelValue.exercise;
    },
    assessment(): EventParticipationSlotAssessment {
      const { comment, score, score_edited, assessment_state } =
        this.modelValue;
      return {
        comment,
        score,
        score_edited,
        assessment_state,
      };
    },
    submission(): EventParticipationSlotSubmission {
      const { selected_choices, answer_text, execution_results, attachment } =
        this.modelValue;
      return {
        selected_choices,
        answer_text,
        execution_results,
        attachment,
      };
    },
    isProgrammingExercise() {
      return isProgrammingExercise(this.exercise);
    },
    isOpenAnswerExercise() {
      return isOpenAnswerExercise(this.exercise);
    },
    assessmentExpanded(): boolean {
      return (
        this.assessmentWriteOnly ||
        (this.assessmentControlsVisibility?.[this.modelValue.id] ?? false)
      );
    },
    someSubSlotsPending(): boolean {
      return this.modelValue.sub_slots.some((s) => s.score === null);
    },
  },
});
</script>

<style></style>
