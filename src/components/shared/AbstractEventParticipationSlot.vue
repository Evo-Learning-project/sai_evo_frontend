<template>
  <div class="">
    <div class="w-full">
      <h3 v-if="showExerciseLabel">{{ exercise.label }}</h3>
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
      <div :class="{ 'flex space-x-8': allowEditScores || showAssessment }">
        <!-- controls to submit -->
        <div :class="{ 'w-1/2': allowEditScores || showAssessment }">
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
            <p class="mb-2 text-sm text-muted">{{ description }}</p>

            <!-- <div class="px-2 py-1.25px rounded-md mb-2 bg-gray-50">
        <p class="text-sm text-muted">{{ description }}</p>
      </div> -->
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
            <p class="mb-2 text-sm text-muted">{{ description }}</p>
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

        <!-- show assessment-->
        <div
          class="w-1/2 px-6 py-3 mb-auto rounded bg-light shadow-elevation-2 bg-opacity-70"
          v-if="showAssessment"
        >
          <!-- style="background-color: #e6f4ea; border: 1px solid #dadce0" -->
          <p class="text-muted">
            {{ $t("misc.score") }}:
            <strong class="text-lg">{{ modelValue.score }}</strong>
            <span v-if="!!modelValue.exercise.max_score"
              >&nbsp;{{ $t("misc.out_of") }}
              <strong class="text-lg"> {{ modelValue.exercise.max_score }}</strong></span
            >
          </p>
          <p v-if="(modelValue.comment?.length ?? 0) > 0" class="mt-2 text-muted">
            {{ $t("misc.teacher_comment") }}:
          </p>
          <p v-html="modelValue.comment"></p>
        </div>

        <!-- controls to assess -->
        <div v-if="allowEditScores" class="w-1/2">
          <!-- TODO work on this -->
          <p v-if="modelValue.seen_at">
            {{ $t("event_assessment.exercise_seen_at") }}
            <Timestamp :value="modelValue.seen_at"></Timestamp>
          </p>
          <p v-if="modelValue.answered_at">
            {{ $t("event_assessment.exercise_answered_at") }}
            <Timestamp :value="modelValue.answered_at"></Timestamp>
          </p>
          <!-- -->
          <h3>{{ $t("event_assessment.your_assessment") }}</h3>
          <p
            class="mb-4 text-muted"
            v-if="modelValue.score == null || modelValue.score.length == 0"
          >
            {{ $t("event_assessment.this_exercise_requires_manual_assessment") }}
          </p>
          <div class="mt-4">
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
        ...(this.showScores && {
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
