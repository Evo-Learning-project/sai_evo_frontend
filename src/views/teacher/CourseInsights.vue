<template>
	<div class="relative flex flex-col flex-grow">
		<div class="flex flex-col w-full -mt-4">
			<div class="flex flex-col w-full mb-4">
				<!-- tabs to select view mode -->
				<Tabs class="mt-2 mb-4" :options="viewModesAsOptions" v-model="viewMode" />
				<!-- exam filters -->
				<!-- exam checkboxes-->
				<div
					v-show="viewMode === 'exams'"
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
			</div>
		</div>
		<!-- exams table -->
		<div v-if="viewMode === 'exams'" class="flex flex-col flex-grow">
			<Spinner
				:variant="'light'"
				:size="'xl'"
				v-if="localLoading"
				class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
			/>
			<!-- search filters -->
			<div class="flex items-center mb-2 -mt-2">
				<!-- text filtering-->
				<TextInput
					class="w-full md:w-1/3"
					:searchBar="true"
					:leftIcon="'search'"
					:placeholder="$t('course_insights.search_students')"
					v-model="examsViewSearchText"
				/>
				<!-- sorting options -->
				<DropdownMenu
					:expanded="examsViewSortingOptionsExpanded"
					@toggleExpanded="
						examsViewSortingOptionsExpanded = !examsViewSortingOptionsExpanded
					"
				>
					<template v-slot:activator>
						<Btn :variant="'icon'" :outline="true" class="">
							<!-- :tooltip="$t('event_monitor.sorting_tooltip')" -->
							<svg
								style="width: 22px; height: 22px"
								class="opacity-70"
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
							>
								<title>sort</title>
								<path
									d="M18 21L14 17H17V7H14L18 3L22 7H19V17H22M2 19V17H12V19M2 13V11H9V13M2 7V5H6V7H2Z"
								/>
							</svg>
						</Btn>
					</template>
					<div class="-mx-5 -my-2.5 w-max">
						<div v-for="(option, index) in examsViewSortingOptions" :key="index">
							<Btn
								:outline="true"
								class="px-8 pt-2 pb-2 w-full"
								:variant="'transparent'"
								@click="setSortingOption(index)"
							>
								<span
									class="material-icons mr-2 text-primary"
									v-if="index === examsViewSelectedSortingOption"
									>done</span
								>
								<div class="flex items-center align-top">{{ option.label }}</div>
							</Btn>
						</div>
					</div>
				</DropdownMenu>
				<!-- filtering options based on average-->
				<div class="flex space-x-1 ml-2">
					<Dropdown
						v-model="examsViewSelectedFilterOption"
						:options="examViewFilteringOptions"
						class="w-60"
					/>
					<NumberInput
						style="padding-top: 0.5rem !important; padding-bottom: 0.645rem !important"
						:elementId="'grade-filter-value-input'"
						v-if="examsViewSelectedFilterOption !== 'no_filter'"
						v-model="examsViewAverageGradeFilterValue"
						class="w-16"
					/>
				</div>

				<div class="flex items-center ml-2">
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
				<Btn
					class="ml-auto"
					:disabled="downloadingReport"
					:outline="true"
					:variant="'icon'"
					@click="downloadReport()"
					:tooltip="$t('misc.download_as_csv')"
				>
					<span class="material-icons-outlined"> file_download </span>
					<!-- {{ downloadingReport ? $t("misc.wait") : $t("misc.download_as_csv") }} -->
				</Btn>
			</div>
			<div class="flex-grow overflow-y-auto">
				<DataTable
					:class="{ 'opacity-60': loading || localLoading }"
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
		<!-- enrolled students list-->
		<div v-show="viewMode === 'students'" class="flex flex-col flex-grow w-full">
			<!-- filters & controls -->
			<div
				class="
					flex flex-col
					items-center
					w-full
					mb-12
					space-y-4
					md:flex-row md:space-y-0
					-mt-2
				"
			>
				<TextInput
					class="w-full md:w-1/2"
					:searchBar="true"
					:leftIcon="'search'"
					:placeholder="$t('course_insights.search_students')"
					v-model="usersViewSearchText"
				/>
				<div class="flex items-center space-x-2 ml-auto">
					<Btn class="" @click="onEnrollUsers()">
						<span class="mr-2 material-icons">person_add</span>
						{{ $t("course_insights.enroll_students") }}
					</Btn>
					<Btn
						v-if="classroomIntegrationActive"
						:outline="true"
						:variant="'icon'"
						class=""
						style="margin-top: 2px"
						@click="showClassroomSyncDialog = true"
						:tooltip="$t('integrations.classroom.sync_classroom_roster')"
					>
						<img src="@/assets/classroom_sync.png" style="width: 28px" />
					</Btn>
				</div>
			</div>
			<!-- students -->
			<div class="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
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
				<div
					v-else-if="!loading && filteredEnrolledUsers.length === 0"
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
					<h2 class="opacity-40">{{ $t("course_insights.no_users_matching_search") }}</h2>
				</div>
				<StudentCard
					class="mb-auto"
					v-for="user in filteredEnrolledUsers"
					:key="'enrolled-user-' + user.id"
					:user="user"
				/>
			</div>
		</div>
		<Dialog
			:showDialog="showClassroomSyncDialog"
			@yes="onSyncClassroomRoster()"
			@no="showClassroomSyncDialog = false"
			:yesText="
				syncingClassroomRoster
					? $t('misc.wait')
					: $t('integrations.classroom.sync_roster')
			"
			:noText="$t('dialog.default_cancel_text')"
			:disableOk="syncingClassroomRoster"
			:loading="syncingClassroomRoster"
		>
			<template v-slot:title>
				{{ $t("integrations.classroom.sync_classroom_roster") }}
			</template>
			<template v-slot:body>
				<p class="text-darkText">
					{{ $t("integrations.classroom.sync_classroom_roster_description_1") }}
					<span class="">
						<img src="@/assets/classroom.png" style="width: 20px" class="inline mr-1" />
						<strong>{{ googleClassroomCourseTwin?.data?.name }}</strong>
					</span>
					{{ $t("integrations.classroom.sync_classroom_roster_description_2") }}
					<strong>{{ currentCourse.name }}</strong
					>.
					<!-- {{ $t("integrations.classroom.sync_classroom_roster_description_3") }} -->
				</p>
			</template>
		</Dialog>
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
import { useGoogleIntegrationsStore } from "../../integrations/stores/googleIntegrationsStore";
import { GoogleClassroomCourseTwin } from "../../integrations/classroom/interfaces";
import StudentRenderer from "@/components/datatable/StudentRenderer.vue";
import CourseInsightsExamParticipationRenderer from "../../components/datatable/CourseInsightsExamParticipationRenderer.vue";
import CourseInsightsExamHeaderRenderer from "../../components/datatable/CourseInsightsExamHeaderRenderer.vue";
import DropdownMenu from "../../components/ui/DropdownMenu.vue";
import Dropdown from "../../components/ui/Dropdown.vue";
import NumberInput from "../../components/ui/NumberInput.vue";
import Spinner from "../../components/ui/Spinner.vue";

interface ExamsTableRow {
	user: User;
	scoreAverage: number;
}

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
		// eslint-disable-next-line vue/no-unused-components
		StudentRenderer,
		// eslint-disable-next-line vue/no-unused-components
		CourseInsightsExamParticipationRenderer,
		// eslint-disable-next-line vue/no-unused-components
		CourseInsightsExamHeaderRenderer,
		DropdownMenu,
		Dropdown,
		NumberInput,
		Spinner,
	},
	beforeUnmount() {
		if (this.fetchUserPollingHandle) {
			clearInterval(this.fetchUserPollingHandle);
		}
	},
	watch: {
		viewMode(newVal) {
			logAnalyticsEvent("changeCourseInsightsViewMode", {
				courseId: this.courseId,
				to: newVal,
			});
			window.location.hash = newVal;
		},
		usersToEnroll: {
			handler(newVal) {
				// this will enable the `unsavedChanges` getter which will prompt
				// user for confirmation when leaving the window
				this.metaStore.saving = newVal.ids.length > 0 || newVal.emails.length > 0;
			},
			deep: true,
		},
		examsViewSelectedFilterOption(newVal) {
			if (newVal !== "no_filter") {
				this.$nextTick(() =>
					document.getElementById("grade-filter-value-input")?.focus(),
				);
			} else {
				this.examsViewAverageGradeFilterValue = 0;
			}
		},
	},
	async created() {
		const hash = window.location.hash.replace("#", "");
		// check for invalid hash
		if (["students", "exams"].includes(hash)) {
			this.viewMode = hash as "students" | "exams";
		}

		await this.withLoading(async () => {
			await Promise.all([this.fetchUsers(), this.fetchExams()]);
		});

		this.googleClassroomCourseTwin = await this.googleIntegrationStore.getCourseTwin(
			this.courseId,
		);

		await this.withLocalLoading(async () => {
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
			viewMode: "students" as "exams" | "students",
			downloadingReport: false,
			usersViewSearchText: "",
			usersToEnroll: { ids: [], emails: [] } as {
				ids: string[];
				emails: string[];
			},
			enrollingUsers: false,
			googleClassroomCourseTwin: null as null | GoogleClassroomCourseTwin,
			showClassroomSyncDialog: false,
			syncingClassroomRoster: false,
			fetchUserPollingHandle: null as null | number,
			// filtering on exam view
			examsViewSearchText: "",
			examsViewSelectedFilterOption: "no_filter",
			examsViewAverageGradeFilterValue: 0,
			examsViewSelectedSortingOption: 0,
			examsViewSortingOptionsExpanded: false,
		};
	},
	methods: {
		getRowId(data: any) {
			return data.id;
		},
		async onSyncClassroomRoster() {
			try {
				this.syncingClassroomRoster = true;
				await this.googleIntegrationStore.syncCourseRoster(this.courseId);
				this.showClassroomSyncDialog = false;
				this.metaStore.showSuccessFeedback(
					_("integrations.classroom.roster_sync_scheduled"),
					5000,
				);
				this.fetchUserPollingHandle = setInterval(() => {
					this.fetchUsers();
				}, 10_000);
			} catch (e) {
				setErrorNotification(e);
			} finally {
				this.syncingClassroomRoster = false;
			}
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
				const filteredSortedUsers = this.tableData.map((row: ExamsTableRow) => ({
					...row.user,
					score_average: row.scoreAverage,
				}));
				const content = getCourseExamParticipationsReportAsCsv(
					this.participations,
					filteredSortedUsers,
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
		// exams view sorting & filtering
		setSortingOption(index: number) {
			this.examsViewSelectedSortingOption = index;
			this.examsViewSortingOptionsExpanded = false;
		},
	},
	computed: {
		...mapStores(useMainStore, useMetaStore, useGoogleIntegrationsStore),
		// bookkeeping
		classroomIntegrationActive() {
			return this.googleClassroomCourseTwin !== null;
		},
		viewModesAsOptions(): SelectableOption[] {
			return [
				{
					value: "students",
					icons: ["people"],
					content: _("course_insights.enrolled_students"),
				},
				{
					value: "exams",
					icons: ["table_chart"],
					content: _("course_insights.exams_stats"),
				},
			];
		},
		// users view & enrollment
		filteredEnrolledUsers() {
			const enrolledUsers = this.mainStore.enrolledUsers;
			return enrolledUsers.filter(u => {
				return userMatchesSearch(this.usersViewSearchText, u);
			});
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
		// exams view data, sorting & filtering
		examViewFilteringOptions(): SelectableOption[] {
			return [
				{
					value: "no_filter",
					content: _("course_insights.no_filter"),
					data: () => true,
				},
				{
					value: "average_greater_than",
					content: _("course_insights.filter_average_greater_than"),
					data: (row: ExamsTableRow) =>
						row.scoreAverage >= (this.examsViewAverageGradeFilterValue ?? 0),
				},
				{
					value: "average_less_than",
					content: _("course_insights.filter_average_less_than"),
					data: (row: ExamsTableRow) =>
						row.scoreAverage <= (this.examsViewAverageGradeFilterValue ?? 0),
				},
			];
		},
		examsViewSortingOptions() {
			const options: {
				label: string;
				sortFn: (r1: ExamsTableRow, r2: ExamsTableRow) => number;
			}[] = [
				{
					label: _("event_monitor.sort_options.alphabetical"),
					sortFn: (r1, r2) => {
						const lastName1 = r1.user.last_name;
						const lastName2 = r2.user.last_name;
						if (lastName1 > lastName2) {
							return 1;
						}
						if (lastName1 < lastName2) {
							return -1;
						}
						return 0;
					},
				},
				{
					label: _("event_monitor.sort_options.alphabetical_reverse"),
					sortFn: (r1, r2) => {
						const lastName1 = r1.user.last_name;
						const lastName2 = r2.user.last_name;
						if (lastName1 > lastName2) {
							return -1;
						}
						if (lastName1 < lastName2) {
							return 1;
						}
						return 0;
					},
				},
				{
					label: _("event_monitor.sort_options.average_increasing"),
					sortFn: (r1, r2) => {
						const average1 = r1.scoreAverage;
						const average2 = r2.scoreAverage;
						if (average1 > average2) {
							return 1;
						}
						if (average1 < average2) {
							return -1;
						}
						return 0;
					},
				},
				{
					label: _("event_monitor.sort_options.average_decreasing"),
					sortFn: (r1, r2) => {
						const average1 = r1.scoreAverage;
						const average2 = r2.scoreAverage;
						if (average1 > average2) {
							return -1;
						}
						if (average1 < average2) {
							return 1;
						}
						return 0;
					},
				},
			];
			return options;
		},
		rawTableData() {
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
				user: u, // this isn't used directly by the table, but it's useful for filtering & sorting
				id: u.id,
				email: u.email,
				fullName: u.full_name,
				student: u,
				mat: u.mat,
				course: u.course,
				...exams.reduce((acc, e) => {
					const participation = this.participations[e.id]?.find(p => p.user == u.id);
					const score = normalizeOptionalStringContainingNumber(participation?.score);
					acc["exam_" + e.id] = {
						id: participation?.id,
						examId: e.id,
						score,
					};
					return acc;
				}, {} as any),
				score_sum: getScoreSumFn(u),
				scoreAverage: roundToTwoDecimals(
					getScoreSumFn(u) /
						this.selectedExams.filter(
							// only consider exams the user has participated in
							e =>
								(this.participations[e.id] ?? []).findIndex(p => p.user == u.id) !== -1,
						).length,
				),
			}));
		},
		tableData() {
			return this.rawTableData
				.filter(
					row =>
						// if search text is provided, only show users that match it
						(!this.examsViewSearchText.trim() ||
							userMatchesSearch(this.examsViewSearchText, row.user)) &&
						// if filter is provided, only show users that match it
						this.examViewFilteringOptions
							.find(o => o.value === this.examsViewSelectedFilterOption)!
							// the filter function is stored in the `data` property of the filtering option
							.data(row),
				)
				.sort(this.examsViewSortingOptions[this.examsViewSelectedSortingOption].sortFn);
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
	},
});
</script>

<style></style>
