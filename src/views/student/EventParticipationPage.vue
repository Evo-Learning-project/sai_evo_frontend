<template>
	<div class="flex flex-col flex-grow h-full pb-4">
		<div
			v-if="showTimeUpBackdrop"
			style="z-index: 99999"
			class="fixed top-0 left-0 w-full h-full bg-opacity-50 bg-dark"
		>
			<div
				class="
					fixed
					z-50
					w-full
					px-6
					py-4
					text-center
					transform
					-translate-x-1/2 -translate-y-1/2
					rounded
					md:w-max
					top-1/2
					left-1/2
				"
			>
				<p
					style="font-size: 10rem"
					class="opacity-50 material-icons-outlined text-lightText"
				>
					timer_off
				</p>
				<h3
					class="pt-1 mx-auto rounded-t md:bg-transparent text-lightText md:px-2"
					style="text-shadow: 0.5px 0.5px 4px rgb(0 0 0 / 50%)"
				>
					{{ $t("event_participation_page.times_up") }}
				</h3>
				<p
					class="pb-1 rounded-b md:bg-transparent text-lightText md:mx-2 md:px-2"
					style="text-shadow: 0.5px 0.5px 4px rgb(0 0 0 / 50%)"
				>
					{{ $t("event_participation_page.all_answers_saved") }}
				</p>
			</div>
		</div>
		<teleport v-if="mounted" to="#main-student-header-right">
			<div class="flex items-start mt-1 space-x-10">
				<CloudSaveStatus :saving="saving" :hadError="savingError"></CloudSaveStatus>
				<Countdown
					v-show="currentEventParticipation.time_limit_timestamp !== null && runTimer"
					@timeUp="onTimeUp()"
					:endTimestamp="currentEventParticipation.time_limit_timestamp"
					:isInitialized="runTimer"
				/>
			</div>
		</teleport>

		<div class="mt-3" v-if="firstLoading">
			<SlotSkeleton class="mb-24"></SlotSkeleton>
			<SlotSkeleton class="mb-24"></SlotSkeleton>
			<SlotSkeleton class="mb-24"></SlotSkeleton>
			<SlotSkeleton></SlotSkeleton>
		</div>
		<div
			v-else
			:class="{
				'flex-grow': oneExerciseAtATime,
				'mb-10 pb-10':
					index !== currentEventParticipation.slots.length - 1 && !oneExerciseAtATime,
				'pb-0 border-b-0': index === currentEventParticipation.slots.length - 1,
			}"
			class=""
			v-for="(slot, index) in currentEventParticipation.slots"
			:key="'p-' + currentEventParticipation.id + '-s-' + slot.id"
		>
			<div
				v-show="ads3Code || adsMobileCode"
				v-if="
					currentEventParticipation.event.event_type ===
						EventType.SELF_SERVICE_PRACTICE && index === 1
				"
				class="relative w-full bg-light py-2 mb-8 -mt-10 px-2"
			>
				<p
					class="
						select-none
						uppercase
						text-muted text-xs
						mt-2
						mr-2
						absolute
						top-0
						right-0
					"
				>
					{{ $t("misc.ads") }}
				</p>
				<div v-show="ads3Code" class="hidden md:block" v-html="ads3Code"></div>
				<div v-show="adsMobileCode" class="md:hidden" v-html="adsMobileCode"></div>
			</div>
			<AbstractEventParticipationSlot
				:modelValue="slot"
				@updateSelectedChoices="onChange($event.slot, 'selected_choices', $event.payload)"
				@updateSubmission="onUpdateSubmission($event.slot, $event.payload)"
				@runCode="onRunCode($event)"
				@blur="onBlur($event)"
				:allowEditSubmission="true"
				:saving="saving"
				:showTags="
					currentEventParticipation.event.event_type === EventType.SELF_SERVICE_PRACTICE
				"
			>
				<h4 class="mb-0">
					{{ $t("event_participation_page.exercise") }}
					{{ slot.slot_number + 1 }}
					<span v-if="oneExerciseAtATime"
						>{{ $t("event_participation_page.of") }}
						{{ currentEventParticipation.last_slot_number + 1 }}
					</span>
				</h4>
			</AbstractEventParticipationSlot>
			<!---@updateAttachment="onChange(slot, 'attachment', $event)"-->
		</div>
		<div class="flex items-center w-full mt-8">
			<Btn
				class=""
				@click="onGoBack"
				v-if="goingBackAllowed"
				:disabled="
					!canGoBack ||
					goingBack ||
					goingForward ||
					metaStore.loading ||
					schedulingCodeRun
				"
			>
				<span class="material-icons-outlined mt-0.5 mr-0.5 text-base">
					chevron_left
				</span>
				{{
					goingBack ? $t("misc.wait") : $t("event_participation_page.previous_exercise")
				}}
			</Btn>
			<Btn
				class="ml-auto"
				@click="goingBackAllowed ? onGoForward() : confirmGoForward()"
				v-if="canGoForward"
				:disabled="goingForward || goingBack || metaStore.loading || schedulingCodeRun"
				>{{
					goingForward ? $t("misc.wait") : $t("event_participation_page.next_exercise")
				}}
				<span class="material-icons-outlined mt-0.5 ml-0.5 text-base">
					chevron_right
				</span>
			</Btn>
			<Btn
				class="ml-auto"
				@click="confirmTurnIn"
				v-else-if="canTurnIn"
				:variant="'success'"
				:disabled="metaStore.loading || goingBack || turningIn"
			>
				<span class="material-icons-outlined mt-0.5 text-base mr-1"> check </span
				>{{ turningIn ? $t("misc.wait") : $t("event_participation_page.turn_in") }}
			</Btn>
		</div>
		<Dialog
			:showDialog="showConfirmDialog"
			:yesText="dialogData.yesText"
			:noText="$t('dialog.default_cancel_text')"
			@yes="dialogData.onYes"
			@no="showConfirmDialog = false"
		>
			<template v-slot:title>
				{{ dialogData.title }}
			</template>
			<template v-slot:body>
				{{ dialogData.text }}
			</template>
		</Dialog>
	</div>
</template>

<script lang="ts">
const EXECUTION_RESULTS_POLLING_INTERVAL = 1000;
import AbstractEventParticipationSlot from "@/components/shared/AbstractEventParticipationSlot.vue";
import Btn from "@/components/ui/Btn.vue";
import CloudSaveStatus from "@/components/ui/CloudSaveStatus.vue";
import Dialog from "@/components/ui/Dialog.vue";
import {
	adComponentMixin,
	courseIdMixin,
	eventIdMixin,
	loadingMixin,
	savingMixin,
} from "@/mixins";
import {
	EventParticipation,
	EventParticipationSlot,
	EventParticipationSlotSubmission,
	EventParticipationState,
	EventType,
	ExerciseType,
	getBlankEventParticipation,
	programmingExerciseTypes,
} from "@/models";
import { defineComponent } from "@vue/runtime-core";
import { getTranslatedString as _ } from "@/i18n";
import { DialogData } from "@/interfaces";

import { AutoSaveManager } from "@/autoSave";
import {
	EVENT_PARTICIPATION_SLOT_DEBOUNCED_FIELDS,
	EVENT_PARTICIPATION_SLOT_DEBOUNCE_TIME_MS,
} from "@/const";
import {
	getEventParticipationSlotExecutionResults,
	partialUpdateEventParticipationSlot,
} from "@/api";
import SlotSkeleton from "@/components/ui/skeletons/SlotSkeleton.vue";
import Countdown from "@/components/ui/Countdown.vue";
import { getParticipationRemainingTime, setErrorNotification } from "@/utils";
import { mapStores } from "pinia";
import { useMainStore } from "@/stores/mainStore";
import { useMetaStore } from "@/stores/metaStore";

export default defineComponent({
	components: {
		AbstractEventParticipationSlot,
		CloudSaveStatus,
		Btn,
		Dialog,
		SlotSkeleton,
		Countdown,
	},
	name: "EventParticipationPage",
	mixins: [courseIdMixin, eventIdMixin, savingMixin, loadingMixin, adComponentMixin],
	watch: {
		"currentEventParticipation.slots"(newVal: EventParticipationSlot[]) {
			// TODO be more sophisticated to track new slots, old slots leaving etc.
			newVal.forEach(s => this.instantiateSlotAutoSaveManager(s));
		},
	},
	beforeUnmount() {
		Object.values(this.executionResultsPollingHandles)
			.filter(h => typeof h === "number")
			.forEach(h => clearInterval(h as number));
	},
	async created() {
		await this.withFirstLoading(
			async () =>
				await this.mainStore.participateInEvent({
					courseId: this.courseId,
					eventId: this.eventId,
				}),
		);

		// already turned in, redirect to submission review page
		if (this.currentEventParticipation.state === EventParticipationState.TURNED_IN) {
			this.$router.push({
				name:
					this.currentEventParticipation.event.event_type ===
					EventType.SELF_SERVICE_PRACTICE
						? "PracticeSummaryPage"
						: "SubmissionReviewPage",
				params: {
					participationId: this.currentEventParticipation.id,
				},
			});
			return;
		}

		// set up timer, if there is a time limit
		if (typeof this.currentEventParticipation.time_limit_timestamp === "number") {
			this.runTimer = true;
		}

		// poll for any slots whose execution results is running (for example,
		// if the user refreshed the page while a programming exercise was running)
		this.currentEventParticipation.slots
			.filter(s => s.execution_results && s.execution_results.state === "running")
			.forEach(s => this.pollForExecutionResults(s.id));
	},
	mounted() {
		this.mounted = true; // prevent issues with teleported component
	},
	data() {
		return {
			slotAutoSaveManagers: {} as Record<string, AutoSaveManager<EventParticipationSlot>>,
			lastSlotChanged: null as EventParticipationSlot | null,
			saving: false,
			savingError: false,
			mounted: false,
			showConfirmDialog: false,
			schedulingCodeRun: false,
			dialogData: {
				title: "",
				text: "",
				yesText: "",
				onYes: () => null,
			} as DialogData,
			EventType,
			showTimeUpBackdrop: false,
			remainingTime: null as number | null,
			runTimer: false,
			detectedTimerMisfire: false,
			goingForward: false,
			goingBack: false,
			turningIn: false,
			executionResultsPollingHandles: {} as Record<string, number | null>,
		};
	},
	methods: {
		async onUpdateSubmission(
			slot: EventParticipationSlot,
			change: [keyof EventParticipationSlotSubmission, any],
		) {
			if (change[0] !== "attachment") {
				await this.onChange(slot, change[0], change[1]);
			} else {
				// handle file uploads separately
				console.log("FILE BLOB", change[1]);
				await this.onUpdateAttachment(slot, change[1]);
			}
		},
		async onBlur(slot: EventParticipationSlot) {
			try {
				await this.slotAutoSaveManagers[slot.id].flush();
			} catch (e) {
				setErrorNotification(e);
			}
		},
		async onRunCode(slot: EventParticipationSlot) {
			try {
				// flush queued changes before scheduling code run
				await this.slotAutoSaveManagers[slot.id].flush();

				// temporarily block forward/go buttons to prevent issues with setCurrentEventParticipationSlot
				this.schedulingCodeRun = true;
				// send request to run code
				await this.mainStore.runCurrentEventParticipationSlotCode({
					courseId: this.courseId,
					slot,
				});
				// poll until execution is complete
				this.pollForExecutionResults(slot.id);
			} catch (e) {
				setErrorNotification(e);
			} finally {
				this.schedulingCodeRun = false;
			}
		},
		pollForExecutionResults(slotId: string) {
			const handle = this.executionResultsPollingHandles[slotId];
			if (typeof handle === "number") {
				clearInterval(handle);
			}
			this.executionResultsPollingHandles[slotId] = setInterval(async () => {
				const executionResults = await getEventParticipationSlotExecutionResults(
					this.courseId,
					this.eventId,
					this.currentEventParticipation.id,
					slotId,
				);
				if (executionResults.state !== "running") {
					try {
						// slot might not exist anymore if user has gone forward/back or has turned in
						this.mainStore.patchCurrentEventParticipationSlot({
							slotId,
							changes: { execution_results: executionResults },
						});
					} catch (e) {
						console.warn("caught patchCurrentEventParticipationSlot", e);
					} finally {
						clearInterval(this.executionResultsPollingHandles[slotId] as number);
						this.executionResultsPollingHandles[slotId] = null;
					}
				}
			}, EXECUTION_RESULTS_POLLING_INTERVAL);
		},
		async onGoForward() {
			this.showConfirmDialog = false;

			// assumption: going forward is only allowed when showing one slot at a time
			const currentSlot = this.currentEventParticipation.slots[0];
			this.goingForward = true;
			await this.withLoading(
				async () => {
					// flush queued changes before moving on to next slot
					await this.slotAutoSaveManagers[currentSlot.id].flush();
					await this.mainStore.moveEventParticipationCurrentSlotCursorForward({
						courseId: this.courseId,
					});
				},
				e => setErrorNotification(e),
			);
			this.goingForward = false;
		},
		async onGoBack() {
			// assumption: going back is only allowed when showing one slot at a time
			const currentSlot = this.currentEventParticipation.slots[0];
			this.goingBack = true;
			await this.withLoading(
				async () => {
					// flush queued changes before moving on to next slot
					await this.slotAutoSaveManagers[currentSlot.id].flush();
					await this.mainStore.moveEventParticipationCurrentSlotCursorBack({
						courseId: this.courseId,
					});
				},
				e => setErrorNotification(e),
			);
			this.goingBack = false;
		},
		async onTimeUp() {
			const remainingTime = getParticipationRemainingTime(
				this.currentEventParticipation,
				this.currentEventParticipation.event,
			);
			if (typeof remainingTime === "number" && remainingTime > 0) {
				// sanity check that the timer isn't mis-firing
				this.runTimer = false;
				this.remainingTime = remainingTime;
				this.$nextTick(() => (this.runTimer = true));
				if (!this.detectedTimerMisfire) {
					this.detectedTimerMisfire = true;
					throw new Error(
						"onTimeUp called with remaining time = " +
							remainingTime +
							", participation " +
							this.currentEventParticipation.id,
					);
				}
				return;
			}
			this.showTimeUpBackdrop = true;
			setTimeout(async () => await this.onTurnIn(), 500);
		},
		async onTurnIn() {
			this.showConfirmDialog = false;
			this.turningIn = true;
			await this.withLoading(async () => {
				// stop timer
				this.runTimer = false;
				// flush any pending slots to make sure the most recent content is saved
				for (const s of Object.values(this.slotAutoSaveManagers)) {
					if (
						programmingExerciseTypes.includes(
							s.instance.exercise.exercise_type as ExerciseType,
						)
					) {
						// for programming exercises, also run code to ensure the most up-to-date results
						// TODO investigate https://sentry.io/organizations/samuele/issues/3612164391/?project=6265941&query=is%3Aunresolved
						await this.onRunCode(s.instance);
					} else {
						await s.flush();
					}
				}
				try {
					await this.mainStore.partialUpdateCurrentEventParticipation({
						courseId: this.courseId,
						changes: {
							state: EventParticipationState.TURNED_IN,
						},
					});
					this.$router.push({
						name:
							this.currentEventParticipation.event.event_type ===
							EventType.SELF_SERVICE_PRACTICE
								? "PracticeSummaryPage"
								: "SubmissionReviewPage",
						params: {
							participationId: this.currentEventParticipation.id,
							showSubmissionConfirmationMessage: 1, // should be `true`, but TS complains about type
						},
					});
					this.metaStore.showSuccessFeedback();
				} catch (e) {
					setErrorNotification(e);
				}
			});
			this.turningIn = false;
		},
		confirmGoForward() {
			this.dialogData = {
				title: _("event_participation_page.next_dialog_title"),
				text: _("event_participation_page.next_dialog_text"),
				yesText: _("event_participation_page.next_dialog_confirm_button"),
				onYes: this.onGoForward,
			};
			this.showConfirmDialog = true;
		},
		confirmTurnIn() {
			this.dialogData = {
				title: _("event_participation_page.turn_in_dialog_title"),
				text: _("event_participation_page.turn_in_dialog_text"),
				yesText: _("event_participation_page.turn_in_confirm_button"),
				onYes: this.onTurnIn,
			};
			this.showConfirmDialog = true;
		},
		async onUpdateAttachment(slot: EventParticipationSlot, attachment: Blob) {
			// TODO refactor and use the generic onChange
			let formData = new FormData();
			formData.append("attachment", attachment);

			await partialUpdateEventParticipationSlot(
				this.courseId,
				this.eventId,
				this.currentEventParticipation.id,
				slot.id,
				formData as any,
				true,
			);
			//await this.onChange(slot, "attachment", formData);
		},
		async onChange<K extends keyof EventParticipationSlot>(
			slot: EventParticipationSlot,
			field: K,
			value: EventParticipationSlot[K],
		) {
			// !! [this might cause the bug with missing slot]
			// if a new slot has been changed, flush any pending slots
			if (this.lastSlotChanged != null && this.lastSlotChanged.id != slot.id) {
				for (const s of Object.values(this.slotAutoSaveManagers)) {
					await s.flush();
				}
			}
			this.lastSlotChanged = slot;
			await this.slotAutoSaveManagers[slot.id].onChange({ [field]: value });
		},
		instantiateSlotAutoSaveManager(slot: EventParticipationSlot) {
			this.slotAutoSaveManagers[slot.id] = new AutoSaveManager<EventParticipationSlot>(
				slot,
				async changes => {
					try {
						await this.mainStore.partialUpdateCurrentEventParticipationSlot({
							courseId: this.courseId,
							slotId: slot.id,
							changes,
							mutate: true,
							forceStudent: true,
						});
					} catch (e) {
						// investigate https://sentry.io/organizations/samuele/issues/3683654671/?project=6265941
						console.error(
							"partialUpdateCurrentEventParticipationSlot failed when called with args",
							slot.id,
							JSON.stringify(changes),
						);
						throw e;
					}
				},
				(changes, reverting) => {
					if (!reverting) {
						// TODO find a way not to block multiple choice questions while open answer exercises are saving
						this.saving = true;
						this.savingError = false;
						this.metaStore.localLoading = true;
					}
					try {
						this.mainStore.setCurrentEventParticipationSlot({ ...slot, ...changes });
					} catch (e) {
						// investigating https://sentry.io/organizations/samuele/issues/3603878793
						console.error(
							"setCurrentEventParticipationSlot failed",
							"slot id was",
							slot.id,
							JSON.stringify(changes),
						);
						throw e;
					}
				},
				EVENT_PARTICIPATION_SLOT_DEBOUNCED_FIELDS,
				EVENT_PARTICIPATION_SLOT_DEBOUNCE_TIME_MS,
				undefined,
				() => (this.savingError = true),
				() => {
					this.metaStore.localLoading = false;
					this.saving = false;
				},
				true,
			);
			slot.sub_slots.forEach(s => this.instantiateSlotAutoSaveManager(s));
		},
	},
	computed: {
		...mapStores(useMainStore, useMetaStore),
		currentEventParticipation() {
			return this.mainStore.currentEventParticipation ?? getBlankEventParticipation();
		},
		oneExerciseAtATime(): boolean {
			// TODO this assumes the participation contains Event
			return (this.currentEventParticipation.event?.exercises_shown_at_a_time ?? 0) === 1;
		},
		canGoForward(): boolean {
			return (
				this.oneExerciseAtATime &&
				this.currentEventParticipation.slots.length > 0 &&
				!this.currentEventParticipation.slots[0]?.is_last
			);
		},
		canGoBack(): boolean {
			return (
				this.oneExerciseAtATime &&
				(this.currentEventParticipation.slots?.length ?? 0) > 0 &&
				!this.currentEventParticipation.slots[0].is_first
			);
		},
		canTurnIn(): boolean {
			return (
				!this.firstLoading &&
				(!this.oneExerciseAtATime ||
					(this.currentEventParticipation.slots.length > 0 &&
						(this.currentEventParticipation.slots[0]?.is_last ?? false))) &&
				this.currentEventParticipation.state !== EventParticipationState.TURNED_IN
			);
		},
		goingBackAllowed(): boolean {
			return (
				// TODO this assumes the participation contains Event
				this.oneExerciseAtATime && this.currentEventParticipation.event.allow_going_back
			);
		},
	},
});
</script>

<style></style>
