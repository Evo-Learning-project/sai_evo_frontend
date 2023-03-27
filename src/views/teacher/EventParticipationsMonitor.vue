<template>
	<div class="relative flex flex-col flex-grow">
		<!-- top row heading & stats chips -->
		<div class="flex items-center pb-4 pt-1.5 mb-2">
			<div class="overflow-hidden mr-4">
				<h4
					class="mb-0"
					style="
						line-height: 0.95;
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
					"
				>
					{{ event.name }}
				</h4>
			</div>
			<!-- stats chips -->
			<div class="flex items-center" v-if="!firstLoading">
				<div class="chip chip-primary mb-0">
					<div class="flex items-center mx-auto">
						<span class="mr-1 material-icons text-primary">people</span>
						<p class="text-primary">{{ participantCount }}</p>
						<p class="ml-1 text-sm text-muted text-primary">
							{{ $t("event_monitor.stats_participants") }}
						</p>
					</div>
				</div>

				<div class="chip chip-success mb-0">
					<div class="flex items-center mx-auto">
						<span class="mr-1 material-icons-outlined text-success"
							>assignment_turned_in</span
						>
						<p class="text-success">{{ turnedInCount }}</p>
						<p class="ml-1 text-sm text-muted text-success">
							{{ $t("event_monitor.stats_turned_in") }}
						</p>
					</div>
				</div>

				<div class="chip bg-light border-none mb-0">
					<div class="flex items-center mx-auto">
						<p>{{ averageProgress }}</p>
						<p>%</p>
						<p class="ml-1 text-sm text-center text-muted">
							{{ $t("event_monitor.stats_average_progress") }}
						</p>
					</div>
				</div>
			</div>
		</div>

		<!-- second row with controls -->
		<div class="flex items-center mb-1">
			<div class="flex items-center space-x-2 w-1/3 mr-auto">
				<TextInput
					:searchBar="true"
					v-model="searchText"
					:leftIcon="'search'"
					class="w-full"
					:placeholder="$t('event_monitor.search_students')"
				/>
				<!-- TODO implement sorting -->
				<DropdownMenu
					:expanded="sortingOptionsExpanded"
					@toggleExpanded="sortingOptionsExpanded = !sortingOptionsExpanded"
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
						<div v-for="(option, index) in sortingOptions" :key="index">
							<Btn
								:outline="true"
								class="px-8 pt-2 pb-2 w-full"
								:variant="'transparent'"
								@click="setSortingOption(index)"
							>
								<span
									class="material-icons mr-2 text-primary"
									v-if="index === selectedSortingOption"
									>done</span
								>
								<div class="flex items-center align-top">{{ option.label }}</div>
							</Btn>
						</div>
					</div>
				</DropdownMenu>
			</div>

			<!-- buttons to publish results and download participations -->
			<div v-if="!firstLoading && resultsMode" class="flex mr-2">
				<!-- TODO if the button is wrapped in a tooltip,
					it'll be clickable even if disabled, and won't inherit no-elevate class -->
				<Btn
					class="no-elevate mr-2"
					@click="onPublishResults"
					:disabled="selectedParticipationsIds.length == 0"
					:tooltip="
						selectedParticipationsIds.length == 0
							? $t('event_monitor.select_students_to_publish_results')
							: ''
					"
				>
					<!-- <span class="mr-1 text-base material-icons-outlined"> done </span> -->
					{{ $t("event_results.publish_results") }}</Btn
				>
				<!-- insights button -->

				<router-link class="z-50" :to="{ name: 'ExamStats' }">
					<Btn
						:outline="true"
						:tooltip="$t('help_texts.stats')"
						:variant="'icon'"
						class="transition-transform duration-200 transform icon-btn-primary"
					>
						<span
							id="insights-btn"
							class="transition-opacity duration-75 rounded-full material-icons-outlined"
							>insights</span
						>
					</Btn>
				</router-link>
				<CsvParticipationDownloader class="ml-auto" />
			</div>

			<!-- buttons to close/open participations-->
			<div v-else-if="!firstLoading" class="flex mr-2 items-center">
				<p class="text-muted mr-1">{{ $t("event_monitor.if_selected") }}:</p>
				<div v-for="[name, action] in Object.entries(bulkActions)" :key="name">
					<Btn
						@click="action.method()"
						class="no-elevate mx-1"
						:variant="'secondary'"
						:disabled="!selectedParticipations.some(p => action.applicable(p))"
						>{{ action.label }}</Btn
					>
				</div>
				<Btn
					:outline="true"
					:size="'sm'"
					:variant="'danger'"
					@click="onCloseExam"
					class="ml-4 mr-1"
				>
					<span class="mr-1 text-base material-icons-outlined"> block </span>
					{{ $t("event_preview.close") }}
				</Btn>
			</div>
		</div>

		<!-- alerts -->
		<!-- event restricted alert -->
		<div v-if="false">
			<div
				class="flex w-full transition-all duration-200"
				v-if="event.state === EventState.RESTRICTED"
				:class="{
					'opacity-0 max-h-0 mb-0': !showRestrictedModeBanner,
					'opacity-100 max-h-96 mb-3': showRestrictedModeBanner,
				}"
			>
				<div class="w-full mb-4 banner banner-danger">
					<span class="text-yellow-900 material-icons-outlined"> error_outline </span>
					<p>
						{{ $t("event_monitor.some_exams_still_open") }}
					</p>
					<Btn
						:outline="true"
						:size="'xs'"
						:variant="'icon'"
						@click="showRestrictedModeBanner = false"
					>
						<span
							class="material-icons-outlined"
							style="font-size: 17px !important; margin-right: 0 !important"
							>close</span
						></Btn
					>
				</div>
			</div>
			<div v-if="!firstLoading && resultsMode">
				<!-- pending assessments alert -->
				<div
					v-if="!areAllParticipationsFullyAssessed(mainStore.eventParticipations)"
					class="flex transition-all duration-200 banner banner-danger"
					:class="{
						'opacity-0 max-h-0 mb-0 py-0': !showThereArePendingAssessmentsBanner,
						'opacity-100 max-h-96 mb-3': showThereArePendingAssessmentsBanner,
					}"
				>
					<span class="ml-px text-yellow-900 material-icons-outlined">
						pending_actions
					</span>
					<p class="">
						{{ $t("event_assessment.some_exams_require_manual_assessment") }}

						{{ $t("event_assessment.exams_awaiting_assessment_are_marked") }}
						<span class="text-base text-yellow-900 inline-icon material-icons-outlined"
							>pending_actions</span
						>.
					</p>
					<Btn
						:outline="true"
						:size="'xs'"
						:variant="'icon'"
						@click="showThereArePendingAssessmentsBanner = false"
					>
						<span
							class="material-icons-outlined"
							style="font-size: 17px !important; margin-right: 3px !important"
							>close</span
						></Btn
					>
				</div>
				<!-- you can publish results alert -->
				<div
					v-else-if="thereAreUnpublishedAssessments"
					class="flex transition-all duration-200 banner banner-light"
					:class="{
						'opacity-0 max-h-0 mb-0 py-0': !showThereAreUnpublishedResultsBanner,
						'opacity-100 max-h-96 mb-3': showThereAreUnpublishedResultsBanner,
					}"
				>
					<span class="ml-px material-icons-outlined text-success"> task </span>
					<p>
						{{ $t("event_assessment.ready_to_publish_1") }}
						<span>{{ $t("event_results.publish_results") }}</span
						>. {{ $t("event_assessment.ready_to_publish_2") }}
					</p>
					<Btn
						:outline="true"
						:size="'xs'"
						:variant="'icon'"
						style="margin-left: auto !important"
						@click="showThereAreUnpublishedResultsBanner = false"
					>
						<span
							class="material-icons-outlined"
							style="font-size: 17px !important; margin-right: 0 !important"
							>close</span
						></Btn
					>
				</div>
				<!-- all assessments published alert -->
				<div
					v-else
					class="flex transition-all duration-200 banner banner-success"
					:class="{
						'opacity-0 max-h-0 mb-0 py-0': !showAllAssessmentsPublishedBanner,
						'opacity-100 max-h-96 mb-3': showAllAssessmentsPublishedBanner,
					}"
				>
					<span class="text-xl material-icons-outlined"> done </span>
					<p class="">
						{{ $t("event_assessment.all_published") }}
					</p>
					<Btn
						:outline="true"
						:size="'xs'"
						:variant="'icon'"
						style="margin-left: auto !important"
						@click="showAllAssessmentsPublishedBanner = false"
					>
						<span
							class="material-icons-outlined"
							style="font-size: 17px !important; margin-right: 0 !important"
							>close</span
						></Btn
					>
				</div>
			</div>
		</div>

		<!-- stats cards -->
		<!--
		<div v-if="!firstLoading && !resultsMode" class="mb-2">
			<div class="flex">
				<div class="flex w-1/3 mr-4 card shadow-elevation">
					<div class="flex items-center mx-auto">
						<span class="mr-1 material-icons icon-light">people</span>
						<p>{{ participantCount }}</p>
						<p class="ml-2 text-sm text-muted">
							{{ $t("event_monitor.stats_participants") }}
						</p>
					</div>
				</div>
				<div class="flex items-center w-1/3 mr-4 card shadow-elevation">
					<div class="flex items-center mx-auto">
						<span class="mr-1 material-icons-two-tone two-tone-success"
							>assignment_turned_in</span
						>
						<p>{{ turnedInCount }}</p>
						<p class="ml-2 text-sm text-muted">
							{{ $t("event_monitor.stats_turned_in") }}
						</p>
					</div>
				</div>
				<div class="flex items-center w-1/3 card shadow-elevation">
					<div class="flex items-center mx-auto">
						<p>{{ averageProgress }}</p>
						<p>%</p>
						<p class="ml-2 text-sm text-center text-muted">
							{{ $t("event_monitor.stats_average_progress") }}
						</p>
					</div>
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
		</div>
		-->

		<!----------------------->
		<!-- table -->
		<div class="flex-grow">
			<DataTable
				:class="{
					'opacity-50': filteredParticipationsData.length === 0 || firstLoading,
				}"
				:columnDefs="participationPreviewColumns"
				:rowData="firstLoading ? [] : filteredParticipationsData"
				:isRowSelectable="isRowSelectable"
				:rowClassRules="getRowClassRules()"
				:getRowId="getRowId"
				@cellClicked="onCellClicked"
				@gridReady="
					gridApi = $event.api;
					columnApi = $event.columnApi;
					columnApi.autoSizeAllColumns(false);
				"
				@selectionChanged="onSelectionChanged"
			></DataTable>
		</div>

		<Dialog
			v-if="blockingDialogData"
			:showDialog="showBlockingDialog"
			@no="resolveBlockingDialog(false)"
			@yes="resolveBlockingDialog(true)"
			:noText="blockingDialogData.noText"
			:yesText="dispatchingCall ? $t('misc.wait') : blockingDialogData.yesText"
			:dismissible="true"
			:disableOk="blockingDialogData.disableOk || dispatchingCall"
		>
			<template v-if="blockingDialogData.title" v-slot:title>
				{{ blockingDialogData.title }}
			</template>
			<template v-slot:body>
				{{ blockingDialogData.text }}
			</template>
			<template v-slot:footerButtons>
				<IntegrationSwitch
					v-if="showClassroomIntegrationSwitch"
					class="ml-7.5 mb-1"
					v-model="publishToClassroom"
				/>
			</template>
		</Dialog>

		<Dialog
			:warning="!resultsMode && !editingSlot"
			:fullWidth="!!editingSlot"
			:showDialog="showAssessmentEditorDialog"
			@no="showAssessmentEditorDialog = false"
			@yes="dispatchAssessmentUpdate()"
			:noText="dialogData.noText"
			:yesText="
				dispatchingCall ? $t('misc.wait') : $t('event_assessment.confirm_assessment')
			"
			:dismissible="false"
			:footerBorder="true"
			:disableOk="
				dispatchingCall ||
				(editingSlotDirty &&
					(editingSlotDirty.score == null || editingSlotDirty.score.length == 0))
			"
		>
			<template v-if="editingSlot" v-slot:title>
				{{ $t("event_assessment.assess") }}
				{{ $t("event_assessment.exercise") }}
				{{ (editingSlot?.slot_number ?? 0) + 1 }}
				{{ $t("misc.for") }}
				{{ editingFullName }}
			</template>
			<template v-else-if="dialogData.title?.length > 0" v-slot:title>{{
				dialogData.title
			}}</template>
			<template v-slot:body>
				<!-- editing an assessment slot -->
				<div class="text-darkText" v-if="editingSlot">
					<!-- TODO investigate bug if adding :showSolutionAndScores="true" here -->
					<AbstractEventParticipationSlot
						:allowEditAssessment="true"
						:showAssessmentCard="true"
						:assessmentWriteOnly="true"
						:modelValue="editingSlotDirty"
						@openFull="
							$router.push({
								name: 'ExamParticipationFull',
								params: { participationId: editingParticipationId },
							})
						"
						@updateAssessment="onUpdateSlotAssessment($event)"
						v-if="!localLoading && editingSlotDirty"
					></AbstractEventParticipationSlot>
					<div v-else>
						<SkeletonCard :borderLess="true"></SkeletonCard>
						<SkeletonCard :borderLess="true"></SkeletonCard>
					</div>
				</div>
			</template>
		</Dialog>
		<Spinner
			style="z-index: 99999999"
			:variant="'dark'"
			:fast="true"
			:size="'xl'"
			class="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
			v-if="firstLoading"
		/>
		<v-tour
			name="examInsightsTour"
			:steps="examInsightsPageTourSteps"
			:options="tourOptions"
		/>
	</div>
</template>

<script lang="ts">
const VISITED_INSIGHTS_TOUR_KEY = "VISITED_INSIGHTS_TOUR_KEY";

/* eslint-disable @typescript-eslint/no-explicit-any */
import DataTable from "@/components/ui/DataTable.vue";
import { blockingDialogMixin, courseIdMixin, eventIdMixin, loadingMixin } from "@/mixins";
import {
	AssessmentVisibility,
	Event,
	EventParticipation,
	EventParticipationSlot,
	EventParticipationSlotAssessment,
	EventParticipationState,
	EventState,
	EventTemplateRule,
	ParticipationAssessmentProgress,
	User,
	userMatchesSearch,
} from "@/models";
import { defineComponent } from "@vue/runtime-core";

import { getTranslatedString as _ } from "@/i18n";
import { CellClickedEvent, ColDef, RowClassParams, RowNode } from "ag-grid-community";
import { icons as assessmentStateIcons } from "@/assets/assessmentStateIcons";
import { icons as participationStateIcons } from "@/assets/participationStateIcons";
import Dialog from "@/components/ui/Dialog.vue";
import AbstractEventParticipationSlot from "@/components/shared/AbstractEventParticipationSlot.vue";
import { DialogData } from "@/interfaces";
import Btn from "@/components/ui/Btn.vue";
import CsvParticipationDownloader from "@/components/teacher/CsvParticipationDownloader.vue";
import SkeletonCard from "@/components/ui/SkeletonCard.vue";
import {
	examInsightsPageTourSteps,
	getEventParticipationMonitorHeaders,
	tourOptions,
} from "@/const";

import Spinner from "@/components/ui/Spinner.vue";
import {
	areAllParticipationsFullyAssessed,
	getParticipationsAverageProgress,
} from "@/reports";

import EventParticipationSlotScoreRenderer from "@/components/datatable/EventParticipationSlotScoreRenderer.vue";
import EventParticipationSlotCompletionRenderer from "@/components/datatable/EventParticipationSlotCompletionRenderer.vue";
import EventParticipationEmailRenderer from "@/components/datatable/EventParticipationEmailRenderer.vue";
import EventParticipationStateRenderer from "@/components/datatable/EventParticipationStateRenderer.vue";
import EventParticipationAssessmentStateRenderer from "@/components/datatable/EventParticipationAssessmentStateRenderer.vue";
import EventParticipationScoreRenderer from "@/components/datatable/EventParticipationScoreRenderer.vue";
import { mapStores } from "pinia";
import { useMainStore } from "@/stores/mainStore";
import { useMetaStore } from "@/stores/metaStore";
import { setErrorNotification } from "@/utils";
import IntegrationSwitch from "@/integrations/classroom/components/IntegrationSwitch.vue";
import { GoogleClassroomCourseWorkTwin } from "@/integrations/classroom/interfaces";
import { useGoogleIntegrationsStore } from "@/integrations/stores/googleIntegrationsStore";
import TextInput from "@/components/ui/TextInput.vue";
import DropdownMenu from "@/components/ui/DropdownMenu.vue";

export default defineComponent({
	components: {
		DataTable,
		Dialog,
		AbstractEventParticipationSlot,
		Btn,
		CsvParticipationDownloader,
		SkeletonCard,
		Spinner,
		/** Cell renderers required by Ag-grid */
		// eslint-disable-next-line vue/no-unused-components
		EventParticipationSlotScoreRenderer,
		// eslint-disable-next-line vue/no-unused-components
		EventParticipationSlotCompletionRenderer,
		// eslint-disable-next-line vue/no-unused-components
		EventParticipationEmailRenderer,
		// eslint-disable-next-line vue/no-unused-components
		EventParticipationStateRenderer,
		// eslint-disable-next-line vue/no-unused-components
		EventParticipationAssessmentStateRenderer,
		// eslint-disable-next-line vue/no-unused-components
		EventParticipationScoreRenderer,
		IntegrationSwitch,
		TextInput,
		DropdownMenu,
	},
	name: "EventParticipationsMonitor",
	props: {
		refreshData: {
			type: Boolean,
			default: true,
		},
		allowEditParticipations: {
			type: Boolean,
			default: false,
		},
	},
	mixins: [courseIdMixin, eventIdMixin, loadingMixin, blockingDialogMixin],
	async created() {
		await this.withFirstLoading(async () => {
			await this.mainStore.getEventParticipations({
				courseId: this.courseId,
				eventId: this.eventId,
				mutate: true,
			});
			// TODO gridApi could be null (doesn't really happen in production) - what did this line solve?
			//this.gridApi.refreshCells({ force: true });
			await this.mainStore.getEvent({
				courseId: this.courseId,
				eventId: this.eventId,
				includeDetails: false,
			});
		});

		if (this.resultsMode) {
			await this.checkForCourseworkTwin();
		}

		if (this.resultsMode && !(VISITED_INSIGHTS_TOUR_KEY in localStorage)) {
			setTimeout(() => (this.$tours as any)["examInsightsTour"].start(), 200);
			localStorage.setItem(VISITED_INSIGHTS_TOUR_KEY, "true");
		}

		if (this.refreshData) {
			// TODO improve this to avoid repeated calls before the last one completes, and possibly adjusting for network speed
			this.setDataRefreshInterval(10000);
		}

		const runningSlotsCheckFn = () =>
			this.mainStore.eventParticipations
				.flatMap(p => p.slots)
				.some(s => s.execution_results && s.execution_results.state === "running");

		// if the exam is closed but there are participation slots with
		// code still running, periodically refetch data until all slots
		// are settled down
		if (this.resultsMode && runningSlotsCheckFn()) {
			this.setDataRefreshInterval(2000, () => {
				if (!runningSlotsCheckFn()) {
					clearInterval(this.refreshHandle as number);
					this.refreshHandle = null;
				}
			});
		}
		// setTimeout(() => this.columnApi.autoSizeAllColumns(false), 5000);
	},

	beforeRouteLeave() {
		if (this.refreshHandle != null) {
			clearInterval(this.refreshHandle);
		}
	},
	data() {
		return {
			refreshHandle: null as number | null,
			EventState,
			editingSlot: null as EventParticipationSlot | null,
			editingSlotDirty: null as EventParticipationSlot | null,
			editingFullName: "",
			editingParticipationId: "",
			gridApi: null as any,
			columnApi: null as any,
			selectedParticipationsIds: [] as string[],
			dispatchingCall: false,
			searchText: "",

			// dialog functions
			showAssessmentEditorDialog: false,

			// show banners
			showThereAreUnpublishedResultsBanner: true,
			showRestrictedModeBanner: true,
			showThereArePendingAssessmentsBanner: true,
			showAllAssessmentsPublishedBanner: true,

			//tour
			tourOptions,
			examInsightsPageTourSteps,

			EventParticipationState,
			participationStateIcons,

			googleClassroomCourseWorkTwin: null as null | GoogleClassroomCourseWorkTwin,
			publishToClassroom: true,
			sortingOptionsExpanded: false,

			selectedSortingOption: 0,
		};
	},
	methods: {
		areAllParticipationsFullyAssessed,
		async checkForCourseworkTwin() {
			this.googleClassroomCourseWorkTwin =
				await this.googleIntegrationStore.getGoogleClassroomCourseWorkTwin(this.eventId);
		},
		setDataRefreshInterval(interval: number, callback?: any) {
			this.refreshHandle = setInterval(async () => {
				await this.mainStore.getEventParticipations({
					courseId: this.courseId,
					eventId: this.eventId,
					mutate: true,
				});
				if (typeof callback === "function") {
					callback();
				}
			}, interval);
		},

		onUpdateSlotAssessment(event: {
			slot: EventParticipationSlot;
			payload: [keyof EventParticipationSlotAssessment, any];
		}) {
			if (this.editingSlotDirty) {
				this.editingSlotDirty[event.payload[0]] = event.payload[1];
			}
		},
		isRowSelectable(row: RowNode) {
			/**
			 * Used by ag grid to determine whether the row is selectable
			 */
			if (this.resultsMode) {
				return (
					row.data.state == ParticipationAssessmentProgress.FULLY_ASSESSED &&
					row.data.visibility != AssessmentVisibility.PUBLISHED
				);
			}
			return true;
		},
		getRowId(data: any) {
			return data.id;
		},
		getRowClassRules() {
			return {
				"bg-success-important hover:bg-success-important": (params: RowNode) =>
					this.resultsMode && params.data.visibility === AssessmentVisibility.PUBLISHED,
				"bg-danger-important hover:bg-danger-important": (params: RowNode) =>
					!this.resultsMode &&
					this.mainStore.getEventParticipationById(params.data.id)?.state ===
						EventParticipationState.CLOSED_BY_TEACHER,
			};
		},
		onSelectionChanged() {
			// copy the id's of the selected participations
			this.selectedParticipationsIds = this.gridApi
				?.getSelectedNodes()
				.map((n: any) => n.data.id);
		},
		deselectAllRows() {
			this.gridApi.deselectAll();
			this.selectedParticipationsIds = [];
		},
		async onCellClicked(event: CellClickedEvent) {
			if (event.colDef.field?.startsWith("slot") && this.resultsMode) {
				this.onOpenAssessmentEditorDialog(event.data.id, event.value);
			}
		},
		async onOpenAssessmentEditorDialog(
			participationId: string,
			slot: EventParticipationSlot,
		) {
			this.editingSlot = slot;
			this.editingParticipationId = participationId;
			this.showAssessmentEditorDialog = true;

			// fetch slot that is being edited to have the full details
			await this.withLocalLoading(
				async () =>
					await this.mainStore.getEventParticipationSlot({
						courseId: this.courseId,
						slotId: (this.editingSlot as EventParticipationSlot).id,
						participationId,
						eventId: this.eventId,
					}),
			);
			// deep copy slot to prevent affecting the original one while editing
			this.editingSlotDirty = JSON.parse(JSON.stringify(this.editingSlot));
			this.editingFullName = (
				this.mainStore.getEventParticipationById(participationId) as EventParticipation
			).user.full_name;
		},
		async dispatchAssessmentUpdate() {
			this.dispatchingCall = true;
			try {
				await this.mainStore.partialUpdateEventParticipationSlot({
					courseId: this.courseId,
					eventId: this.eventId,
					participationId: this.editingParticipationId,
					slotId: (this.editingSlot as EventParticipationSlot).id,
					changes: {
						score: this.editingSlotDirty?.score,
						comment: this.editingSlotDirty?.comment,
					},
					mutate: true,
				});
				await this.mainStore.getEventParticipation({
					courseId: this.courseId,
					eventId: this.eventId,
					participationId: this.editingParticipationId,
				});
				this.hideDialog();
				this.metaStore.showSuccessFeedback();
				this.gridApi.refreshCells({ force: true });
			} catch (e) {
				setErrorNotification(e);
			} finally {
				this.dispatchingCall = false;
			}
		},
		async onCloseExam() {
			const dialogData: DialogData = {
				title: _("course_events.close_exam_for_everyone_title"),
				text:
					_("course_events.close_exam_for_everyone_body_1_alt") +
					" " +
					this.event.name +
					" " +
					_("course_events.close_exam_for_everyone_body_2") +
					"?",
				yesText: _("course_events.close_for_everyone"),
				noText: _("dialog.default_cancel_text"),
			};
			this.blockingDialogData = dialogData;

			const choice = await this.getBlockingBinaryDialogChoice();

			if (!choice) {
				this.showBlockingDialog = false;
				return;
			}

			await this.withLoading(
				async () =>
					await this.mainStore.partialUpdateEvent({
						courseId: this.courseId,
						eventId: this.event.id,
						mutate: true,
						changes: {
							state: EventState.CLOSED,
							users_allowed_past_closure: [],
						},
					}),
				setErrorNotification,
				() => this.metaStore.showSuccessFeedback(),
			);
			this.showBlockingDialog = false;
		},
		async onCloseSelectedExams() {
			const applicableParticipationsIds = this.selectedParticipations
				.filter(p => this.bulkActions.close.applicable(p))
				.map(p => p.id);

			const dialogData: DialogData = {
				title: _("event_monitor.close_for_selected"),
				yesText:
					_("misc.close") +
					" " +
					applicableParticipationsIds.length +
					" " +
					_("misc.exam", applicableParticipationsIds.length),
				noText: _("dialog.default_cancel_text"),
				text:
					_("event_monitor.close_for_selected_text_1") +
					" " +
					applicableParticipationsIds.length +
					" " +
					_("misc.participant", applicableParticipationsIds.length) +
					".",
			};

			this.blockingDialogData = dialogData;
			const choice = await this.getBlockingBinaryDialogChoice();

			if (!choice) {
				this.showBlockingDialog = false;
				return;
			}

			await this.dispatchParticipationsUpdate(applicableParticipationsIds, {
				state: EventParticipationState.CLOSED_BY_TEACHER,
			});

			// TODO extract
			if (this.resultsMode && !(VISITED_INSIGHTS_TOUR_KEY in localStorage)) {
				setTimeout(() => (this.$tours as any)["examInsightsTour"].start(), 1000);
				localStorage.setItem(VISITED_INSIGHTS_TOUR_KEY, "true");
			}
		},
		async onOpenSelectedExams() {
			const applicableParticipationsIds = this.selectedParticipations
				.filter(p => this.bulkActions.reOpen.applicable(p))
				.map(p => p.id);

			const dialogData: DialogData = {
				title: _("event_monitor.open_for_selected"),
				yesText:
					_("misc.reopen") +
					" " +
					applicableParticipationsIds.length +
					" " +
					_("misc.exam", applicableParticipationsIds.length),
				noText: _("dialog.default_cancel_text"),
				onYes: this.openExams,
				text:
					_("event_monitor.open_for_selected_text") +
					" " +
					applicableParticipationsIds.length +
					" " +
					_("misc.participant", applicableParticipationsIds.length) +
					".",
			};

			this.blockingDialogData = dialogData;
			const choice = await this.getBlockingBinaryDialogChoice();

			if (!choice) {
				this.showBlockingDialog = false;
				return;
			}

			await this.dispatchParticipationsUpdate(applicableParticipationsIds, {
				state: EventParticipationState.IN_PROGRESS,
			});
		},
		async dispatchParticipationsUpdate(
			participationIds: string[],
			changes: Partial<EventParticipation>,
			fireIntegrationEvent?: boolean,
		) {
			/**
			 * Generic method to update multiple participations
			 * at once and show feedback/error
			 */
			this.dispatchingCall = true;

			try {
				await this.mainStore.bulkPartialUpdateEventParticipation({
					courseId: this.courseId,
					eventId: this.eventId,
					participationIds,
					changes,
					fireIntegrationEvent,
				});
				this.showBlockingDialog = false;
				this.metaStore.showSuccessFeedback();
				this.deselectAllRows();
				this.gridApi.refreshCells({ force: true });
			} catch (e) {
				setErrorNotification(e);
			} finally {
				this.dispatchingCall = false;
			}
		},
		async onPublishResults() {
			const dialogData: DialogData = {
				//onYes: this.publishResults,
				yesText: _("event_results.publish"),
				noText: _("dialog.default_cancel_text"),
				text: _("event_results.publish_confirm_text"),
			};

			this.blockingDialogData = dialogData;
			const choice = await this.getBlockingBinaryDialogChoice();

			if (!choice) {
				this.showBlockingDialog = false;
				return;
			}

			// TODO handle blocking dialog
			await this.dispatchParticipationsUpdate(
				// TODO if you select all you might mistakenly publish results for unassessed participations
				this.selectedParticipationsIds,
				{
					visibility: AssessmentVisibility.PUBLISHED,
				},
				this.publishToClassroom,
			);
		},
		async onUndoParticipationTurnIn() {
			const applicableParticipationsIds = this.selectedParticipations
				.filter(p => this.bulkActions.undoTurnIn.applicable(p))
				.map(p => p.id);
			const dialogData: DialogData = {
				title: "",
				text:
					_("event_monitor.un_turn_in_text", applicableParticipationsIds.length) +
					(this.event.exercises_shown_at_a_time === 1
						? " " +
						  _(
								"event_monitor.student_will_be_brought_back_to_first_slot",
								applicableParticipationsIds.length,
						  )
						: ""),
				warning: false,
				noText: _("dialog.default_no_text"),
				yesText: _("dialog.default_yes_text"),
			};

			this.blockingDialogData = dialogData;
			const choice = await this.getBlockingBinaryDialogChoice();

			if (!choice) {
				this.showBlockingDialog = false;
				return;
			}

			await this.dispatchParticipationsUpdate(applicableParticipationsIds, {
				state: EventParticipationState.IN_PROGRESS,
				current_slot_cursor: 0,
			});
		},

		setSortingOption(index: number) {
			this.selectedSortingOption = index;
			this.sortingOptionsExpanded = false;
		},

		hideDialog() {
			this.editingSlot = null;
			this.editingSlotDirty = null;
			this.editingFullName = "";
			this.editingParticipationId = "";
			this.selectedParticipationsIds = [];
			this.showAssessmentEditorDialog = false;
		},
	},
	computed: {
		...mapStores(useMainStore, useMetaStore, useGoogleIntegrationsStore),
		selectedParticipations() {
			return this.mainStore.eventParticipations.filter(p =>
				this.selectedParticipationsIds.includes(p.id),
			);
		},
		sortingOptions() {
			const options: {
				label: string;
				sortFn: (p1: EventParticipation, p2: EventParticipation) => number;
			}[] = [
				{
					label: _("event_monitor.sort_options.alphabetical"),
					sortFn: (p1, p2) => {
						const lastName1 = p1.user.last_name;
						const lastName2 = p2.user.last_name;
						console.log({ lastName1, lastName2 });
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
					sortFn: (p1, p2) => {
						const lastName1 = p1.user.last_name;
						const lastName2 = p2.user.last_name;
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
					label: _("event_monitor.sort_options.begin_timestamp"),
					sortFn: (p1, p2) => {
						const begin1 = p1.begin_timestamp;
						const begin2 = p2.begin_timestamp;
						return new Date(begin1).getTime() - new Date(begin2).getTime();
					},
				},
				{
					label: _("event_monitor.sort_options.begin_timestamp_reverse"),
					sortFn: (p1, p2) => {
						const begin1 = p1.begin_timestamp;
						const begin2 = p2.begin_timestamp;
						return new Date(begin2).getTime() - new Date(begin1).getTime();
					},
				},
				// { label: _("event_monitor.sort_options.progress") },
				// { label: _("event_monitor.sort_options.progress_inverse") },
			];
			return options;
		},
		bulkActions() {
			const actions = {
				undoTurnIn: {
					applicable: (p: EventParticipation) =>
						p.state === EventParticipationState.TURNED_IN,
					method: this.onUndoParticipationTurnIn,
					label: _("event_monitor.undo_turn_in"),
				},
				close: {
					applicable: (p: EventParticipation) =>
						p.state === EventParticipationState.IN_PROGRESS,
					method: this.onCloseSelectedExams,
					label: _("event_monitor.close_for_selected"),
				},
				reOpen: {
					applicable: (p: EventParticipation) =>
						p.state === EventParticipationState.CLOSED_BY_TEACHER,
					method: this.onOpenSelectedExams,
					label: _("event_monitor.reopen_for_selected"),
				},
			};

			return actions;
		},
		showClassroomIntegrationSwitch() {
			// TODO refactor
			return (
				this.googleClassroomCourseWorkTwin !== null &&
				(this.blockingDialogData?.text ?? "") === _("event_results.publish_confirm_text")
			);
		},
		dialogData(): DialogData {
			let ret = {} as DialogData;
			const defaultData = {
				onNo: this.hideDialog,
				noText: _("dialog.default_cancel_text"),
			} as DialogData;

			// TODO handle this
			if (this.dispatchingCall) {
				ret.disableOk = true;
				ret.yesText = _("misc.wait");
			}

			return { ...defaultData, ...ret };
		},
		event() {
			return this.mainStore.getEventById(this.eventId);
		},
		resultsMode() {
			return this.event.state === EventState.CLOSED;
		},
		participantCount() {
			return this.mainStore.eventParticipations.length;
		},
		turnedInCount() {
			return this.mainStore.eventParticipations.filter(
				(p: EventParticipation) => p.state === EventParticipationState.TURNED_IN,
			).length;
		},
		averageProgress() {
			return getParticipationsAverageProgress(
				this.mainStore.eventParticipations,
				this.event,
			);
		},
		thereAreUnpublishedAssessments() {
			return this.mainStore.eventParticipations.some(
				p => p.visibility != AssessmentVisibility.PUBLISHED,
			);
		},
		participationPreviewColumns() {
			return getEventParticipationMonitorHeaders(
				this.resultsMode,
				this.mainStore.eventParticipations,
			);
		},
		filteredParticipationsData() {
			const data = this.participationsData as any as EventParticipation[]; // TODO refactor
			return data
				.filter(d => userMatchesSearch(this.searchText, d.user as User))
				.sort(this.sortingOptions[this.selectedSortingOption].sortFn);
		},
		participationsData() {
			return this.mainStore.eventParticipations.map((p: EventParticipation) => {
				const ret = {
					id: p.id,
					email: p.user?.email,
					mat: p.user?.mat,
					currentSlotCursor: p.current_slot_cursor,
					course: p.user?.course,
					fullName: p.user?.full_name,
					state: this.resultsMode ? p.assessment_progress : p.state,
					visibility: p.visibility,
					score: p.score ?? "",
					user: p.user,
					begin_timestamp: p.begin_timestamp,
				} as Record<string, unknown>;
				p.slots.forEach(
					s => (ret["slot-" + ((s.slot_number as number) + 1)] = s), //s.score ?? '-')
				);
				return ret;
			});
		},
	},
});
</script>
