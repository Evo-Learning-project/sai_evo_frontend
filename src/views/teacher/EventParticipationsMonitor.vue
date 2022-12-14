<template>
	<div class="relative flex flex-col flex-grow">
		<!-- insights button -->
		<div v-if="!firstLoading && resultsMode" class="z-50 flex flex-col mb-2 -mt-8">
			<router-link class="ml-auto" :to="{ name: 'ExamStats' }">
				<Btn
					:outline="true"
					:tooltip="!showStats ? $t('help_texts.stats') : ''"
					:variant="'icon'"
					class="-mt-8 transition-transform duration-200 transform icon-btn-primary"
				>
					<span
						id="insights-btn"
						class="transition-opacity duration-75 rounded-full material-icons-outlined"
						>insights</span
					>
				</Btn>
			</router-link>
		</div>

		<!-- alerts -->
		<!-- event restricted alert -->
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

		<!-- stats cards -->
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

		<!-- table -->
		<div class="flex-grow">
			<DataTable
				:class="{
					'opacity-50': participationsData.length === 0 || firstLoading,
				}"
				:columnDefs="participationPreviewColumns"
				:rowData="firstLoading ? [] : participationsData"
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

		<!-- buttons to publish results and download participations -->
		<div v-if="!firstLoading && resultsMode" class="flex mt-4">
			<Btn
				:variant="'success'"
				@click="onPublishResults"
				:disabled="selectedParticipations.length == 0"
			>
				<span class="mr-1 text-base material-icons-outlined"> done </span>
				{{ $t("event_results.publish_results") }}</Btn
			>
			<CsvParticipationDownloader class="ml-auto" />
		</div>

		<!-- buttons to close/open participations-->
		<div v-else-if="!firstLoading" class="flex mt-2 space-x-2">
			<Btn
				v-if="false"
				class=""
				:outline="true"
				:variant="'danger'"
				@click="onCloseSelectedExams"
				:disabled="selectedCloseableParticipations.length === 0"
			>
				<span class="mr-1 text-base material-icons-outlined"> block </span>
				{{ $t("event_monitor.close_for_selected") }}</Btn
			>

			<Btn
				v-if="false"
				class=""
				v-show="event.state === EventState.RESTRICTED"
				:variant="'primary'"
				:outline="true"
				@click="onOpenSelectedExams"
				:disabled="selectedOpenableParticipations.length === 0"
			>
				<span class="mr-1 text-base material-icons-outlined"> undo </span>
				{{ $t("event_monitor.open_for_selected") }}</Btn
			>
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
		></v-tour>
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
import { mapStores } from "pinia";
import { useMainStore } from "@/stores/mainStore";
import { useMetaStore } from "@/stores/metaStore";

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

		if (this.resultsMode && !(VISITED_INSIGHTS_TOUR_KEY in localStorage)) {
			setTimeout(() => (this.$tours as any)["examInsightsTour"].start(), 200);
			localStorage.setItem(VISITED_INSIGHTS_TOUR_KEY, "true");
		}

		if (this.refreshData) {
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
			selectedParticipations: [] as string[],
			showStats: false,
			dispatchingCall: false,

			// dialog functions
			showAssessmentEditorDialog: false,
			publishingResultsMode: false,
			closingExamsMode: false,
			reOpeningTurnedInParticipationMode: false,
			reOpeningClosedExamsMode: false,

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
		};
	},
	methods: {
		areAllParticipationsFullyAssessed,
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
					this.event.state === EventState.RESTRICTED &&
					!this.event.users_allowed_past_closure?.includes(
						this.mainStore.getEventParticipationById(params.data.id)?.user?.id ?? "",
					),
			};
		},
		onSelectionChanged() {
			// copy the id's of the selected participations
			this.selectedParticipations = this.gridApi
				?.getSelectedNodes()
				.map((n: any) => n.data.id);
		},
		deselectAllRows() {
			this.gridApi.deselectAll();
			this.selectedParticipations = [];
		},
		async onCellClicked(event: CellClickedEvent) {
			// TODO refactor to have separate methods
			if (event.colDef.field?.startsWith("slot") && this.resultsMode) {
				this.onOpenAssessmentEditorDialog(event.data.id, event.value);
			}
			// change turned in status
			else if (
				event.colDef.field === "state" &&
				!this.resultsMode &&
				event.data.state == EventParticipationState.TURNED_IN
			) {
				const participation = this.mainStore.getEventParticipationById(event.data.id);
				await this.onUndoParticipationTurnIn(participation as EventParticipation);
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
				this.setErrorNotification(e);
			} finally {
				this.dispatchingCall = false;
			}
		},
		async onCloseSelectedExams() {
			// closing exams only for a group of participant means putting all of the
			// participants except those ones inside the `users_allowed_past_closure`
			// list of the exam and setting the exam state to RESTRICTED

			const dialogData: DialogData = {
				title: _("event_monitor.close_for_selected"),
				yesText:
					_("misc.close") +
					" " +
					this.selectedCloseableParticipations.length +
					" " +
					(this.selectedCloseableParticipations.length === 1
						? _("misc.exam")
						: _("misc.exams")),
				noText: _("dialog.default_cancel_text"),
				text:
					_("event_monitor.close_for_selected_text_1") +
					" " +
					this.selectedCloseableParticipations.length +
					" " +
					(this.selectedCloseableParticipations.length === 1
						? _("misc.participant")
						: _("misc.participants")) +
					".",
				//onYes: this.closeExams,
			};

			this.blockingDialogData = dialogData;
			const choice = await this.getBlockingBinaryDialogChoice();

			if (!choice) {
				this.showBlockingDialog = false;
				return;
			}

			// these are the ones the exam will stay open for
			const unselectedParticipations = this.mainStore.eventParticipations.filter(
				p => !this.selectedParticipations.includes(p.id),
			);
			const unselectedUserIds = unselectedParticipations.map(p => p.user.id);

			this.dispatchingCall = true;
			try {
				await this.mainStore.partialUpdateEvent({
					courseId: this.courseId,
					eventId: this.eventId,
					mutate: true, // update local object too
					changes: {
						state: EventState.RESTRICTED,
						users_allowed_past_closure: [
							// users that were already allowed and haven't been selected now
							...(this.event.users_allowed_past_closure ?? []).filter(
								i =>
									!this.selectedCloseableParticipations.map(p => p.user.id).includes(i),
							),
							// unselected id's that were already allowed (unless it's the
							// first time the exam gets restricted)
							...unselectedUserIds.filter(
								i =>
									this.event.state !== EventState.RESTRICTED ||
									this.event.users_allowed_past_closure?.includes(i),
							),
						],
					},
				});
				this.showBlockingDialog = false;
				this.metaStore.showSuccessFeedback();
				this.deselectAllRows();
				this.gridApi.refreshCells({ force: true });
			} catch (e) {
				this.setErrorNotification(e);
			} finally {
				this.dispatchingCall = false;
			}

			// TODO extract
			if (this.resultsMode && !(VISITED_INSIGHTS_TOUR_KEY in localStorage)) {
				setTimeout(() => (this.$tours as any)["examInsightsTour"].start(), 1000);
				localStorage.setItem(VISITED_INSIGHTS_TOUR_KEY, "true");
			}
		},
		async onOpenSelectedExams() {
			// re-opening exam for a group of participants means adding those
			// participants to the `users_allowed_past_closure` list for the exam
			const dialogData: DialogData = {
				title: _("event_monitor.open_for_selected"),
				yesText:
					_("misc.reopen") +
					" " +
					this.selectedOpenableParticipations.length +
					" " +
					(this.selectedOpenableParticipations.length === 1
						? _("misc.exam")
						: _("misc.exams")),
				noText: _("dialog.default_cancel_text"),
				onYes: this.openExams,
				text:
					_("event_monitor.open_for_selected_text") +
					" " +
					this.selectedOpenableParticipations.length +
					" " +
					(this.selectedOpenableParticipations.length === 1
						? _("misc.participant")
						: _("misc.participants")) +
					".",
			};

			this.blockingDialogData = dialogData;
			const choice = await this.getBlockingBinaryDialogChoice();

			if (!choice) {
				this.showBlockingDialog = false;
				return;
			}

			// these are the ones the exam will stay open for
			const selectedParticipations = this.mainStore.eventParticipations.filter(p =>
				this.selectedParticipations.includes(p.id),
			);
			const selectedUserIds = selectedParticipations.map(p => p.user.id);

			this.dispatchingCall = true;

			try {
				await this.mainStore.partialUpdateEvent({
					courseId: this.courseId,
					eventId: this.eventId,
					mutate: true, // update local object
					changes: {
						users_allowed_past_closure: [
							// those that were already allowed
							...(this.event.users_allowed_past_closure ?? []),
							...selectedUserIds, // those added now
						],
					},
				});
				this.showBlockingDialog = false;

				this.metaStore.showSuccessFeedback();
				this.deselectAllRows();
				this.gridApi.refreshCells({ force: true });
			} catch (e) {
				this.setErrorNotification(e);
			} finally {
				this.dispatchingCall = false;
			}
		},
		async dispatchParticipationsUpdate(
			participationIds: string[],
			changes: Partial<EventParticipation>,
		) {
			// generic method to update multiple participations at once and show feedback/error
			this.dispatchingCall = true;

			try {
				await this.mainStore.bulkPartialUpdateEventParticipation({
					courseId: this.courseId,
					eventId: this.eventId,
					participationIds,
					changes,
				});
				this.showBlockingDialog = false;
				this.metaStore.showSuccessFeedback();
				this.deselectAllRows();
				this.gridApi.refreshCells({ force: true });
			} catch (e) {
				this.setErrorNotification(e);
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
			await this.dispatchParticipationsUpdate(this.selectedParticipations, {
				visibility: AssessmentVisibility.PUBLISHED,
			});
		},
		async onUndoParticipationTurnIn(participation: EventParticipation) {
			const dialogData: DialogData = {
				title: "",
				text: _("event_monitor.un_turn_in_text") + participation.user?.full_name + "?",
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

			await this.dispatchParticipationsUpdate([participation.id], {
				state: EventParticipationState.IN_PROGRESS,
			});
		},

		hideDialog() {
			this.editingSlot = null;
			this.editingSlotDirty = null;
			this.editingFullName = "";
			this.editingParticipationId = "";
			this.showDialog = false;
			this.selectedParticipations = [];
		},
	},
	computed: {
		...mapStores(useMainStore, useMetaStore),
		showDialog: {
			get() {
				return (
					this.showAssessmentEditorDialog ||
					this.publishingResultsMode ||
					this.closingExamsMode ||
					this.reOpeningTurnedInParticipationMode ||
					this.reOpeningClosedExamsMode
				);
			},
			set(val: boolean) {
				if (!val) {
					this.showAssessmentEditorDialog = false;
					this.publishingResultsMode = false;
					this.closingExamsMode = false;
					this.reOpeningTurnedInParticipationMode = false;
					this.reOpeningClosedExamsMode = false;
				}
			},
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
				} as Record<string, unknown>;
				p.slots.forEach(
					s => (ret["slot-" + ((s.slot_number as number) + 1)] = s), //s.score ?? '-')
				);
				return ret;
			});
		},
		selectedCloseableParticipations(): EventParticipation[] {
			return this.mainStore.eventParticipations.filter(
				p =>
					this.selectedParticipations.includes(p.id) && // participation is selected
					(this.event.state === EventState.OPEN || // event is open for everyone or...
						//... event is still open for this participant
						this.event.users_allowed_past_closure?.includes(p.user.id)),
			);
		},
		selectedOpenableParticipations(): EventParticipation[] {
			return this.mainStore.eventParticipations.filter(
				p =>
					this.selectedParticipations.includes(p.id) && // participation is selected
					// event is restricted and participant isn't in the list of those still allowed
					this.event.state === EventState.RESTRICTED &&
					!this.event.users_allowed_past_closure?.includes(p.user.id),
			);
		},
	},
});
</script>
