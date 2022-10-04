<template>
	<div class="flex flex-col">
		<Card
			v-if="false"
			class="mb-8 border-none shadow-elevation"
			:filled="true"
			:hoverable="false"
		>
			<template v-slot:body>
				<div class="flex items-center space-x-2">
					<span class="material-icons-outlined icon-light"> people </span>
					<p>
						<span class="text-muted">{{ $t("course_insights.active_students") }}:</span>
						{{ users.length }}
					</p>
				</div>
				<div class="flex items-center my-4 space-x-2">
					<span class="material-icons-outlined icon-light"> fitness_center </span>
					<p>
						<span class="text-muted">{{ $t("course_insights.practice_sessions") }}:</span>
						&nbsp;<em>(coming soon)</em
						><!--{{ practiceParticipations.length }}-->
					</p>
				</div>
				<div class="flex items-center space-x-2">
					<span class="material-icons-outlined icon-light"> topic </span>
					<p>
						<span class="text-muted">{{ $t("course_insights.exercises") }}:</span>
						&nbsp;<em>(coming soon)</em>
						<!-- {{ users.length }} -->
					</p>
				</div>
			</template>
		</Card>
		<h3>{{ $t("course_insights.active_students") }}</h3>
		<p class="text-muted">
			{{ $t("course_insights.active_students_description") }}
		</p>
		<div v-if="!loading && users.length === 0" class="flex flex-col items-center mt-8">
			<p style="font-size: 6rem" class="material-icons-outlined opacity-10">person_off</p>
			<h2 class="opacity-40">{{ $t("course_insights.no_active_students") }}</h2>
		</div>
		<div v-if="false" class="grid grid-cols-1 gap-3 mt-4 md:grid-cols-3">
			<StudentCard
				class="mb-auto"
				v-for="user in users"
				:key="'active-user-' + user.id"
				:user="user"
			></StudentCard>
		</div>
		<div class="flex-grow">
			LISTA DEGLI ESAMI CON SWITCH PER SELEZIONARE QUALI INCLUDERE
			<DataTable
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
export default defineComponent({
	name: "CourseInsights",
	mixins: [courseIdMixin, loadingMixin],
	props: {},
	async created() {
		await this.withLoading(async () => {
			await Promise.all([this.fetchUsers(), this.fetchClosedExams()]);
			this.participations = await this.fetchParticipations();
		});
		logAnalyticsEvent("viewedCourseStats", { courseId: this.courseId });
	},
	data() {
		return {
			loadingActiveStudents: false,
			loadingExams: false,
			gridApi: null as any,
			columnApi: null as any,
			participations: {} as Record<string, EventParticipation[]>,
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
		tableHeaders() {
			// TODO sort exams by increasing begin timestamp
			// TODO add ability to select which exams to show
			return getCourseInsightsHeaders(this.exams);
		},
		tableData() {
			if (this.loading) {
				return [];
			}
			const activeUsers = this.users as User[];
			const exams = this.exams as Event[];

			console.log("active", activeUsers);

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
				// TODO add sum score and average
			}));
		},
	},
	components: { StudentCard, Card, DataTable },
});
</script>

<style></style>
