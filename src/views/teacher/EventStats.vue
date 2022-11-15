<template>
	<div class="">
		<div class="flex items-center mb-4 space-x-2">
			<router-link class="" :to="{ name: 'ExamResults' }">
				<Btn
					:outline="true"
					:variant="'icon'"
					:tooltip="$t('event_stats.back_to_results')"
					><span class="material-icons-outlined">arrow_back</span></Btn
				></router-link
			>
			<h3 class="mb-0.5">
				{{ $t("event_stats.event_stats") }}
				{{ mainStore.getEventById(eventId).name }}
			</h3>
		</div>

		<Tabs class="mb-8" :options="tabsAsSelectableOptions" v-model="currentTab"></Tabs>

		<div>
			<div v-if="!loading" v-show="currentTab === ExamStatsTabs.OVERALL">
				<!-- stats cards -->
				<div class="flex mt-8 mb-12">
					<div class="flex flex-col items-center w-1/3 mr-4 card shadow-elevation">
						<div class="flex space-x-0.5 text-2xl items-center">
							<p>{{ participantCount }}</p>
							<span class="text-3xl material-icons icon-light">people</span>
						</div>
						<p class="text-sm text-muted">
							{{ $t("event_monitor.stats_participants") }}
						</p>
					</div>
					<div class="flex flex-col items-center w-1/3 mr-4 card shadow-elevation">
						<div class="flex space-x-0.5 text-2xl items-center">
							<p>{{ turnedInCount }}</p>
							<span class="text-3xl material-icons-two-tone two-tone-success"
								>assignment_turned_in</span
							>
						</div>
						<p class="text-sm text-muted">
							{{ $t("event_monitor.stats_turned_in") }}
						</p>
					</div>
					<div class="flex flex-col items-center w-1/3 card shadow-elevation">
						<div class="flex space-x-0.5 text-2xl items-center">
							<p>{{ averageProgress }}</p>
							<p>%</p>
						</div>
						<p class="text-sm text-center text-muted">
							{{ $t("event_monitor.stats_average_progress") }}
						</p>
					</div>
					<div class="hidden md:ml-auto banner banner-light">
						<span class="material-icons-outlined icon-light"> assignment_returned </span>
						<p>
							{{ $t("event_monitor.un_turn_in_instructions") }}
							<span class="text-lg inline-icon text-success material-icons-outlined">{{
								participationStateIcons[EventParticipationState.TURNED_IN][0]
							}}</span>
							<span style="margin-left: -1px">{{
								$t("event_monitor.in_column_state")
							}}</span>
						</p>
					</div>
				</div>

				<!-- score distribution chart -->
				<h2>{{ $t("event_stats.score_distribution") }}</h2>
				<div
					v-if="!areAllParticipationsFullyAssessed(mainStore.eventParticipations)"
					class="flex my-4 transition-all duration-200 banner banner-danger"
				>
					<span class="ml-px text-yellow-900 material-icons-outlined">
						pending_actions
					</span>
					<p class="">{{ $t("event_stats.incomplete_scores") }}.</p>
				</div>
				<div class="w-full h-96">
					<Bar
						:chart-data="scoreFrequencyChartData"
						:chart-options="scoreChartOptions"
						:height="mediaQueryMdMatches ? 100 : 300"
					/>
				</div>
			</div>

			<div v-if="!localLoading" v-show="currentTab === ExamStatsTabs.EXERCISES">
				<h2>{{ $t("event_stats.per_exercise_stats") }}</h2>
				<div
					v-for="(exercise, index) in exercises"
					:key="'e-stats-' + exercise?.id + '-' + index"
					class="my-8"
				>
					<!-- TODO find a better way to check exercises have been loaded 
        than v-if="exercise" -->
					<ExerciseWithStats
						v-if="exercise"
						:exercise="exercise"
						:slots="getSlotsContaining(exercise)"
					></ExerciseWithStats>
				</div>
			</div>
			<div
				class="flex flex-col space-y-8"
				v-show="currentTab === ExamStatsTabs.EXERCISES"
				v-else
			>
				<MinimalExercisePreviewSkeleton />
				<MinimalExercisePreviewSkeleton />
				<MinimalExercisePreviewSkeleton />
				<MinimalExercisePreviewSkeleton />
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { courseIdMixin, eventIdMixin, loadingMixin, mediaQueryMixin } from "@/mixins";
import {
	Event,
	EventParticipation,
	EventParticipationState,
	EventTemplateRule,
	Exercise,
} from "@/models";
import { defineComponent, PropType } from "@vue/runtime-core";
import { icons as participationStateIcons } from "@/assets/participationStateIcons";

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
} from "chart.js";
import { _DeepPartialObject } from "chart.js/types/utils";
import { getTranslatedString as _ } from "@/i18n";
import Btn from "@/components/ui/Btn.vue";
import Tabs from "@/components/ui/Tabs.vue";
import { SelectableOption } from "@/interfaces";
import ExerciseWithStats from "@/components/teacher/ExerciseWithStats.vue";
import MinimalExercisePreviewSkeleton from "@/components/ui/skeletons/MinimalExercisePreviewSkeleton.vue";
import {
	areAllParticipationsFullyAssessed,
	DataFrequency,
	ExamStatsTabs,
	getExerciseListFromParticipations,
	getScoreFrequencyFromParticipations,
	scoreChartDatasetSettings,
	scoreChartOptions,
} from "@/reports";
import { roundToTwoDecimals } from "@/utils";
import { mapStores } from "pinia";
import { useMainStore } from "@/stores/mainStore";
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

export default defineComponent({
	name: "EventStats",
	props: {},
	components: {
		Bar,
		Btn,
		Tabs,
		ExerciseWithStats,
		MinimalExercisePreviewSkeleton,
	},
	mixins: [courseIdMixin, eventIdMixin, loadingMixin, mediaQueryMixin],
	async created() {
		await this.withLoading(async () => {
			// make a first request without the heavy fields in order
			// to quickly show the first chart...
			await this.mainStore.getEventParticipations({
				courseId: this.courseId,
				eventId: this.eventId,
				mutate: true,
				includeDetails: false,
			});
			await this.mainStore.getEvent({
				courseId: this.courseId,
				eventId: this.eventId,
				includeDetails: false, // event template isn't needed
			});
		});
		// ... then make the heavy request, whose data is to be shown
		// in a tab that's not yet visible to the user
		await this.withLocalLoading(
			async () =>
				await this.mainStore.getEventParticipations({
					courseId: this.courseId,
					eventId: this.eventId,
					mutate: true,
					includeDetails: true, // needed to get slots' exercises and answer texts
				}),
		);
	},
	data() {
		return {
			currentTab: ExamStatsTabs.OVERALL,
			ExamStatsTabs,
			scoreChartOptions,
			participationStateIcons,
			EventParticipationState,
		};
	},
	methods: {
		getSlotsContaining(exercise: Exercise) {
			if (exercise) {
				return this.mainStore.eventParticipations
					.flatMap(p => p.slots)
					.filter(s => s.exercise?.id == exercise.id);
			}
			return [];
		},
		areAllParticipationsFullyAssessed,
	},
	computed: {
		...mapStores(useMainStore),
		tabsAsSelectableOptions(): SelectableOption[] {
			return [
				{
					value: ExamStatsTabs.OVERALL,
					content: _("event_stats.overall"),
				},
				{
					value: ExamStatsTabs.EXERCISES,
					content: _("event_stats.exercises"),
				},
			];
		},
		exercises(): Exercise[] {
			return getExerciseListFromParticipations(this.mainStore.eventParticipations);
		},
		scoreFrequency(): DataFrequency<string>[] {
			return getScoreFrequencyFromParticipations(this.mainStore.eventParticipations);
		},
		scoreFrequencyChartData(): TChartData<"bar", number[], unknown> {
			return {
				labels: this.scoreFrequency.map(r => r.datum),
				datasets: [
					{
						data: this.scoreFrequency.map(r => r.frequency),
						...scoreChartDatasetSettings,
					},
				],
			};
		},
		// overall stats
		participantCount() {
			return this.mainStore.eventParticipations.length;
		},
		turnedInCount() {
			return this.mainStore.eventParticipations.filter(
				p => p.state === EventParticipationState.TURNED_IN,
			).length;
		},
		averageProgress() {
			// TODO use method in utils (like in monitor view)
			const participations = this.mainStore.eventParticipations;
			if (!participations.length) {
				return 0;
			}
			const divisor =
				(this.mainStore
					.getEventById(this.eventId)
					.template?.rules?.map(r => r.amount)
					?.reduce((a, b) => a + b, 0) ?? 0) * participations.length;

			const perc =
				(100 *
					participations
						.map(p =>
							p.state === EventParticipationState.TURNED_IN
								? p.slots.length
								: p.current_slot_cursor ?? 0,
						)
						.reduce((a, b) => a + b)) /
				divisor;
			return roundToTwoDecimals(perc);
		},
	},
});
</script>

<style></style>
