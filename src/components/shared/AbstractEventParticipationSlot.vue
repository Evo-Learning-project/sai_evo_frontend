<template>
  <div :class="{ 'pl-6': subSlot }">
    <div class="w-full">
      <!-- exercise label (shown in teacher mode) -->
      <h3 v-if="showExerciseLabel">{{ exercise.label }}</h3>

      <!-- exercise text (not shown if programming exercise and not in review mode) -->
      <!-- TODO clarify condition (!allowEditSubmission && !showExerciseLabel) -->
      <div
        class="mb-8 user-content"
        :class="{
          'bg-gray-200 p-2 border border-dark rounded-md': false && allowEditScores,
        }"
        v-if="
          exercise.exercise_type !== ExerciseType.JS ||
          (!allowEditSubmission && !showExerciseLabel)
        "
        v-html="exercise.text"
      ></div>

      <!-- if assessment edit mode, make flex so to fit submission on the left and assessment on the right -->
      <div
        :class="{
          'flex  md:flex-row flex-col md:space-y-0 space-y-4 md:space-x-8':
            allowEditScores || showAssessment,
        }"
      >
        <!-- controls to submit -->
        <div
          :class="{
            'w-full': allowEditScores || showAssessment,
            'md:w-1/2': (allowEditScores || showAssessment) && subSlot,
          }"
        >
          <!-- multiple choice multiple possible -->
          <CheckboxGroup
            v-if="
              exercise.exercise_type === ExerciseType.MULTIPLE_CHOICE_MULTIPLE_POSSIBLE
            "
            :options="exerciseChoicesAsOptions"
            v-model="selectedChoicesProxy"
            :disabled="!allowEditSubmission || saving"
            v-slot="{ description }"
          >
            <p class="mb-2 text-sm text-muted text-primary font-semibold">
              {{ description }}
            </p>
          </CheckboxGroup>

          <!-- multiple choice single possible -->
          <RadioGroup
            v-else-if="
              exercise.exercise_type === ExerciseType.MULTIPLE_CHOICE_SINGLE_POSSIBLE
            "
            :options="exerciseChoicesAsOptions"
            v-model="selectedChoicesProxy"
            :disabled="!allowEditSubmission || saving"
            v-slot="{ description }"
          >
            <p class="mb-2 text-sm font-semibold text-muted text-primary">
              {{ description }}
            </p>
          </RadioGroup>

          <!-- open answer -->
          <TextEditor
            :disabled="!allowEditSubmission"
            v-else-if="exercise.exercise_type === ExerciseType.OPEN_ANSWER"
            v-model="answerTextProxy"
          >
            {{
              allowEditSubmission
                ? $t("event_participation_slot.text_answer_label")
                : $t("event_assessment.text_answer_label")
            }}
          </TextEditor>

          <!-- aggregated answer -->
          <div
            v-else-if="exercise.exercise_type === ExerciseType.AGGREGATED"
            v-for="(subSlot, index) in modelValue.sub_slots"
            :key="modelValue.id + '-sub-slot-' + subSlot.id"
            :class="{ 'mb-6': index !== modelValue.sub_slots.length - 1 }"
          >
            <AbstractEventParticipationSlot
              :subSlot="true"
              :modelValue="subSlot"
              :allowEditScores="allowEditScores"
              :allowEditSubmission="allowEditSubmission"
              :showAssessment="showAssessment"
              :showScores="showScores"
            >
            </AbstractEventParticipationSlot>
          </div>

          <!-- programming exercise -->
          <ProgrammingExercise
            v-else-if="
              exercise.exercise_type === ExerciseType.JS &&
              (allowEditSubmission || showExerciseLabel)
            "
            :exercise="modelValue.exercise"
            v-model="answerTextProxy"
            :executionResults="modelValue.execution_results"
            :slot="modelValue"
            :running="running"
            @runCode="$emit('runCode')"
            :showEditor="allowEditSubmission"
          ></ProgrammingExercise>
          <!-- if reviewing submission, just show submitted code and execution results-->
          <div
            v-else-if="exercise.exercise_type === ExerciseType.JS && !allowEditSubmission"
          >
            <CodeFragment
              class="mb-4"
              :value="modelValue.answer_text"
              v-if="!showExerciseLabel"
            ></CodeFragment>
            <CodeExecutionResults
              :slot="modelValue"
              v-if="!showExerciseLabel"
            ></CodeExecutionResults>
          </div>

          <!-- attachment exercise-->
          <FileUpload
            @download="$emit('download')"
            v-model="attachmentProxy"
            :disabled="!allowEditSubmission"
            v-else-if="exercise.exercise_type === ExerciseType.ATTACHMENT"
          ></FileUpload>
        </div>

        <!-- assessment card-->
        <div
          :class="{
            'md:w-1/2': true || modelValue.sub_slots.length === 0,
            'md:w-1/3': false && modelValue.sub_slots.length > 0,
          }"
          class="px-6 py-3 mb-auto rounded md:self-start bg-light shadow-elevation-2 bg-opacity-70"
          v-if="showAssessment && (!showAssessmentControls || !allowEditScores)"
        >
          <!-- score -->
          <div
            v-if="!showAssessmentControls && allowEditScores && modelValue.score == null"
            class="text-danger-dark text-muted text-sm flex items-center space-x-1"
          >
            <span class="my-auto text-base material-icons-outlined text-yellow-900"
              >pending_actions</span
            >
            <p>
              {{ $t("event_assessment.this_exercise_requires_manual_assessment") }}
            </p>
          </div>
          <div class="flex items-center space-x-2">
            <p class="text-muted">
              {{ $t("misc.score") }}:
              <strong class="text-lg">{{ modelValue.score }}</strong>
              <span v-if="modelValue.exercise.max_score"
                >&nbsp;{{ $t("misc.out_of") }}
                <strong class="text-lg">
                  {{ modelValue.exercise.max_score }}</strong
                ></span
              >
            </p>
            <Btn
              v-if="allowEditScores"
              :outline="true"
              :variant="'icon'"
              @click="onShowAssessmentControls()"
              ><span class="text-gray-600 material-icons-outlined text-lg"
                >edit</span
              ></Btn
            >
          </div>

          <!-- teacher comment -->
          <p v-if="(modelValue.comment?.length ?? 0) > 0" class="mt-2 text-muted">
            {{ $t("misc.teacher_comment") }}:
          </p>
          <p v-html="modelValue.comment"></p>

          <!-- exercise solution -->
          <p
            v-if="(modelValue.exercise.solution?.length ?? 0) > 0"
            class="mt-2 text-muted"
          >
            {{ $t("misc.solution") }}:
          </p>
          <p v-html="modelValue.exercise.solution"></p>
        </div>

        <!-- controls to assess -->
        <div
          v-if="allowEditScores && (!showAssessment || showAssessmentControls)"
          class="flex flex-col md:w-1/2"
          :class="{
            'rounded bg-light shadow-elevation-2 bg-opacity-70 px-6 py-8': showAssessmentControls,
          }"
        >
          <div class="flex flex-col md:flex-row md:items-center">
            <h3>{{ $t("event_assessment.your_assessment") }}</h3>
            <div
              class="flex flex-col text-sm md:ml-auto"
              v-if="modelValue.seen_at || modelValue.answered_at"
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
          </div>
          <!-- notice text to assess -->
          <p
            class="text-sm text-muted text-danger-dark"
            v-if="modelValue.score == null || modelValue.score.length == 0"
          >
            {{ $t("event_assessment.this_exercise_requires_manual_assessment") }}
          </p>
          <div class="mt-4">
            <!-- actual assessment controls -->
            <p>
              <NumberInput class="mb-4" v-model="scoreProxy"
                >{{ $t("event_assessment.assigned_score")
                }}<!--@update:modelValue="
                  showAssessmentControls
                    ? (dirtyScore = $event)
                    : emitUpdate('score', $event)
                "-->
              </NumberInput>
              <TextEditor class="w-full" v-model="commentProxy">{{
                $t("event_assessment.comment_for_student")
              }}</TextEditor>
            </p>
          </div>
          <!-- controls to save or discard changes -->
          <div v-if="showAssessmentControls" class="ml-auto mt-4">
            <Btn
              class="mr-2"
              :outline="false"
              :variant="'primary'"
              :loading="assessmentLoading"
              @click="onHideAssessmentControls()"
            >
              {{ $t("event_assessment.confirm_assessment") }}
            </Btn>
            <Btn
              :outline="true"
              :disabled="assessmentLoading"
              :variant="'primary'"
              @click="onHideAssessmentControls(true)"
            >
              {{ $t("dialog.default_cancel_text") }}
            </Btn>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { EventParticipationSlot, Exercise, ExerciseChoice, ExerciseType } from "@/models";
import { defineComponent, PropType } from "@vue/runtime-core";
import CheckboxGroup from "@/components/ui/CheckboxGroup.vue";
import { SelectableOption } from "@/interfaces";
import RadioGroup from "../ui/RadioGroup.vue";
import { getTranslatedString as _ } from "@/i18n";
import TextEditor from "../ui/TextEditor.vue";
import NumberInput from "../ui/NumberInput.vue";
import Timestamp from "../ui/Timestamp.vue";
import ProgrammingExercise from "./ProgrammingExercise.vue";
import CodeFragment from "../ui/CodeFragment.vue";
import CodeExecutionResults from "./CodeExecutionResults.vue";
import { texMixin } from "@/mixins";
import FileUpload from "../ui/FileUpload.vue";
import { downloadEventParticipationSlotAttachment } from "@/api/events";
import Btn from "../ui/Btn.vue";

export default defineComponent({
  components: {
    CheckboxGroup,
    RadioGroup,
    TextEditor,
    NumberInput,
    Timestamp,
    ProgrammingExercise,
    CodeFragment,
    CodeExecutionResults,
    FileUpload,
    Btn,
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
    allowEditScores: {
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
    showScores: {
      // whether the exercises' solutions and choices' scores should be displayed
      // to be used when reviewing a participation to a practice event
      type: Boolean,
      default: false,
    },
    showAssessment: {
      // whether the teacher assessment fields (scores and comments) should be displayed
      // to be used when assessments are made available and a student displays them
      type: Boolean,
      default: false,
    },
    showAssessmentControls: {
      // whether the card containing the input fields to assess the slot should be displayed
      // should be used when accessing a full participation as a teacher and the user is editing
      // the assessment fields of the slot (i.e. clicked on edit button)
      type: Boolean,
      default: false,
    },
    assessmentLoading: {
      // used when dispatching the changes to the assessment slots, to disable the button
      // until the action has succeeded
      type: Boolean,
      default: false,
    },
    saving: {
      type: Boolean,
      default: false,
    },
    running: {
      // code for the submission if being run on the server
      type: Boolean,
    },
  },
  mixins: [texMixin],
  created() {
    this.triggerTexRender();
  },
  methods: {
    emitUpdate(key: keyof EventParticipationSlot, value: unknown) {
      console.log(key, value);
      this.$emit("update:modelValue", {
        ...this.modelValue,
        [key]: value,
      });
    },
    onShowAssessmentControls() {
      this.$emit("setAssessmentControlsVisibility", true);
      //this.showAssessmentControls = true;
      this.dirtyComment = this.modelValue.comment;
      this.dirtyScore = this.modelValue.score;
    },
    onHideAssessmentControls(discard = false) {
      if (discard) {
        this.$emit("setAssessmentControlsVisibility", false);
        return;
      }
      this.$emit("updateAssessment", {
        score: this.dirtyScore,
        comment: this.dirtyComment,
      });
    },
  },
  data() {
    return {
      ExerciseType,
      //showAssessmentControls: false,
      dirtyScore: undefined as number | undefined,
      dirtyComment: undefined as string | undefined,
    };
  },
  computed: {
    exercise(): Exercise {
      return this.modelValue.exercise;
    },
    exerciseChoicesAsOptions(): SelectableOption[] {
      if (
        this.exercise.exercise_type !== ExerciseType.MULTIPLE_CHOICE_SINGLE_POSSIBLE &&
        this.exercise.exercise_type !== ExerciseType.MULTIPLE_CHOICE_MULTIPLE_POSSIBLE
      ) {
        return [];
      }

      return (this.exercise.choices as ExerciseChoice[]).map((c) => ({
        value: c.id,
        content: c.text,
        ...(this.showScores &&
          ((c.score ?? "") + "").length > 0 && {
            description:
              c.score +
              " " +
              _(
                `exercise.choice_score_word_${
                  c.score == 1 || c.score == -1 ? "singular" : "plural"
                }`
              ),
          }),
      }));
    },
    selectedChoicesProxy: {
      get() {
        return this.modelValue.selected_choices;
      },
      set(val: string | string[]) {
        this.$emit("updateSelectedChoices", typeof val === "object" ? val : [val]);
      },
    },
    answerTextProxy: {
      get() {
        return this.modelValue.answer_text;
      },
      set(val: string) {
        this.$emit("updateAnswerText", val);
      },
    },
    attachmentProxy: {
      get() {
        return this.modelValue.attachment
          ? [{ ...this.modelValue.attachment }] //  success: true,
          : [];
      },
      set(val: any) {
        this.$emit("updateAttachment", val);
      },
    },
    // proxies used to get the correct values and emit the correct events for assessment
    // fields depending on current usage mode of the component
    scoreProxy: {
      get() {
        if (!this.showAssessmentControls) {
          return this.modelValue.score;
        }
        return this.dirtyScore;
      },
      set(val: any) {
        if (!this.showAssessmentControls) {
          this.emitUpdate("score", val);
        } else {
          this.dirtyScore = val;
        }
      },
    },
    commentProxy: {
      get() {
        if (!this.showAssessmentControls) {
          return this.modelValue.comment;
        }
        return this.dirtyComment;
      },
      set(val: any) {
        if (!this.showAssessmentControls) {
          this.emitUpdate("comment", val);
        } else {
          this.dirtyComment = val;
        }
      },
    },
  },
});
</script>

<style></style>
