<template>
	<div class="relative flex flex-col">
		<!-- <h3>{{ $t("course_insights.active_students") }}</h3>
		<p class="text-muted">
			 {{ $t("course_insights.active_students_description") }}
		</p> -->
		<!-- <div v-if="!loading && users.length === 0" class="flex flex-col items-center mt-8">
			<p style="font-size: 6rem" class="material-icons-outlined opacity-10">person_off</p>
			<h2 class="opacity-40">{{ $t("course_insights.no_active_students") }}</h2>
		</div> -->
		<!-- <div v-if="false" class="grid grid-cols-1 gap-3 mt-4 md:grid-cols-3">
			<StudentCard
				class="mb-auto"
				v-for="user in users"
				:key="'active-user-' + user.id"
				:user="user"
			></StudentCard>
		</div> -->
		<div class="-mt-4 flex w-full flex-col">
			<!-- exam checkboxes-->
			<div
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
						@click="selectedExamsIds = exams.map(e => e.id)"
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
			<div class="w-max mb-2 -ml-3">
				<div class="flex items-center w-max">
					<Btn
						v-if="!full"
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
					<label v-if="!full" class="cursor-pointer text-muted" for="more-filters-btn">{{
						$t("course_insights.filter_exams")
					}}</label>
				</div>
			</div>
		</div>
		<div class="flex-grow">
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
		<!-- <div class="flex mt-2 space-x-2">
			<Btn class="" :outline="true" :variant="'danger'">
				<span class="mr-1 text-base material-icons-outlined"> block </span>
				{{ $t("event_monitor.close_for_selected") }}</Btn
			>

			<Btn class="" :variant="'primary'" :outline="true">
				<span class="mr-1 text-base material-icons-outlined"> undo </span>
				{{ $t("event_monitor.open_for_selected") }}</Btn
			>
		</div> -->
	</div>
</template>

<script lang="ts">
import { createNamespacedHelpers } from "vuex";
const { mapActions, mapState, mapGetters } = createNamespacedHelpers("teacher");
import { courseIdMixin, loadingMixin } from "@/mixins";
import { defineComponent, PropType } from "@vue/runtime-core";
import StudentCard from "@/components/shared/StudentCard.vue";
import Card from "@/components/ui/Card.vue";
import { logAnalyticsEvent } from "@/utils";
import DataTable from "@/components/ui/DataTable.vue";
import { EventSearchFilter } from "@/api";
import { EventState, EventType, User, Event, EventParticipation } from "@/models";
import { getCourseInsightsHeaders } from "@/const";
import CheckboxGroup from "@/components/ui/CheckboxGroup.vue";
import { SelectableOption } from "@/interfaces";
import Btn from "@/components/ui/Btn.vue";
import { getTranslatedString as _ } from "@/i18n";
export default defineComponent({
	name: "CourseInsights",
	mixins: [courseIdMixin, loadingMixin],
	props: {},
	components: {
		//StudentCard,
		//Card,
		DataTable,
		CheckboxGroup,
		Btn,
	},

	async created() {
		await this.withLoading(async () => {
			await Promise.all([this.fetchUsers(), this.fetchClosedExams()]);
			// initially enable all exams in the table
			this.selectedExamsIds = this.exams.map((e: Event) => e.id);
			this.participations = await this.fetchParticipations();
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
			participations: {} as Record<string, EventParticipation[]>,
			selectedExamsIds: [] as string[],
		};
	},
	methods: {
		...mapActions(["getCourseActiveUsers", "getEvents", "getEventParticipations"]),
		getRowId(data: any) {
			return data.id;
		},
		async fetchUsers() {
			this.loadingActiveStudents = true;
			try {
				await this.getCourseActiveUsers({ courseId: this.courseId });
			} catch (e) {
				this.setErrorNotification(e);
			} finally {
				this.loadingActiveStudents = false;
			}
		},
		async fetchClosedExams() {
			this.loadingExams = true;
			try {
				await this.getEvents({
					courseId: this.courseId,
					filters: {
						event_type: EventType.EXAM,
						state: EventState.CLOSED,
					} as EventSearchFilter,
				});
			} catch (e) {
				this.setErrorNotification(e);
			} finally {
				this.loadingExams = false;
			}
		},
		async fetchParticipations() {
			const participations: Record<string, EventParticipation[]> = {};
			for (const e of this.exams as Event[]) {
				// TODO profile this and consider enabling bulk get
				participations[e.id] = await this.getEventParticipations({
					courseId: this.courseId,
					eventId: e.id,
					mutate: false,
					//includeDetails: true, // TODO make custom serializer that includes event id
				});
			}
			return participations;
		},
	},
	computed: {
		...mapState(["users"]),
		...mapGetters(["exams"]),
		practiceParticipations() {
			return [];
		},
		examsAsSelectableOptions(): SelectableOption[] {
			return (this.exams as Event[]).map(e => ({
				value: e.id,
				content:
					e.name.trim().length > 0 ? e.name.trim() : _("event_preview.unnamed_event"),
			}));
		},
		activeUsersForSelectedExams() {
			const activeUsers = this.users as User[];
			return activeUsers.filter(u =>
				this.selectedExams.some(
					e =>
						typeof this.participations[e.id].find(p => p.user.id == u.id) !== "undefined",
				),
			);
		},
		selectedExams(): Event[] {
			return this.exams.filter((e: Event) =>
				this.selectedExamsIds.map(i => String(i)).includes(String(e.id)),
			);
		},
		tableHeaders() {
			// TODO sort exams by increasing begin timestamp
			// TODO add ability to select which exams to show
			return getCourseInsightsHeaders(this.selectedExams, this.examsColors);
		},
		examsColors(): Record<string, string> {
			return (this.exams as Event[]).reduce((acc, e) => {
				const letters = "0123456789ABCDEF";
				let color = "#";
				for (let i = 0; i < 6; i++) {
					color += letters[Math.floor(Math.random() * 16)];
				}
				/*
				let hash = 0;
				for (let i = 0; i < e.name.length; i++) {
					hash = e.name.charCodeAt(i) + ((hash << 5) - hash);
				}
				let color = "#";
				for (let i = 0; i < 3; i++) {
					let value = (hash >> (i * 8)) & 0xff;
					color += ("00" + value.toString(16)).substr(-2);
				}
				*/
				acc[e.id] = color;
				return acc;
			}, {} as Record<string, string>);
		},
		tableData() {
			if (this.loading) {
				return [];
			}
			const activeUsers = this.activeUsersForSelectedExams;
			const exams = this.exams as Event[];

			const getScoreSumFn = (u: User) =>
				Math.round(
					Object.entries(this.participations)
						.filter(e => this.selectedExamsIds.map(i => String(i)).includes(String(e[0])))
						.map(e => e[1])
						.flat()
						.filter(p => p.user.id == u.id)
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
					acc["exam_" + e.id] = this.participations[e.id].find(
						p => p.user.id == u.id,
					)?.score;
					return acc;
				}, {} as any),
				score_sum: getScoreSumFn(u),
				score_average:
					Math.round((getScoreSumFn(u) / this.selectedExams.length) * 100) / 100,
			}));
		},
	},
});
</script>

<style></style>
