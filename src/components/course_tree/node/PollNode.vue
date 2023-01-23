<template>
	<div
		:class="{ 'bg-light': node.state === PollNodeState.DRAFT }"
		class="
			group
			card card-border card-hoverable
			hover-shadow-elevation hover:border-transparent
			relative
		"
	>
		<span
			v-if="isDraggable"
			class="
				opacity-0
				group-hover:opacity-50
				transition-opacity
				duration-100
				ease
				absolute
				top-1/2
				transform
				-translate-y-1/2
				left-0
				text-lg
				cursor-move
				drag-handle
				material-icons-outlined
			"
		>
			drag_indicator
		</span>
		<!-- header -->
		<div class="flex md:flex-row flex-col items-start">
			<!-- main -->
			<div class="flex flex-col w-full">
				<div class="flex">
					<!-- icon -->
					<div
						class="flex rounded-full mr-3"
						:class="{
							'bg-gray-200': node.state === PollNodeState.DRAFT,
							'bg-primary  bg-opacity-15': node.state === PollNodeState.OPEN,
						}"
						style="
							min-width: 2.5rem;
							max-width: 2.5rem;
							min-height: 2.5rem;
							max-height: 2.5rem;
						"
					>
						<span
							style="font-size: 28px !important"
							:class="{
								'text-gray-500': node.state === PollNodeState.DRAFT,
								'text-primary': node.state === PollNodeState.OPEN,
							}"
							class="m-auto material-icons-outlined"
							>poll</span
						>
					</div>
					<!-- poll title & creator, timestamp-->
					<div>
						<router-link
							:to="{
								name: 'CourseTreeNodeDetailDispatcher',
								params: { nodeId: node.id },
							}"
						>
							<h2
								style="line-height: 0.95"
								class="mb-2 hover:text-primary hover:underline"
							>
								{{ $t("course_tree.poll_title") }}
							</h2>
						</router-link>
						<div class="flex space-x-2 ml-0.5 -mt-2">
							<p v-if="node.creator" class="text-sm">
								{{ node.creator.full_name }}
							</p>
							<Timestamp
								:date-only="true"
								class="text-sm text-muted"
								:value="node.created"
							/>
						</div>
					</div>
				</div>

				<div class="flex md:flex-row flex-col md:ml-12 md:pl-1 ml-1">
					<!-- container for both the poll text & its choices-->
					<div>
						<!-- poll text -->
						<div class="mt-2 flex">
							<ProcessedTextFragment
								class="w-full overflow-x-hidden overflow-ellipsis text-muted"
								:value="node.text"
							/>
						</div>
						<!-- choices -->
						<div class="mt-4 hidden-in-dragging-element" v-if="node.choices.length > 0">
							<div class="">
								<!-- poll closed warning -->
								<div
									class="italic flex items-center space-x-1 text-muted text-sm mb-1"
									v-if="node.state === PollNodeState.CLOSED"
								>
									<span
										class="-ml-0.5 material-icons-outlined"
										style="font-size: 16px !important"
										>block</span
									>
									<p>{{ $t("course_tree.poll_closed") }}</p>
								</div>
								<!-- choice radios -->
								<RadioGroup
									class="-ml-2 flex"
									:options="pollChoicesAsOptions"
									:modelValue="draftSelectedChoiceId ?? selectedChoice?.id"
									@update:modelValue="draftSelectedChoiceId = $event"
									:disabled="!canVote"
								>
									<template v-slot:itemSide="{ option }">
										<!-- TODO show number of selections-->
										<div
											v-if="canVote && option.value == draftSelectedChoiceId"
											class="flex items-center space-x-2 ml-8"
										>
											<Btn
												:size="'xs'"
												:outline="true"
												@click="onVote(draftSelectedChoiceId)"
												>{{ $t("course_tree.save_poll_choice") }}</Btn
											>
											<p class="text-sm text-muted italic hidden md:block">
												{{ $t("course_tree.poll_choice_not_saved_yet") }}
											</p>
										</div>
									</template>
								</RadioGroup>
							</div>
						</div>
					</div>
					<!-- results -->
					<div
						v-if="showResults && node.state !== PollNodeState.DRAFT"
						class="flex flex-col items-center md:ml-auto space-y-2 overflow-hidden"
					>
						<!-- <h3>{{ $t("course_tree.poll_results") }}</h3> -->
						<Pie :chartData="pollVotesData" :chartOptions="chartOptions" :height="200">
						</Pie>
					</div>
				</div>
			</div>
			<!-- teacher actions-->
			<div
				class="
					group-hover:opacity-100
					transition-opacity
					duration-100
					ease
					opacity-50
					ml-auto
					flex
					items-center
				"
			>
				<p
					class="text-muted mr-4 hidden md:block"
					v-if="node.state === PollNodeState.DRAFT"
				>
					{{ $t("course_tree.draft") }}
				</p>
				<Btn
					v-if="canEdit"
					@click="onEdit"
					:variant="'icon'"
					:outline="true"
					class="icon-btn-primary"
					:tooltip="$t('misc.edit')"
				>
					<span class="text-xl material-icons"> edit </span>
				</Btn>
				<Btn
					class="mr-4"
					v-if="canEdit"
					@click="onDelete"
					:variant="'icon'"
					:outline="true"
					:tooltip="$t('misc.delete')"
				>
					<span class="text-xl material-icons"> delete </span>
				</Btn>
				<CopyToClipboard
					:icon-only="true"
					:tooltip="$t('exercise_solution.share')"
					:value="permalink"
				/>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import Btn from "@/components/ui/Btn.vue";
import CopyToClipboard from "@/components/ui/CopyToClipboard.vue";
import ProcessedTextFragment from "@/components/ui/ProcessedTextFragment.vue";
import RadioGroup from "@/components/ui/RadioGroup.vue";
import Timestamp from "@/components/ui/Timestamp.vue";
import { getTranslatedString as _ } from "@/i18n";
import { SelectableOption } from "@/interfaces";
import { courseIdMixin, loadingMixin, nodeMixin } from "@/mixins";
import { PollNode, PollNodeChoice, PollNodeState } from "@/models";
import { useMainStore } from "@/stores/mainStore";
import { getColorFromString, md5, setErrorNotification } from "@/utils";
import { defineComponent, PropType } from "@vue/runtime-core";
import { mapStores } from "pinia";
import { nodeEmits, nodeProps } from "../shared";

import { Pie } from "vue-chartjs";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { TChartData } from "vue-chartjs/dist/types";
import { DataFrequency, makeLabelText } from "@/reports";

ChartJS.register(ArcElement, Tooltip, Legend);

export default defineComponent({
	name: "PollNode",
	mixins: [loadingMixin, courseIdMixin, nodeMixin],
	props: {
		node: {
			type: Object as PropType<PollNode>,
			required: true,
		},
		...nodeProps,
	},
	data() {
		return {
			PollNodeState,
			draftSelectedChoiceId: null as null | string,
		};
	},
	emits: {
		// TODO periodically refetch to get updated vote counts; add a "refetchNode" event
		...nodeEmits,
	},
	methods: {
		onEdit() {
			this.$emit("editNode", this.node);
		},
		onDelete() {
			this.$emit("deleteNode", this.node);
		},
		async onVote(choiceId: string) {
			await this.withLoading(async () => {
				await this.mainStore.votePollNodeChoice({
					courseId: this.courseId,
					nodeId: this.node.id,
					choiceId,
					remove: false,
				});
			}, setErrorNotification);
		},
	},
	computed: {
		...mapStores(useMainStore),
		chartOptions() {
			return { responsive: false, maintainAspectRatio: false };
		},
		pollChoicesSelectionFrequency(): DataFrequency<PollNodeChoice>[] {
			return this.node.choices
				.map(c => ({ datum: c, frequency: c.votes ?? 0 }))
				.sort((a, b) => (String(a.datum.id) < String(b.datum.id) ? -1 : 1));
		},

		// TODO extract shared logic with detail version of this component
		pollVotesData(): TChartData<"pie", number[], unknown> {
			const colors = this.node.choices.reduce((acc, e) => {
				const text = md5(e.text);
				const color = getColorFromString(text);
				acc[e.text] = color + "B3";
				return acc;
			}, {} as Record<string, string>);
			return {
				labels: this.pollChoicesSelectionFrequency.map(
					r =>
						makeLabelText(r.datum.text).slice(0, 100) +
						(makeLabelText(r.datum.text).length <= 100 ? "" : "..."),
				),
				datasets: [
					{
						data: this.pollChoicesSelectionFrequency.map(r => r.frequency),
						backgroundColor: this.pollChoicesSelectionFrequency.map(
							r => colors[r.datum.text],
						),
					},
				],
			};
		},
		selectedChoice() {
			// ! assumess only one choice can be selected
			return this.node.choices.filter(c => c.selected)[0];
		},
		textPreview() {
			return this.node.text;
		},
		canVote() {
			return this.node.state === PollNodeState.OPEN && !this.selectedChoice;
		},
		showResults() {
			return !this.canVote;
		},
		pollChoicesAsOptions(): SelectableOption[] {
			return this.node.choices.map(o => ({
				content: o.text,
				value: o.id,
			}));
		},
	},
	// eslint-disable-next-line vue/no-unused-components
	components: {
		ProcessedTextFragment,
		Timestamp,
		Btn,
		CopyToClipboard,
		RadioGroup,
		Pie,
	},
});
</script>

<style></style>
