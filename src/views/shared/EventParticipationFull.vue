<template>
	<div>
		<div
			v-if="$route.params.showSubmissionConfirmationMessage"
			class="banner banner-success"
		>
			<span class="material-icons-outlined"> check </span>
			<p class="">{{ $t("event_participation_page.turned_in_text") }}</p>
		</div>
		<div
			class="mb-4 items-center flex space-x-0.5 md:space-x-2"
			v-if="!firstLoading && mainStore.currentEventParticipation && allowEditAssessment"
		>
			<!-- <router-link :to="{ name: 'ExamProgress' }"
        ><Btn :outline="true" :variant="'icon'"
          ><span class="material-icons-outlined">arrow_back</span></Btn
        ></router-link
      > -->
			<Btn @click="onGoBack" :outline="true" :variant="'icon'" v-if="false"
				><span class="material-icons-outlined">arrow_back</span></Btn
			>
			<h3 class="mb-0.5 pl-2">
				{{
					mainStore.currentEventParticipation.event.event_type === EventType.EXAM
						? $t("event_assessment.viewing_participation_of")
						: $t("event_assessment.viewing_practice_of")
				}}
				{{ mainStore.currentEventParticipation.user.full_name }}
			</h3>
		</div>
		<div class="px-2 py-6" v-if="!firstLoading && mainStore.currentEventParticipation">
			<div class="flex flex-col mb-6 space-y-8">
				<!--md:flex-row md:space-y-0-->
				<div class="text-sm">
					<div class="flex space-x-1">
						<span class="my-auto text-sm material-icons-outlined"> timer </span>
						<p class="">{{ $t("event_participation_page.begin_timestamp") }}:</p>
						<Timestamp
							:value="mainStore.currentEventParticipation.begin_timestamp"
							class="text-muted"
						/>
					</div>
					<div
						class="flex space-x-1"
						v-if="mainStore.currentEventParticipation.end_timestamp"
					>
						<span class="my-auto text-sm material-icons-outlined">
							assignment_turned_in
						</span>

						<p class="">{{ $t("event_participation_page.turn_in_timestamp") }}:</p>
						<Timestamp
							class="text-muted"
							:value="mainStore.currentEventParticipation.end_timestamp"
						/>
					</div>
				</div>
				<div class="flex flex-col space-y-2">
					<div
						class="
							flex flex-col
							items-center
							mb-2
							space-y-2
							md:flex-row md:space-x-8 md:space-y-0
						"
						v-if="showAssessmentCard && !firstLoading"
					>
						<div class="card card-filled shadow-elevation md:w-5/12">
							<div class="flex items-center">
								<h4 class="">
									{{ $t("event_assessment.overall_score") }}:
									<strong>{{ mainStore.currentEventParticipation.score }}</strong>
								</h4>
								<Btn
									v-if="allowEditAssessment"
									:outline="true"
									:variant="'icon'"
									:disabled="showEditScore"
									class="ml-1"
									:tooltip="showEditScore ? '' : $t('help_texts.edit_overall_grade')"
									@click="onShowEditScore()"
									><span class="text-lg icon-light material-icons">edit</span></Btn
								>
								<Btn
									v-if="mainStore.currentEventParticipation.score_edited"
									:outline="true"
									class="ml-auto"
									:variant="'icon'"
									:disabled="showEditScore"
									:tooltip="$t('event_assessment.undo_score_edit_tooltip')"
									@click="onUndoScoreEdit()"
									><span class="text-lg text-gray-600 material-icons-outlined"
										>undo</span
									></Btn
								>
							</div>
							<div
								:class="{
									'max-h-0': !showEditScore,
									'max-h-96': showEditScore,
								}"
								class="
									flex flex-col
									max-w-md
									space-y-4
									overflow-y-hidden
									duration-200
									ease-in-out
									lg:max-w-lg
									transition-max-height
								"
							>
								<p class="my-4 text-muted">
									{{ $t("event_assessment.overall_score_instructions") }}
								</p>
								<TextInput v-model="dirtyScore">{{
									$t("event_assessment.overall_score")
								}}</TextInput>
								<div class="flex">
									<Btn
										class="ml-auto mr-2"
										:outline="false"
										:variant="'primary'"
										:loading="assessmentLoading"
										@click="onHideEditScore()"
									>
										{{ $t("event_assessment.confirm_assessment") }}
									</Btn>
									<Btn
										:outline="true"
										:disabled="assessmentLoading"
										:variant="'primary'"
										@click="onHideEditScore(true)"
									>
										{{ $t("dialog.default_cancel_text") }}
									</Btn>
								</div>
							</div>
						</div>
					</div>
					<div
						class="banner banner-light"
						v-if="
							allowEditAssessment && !mainStore.currentEventParticipation.score_edited
						"
					>
						<span class="material-icons-outlined icon-light">info</span>
						<p class="text-muted">
							{{ $t("event_assessment.default_score") }}
						</p>
					</div>
					<div
						class="banner banner-light"
						v-else-if="
							allowEditAssessment && mainStore.currentEventParticipation.score_edited
						"
					>
						<span class="material-icons-outlined icon-light">sync_disabled</span>
						<span class="text-muted">
							{{ $t("event_assessment.you_overrode_score") }}
						</span>
					</div>
					<div
						class="banner banner-danger"
						v-if="
							allowEditAssessment &&
							someSlotsPending &&
							!mainStore.currentEventParticipation.score_edited
						"
					>
						<span class="mr-1 text-base text-2xl text-yellow-900 material-icons-outlined"
							>pending_actions</span
						>
						<span class="text-muted text-danger-dark">
							{{ $t("event_assessment.some_slots_pending") }}
						</span>
					</div>
				</div>
			</div>

			<div
				:class="{
					'mt-0': index === 0,
					'mb-5': index === mainStore.currentEventParticipation.slots.length - 1,
					'mb-10': index !== mainStore.currentEventParticipation.slots.length - 1,
				}"
				class=""
				v-for="(slot, index) in mainStore.currentEventParticipation.slots"
				:key="'p-' + mainStore.currentEventParticipation.id + '-s-' + slot.id"
			>
				<AbstractEventParticipationSlot
					:modelValue="slot"
					@saveAssessment="onSlotSaveAssessment($event.slot, $event.changes)"
					:allowEditAssessment="allowEditAssessment"
					:showSolutionAndScores="showSolutionAndScores"
					:showAssessmentCard="showAssessmentCard"
					:assessmentControlsVisibility="slotsAssessmentControlsVisibility"
					@setAssessmentExpanded="
						slotsAssessmentControlsVisibility[$event.slot.id] = $event.payload
					"
					:assessmentLoading="slotsAssessmentLoading[slot.id] ?? false"
				>
					<h3 class="mb-1">
						{{ $t("event_participation_page.exercise") }}
						{{ slot.slot_number + 1 }}
					</h3>
				</AbstractEventParticipationSlot>
				<div
					v-if="
						showSolutionAndScores &&
						!allowEditAssessment &&
						!slotsLoadingSolution[slot.id]
					"
				>
					<ExerciseSolutionContainer
						:exercise="slot.exercise"
						:solutions="getSolutionsForExercise(slot.exercise)"
						class="mt-4"
						:showExerciseThreadLink="true"
						:allowShowMore="false"
						:initialEditorContent="slot.answer_text"
					/>
				</div>

				<SlotSkeleton class="mt-2" v-else-if="slotsLoadingSolution[slot.id]" />
			</div>
		</div>
		<div class="py-6" v-else>
			<SlotSkeleton />
			<SlotSkeleton />
			<SlotSkeleton />
			<SlotSkeleton />
		</div>
	</div>
</template>

<script lang="ts">
import { courseIdMixin, eventIdMixin, loadingMixin } from "@/mixins";
import { defineComponent } from "@vue/runtime-core";
import AbstractEventParticipationSlot from "@/components/shared/AbstractEventParticipationSlot.vue";

import {
	EventParticipation,
	EventParticipationSlot,
	EventParticipationSlotAssessment,
	EventParticipationState,
	EventState,
	EventType,
	Exercise,
} from "@/models";
import Timestamp from "@/components/ui/Timestamp.vue";
import SlotSkeleton from "@/components/ui/skeletons/SlotSkeleton.vue";
import Btn from "@/components/ui/Btn.vue";
import TextInput from "@/components/ui/TextInput.vue";
import { getTranslatedString } from "@/i18n";
import ExerciseSolutionContainer from "@/components/shared/ExerciseSolution/ExerciseSolutionContainer.vue";
import { mapStores } from "pinia";
import { useMainStore } from "@/stores/mainStore";
import { setErrorNotification } from "@/utils";

export default defineComponent({
	name: "EventParticipationFull",
	mixins: [eventIdMixin, courseIdMixin, loadingMixin],
	props: {
		showSolutionAndScores: {
			type: Boolean,
			default: true,
		},
		allowEditAssessment: {
			type: Boolean,
			default: false,
		},
		showAssessmentCard: {
			type: Boolean,
			default: false,
		},
	},
	components: {
		AbstractEventParticipationSlot,
		Timestamp,
		SlotSkeleton,
		Btn,
		TextInput,
		ExerciseSolutionContainer,
	},
	async created() {
		await this.withFirstLoading(async () => {
			await this.mainStore.getCurrentEventParticipation({
				courseId: this.courseId,
				eventId: this.eventId,
				participationId: this.participationId,
			});
		});

		// participation is still in progress and exam is
		// still open, redirect to participation page
		if (
			!this.allowEditAssessment && // not in teacher mode
			this.mainStore.currentEventParticipation?.state !==
				EventParticipationState.TURNED_IN &&
			// TODO assumes that currentEventParticipation contains Event
			this.mainStore.currentEventParticipation?.event.state === EventState.OPEN
		) {
			this.$router.push({
				name: "ExamParticipationPage",
				params: {
					examId: this.eventId,
				},
			});
		}

		if (this.showSolutionAndScores) {
			(this.mainStore.currentEventParticipation?.slots ?? []).forEach(async s => {
				this.slotsLoadingSolution[s.id] = true;
				try {
					await this.mainStore.getSolutionsByExercise({
						courseId: this.courseId,
						exerciseId: s.exercise.id,
						filter: null,
						fromFirstPage: true,
					});
				} catch (e) {
					setErrorNotification(e);
				} finally {
					this.slotsLoadingSolution[s.id] = false;
				}
			});
		}
	},
	data() {
		return {
			slotsLoadingSolution: {} as Record<string, boolean>,
			slotsAssessmentControlsVisibility: {} as Record<string, boolean>,
			slotsAssessmentLoading: {} as Record<string, boolean>,
			showEditScore: false,
			dirtyScore: undefined as string | null | undefined,
			EventType,
			assessmentLoading: false,
		};
	},
	methods: {
		onGoBack() {
			if (window.history.length > 1) {
				this.$router.back();
			} else {
				// default "back" location
				this.$router.push({
					name: "ExamProgress",
				});
			}
		},
		getSolutionsForExercise(exercise: Exercise) {
			return this.mainStore.getPaginatedSolutionsByExerciseId(exercise.id).data;
		},
		onShowEditScore() {
			this.dirtyScore = this.mainStore.currentEventParticipation?.score;
			this.showEditScore = true;
		},
		async onUndoScoreEdit() {
			if (confirm(getTranslatedString("event_assessment.undo_overall_score_edit"))) {
				this.dirtyScore = null;
				await this.onHideEditScore();
			}
		},
		async onHideEditScore(discard = false) {
			if (discard) {
				this.showEditScore = false;
				return;
			}
			this.assessmentLoading = true;
			await this.withLocalLoading(
				async () =>
					await this.mainStore.partialUpdateCurrentEventParticipation({
						courseId: this.courseId,
						changes: {
							score: this.dirtyScore,
						},
					}),
			);
			this.assessmentLoading = false;
			this.showEditScore = false;
		},
		async onSlotSaveAssessment(
			slot: EventParticipationSlot,
			changes: { score: number | null; comment: string },
		) {
			this.slotsAssessmentLoading[slot.id] = true;
			try {
				await this.mainStore.partialUpdateCurrentEventParticipationSlot({
					courseId: this.courseId,
					slotId: slot.id,
					changes,
					mutate: false,
					forceStudent: false, // update performed as a teacher
				});
				// re-fetch participation to register any updates (e.g. the score property)
				await this.mainStore.getCurrentEventParticipation({
					courseId: this.courseId,
					eventId: this.eventId,
					participationId: this.participationId,
				});
				this.slotsAssessmentControlsVisibility[slot.id] = false;
			} catch (e) {
				setErrorNotification(e);
			} finally {
				this.slotsAssessmentLoading[slot.id] = false;
			}
		},
	},
	computed: {
		...mapStores(useMainStore),
		participationId(): string {
			return this.$router.currentRoute.value.params.participationId as string;
		},
		someSlotsPending(): boolean {
			return (
				this.mainStore.currentEventParticipation?.slots.some(
					s => s.score === null || s.sub_slots.some(r => r.score === null),
				) ?? true
			);
		},
	},
});
</script>

<style></style>
