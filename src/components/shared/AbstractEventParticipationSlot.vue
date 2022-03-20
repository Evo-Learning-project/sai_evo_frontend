<template>
  <div class="">
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
        <div :class="{ 'w-full md:w-1/2': allowEditScores || showAssessment }">
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
          class="px-6 py-3 mb-auto rounded md:self-start md:w-1/2 bg-light shadow-elevation-2 bg-opacity-70"
          v-if="showAssessment"
        >
          <!-- score -->
          <p class="text-muted">
            {{ $t("misc.score") }}:
            <strong class="text-lg">{{ modelValue.score }}</strong>
            <span v-if="modelValue.exercise.max_score"
              >&nbsp;{{ $t("misc.out_of") }}
              <strong class="text-lg"> {{ modelValue.exercise.max_score }}</strong></span
            >
          </p>

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
        <div v-if="allowEditScores" class="flex flex-col md:w-1/2">
          <!-- -->
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
              <NumberInput
                class="mb-4"
                :modelValue="modelValue.score"
                @update:modelValue="emitUpdate('score', $event)"
                >{{ $t("event_assessment.assigned_score") }}
              </NumberInput>
              <TextEditor
                class="w-full"
                :modelValue="modelValue.comment"
                @update:modelValue="emitUpdate('comment', $event)"
                >{{ $t("event_assessment.comment_for_student") }}</TextEditor
              >
            </p>
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
  },
  name: "AbstractEventParticipationSlot",
  props: {
    modelValue: {
      type: Object as PropType<EventParticipationSlot>,
      required: true,
    },
    allowEditScores: {
      type: Boolean,
      default: false,
    },
    allowEditSubmission: {
      type: Boolean,
      default: false,
    },
    showExerciseLabel: {
      type: Boolean,
      default: false,
    },
    showScores: {
      type: Boolean,
      default: false,
    },
    showAssessment: {
      type: Boolean,
      default: false,
    },
    saving: {
      type: Boolean,
      default: false,
    },
    running: {
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
  },
  data() {
    return {
      ExerciseType,
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
  },
});
</script>

<style></style>
