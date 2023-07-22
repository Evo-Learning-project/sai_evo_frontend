<template>
	<AbstractExercise :exercise="slot.exercise" :showSolution="showScores">
		<template #exerciseText>
			<div class="user-content">
				<v-runtime-template
					@selectionUpdate="onSelectionUpdate($event)"
					:template="textTemplate"
				/>
			</div>
		</template>
		<template #extras v-if="showScores">
			<div class="mt-4">
				<p class="ml-2 text-sm text-muted">
					{{ $t("misc.correct_answers") }}
				</p>
				<div class="w-full px-4 py-2 rounded bg-gray-50">
					<ul>
						<li
							v-for="choiceId in correctChoices"
							:key="'corr-' + choiceId"
							v-html="getChoice(choiceId).text"
						></li>
					</ul>
				</div>
			</div>
			<div v-if="(exercise.solution ?? '').trim().length > 0">
				<div class="w-full mt-4 whitespace-pre">
					<p class="ml-2 text-sm text-muted">
						{{ $t("misc.solution") }}
					</p>
					<ProcessedTextFragment
						style="white-space: break-spaces"
						class="w-full px-4 py-2 rounded bg-gray-50"
						:value="exercise.solution"
						:defaultValue="$t('misc.no_answer')"
					></ProcessedTextFragment>
				</div>
			</div>
		</template>
	</AbstractExercise>
</template>

<script lang="ts">
/* eslint-disable no-constant-condition */
import { CLOZE_PLACEHOLDER_REGEX } from "@/const";
import {
	EventParticipationSlot,
	EventParticipationSlotSubmission,
	Exercise,
	ExerciseChoice,
} from "@/models";
import { defineComponent, PropType } from "@vue/runtime-core";
import AbstractExercise from "./AbstractExercise.vue";
import VRuntimeTemplate from "vue3-runtime-template";
import { getTranslatedString } from "@/i18n";
import ProcessedTextFragment from "@/components/ui/ProcessedTextFragment.vue";
import { getCorrectChoices } from "./utils";

export default defineComponent({
	name: "ClozeExercise",
	emits: {
		updateSubmission(payload: {
			slot: EventParticipationSlot;
			payload: [keyof EventParticipationSlotSubmission, any];
		}) {
			return true;
		},
	},
	props: {
		slot: {
			type: Object as PropType<EventParticipationSlot>,
			required: true,
		},
		showScores: {
			type: Boolean,
			default: false,
		},
		readOnly: {
			type: Boolean,
			default: false,
		},
	},
	methods: {
		onSelectionUpdate(payload: { slotId: string; value: string }) {
			this.$emit("updateSubmission", {
				slot: this.slot.sub_slots.find(
					s => s.id == payload.slotId,
				) as EventParticipationSlot,
				payload: ["selected_choices", payload.value.length === 0 ? [] : [payload.value]],
			});
		},

		getChoice(choiceId: string) {
			return this.exercise.sub_exercises
				?.flatMap(s => s.choices ?? [])
				.find(c => c.id == choiceId);
		},
	},
	computed: {
		exercise(): Exercise {
			return this.slot?.exercise;
		},
		correctChoices(): string[] {
			return getCorrectChoices(this.exercise);
		},
		textTemplate(): string {
			// Returns a template to be compiled and embedded as the exercise
			// text. The template combines the exercise text with dropdown
			// inputs in correspondence of CLOZE_SEPARATOR sequences.
			const processedIds: string[] = []; // to prevent duplicates
			return this.slot?.exercise.text.replace(CLOZE_PLACEHOLDER_REGEX, (_, clozeId) => {
				const clozeSlot = this.slot.sub_slots
					.filter(s => !processedIds.includes(s.exercise.id))
					.find(s => s.exercise.id == clozeId);
				const ret = clozeSlot
					? `
            <select
                class="inline material-select"
                value="${clozeSlot.selected_choices[0] ?? ""}"
                ${
									clozeSlot.id
										? `@change="$emit('selectionUpdate', {
                    slotId: ${clozeSlot.id},
                    value: $event.target.value
                })"`
										: ""
								}
            >
                <option ${
									this.readOnly ? 'disabled="true"' : ""
								} value="">${getTranslatedString("misc.select_one")}</option>
                ${(clozeSlot.exercise.choices ?? []).map(
									c => `
                    <option
                        ${this.readOnly ? 'disabled="true"' : ""}
                        value="${c.id}"
                    >${c.text}</option>
                    `,
								)}
            </select>
            ` +
					  (this.showScores
							? `<span class="ml-2 text-base material-icons-outlined ${
									this.correctChoices.includes(clozeSlot.selected_choices[0] ?? "")
										? "text-success"
										: "text-danger-dark"
							  }"
            >
                ${
									this.correctChoices.includes(clozeSlot.selected_choices[0] ?? "")
										? "done"
										: "close"
								}
            </span>
        `
							: "")
					: `<span class="p-1 rounded-sm text-danger-dark bg-danger bg-opacity-20">${getTranslatedString(
							"cloze.invalid_cloze_id",
					  )}</span>`;

				if (clozeSlot) {
					processedIds.push(clozeSlot.exercise.id);
				}
				return ret;
			});
		},
	},
	components: { AbstractExercise, VRuntimeTemplate, ProcessedTextFragment },
});
</script>

<style></style>
