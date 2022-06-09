<template>
  <div class="card shadow-elevation hover-shadow-elevation-2">
    <FullExercise
      :exercise="exercise"
      :allowProgrammingExercisePopup="false"
      :showProgrammingExerciseTabs="false"
    ></FullExercise>

    <div v-if="true || isMultipleChoice">
      <Bar
        :chart-data="selectedChoicesFrequencyChartData"
        :chart-options="exerciseChoicesBarChartOptions"
        :height="30"
        :width="100"
      />
    </div>

    <div v-if="isProgrammingExercise"></div>
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
import FullExercise from "../shared/FullExercise.vue";

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
  DataFrequency,
  exerciseChoiceDatasetSettings,
  exerciseChoicesBarChartOptions,
  getChoiceSelectionFrequencyFor,
  makeLabelText,
} from "@/reports";
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
  components: { FullExercise, Bar },
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
    };
  },
  methods: {},
  computed: {
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
    selectedChoicesFrequency(): DataFrequency<ExerciseChoice>[] {
      if ((this.exercise.choices?.length ?? 0) === 0) {
        return [];
      }
      return getChoiceSelectionFrequencyFor(this.exercise, this.slots);
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
  },
});
</script>

<style></style>
