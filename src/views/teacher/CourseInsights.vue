<template>
	<div class="relative flex flex-col flex-grow">
		<div class="-mt-4 flex w-full flex-col">
			<!-- exam checkboxes-->
			<div
				v-show="viewMode === 'table'"
				:class="[
					examSelectionExpanded ? 'max-h-100' : 'max-h-0  overflow-y-hidden',
					'duration-200 ease-in-out w-full transition-max-height',
				]"
			>
				<CheckboxGroup
					class="flex flex-wrap"
					:options="examsAsSelectableOptions"
					v-model="selectedExamsIds"
					:usesCustomSlot="true"
					:itemClass="'mt-4 mr-5'"
				>
					<template v-slot:custom="{ item }">
						<div class="flex items-center">
							<div
								:style="{
									'background-color': examsColors[item.value],
									'margin-right': '5px',
									'min-width': '10px',
									'min-height': '10px',
									width: '10px',
									height: '10px',
									'border-radius': '50%',
								}"
							></div>
							{{ item.content }}
						</div></template
					></CheckboxGroup
				>
				<div class="flex items-center space-x-1.5 mb-3">
					<Btn
						class="mt-3 -ml-1 text-sm"
						:variant="'primary-borderless'"
						:size="'xs'"
						@click="selectedExamsIds = mainStore.exams.map(e => e.id)"
						><span class="text-sm">{{ $t("misc.select_all") }}</span></Btn
					>
					<Btn
						class="mt-3 text-sm"
						:variant="'primary-borderless'"
						:size="'xs'"
						@click="selectedExamsIds = []"
						><span class="text-sm">{{ $t("misc.unselect_all") }}</span></Btn
					>
				</div>
			</div>
			<!-- filter button -->
			<div class="w-full items-center flex mb-4 -ml-3">
				<div v-show="viewMode === 'table'" class="flex items-center w-max">
					<Btn
						:variant="'icon'"
						:outline="true"
						@click="examSelectionExpanded = !examSelectionExpanded"
						class=""
						id="more-filters-btn"
						><span
							class="
								transition-transform
								duration-200
								ease-out
								transform
								material-icons-outlined
							"
							:class="{ 'rotate-180': examSelectionExpanded }"
						>
							{{ "expand_more" }}
						</span>
					</Btn>
					<label class="cursor-pointer text-muted" for="more-filters-btn">{{
						$t("course_insights.filter_exams")
					}}</label>
				</div>
				<SegmentedControls
					:small="true"
					class="hidden ml-auto md:block"
					:options="viewModesAsOptions"
					v-model="viewMode"
				/>
			</div>
		</div>
		<div v-show="viewMode === 'table'" class="flex-grow">
			<div class="h-full overflow-y-auto">
				<DataTable
					:class="{ 'opacity-60': loading }"
					:columnDefs="tableHeaders"
					:rowData="loading ? [] : tableData"
					:getRowId="getRowId"
					@gridReady="
						gridApi = $event.api;
						columnApi = $event.columnApi;
						columnApi.autoSizeAllColumns(false);
					"
				/>
			</div>
		</div>
		<div
			v-show="viewMode === 'cards'"
			class="grid grid-cols-1 gap-3 mt-4 md:grid-cols-3 2xl:grid-cols-4"
		>
			<div
				v-if="!loading && mainStore.paginatedUsers.count === 0"
				class="flex flex-col items-center mt-8"
			>
				<p style="font-size: 6rem" class="material-icons-outlined opacity-10">
					person_off
				</p>
				<h2 class="opacity-40">{{ $t("course_insights.no_active_students") }}</h2>
			</div>
			<StudentCard
				class="mb-auto"
				v-for="user in mainStore.paginatedUsers.data"
				:key="'active-user-' + user.id"
				:user="user"
			/>
		</div>
	</div>
</template>

<script lang="ts">
import { courseIdMixin, loadingMixin } from "@/mixins";
import { defineComponent, PropType } from "@vue/runtime-core";
import {
	getColorFromString,
	logAnalyticsEvent,
	roundToTwoDecimals,
	setErrorNotification,
} from "@/utils";
import DataTable from "@/components/ui/DataTable.vue";
import { EventSearchFilter, getCourseParticipationReport } from "@/api";
import {
	EventState,
	EventType,
	User,
	Event,
	EventParticipation,
	CourseExamParticipationReport,
} from "@/models";
import { getCourseInsightsHeaders } from "@/const";
import CheckboxGroup from "@/components/ui/CheckboxGroup.vue";
import { SelectableOption } from "@/interfaces";
import Btn from "@/components/ui/Btn.vue";
import { getTranslatedString as _ } from "@/i18n";
import { normalizeOptionalStringContainingNumber } from "@/api/utils";
import SegmentedControls from "@/components/ui/SegmentedControls.vue";
import StudentCard from "@/components/shared/StudentCard.vue";
import { mapStores } from "pinia";
import { useMainStore } from "@/stores/mainStore";
export default defineComponent({
	name: "CourseInsights",
	mixins: [courseIdMixin, loadingMixin],
	props: {},
	components: {
		DataTable,
		CheckboxGroup,
		Btn,
		SegmentedControls,
		StudentCard,
	},
	watch: {
		viewMode(newVal) {
			logAnalyticsEvent("changeCourseInsightsViewMode", {
				courseId: this.courseId,
				to: newVal,
			});
		},
	},
	async created() {
		await this.withLoading(async () => {
			await Promise.all([this.fetchUsers(), this.fetchClosedExams()]);
			// initially enable all exams in the table
			this.selectedExamsIds = this.mainStore.exams.map(e => e.id);

			this.participations = await getCourseParticipationReport(this.courseId);
		});
		logAnalyticsEvent("viewedCourseStats", { courseId: this.courseId });
	},
	data() {
		return {
			loadingActiveStudents: false,
			examSelectionExpanded: false,
			loadingExams: false,
			gridApi: null as any,
			columnApi: null as any,
			participations: {} as CourseExamParticipationReport,
			selectedExamsIds: [] as string[],
			viewMode: "table" as "table" | "cards",
		};
	},
	methods: {
		getRowId(data: any) {
			return data.id;
		},
		async fetchUsers() {
			this.loadingActiveStudents = true;
			try {
				await this.mainStore.getCourseActiveUsers({ courseId: this.courseId });
			} catch (e) {
				setErrorNotification(e);
			} finally {
				this.loadingActiveStudents = false;
			}
		},
		async fetchClosedExams() {
			this.loadingExams = true;
			try {
				await this.mainStore.getEvents({
					courseId: this.courseId,
					filters: {
						event_type: EventType.EXAM,
						state: EventState.CLOSED,
					} as EventSearchFilter,
				});
			} catch (e) {
				setErrorNotification(e);
			} finally {
				this.loadingExams = false;
			}
		},
	},
	computed: {
		...mapStores(useMainStore),
		practiceParticipations() {
			return [];
		},
		viewModesAsOptions(): SelectableOption[] {
			return [
				{
					value: "table",
					icons: ["table_chart"],
					content: "",
				},
				{
					value: "cards",
					icons: ["portrait"],
					content: "",
				},
			];
		},
		examsAsSelectableOptions(): SelectableOption[] {
			return [...this.mainStore.exams]
				.sort((a, b) =>
					new Date(b.begin_timestamp ?? "") < new Date(a.begin_timestamp ?? "") ? 1 : -1,
				)
				.map(e => ({
					value: e.id,
					content:
						e.name.trim().length > 0 ? e.name.trim() : _("event_preview.unnamed_event"),
				}));
		},
		activeUsersForSelectedExams() {
			if (this.loading) {
				return [];
			}
			const activeUsers = this.mainStore.paginatedUsers.data;
			return activeUsers.filter(u =>
				this.selectedExams.some(
					e => typeof this.participations[e.id].find(p => p.user == u.id) !== "undefined",
				),
			);
		},
		selectedExams(): Event[] {
			return this.mainStore.exams.filter(e =>
				this.selectedExamsIds.map(i => String(i)).includes(String(e.id)),
			);
		},
		tableHeaders() {
			// TODO sort exams by increasing begin timestamp
			// TODO add ability to select which exams to show
			return getCourseInsightsHeaders(this.selectedExams, this.examsColors);
		},
		examsColors(): Record<string, string> {
			return this.mainStore.exams.reduce((acc, e) => {
				acc[e.id] = getColorFromString(e.name);
				return acc;
			}, {} as Record<string, string>);
		},
		tableData() {
			if (this.loading) {
				return [];
			}
			const activeUsers = this.activeUsersForSelectedExams;
			const exams = this.mainStore.exams;

			const getScoreSumFn = (u: User) =>
				Math.round(
					Object.entries(this.participations)
						.filter(([eventId]) =>
							this.selectedExamsIds.map(i => String(i)).includes(String(eventId)),
						)
						.map(([, participations]) => participations)
						.flat()
						.filter(p => p.user == u.id)
						.map(p => parseFloat(p.score ?? "0"))
						.reduce((a, b) => a + b, 0) * 100,
				) / 100;

			return activeUsers.map(u => ({
				id: u.id,
				email: u.email,
				fullName: u.full_name,
				mat: u.mat,
				course: u.course,
				...exams.reduce((acc, e) => {
					const score = normalizeOptionalStringContainingNumber(
						this.participations[e.id].find(p => p.user == u.id)?.score,
					);
					acc["exam_" + e.id] = score;
					return acc;
				}, {} as any),
				score_sum: getScoreSumFn(u),
				score_average: roundToTwoDecimals(
					getScoreSumFn(u) /
						this.selectedExams.filter(
							// only consider exams the user has participated in
							e => this.participations[e.id].findIndex(p => p.user == u.id) !== -1,
						).length,
				),
			}));
		},
	},
});
</script>

<style></style>
