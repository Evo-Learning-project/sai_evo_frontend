<template>
  <div class="card shadow-elevation hover-shadow-elevation-2">
    <div class="mb-4 user-content">
      <ProcessedTextFragment :value="exercise.text"></ProcessedTextFragment>
    </div>

    <div v-if="isMultipleChoice">
      <Bar
        :chart-data="selectedChoicesFrequencyChartData"
        :chart-options="exerciseChoicesBarChartOptions"
        :height="mediaQueryMdMatches ? 30 : 100"
        :width="100"
      />
    </div>

    <div v-else-if="isProgrammingExercise">
      <Bar
        :chart-data="programmingExerciseScoreFrequencyChartData"
        :chart-options="passedTestCasesBarChartOptions"
        :height="mediaQueryMdMatches ? 30 : 100"
        :width="100"
      />
      <!-- test case details -->
      <div>
        <div
          v-for="record in Object.entries(
            programmingExerciseScoresFrequency.testCasePassingRate
          )"
          :key="record[0] + '-passed-data'"
          class="flex items-center my-6 space-x-12"
        >
          <ExerciseTestCase
            class="w-full"
            :showDescription="false"
            :small="true"
            :testCase="exercise.testcases?.find((t) => t.id == record[0])"
          ></ExerciseTestCase>
          <div class="w-1/2 text-lg text-muted">
            {{ $t("event_stats.testcase_passed_in") }}
            <strong>{{ record[1] }}</strong> {{ $t("event_stats.submissions") }}

            {{ $t("misc.out_of") }}
            {{ slots.length }}
            <strong class="ml-4"
              >({{
                Math.floor((record[1] / slots.length) * 1000) / 10
              }}%)</strong
            >
          </div>
        </div>
      </div>
    </div>

    <div v-if="isOpenAnswerExercise">
      <h3>Risposte</h3>
      <div class="my-4" v-for="slot in slots" :key="'stats-slot-' + slot.id">
        <div class="flex card card-border">
          <div class="w-10/12 overflow-auto max-h-36">
            <ProcessedTextFragment
              :value="slot.answer_text"
              :defaultValue="$t('misc.no_answer')"
            ></ProcessedTextFragment>
          </div>
          <div class="w-2/12 ml-auto text-right">
            <p :class="{ 'text-muted': slot.score === null }">
              {{
                slot.score !== null
                  ? Number.isInteger(parseFloat(slot.score))
                    ? parseInt(slot.score)
                    : slot.score
                  : $t("event_stats.not_yet_assessed")
              }}
              <span v-if="slot.score !== null">{{
                parseFloat(slot.score) === 1
                  ? $t("misc.scored_singular")
                  : $t("misc.scored_plural")
              }}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <p class="text-muted">
        {{ $t("event_stats.no_stats_available_for_exercise") }}
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import {
  EventParticipationSlot,
  Exercise,
  ExerciseChoice,
  ExerciseType,
  multipleChoiceExerciseTypes,
  programmingExerciseTypes,
} from "@/models";
import { defineComponent, PropType } from "@vue/runtime-core";
import ProcessedTextFragment from "../ui/ProcessedTextFragment.vue";

import { Bar } from "vue-chartjs";
import { TChartData } from "vue-chartjs/dist/types";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  CoreChartOptions,
  DatasetChartOptions,
  ElementChartOptions,
  PluginChartOptions,
  ScaleChartOptions,
  BarControllerChartOptions,
} from "chart.js";
import { _DeepPartialObject } from "chart.js/types/utils";
import { getTranslatedString as _ } from "@/i18n";

import { SelectableOption } from "@/interfaces";
import {
  exerciseChoicesBarChartOptions,
  DataFrequency,
  getChoiceSelectionFrequencyFor,
  makeLabelText,
  exerciseChoiceDatasetSettings,
  getTestCasePassingFrequencyFor,
  passedTestCasesBarChartOptions,
  scoreChartDatasetSettings,
} from "@/reports";
import ExerciseTestCase from "../shared/ExerciseTestCase.vue";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

export default defineComponent({
  name: "ExerciseWithStats",
  components: { Bar, ProcessedTextFragment, ExerciseTestCase },
  props: {
    exercise: {
      type: Object as PropType<Exercise>,
      required: true,
    },
    slots: {
      type: Array as PropType<EventParticipationSlot[]>,
      required: true,
    },
  },
  data() {
    return {
      exerciseChoicesBarChartOptions,
      passedTestCasesBarChartOptions,
    };
  },
  methods: {},
  computed: {
    // TODO extract to mixin
    mediaQueryMdMatches(): boolean {
      const mq = window.matchMedia("(min-width: 768px)");
      return mq.matches;
    },
    isMultipleChoice(): boolean {
      return multipleChoiceExerciseTypes.includes(
        this.exercise.exercise_type as ExerciseType
      );
    },
    isProgrammingExercise(): boolean {
      return programmingExerciseTypes.includes(
        this.exercise.exercise_type as ExerciseType
      );
    },
    isOpenAnswerExercise(): boolean {
      return this.exercise.exercise_type === ExerciseType.OPEN_ANSWER;
    },
    selectedChoicesFrequency(): DataFrequency<ExerciseChoice>[] {
      if ((this.exercise.choices?.length ?? 0) === 0) {
        return [];
      }
      return getChoiceSelectionFrequencyFor(this.exercise, this.slots);
    },
    programmingExerciseScoresFrequency(): {
      scoreFrequency: DataFrequency<number>[];
      testCasePassingRate: Record<string, number>;
    } {
      if ((this.exercise.testcases?.length ?? 0) === 0) {
        return { scoreFrequency: [], testCasePassingRate: {} };
      }
      return getTestCasePassingFrequencyFor(this.exercise, this.slots);
    },
    selectedChoicesFrequencyChartData(): TChartData<"bar", number[], unknown> {
      return {
        labels: this.selectedChoicesFrequency.map(
          (r) => makeLabelText(r.datum.text).slice(0, 100)
          // +
          // (makeLabelText(r.datum.text).length <= 100 ? "" : "...")
        ),
        datasets: [
          {
            data: this.selectedChoicesFrequency.map((r) => r.frequency),
            ...exerciseChoiceDatasetSettings,
            backgroundColor: this.selectedChoicesFrequency.map((r) =>
              (this.exercise.correct_choices ?? []).includes(r.datum.id)
                ? "#10B981b3"
                : "#e5e7ebb3"
            ),
          },
        ],
      };
    },
    programmingExerciseScoreFrequencyChartData(): TChartData<
      "bar",
      number[],
      unknown
    > {
      return {
        labels: this.programmingExerciseScoresFrequency.scoreFrequency.map(
          (r) => r.datum
        ),
        datasets: [
          {
            data: this.programmingExerciseScoresFrequency.scoreFrequency.map(
              (r) => r.frequency
            ),
            ...scoreChartDatasetSettings,
            maxBarThickness: 100,
          },
        ],
      };
    },
  },
});
</script>

<style></style>
