<template>
	<div class="relative flex flex-col flex-grow">
		<div class="flex flex-col w-full -mt-4">
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
						@click="selectedExamsIds = closedExamIds"
						><span class="text-sm">{{
							$t("course_insights.select_closed_exams")
						}}</span></Btn
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
			<div class="flex flex-col w-full mb-4">
				<!-- tabs to select view mode -->
				<Tabs class="mt-6 mb-8" :options="viewModesAsOptions" v-model="viewMode" />
				<!-- exam filters -->
				<div class="flex items-center w-full mb-4 -ml-3">
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
				</div>
			</div>
		</div>
		<!-- exams table -->
		<div v-show="viewMode === 'table'" class="flex flex-col flex-grow">
			<div class="flex-grow overflow-y-auto">
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
			<div class="flex w-full">
				<Btn
					class="ml-auto"
					:disabled="downloadingReport"
					:outline="true"
					@click="downloadReport()"
					><span class="mr-1 material-icons-outlined"> file_download </span>
					{{ downloadingReport ? $t("misc.wait") : $t("misc.download_as_csv") }}
				</Btn>
			</div>
		</div>
		<!-- enrolled students list-->
		<div v-show="viewMode === 'cards'" class="flex flex-col flex-grow w-full">
			<!-- filters & controls -->
			<div
				class="flex flex-col items-center w-full mb-12 space-y-4 md:flex-row md:space-y-0"
			>
				<TextInput
					v-if="false"
					class="w-full md:w-1/2"
					:searchBar="true"
					:leftIcon="'search'"
					:placeholder="$t('course_insights.search_students')"
					v-model="userSearchText"
				/>
				<Btn class="w-full md:ml-auto md:w-max" @click="onEnrollUsers()">
					<span class="mr-2 material-icons">person_add</span>
					{{ $t("course_insights.enroll_students") }}
				</Btn>
			</div>
			<!-- students -->
			<div class="grid grid-cols-1 gap-3 md:grid-cols-3 2xl:grid-cols-4">
				<div
					v-if="!loading && mainStore.enrolledUsers.length === 0"
					class="
						flex flex-col
						items-center
						w-full
						h-full
						mt-12
						md:col-span-3
						2xl:col-span-4
					"
				>
					<p style="font-size: 6rem" class="material-icons-outlined opacity-10">
						person_off
					</p>
					<h2 class="opacity-40">{{ $t("course_insights.no_enrolled_students") }}</h2>
				</div>
				<StudentCard
					class="mb-auto"
					v-for="user in mainStore.enrolledUsers"
					:key="'enrolled-user-' + user.id"
					:user="user"
				/>
			</div>
		</div>
		<Dialog
			:showDialog="showBlockingDialog"
			@yes="resolveBlockingDialog(true)"
			@no="resolveBlockingDialog(false)"
			:yesText="enrollingUsers ? $t('misc.wait') : $t('course_insights.enroll')"
			:noText="$t('dialog.default_cancel_text')"
			:disableOk="usersToEnrollCount === 0 || enrollingUsers"
			:large="true"
			:footerBorder="true"
			:loading="enrollingUsers"
		>
			<template v-slot:title>{{ $t("course_insights.add_enrolled_students") }}</template>
			<template v-slot:body>
				<div class="text-darkText">
					<UserPicker v-model="usersToEnroll"></UserPicker>
				</div>
			</template>
		</Dialog>
	</div>
</template>

<script lang="ts">
import { blockingDialogMixin, courseIdMixin, loadingMixin } from "@/mixins";
import { defineComponent, PropType } from "@vue/runtime-core";
import {
	forceFileDownload,
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
	userMatchesSearch,
} from "@/models";
import { getCourseInsightsHeaders } from "@/const";
import CheckboxGroup from "@/components/ui/CheckboxGroup.vue";
import { SelectableOption } from "@/interfaces";
import { getTranslatedString as _ } from "@/i18n";
import { normalizeOptionalStringContainingNumber } from "@/api/utils";
import StudentCard from "@/components/shared/StudentCard.vue";
import { mapStores } from "pinia";
import { useMainStore } from "@/stores/mainStore";
import { getCourseExamParticipationsReportAsCsv } from "@/reports/courseExamsParticipations";
import Btn from "@/components/ui/Btn.vue";
import Tabs from "@/components/ui/Tabs.vue";
import TextInput from "@/components/ui/TextInput.vue";
import Dialog from "@/components/ui/Dialog.vue";
import UserPicker from "@/components/shared/UserPicker.vue";
import { useMetaStore } from "@/stores/metaStore";
export default defineComponent({
	name: "CourseInsights",
	mixins: [courseIdMixin, loadingMixin, blockingDialogMixin],
	props: {},
	components: {
		DataTable,
		CheckboxGroup,
		Btn,
		StudentCard,
		Tabs,
		TextInput,
		Dialog,
		UserPicker,
	},
	watch: {
		viewMode(newVal) {
			logAnalyticsEvent("changeCourseInsightsViewMode", {
				courseId: this.courseId,
				to: newVal,
			});
		},
		usersToEnroll: {
			handler(newVal) {
				// this will enable the `unsavedChanges` getter which will prompt
				// user for confirmation when leaving the window
				this.metaStore.saving = newVal.ids.length > 0 || newVal.emails.length > 0;
			},
			deep: true,
		},
	},
	async created() {
		await this.withLoading(async () => {
			await Promise.all([this.fetchUsers(), this.fetchExams()]);
			// initially enable all exams in the table
			this.selectedExamsIds = this.mainStore.exams.map(e => e.id);

			this.participations = await getCourseParticipationReport(this.courseId);
		});
		logAnalyticsEvent("viewedCourseStats", { courseId: this.courseId });
	},
	data() {
		return {
			loadingEnrolledStudents: false,
			examSelectionExpanded: false,
			loadingExams: false,
			gridApi: null as any,
			columnApi: null as any,
			participations: {} as CourseExamParticipationReport,
			selectedExamsIds: [] as string[],
			viewMode: "table" as "table" | "cards",
			downloadingReport: false,
			userSearchText: "",
			usersToEnroll: { ids: [], emails: [] } as {
				ids: string[];
				emails: string[];
			},
			enrollingUsers: false,
		};
	},
	methods: {
		getRowId(data: any) {
			return data.id;
		},
		async fetchUsers() {
			this.loadingEnrolledStudents = true;
			try {
				await Promise.all([
					this.mainStore.getCourseEnrolledUsers({ courseId: this.courseId }),
					this.mainStore.getCourseActiveUsers({ courseId: this.courseId }),
				]);
			} catch (e) {
				setErrorNotification(e);
			} finally {
				this.loadingEnrolledStudents = false;
			}
		},
		async fetchExams() {
			this.loadingExams = true;
			try {
				await this.mainStore.getEvents({
					courseId: this.courseId,
					filters: {
						event_type: EventType.EXAM,
						// state: EventState.CLOSED,
					} as EventSearchFilter,
				});
			} catch (e) {
				setErrorNotification(e);
			} finally {
				this.loadingExams = false;
			}
		},
		async onEnrollUsers() {
			this.showBlockingDialog = true;
			const choice = await this.getBlockingBinaryDialogChoice();
			if (!choice) {
				this.showBlockingDialog = false;
				return;
			}
			try {
				this.enrollingUsers = true;
				await this.mainStore.enrollUsersInCourse({
					courseId: this.courseId,
					userIds: this.usersToEnroll.ids,
					emails: this.usersToEnroll.emails,
				});
				// re-fetch enrolled users to include new ones
				await this.mainStore.getCourseEnrolledUsers({ courseId: this.courseId });
				// cleanup
				this.metaStore.showSuccessFeedback();
				this.usersToEnroll = {
					ids: [],
					emails: [],
				};
			} catch (e) {
				setErrorNotification(e);
			} finally {
				this.enrollingUsers = false;
				this.showBlockingDialog = false;
			}
		},
		downloadReport() {
			this.downloadingReport = true;
			try {
				const content = getCourseExamParticipationsReportAsCsv(
					this.participations,
					this.activeUsersForSelectedExams,
					this.selectedExams,
				).replace(/(\\r)?\\n/g, "\n");
				forceFileDownload(
					{
						data: content,
					},
					this.currentCourse.name + "_report.csv",
				);
			} catch (e) {
				setErrorNotification(e);
			} finally {
				setTimeout(() => (this.downloadingReport = false), 150);
			}
		},
		filterUser(search: string, userOption: SelectableOption) {
			const user = this.mainStore.getUserById(userOption.value) as User;
			return userMatchesSearch(search, user);
		},
	},
	computed: {
		...mapStores(useMainStore, useMetaStore),
		practiceParticipations() {
			return [];
		},
		usersToEnrollCount() {
			return this.usersToEnroll.emails.length + this.usersToEnroll.ids.length;
		},
		usersAsOptions(): SelectableOption[] {
			return this.mainStore.paginatedUsers.data.map(u => ({
				value: u.id,
				content: u.full_name,
				data: u,
			}));
		},
		viewModesAsOptions(): SelectableOption[] {
			return [
				{
					value: "table",
					icons: ["table_chart"],
					content: _("course_insights.exams_stats"),
				},
				{
					value: "cards",
					icons: ["people"],
					content: _("course_insights.enrolled_students"),
				},
			];
		},
		examsAsSelectableOptions(): SelectableOption[] {
			return (
				[...this.mainStore.exams]
					// TODO use moment
					.sort((a, b) =>
						new Date(b.begin_timestamp ?? "") < new Date(a.begin_timestamp ?? "")
							? 1
							: -1,
					)
					.map(e => ({
						value: e.id,
						content:
							e.name.trim().length > 0 ? e.name.trim() : _("event_preview.unnamed_event"),
					}))
			);
		},
		activeUsersForSelectedExams() {
			if (this.loading) {
				return [];
			}
			const users = this.mainStore.activeUsers;
			return users.filter(u =>
				this.selectedExams.some(
					e =>
						typeof (this.participations[e.id] ?? []).find(p => p.user == u.id) !==
						"undefined",
				),
			);
		},
		closedExamIds() {
			return this.mainStore.exams
				.filter(e => e.state === EventState.CLOSED)
				.map(e => e.id);
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
			const filteredUsers = this.activeUsersForSelectedExams;
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

			return filteredUsers.map(u => ({
				id: u.id,
				email: u.email,
				fullName: u.full_name,
				mat: u.mat,
				course: u.course,
				...exams.reduce((acc, e) => {
					const score = normalizeOptionalStringContainingNumber(
						(this.participations[e.id] ?? []).find(p => p.user == u.id)?.score,
					);
					acc["exam_" + e.id] = score;
					return acc;
				}, {} as any),
				score_sum: getScoreSumFn(u),
				score_average: roundToTwoDecimals(
					getScoreSumFn(u) /
						this.selectedExams.filter(
							// only consider exams the user has participated in
							e =>
								(this.participations[e.id] ?? []).findIndex(p => p.user == u.id) !== -1,
						).length,
				),
			}));
		},
	},
});
</script>

<style></style>
