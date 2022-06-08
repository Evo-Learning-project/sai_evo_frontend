<template>
  <div v-if="!localLoading">
    <h3>Stats</h3>
    <!-- {{ scoreFrequency }}
    <div v-for="(exercise, index) in exercises" :key="'e-' + index">
    </div> -->
    <div class="w-full h-96">
      <Bar
        :chart-data="scoreFrequencyChartData"
        :chart-options="chartOptions"
        :height="100"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { courseIdMixin, eventIdMixin, loadingMixin } from "@/mixins";
import { Exercise } from "@/models";
import {
  DataFrequency,
  getExerciseListFromParticipations,
  getScoreFrequencyFromParticipations,
} from "@/reports";
import { defineComponent, PropType } from "@vue/runtime-core";
import { createNamespacedHelpers } from "vuex";

const { mapState, mapActions } = createNamespacedHelpers("teacher");
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
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

export default defineComponent({
  name: "EventStats",
  props: {},
  components: { Bar },
  mixins: [courseIdMixin, eventIdMixin, loadingMixin],
  async created() {
    await this.withLocalLoading(async () => {
      await this.getEventParticipations({
        courseId: this.courseId,
        eventId: this.eventId,
        includeDetails: true, // needed to get slots' exercises and answer texts
      });
      await this.getEvent({
        courseId: this.courseId,
        eventId: this.eventId,
      });
    });
  },
  data() {
    return {
      chartOptions: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          x: {
            display: true,
            grid: { display: false },
            title: {
              display: true,
              text: _("event_participation_headings.grade"),
            },
          },
          y: {
            display: true,
            grid: { display: true },
            ticks: { stepSize: 1, beginAtZero: true },
          },
        },
      },
    };
  },
  methods: {
    ...mapActions(["getEventParticipations", "getEvent"]),
  },
  computed: {
    ...mapState(["eventParticipations"]),
    exercises(): Exercise[] {
      if ((this.eventParticipations?.length ?? 0) === 0) {
        return [];
      }
      return getExerciseListFromParticipations(this.eventParticipations);
    },
    scoreFrequency(): DataFrequency<string>[] {
      if ((this.eventParticipations?.length ?? 0) === 0) {
        return [];
      }
      return getScoreFrequencyFromParticipations(this.eventParticipations);
    },
    scoreFrequencyChartData(): TChartData<"bar", number[], unknown> {
      return {
        labels: this.scoreFrequency.map((r) => r.datum),
        datasets: [
          {
            data: this.scoreFrequency.map((r) => r.frequency),
            backgroundColor: "#303f9fb3",
            label: "",
          },
        ],
      };
    },
  },
});
</script>

<style></style>
