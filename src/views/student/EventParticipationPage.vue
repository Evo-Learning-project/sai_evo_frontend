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
					v-show="remainingTime !== null"
					@timeUp="onTimeUp()"
					:initialSeconds="remainingTime ?? 0"
					:isInitialized="runTimer"
				></Countdown>
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
				'mb-10 pb-10': index !== proxyModelValue.slots.length - 1 && !oneExerciseAtATime,
				'pb-0 border-b-0': index === proxyModelValue.slots.length - 1,
			}"
			class=""
			v-for="(slot, index) in proxyModelValue.slots"
			:key="'p-' + proxyModelValue.id + '-s-' + slot.id"
		>
			<div
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
				:running="running"
				:showTags="
					currentEventParticipation.event.event_type === EventType.SELF_SERVICE_PRACTICE
				"
			>
				<h4 class="mb-0">
					{{ $t("event_participation_page.exercise") }}
					{{ slot.slot_number + 1 }}
					<span v-if="oneExerciseAtATime"
						>{{ $t("event_participation_page.of") }}
						{{ proxyModelValue.last_slot_number + 1 }}
					</span>
				</h4> </AbstractEventParticipationSlot
			><!---@updateAttachment="onChange(slot, 'attachment', $event)"-->
		</div>
		<div class="flex items-center w-full mt-8">
			<Btn
				class=""
				@click="onGoBack"
				v-if="goingBackAllowed"
				:disabled="!canGoBack"
				:loading="loading"
			>
				<span class="material-icons-outlined mt-0.5 mr-0.5 text-base">
					chevron_left
				</span>
				{{ $t("event_participation_page.previous_exercise") }}</Btn
			>
			<Btn
				class="ml-auto"
				@click="goingBackAllowed ? onGoForward() : confirmGoForward()"
				v-if="canGoForward"
				:loading="loading"
				>{{ $t("event_participation_page.next_exercise") }}
				<span class="material-icons-outlined mt-0.5 ml-0.5 text-base">
					chevron_right
				</span></Btn
			>
			<Btn
				class="ml-auto"
				@click="confirmTurnIn"
				v-else-if="canTurnIn"
				:variant="'success'"
			>
				<span class="material-icons-outlined mt-0.5 text-base mr-1"> check </span
				>{{ $t("event_participation_page.turn_in") }}
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
} from "@/models";
import { defineComponent } from "@vue/runtime-core";
import { getTranslatedString as _ } from "@/i18n";
import { DialogData } from "@/interfaces";

import { createNamespacedHelpers, mapState } from "vuex";
import { AutoSaveManager } from "@/autoSave";
import {
	EVENT_PARTICIPATION_SLOT_DEBOUNCED_FIELDS,
	EVENT_PARTICIPATION_SLOT_DEBOUNCE_TIME_MS,
} from "@/const";
import { partialUpdateEventParticipationSlot } from "@/api/events";
import SlotSkeleton from "@/components/ui/skeletons/SlotSkeleton.vue";
import { subscribeToSubmissionSlotChanges } from "@/ws/modelSubscription";
import Countdown from "@/components/ui/Countdown.vue";
import { getParticipationRemainingTime } from "@/utils";
const { mapActions, mapMutations } = createNamespacedHelpers("student");

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
		"proxyModelValue.slots"(newVal: EventParticipationSlot[]) {
			// TODO might need to get more sophisticated to track new slots, old slots leaving etc.
			newVal.forEach(s => this.instantiateSlotAutoSaveManager(s));
		},
	},
	async created() {
		await this.withFirstLoading(
			async () =>
				await this.participateInEvent({
					courseId: this.courseId,
					eventId: this.eventId,
				}),
		);

		// set up timer, if there is a time limit
		const remainingTime = getParticipationRemainingTime(
			this.currentEventParticipation,
			this.currentEventParticipation.event,
		);
		if (remainingTime !== null) {
			this.remainingTime = remainingTime;
			this.runTimer = true;
		}

		// already turned in, redirect to submission review page
		if (this.proxyModelValue.state === EventParticipationState.TURNED_IN) {
			this.$router.push({
				name:
					this.proxyModelValue.event.event_type === EventType.SELF_SERVICE_PRACTICE
						? "PracticeSummaryPage"
						: "SubmissionReviewPage",
				params: {
					participationId: this.currentEventParticipation.id,
				},
			});
		}
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
			running: false,
			dialogData: {
				title: "",
				text: "",
				yesText: "",
				onYes: () => null,
			} as DialogData,
			ws: null as WebSocket | null,
			EventType,
			showTimeUpBackdrop: false,
			remainingTime: null as number | null,
			runTimer: false,
		};
	},
	methods: {
		...mapActions([
			"participateInEvent",
			"moveEventParticipationCurrentSlotCursorForward",
			"moveEventParticipationCurrentSlotCursorBack",
			"partialUpdateEventParticipationSlot",
			"partialUpdateEventParticipation",
			"runEventParticipationSlotCode",
		]),
		...mapMutations(["setCurrentEventParticipationSlot"]),
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
				this.setErrorNotification(e);
			}
		},
		async onRunCode(slot: EventParticipationSlot) {
			this.running = true;
			// flush queued changes before moving on to next slot
			try {
				await this.slotAutoSaveManagers[slot.id].flush();
				// subscribe to slot to get code execution results
				this.ws?.close();
				this.ws = await subscribeToSubmissionSlotChanges(slot.id);
				// send request to run code
				await this.runEventParticipationSlotCode({
					courseId: this.courseId,
					eventId: this.eventId,
					participationId: this.currentEventParticipation.id,
					slotId: slot.id,
				});
			} catch (e) {
				this.setErrorNotification(e);
			} finally {
				this.running = false;
			}
		},
		async onGoForward() {
			this.showConfirmDialog = false;

			// assumption: going forward is only allowed when showing one slot at a time
			const currentSlot = this.proxyModelValue.slots[0];
			await this.withLoading(
				async () => {
					// flush queued changes before moving on to next slot
					await this.slotAutoSaveManagers[currentSlot.id].flush();
					await this.moveEventParticipationCurrentSlotCursorForward({
						courseId: this.courseId,
					});
				},
				e => this.setErrorNotification(e),
			);
		},
		async onGoBack() {
			// assumption: going back is only allowed when showing one slot at a time
			const currentSlot = this.proxyModelValue.slots[0];
			await this.withLoading(
				async () => {
					// flush queued changes before moving on to next slot
					await this.slotAutoSaveManagers[currentSlot.id].flush();
					await this.moveEventParticipationCurrentSlotCursorBack({
						courseId: this.courseId,
					});
				},
				e => this.setErrorNotification(e),
			);
		},
		async onTimeUp() {
			this.showTimeUpBackdrop = true;
			setTimeout(async () => await this.onTurnIn(), 500);
		},
		async onTurnIn() {
			this.showConfirmDialog = false;
			await this.withLoading(async () => {
				// stop timer
				this.runTimer = false;
				// flush any pending slots to make sure the most recent content is saved
				//const s of this.proxyModelValue.slots
				for (const s of Object.values(this.slotAutoSaveManagers)) {
					if (s.instance.exercise.exercise_type !== ExerciseType.JS) {
						await s.flush();
					} else {
						await this.onRunCode(s.instance);
					}
				}
				try {
					await this.partialUpdateEventParticipation({
						courseId: this.courseId,
						changes: {
							state: EventParticipationState.TURNED_IN,
						},
					});
					this.$router.push({
						name:
							this.proxyModelValue.event.event_type === EventType.SELF_SERVICE_PRACTICE
								? "PracticeSummaryPage"
								: "SubmissionReviewPage",
						params: {
							participationId: this.currentEventParticipation.id,
							showSubmissionConfirmationMessage: 1, // should be `true`, but TS complains about type
						},
					});
					this.$store.commit("shared/showSuccessFeedback");
				} catch (e) {
					this.setErrorNotification(e);
				}
			});
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
				this.proxyModelValue.id,
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
			// if a new slot has been changed, flush any pending slots
			if (this.lastSlotChanged != null && this.lastSlotChanged.id != slot.id) {
				for (const s of Object.values(this.slotAutoSaveManagers)) {
					await s.flush();
				}
			}
			this.lastSlotChanged = slot;
			await this.slotAutoSaveManagers[slot.id].onChange({ field, value });
		},
		instantiateSlotAutoSaveManager(slot: EventParticipationSlot) {
			this.slotAutoSaveManagers[slot.id] = new AutoSaveManager<EventParticipationSlot>(
				slot,
				async changes =>
					await this.partialUpdateEventParticipationSlot({
						courseId: this.courseId,
						eventId: this.eventId,
						participationId: this.proxyModelValue.id,
						slotId: slot.id,
						changes,
					}),
				(changes, reverting) => {
					if (!reverting) {
						// TODO find a way not to block multiple choice questions while open answer exercises are saving
						this.saving = true;
						this.savingError = false;
						this.$store.state.shared.localLoading = true;
					}
					this.setCurrentEventParticipationSlot({ ...slot, ...changes });
				},
				EVENT_PARTICIPATION_SLOT_DEBOUNCED_FIELDS,
				EVENT_PARTICIPATION_SLOT_DEBOUNCE_TIME_MS,
				undefined,
				() => (this.savingError = true),
				() => {
					this.$store.state.shared.localLoading = false;
					this.saving = false;
				},
				true,
			);
			slot.sub_slots.forEach(s => this.instantiateSlotAutoSaveManager(s));
		},
	},
	computed: {
		...mapState("student", ["currentEventParticipation"]),
		...mapState("shared", ["loading"]),
		proxyModelValue: {
			get(): EventParticipation {
				return this.currentEventParticipation ?? {};
			},
			async set(val: EventParticipation) {
				// await this.onChange(val);
			},
		},
		oneExerciseAtATime(): boolean {
			return (this.proxyModelValue.event?.exercises_shown_at_a_time ?? 0) === 1;
		},
		canGoForward(): boolean {
			return (
				this.oneExerciseAtATime &&
				(this.proxyModelValue.slots?.length ?? 0) > 0 &&
				!this.proxyModelValue.slots[0].is_last
			);
		},
		canGoBack(): boolean {
			return (
				this.oneExerciseAtATime &&
				(this.proxyModelValue.slots?.length ?? 0) > 0 &&
				!this.proxyModelValue.slots[0].is_first
			);
		},
		canTurnIn(): boolean {
			return (
				!this.firstLoading &&
				(!this.oneExerciseAtATime ||
					((this.proxyModelValue.slots?.length ?? 0) > 0 &&
						(this.proxyModelValue.slots[0].is_last ?? false))) &&
				this.proxyModelValue.state !== EventParticipationState.TURNED_IN
			);
		},
		goingBackAllowed(): boolean {
			return (
				this.oneExerciseAtATime && (this.proxyModelValue.event?.allow_going_back ?? false)
			);
		},
	},
});
</script>

<style></style>
