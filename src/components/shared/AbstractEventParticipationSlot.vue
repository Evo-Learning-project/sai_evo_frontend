<template>
  <div :class="{ 'pl-6': subSlot }">
    <div class="w-full">
      <div v-if="$slots.default" class="flex flex-wrap items-center">
        <div class="mb-0.5 mr-4">
          <slot></slot>
        </div>
        <div v-if="showTags" class="flex flex-wrap items-center">
          <Tag
            v-for="tag in modelValue.exercise.public_tags"
            :key="'tag-' + tag.id + '-slot-' + modelValue.id"
            :tag="tag"
            class="mb-0.5 mr-2"
          ></Tag>
        </div>
      </div>
      <!-- exercise label (shown in teacher mode) -->
      <div class="flex my-2">
        <h3 v-if="showExerciseLabel">{{ exercise.label }}</h3>
      </div>
      <!-- exercise text (not shown if programming exercise and not in review mode) -->
      <!-- TODO clarify condition (!allowEditSubmission && !showExerciseLabel) -->
      <div
        class="mb-8 user-content"
        :class="{
          'bg-gray-200 p-2 border border-dark rounded-md':
            false && allowEditAssessment,
        }"
        v-if="
          exercise.exercise_type !== ExerciseType.COMPLETION &&
          (!isProgrammingExercise ||
            (!allowEditSubmission && !showExerciseLabel))
        "
      >
        <ProcessedTextFragment :value="exercise.text"></ProcessedTextFragment>
      </div>

      <!-- if assessment edit mode, make flex so to fit submission on the left and assessment on the right -->
      <div
        :class="{
          'flex flex-col space-y-4': allowEditAssessment || showAssessmentCard,
          'md:flex-row md:space-x-8 md:space-y-0': !subSlot,
        }"
      >
        <!-- controls to submit -->
        <div
          :class="{
            'w-8/12':
              allowEditAssessment ||
              (showAssessmentCard &&
                (allowEditSubmission || !isProgrammingExercise)),
            'md:w-8/12 w-full':
              allowEditAssessment ||
              (showAssessmentCard &&
                !allowEditSubmission &&
                isProgrammingExercise),
            'md:w-full':
              allowEditAssessment ||
              (showAssessmentCard &&
                !allowEditSubmission &&
                modelValue.exercise.exercise_type === ExerciseType.OPEN_ANSWER),
          }"
        >
          <!-- multiple choice multiple possible -->
          <CheckboxGroup
            v-if="
              exercise.exercise_type ===
              ExerciseType.MULTIPLE_CHOICE_MULTIPLE_POSSIBLE
            "
            :options="exerciseChoicesAsOptions"
            v-model="selectedChoicesProxy"
            :disabled="!allowEditSubmission || (false && saving)"
          >
            <template v-slot:item="{ description }">
              <div class="flex items-center mb-2 space-x-2">
                <p
                  :class="{
                    'text-success': description?.[0] === 'done',
                    'text-danger-dark': description?.[0] === 'close',
                  }"
                  class="text-sm font-semibold  text-muted material-icons-outlined"
                >
                  {{ description?.[0] }}
                </p>
                <p class="text-sm text-muted" v-if="nonUniformScores">
                  {{ description?.[1] }}
                  {{
                    $t(
                      `exercise.choice_score_word_${
                        parseFloat(description?.[1] ?? "") == 1 ||
                        parseFloat(description?.[1] ?? "") == -1
                          ? "singular"
                          : "plural"
                      }`
                    )
                  }}
                </p>
              </div></template
            >
          </CheckboxGroup>

          <!-- multiple choice single possible -->
          <RadioGroup
            v-else-if="
              exercise.exercise_type ===
              ExerciseType.MULTIPLE_CHOICE_SINGLE_POSSIBLE
            "
            :options="exerciseChoicesAsOptions"
            v-model="selectedChoicesProxy"
            :disabled="!allowEditSubmission || (false && saving)"
          >
            <template v-slot:item="{ description }">
              <div class="flex items-center mb-2 space-x-2">
                <p
                  :class="{
                    'text-success': description?.[0] === 'done',
                    'text-danger-dark': description?.[0] === 'close',
                  }"
                  class="text-sm font-semibold  text-muted material-icons-outlined"
                >
                  {{ description?.[0] }}
                </p>
                <p
                  :id="description?.[3] ?? ''"
                  class="text-sm text-muted"
                  v-if="nonUniformScores"
                >
                  {{ description?.[1] }}
                  {{
                    $t(
                      `exercise.choice_score_word_${
                        parseFloat(description?.[1] ?? "") == 1 ||
                        parseFloat(description?.[1] ?? "") == -1
                          ? "singular"
                          : "plural"
                      }`
                    )
                  }}
                </p>
              </div></template
            >
          </RadioGroup>

          <!-- open answer -->
          <TextEditor
            :disabled="!allowEditSubmission"
            v-else-if="
              exercise.exercise_type === ExerciseType.OPEN_ANSWER &&
              (allowEditSubmission || showExerciseLabel)
            "
            v-model="answerTextProxy"
          >
            {{
              allowEditSubmission
                ? $t("event_participation_slot.text_answer_label")
                : $t("event_assessment.text_answer_label")
            }}
          </TextEditor>
          <div
            v-else-if="
              exercise.exercise_type === ExerciseType.OPEN_ANSWER &&
              !allowEditSubmission
            "
            class="w-full whitespace-pre"
            style="margin-top: -21px"
          >
            <p class="ml-2 text-sm text-muted">
              {{ $t("event_assessment.text_answer_label") }}
            </p>
            <ProcessedTextFragment
              style="white-space: break-spaces"
              class="w-full px-4 py-2 rounded bg-gray-50"
              :value="answerTextProxy"
            ></ProcessedTextFragment>
          </div>

          <!-- aggregated answer -->
          <div
            v-else-if="exercise.exercise_type === ExerciseType.AGGREGATED"
            v-for="(subSlot, index) in modelValue.sub_slots"
            :key="modelValue.id + '-sub-slot-' + subSlot.id"
            :class="{ 'mb-12': index !== modelValue.sub_slots.length - 1 }"
          >
            <AbstractEventParticipationSlot
              :subSlot="true"
              :modelValue="subSlot"
              :allowEditAssessment="allowEditAssessment"
              :allowEditSubmission="allowEditSubmission"
              :showAssessmentCard="showAssessmentCard"
              :showSolutionAndScores="showSolutionAndScores"
              :assessmentControlsVisibility="assessmentControlsVisibility"
              @updateSelectedChoices="$emit('updateSelectedChoices', $event)"
              @updateAnswerText="$emit('updateAnswerText', $event)"
              @updateAttachment="$emit('updateAttachment', $event)"
              @download="$emit('download', $event)"
              @runCode="$emit('runCode', $event)"
              @setAssessmentControlsVisibility="
                $emit('setAssessmentControlsVisibility', $event)
              "
              @openFull="$emit('openFull')"
              @updateAssessment="$emit('updateAssessment', $event)"
            >
            </AbstractEventParticipationSlot>
          </div>

          <!-- programming exercise -->
          <ProgrammingExercise
            v-else-if="
              isProgrammingExercise &&
              (allowEditSubmission || showExerciseLabel)
            "
            :exercise="modelValue.exercise"
            v-model="answerTextProxy"
            :executionResults="modelValue.execution_results"
            :slot="modelValue"
            :running="running"
            @runCode="$emit('runCode', { slot: modelValue })"
            :showEditor="allowEditSubmission"
          ></ProgrammingExercise>
          <!-- if reviewing submission, just show submitted code and execution results-->
          <div v-else-if="isProgrammingExercise && !allowEditSubmission">
            <CodeFragment
              class="mb-4"
              :value="modelValue.answer_text"
              v-if="!showExerciseLabel"
            ></CodeFragment>
            <CodeExecutionResults
              :slot="modelValue"
              v-if="!showExerciseLabel"
            ></CodeExecutionResults>
            <!--TODO when viewing in teacher mode, check if execution results is empty
                      (should never happen) and if it is, add an emergency "run" button  -->
          </div>

          <!-- attachment exercise-->
          <FileUpload
            @download="$emit('download', { slot: modelValue })"
            v-model="attachmentProxy"
            :disabled="!allowEditSubmission"
            v-else-if="exercise.exercise_type === ExerciseType.ATTACHMENT"
          ></FileUpload>

          <!-- completion exercise -->
          <ClozeExercise
            v-else-if="exercise.exercise_type === ExerciseType.COMPLETION"
            @updateSelectedChoices="$emit('updateSelectedChoices', $event)"
            :slot="modelValue"
            :showScores="showSolutionAndScores"
          ></ClozeExercise>
        </div>

        <!-- assessment card-->
        <div
          :class="{
            'md:w-9/12':
              !subSlot &&
              !isProgrammingExercise &&
              !(
                allowEditAssessment ||
                (showAssessmentCard &&
                  !allowEditSubmission &&
                  modelValue.exercise.exercise_type ===
                    ExerciseType.OPEN_ANSWER)
              ),
            'md:w-6/12':
              allowEditAssessment ||
              (showAssessmentCard &&
                !allowEditSubmission &&
                modelValue.exercise.exercise_type === ExerciseType.OPEN_ANSWER),
            'md:w-full': subSlot,
          }"
          class="sticky mb-auto  top-4 md:self-start shadow-elevation card card-filled"
          v-if="
            showAssessmentCard &&
            (true || !showAssessmentControls || !allowEditAssessment)
          "
        >
          <!-- score -->
          <div
            v-if="
              !showAssessmentControls &&
              allowEditAssessment &&
              modelValue.score == null
            "
            class="flex items-center space-x-1 text-sm  text-danger-dark text-muted"
          >
            <span
              class="my-auto text-base text-yellow-900 material-icons-outlined"
              >pending_actions</span
            >
            <p>
              {{
                $t("event_assessment.this_exercise_requires_manual_assessment")
              }}
            </p>
          </div>

          <!-- score -->
          <div class="flex items-center transition-opacity duration-100">
            <p class="text-muted">
              {{
                !isProgrammingExercise
                  ? $t("misc.score")
                  : $t("misc.passed_tests")
              }}:
              <strong class="text-lg">{{
                !isProgrammingExercise &&
                !Number.isInteger(parseFloat(modelValue.score))
                  ? modelValue.score
                  : parseInt(modelValue.score)
              }}</strong>
              <span v-if="modelValue.exercise.max_score"
                >&nbsp;{{ $t("misc.out_of") }}
                <strong class="text-lg">
                  {{ modelValue.exercise.max_score }}</strong
                ></span
              >
            </p>
            <Btn
              v-if="allowEditAssessment"
              class="ml-1"
              :outline="true"
              :variant="'icon'"
              :size="'sm'"
              :tooltip="
                showAssessmentControls ? '' : $t('help_texts.edit_score')
              "
              :disabled="showAssessmentControls"
              @click="onShowAssessmentControls()"
              ><span class="text-lg icon-light material-icons">edit</span></Btn
            >
            <Btn
              v-if="allowEditAssessment && modelValue.score_edited"
              :outline="true"
              class="ml-auto"
              :variant="'icon'"
              :size="'sm'"
              :tooltip="$t('event_assessment.undo_score_edit_tooltip')"
              :disabled="showAssessmentControls"
              @click="onUndoScoreEdit()"
              ><span class="text-lg icon-light material-icons-outlined"
                >undo</span
              ></Btn
            >
          </div>
          <div
            class="flex items-start mt-2 space-x-2 text-sm"
            v-if="false && allowEditAssessment && someSubSlotsPending"
          >
            <span class="text-lg text-yellow-900 material-icons-outlined"
              >pending_actions</span
            >
            <p class="text-danger-dark text-muted">
              {{ $t("event_assessment.some_sub_slots_pending") }}
            </p>
          </div>

          <!-- teacher comment -->
          <div class="transition-opacity duration-100">
            <p
              v-if="(modelValue.comment?.length ?? 0) > 0"
              class="mt-2 text-muted"
            >
              {{
                allowEditAssessment
                  ? $t("event_assessment.comment_for_student")
                  : $t("misc.teacher_comment")
              }}:
            </p>
            <p v-html="modelValue.comment"></p>
          </div>

          <!-- exercise solution -->
          <p
            v-if="(modelValue.exercise.solution?.length ?? 0) > 0"
            class="mt-2 text-muted"
          >
            {{ $t("misc.solution") }}:
          </p>
          <p
            v-if="!isProgrammingExercise"
            v-html="modelValue.exercise.solution"
          ></p>
          <CodeFragment
            v-else-if="modelValue.exercise.solution"
            :value="modelValue.exercise.solution"
          ></CodeFragment>

          <!-- in-card assessment controls -->
          <div
            :class="{
              'max-h-0': !showAssessmentControls,
              'max-h-96': showAssessmentControls,
            }"
            class="flex flex-col overflow-y-hidden duration-200 ease-in-out  transition-max-height"
          >
            <div
              :class="{ 'md:flex-row  md:items-center': !subSlot }"
              class="flex flex-col mt-4 ease-in-out"
            >
              <h3>{{ $t("event_assessment.your_assessment") }}</h3>
              <div
                :class="{ 'md:ml-auto': !subSlot }"
                class="flex flex-col text-sm"
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
                    >{{
                      $t("event_assessment.exercise_answered_at")
                    }}&nbsp;</span
                  ><Timestamp :value="modelValue.answered_at"></Timestamp>
                </div>
              </div>
            </div>
            <!-- notice text to assess -->
            <p
              class="text-sm text-muted text-danger-dark"
              v-if="modelValue.score == null || modelValue.score.length == 0"
            >
              {{
                $t("event_assessment.this_exercise_requires_manual_assessment")
              }}
            </p>
            <div class="mt-4">
              <!-- actual assessment controls -->
              <p>
                <NumberInput class="mb-4" v-model="scoreProxy"
                  >{{ $t("event_assessment.assigned_score") }}
                </NumberInput>
                <TextEditor class="w-full" v-model="commentProxy">{{
                  $t("event_assessment.comment_for_student")
                }}</TextEditor>
              </p>
            </div>
            <!-- controls to save or discard changes -->
            <div class="mt-4 ml-auto">
              <Btn
                class="mr-2"
                :outline="false"
                :variant="'primary'"
                :loading="assessmentLoading"
                :disabled="dirtyScore === null || dirtyScore?.length === 0"
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
          <!-- end in-card assessment controls  -->
        </div>
        <!-- end assessment card -->

        <!-- standalone assessment controls (to use inside the modal, single-slot assessment mode) -->
        <div
          v-if="allowEditAssessment && !showAssessmentCard"
          class="sticky flex flex-col md:w-2/3 top-4"
        >
          <div
            v-if="!subSlot"
            class="flex flex-col mt-4 ease-in-out md:flex-row md:items-center"
          >
            <h3>{{ $t("event_assessment.your_assessment") }}</h3>
            <div
              :class="{ 'md:ml-auto': !subSlot }"
              class="flex flex-col text-sm"
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
            {{
              $t("event_assessment.this_exercise_requires_manual_assessment")
            }}
          </p>
          <div class="mt-4" v-if="!subSlot">
            <!-- actual assessment controls -->
            <p>
              <NumberInput class="mb-4" v-model="scoreProxy"
                >{{ $t("event_assessment.assigned_score") }}
              </NumberInput>
              <TextEditor class="w-full" v-model="commentProxy">{{
                $t("event_assessment.comment_for_student")
              }}</TextEditor>
            </p>
          </div>
          <div v-else class="flex space-x-2">
            <Btn
              :outline="true"
              :variant="'icon'"
              class="mb-auto"
              @click="$emit('openFull')"
              ><span class="material-icons-outlined text-base mr-0.5 text-muted"
                >launch</span
              ></Btn
            >
            <p class="text-muted">
              {{
                $t(
                  "event_assessment.sub_slot_assessment_unavailable_open_full_1"
                )
              }}

              <span>{{
                $t(
                  "event_assessment.sub_slot_assessment_unavailable_open_full_2"
                )
              }}</span>

              {{
                $t(
                  "event_assessment.sub_slot_assessment_unavailable_open_full_3"
                )
              }}
            </p>
          </div>
        </div>
        <!-- end standalone assessment controls -->
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  EventParticipationSlot,
  Exercise,
  ExerciseChoice,
  ExerciseType,
  programmingExerciseTypes,
} from "@/models";
import { defineComponent, PropType } from "@vue/runtime-core";
import CheckboxGroup from "@/components/ui/CheckboxGroup.vue";
import { SelectableOption } from "@/interfaces";
import RadioGroup from "../ui/RadioGroup.vue";
import { getTranslatedString, getTranslatedString as _ } from "@/i18n";
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
import { every, some } from "lodash";
import ClozeExercise from "./ClozeExercise.vue";
import { formatExerciseText } from "@/utils";
import ProcessedTextFragment from "../ui/ProcessedTextFragment.vue";
import Tag from "../ui/Tag.vue";

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
    ClozeExercise,
    ProcessedTextFragment,
    Tag,
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
    assessmentControlsVisibility: {
      // whether the card containing the input fields to assess the slot should be displayed
      // should be used when accessing a full participation as a teacher and the user is editing
      // the assessment fields of the slot (i.e. clicked on edit button)
      type: Object as PropType<Record<string, boolean>>, // Boolean,
      default: () => {},
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
    emitUpdate(key: keyof EventParticipationSlot, value: unknown) {
      console.log(key, value);
      this.$emit("update:modelValue", {
        ...this.modelValue,
        [key]: value,
      });
    },
    onShowAssessmentControls() {
      this.$emit("setAssessmentControlsVisibility", {
        slot: this.modelValue,
        payload: true,
      });

      this.dirtyComment = this.modelValue.comment;
      this.dirtyScore = this.modelValue.score;
    },
    onHideAssessmentControls(discard = false) {
      if (discard) {
        this.$emit("setAssessmentControlsVisibility", {
          slot: this.modelValue,
          payload: false,
        });
        return;
      }
      this.$emit("updateAssessment", {
        slot: this.modelValue,
        payload: { score: this.dirtyScore, comment: this.dirtyComment },
      });
    },
    onUndoScoreEdit() {
      if (confirm(getTranslatedString("event_assessment.undo_score_edit"))) {
        this.dirtyScore = null;
        this.onHideAssessmentControls();
      }
    },
  },
  data() {
    return {
      ExerciseType,
      //showAssessmentControls: false,
      dirtyScore: undefined as number | undefined | null,
      dirtyComment: undefined as string | undefined,
    };
  },
  computed: {
    exercise(): Exercise {
      return this.modelValue.exercise;
    },
    isProgrammingExercise(): boolean {
      return programmingExerciseTypes.includes(
        this.modelValue.exercise.exercise_type as ExerciseType
      );
    },
    showAssessmentControls(): boolean {
      return this.assessmentControlsVisibility?.[this.modelValue.id] ?? false;
    },
    someSubSlotsPending(): boolean {
      return this.modelValue.sub_slots.some((s) => s.score === null);
    },
    nonUniformScores(): boolean {
      // Returns whether all choices aside from the correct ones have the same score_selected
      if (
        ![
          ExerciseType.MULTIPLE_CHOICE_MULTIPLE_POSSIBLE,
          ExerciseType.MULTIPLE_CHOICE_SINGLE_POSSIBLE,
        ].includes(this.modelValue.exercise.exercise_type as ExerciseType)
      ) {
        return false;
      }

      const nonCorrectChoices = (
        this.modelValue.exercise.choices as ExerciseChoice[]
      ).filter(
        (c) => !this.modelValue.exercise.correct_choices?.includes(c.id)
      );

      return nonCorrectChoices.some(
        (c) => c.score_selected != nonCorrectChoices[0].score_selected
      );
    },
    exerciseChoicesAsOptions(): SelectableOption[] {
      if (
        this.exercise.exercise_type !==
          ExerciseType.MULTIPLE_CHOICE_SINGLE_POSSIBLE &&
        this.exercise.exercise_type !==
          ExerciseType.MULTIPLE_CHOICE_MULTIPLE_POSSIBLE
      ) {
        return [];
      }

      return (this.exercise.choices as ExerciseChoice[]).map((c) => ({
        value: c.id,
        content: formatExerciseText(c.text),
        ...(this.showSolutionAndScores &&
          ((c.score_selected ?? "") + "").length > 0 &&
          ((c.score_unselected ?? "") + "").length > 0 && {
            description: [
              this.modelValue.exercise.correct_choices?.includes(c.id)
                ? "done"
                : "close",
              String(c.score_selected),
              String(c.score_unselected),
              c.id,
            ],
          }),
      }));
    },
    selectedChoicesProxy: {
      get() {
        return this.modelValue.selected_choices;
      },
      set(val: string | string[]) {
        this.$emit("updateSelectedChoices", {
          slot: this.modelValue,
          payload: typeof val === "object" ? val : [val],
        });
      },
    },
    answerTextProxy: {
      get() {
        return this.modelValue.answer_text;
      },
      set(val: string) {
        this.$emit("updateAnswerText", { slot: this.modelValue, payload: val });
      },
    },
    attachmentProxy: {
      get() {
        return this.modelValue.attachment
          ? [{ ...this.modelValue.attachment }] //  success: true,
          : [];
      },
      set(val: any) {
        this.$emit("updateAttachment", { slot: this.modelValue, payload: val });
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
