<template>
	<div v-if="firstLoading" class="mt-6">
		<SlotSkeleton />
		<SlotSkeleton class="mb-4 mt-2" />
		<SlotSkeleton />
	</div>
	<div v-else class="mt-2">
		<!-- back button-->
		<div class="mb-4">
			<router-link :to="{ name: 'CourseTreeDispatcher', params: { courseId } }">
				<Btn :size="'xs'" :variant="'primary-borderless'">
					<span class="material-icons-outlined">chevron_left</span>
					{{ $t("course_tree.back_to_tree") }}
				</Btn>
			</router-link>
		</div>
		<!-- header -->
		<div class="flex md:items-center items-start">
			<!-- icon-->
			<div
				style="min-width: 3.5rem; max-width: 3.5rem"
				class="flex rounded-full w-14 h-14 bg-primary bg-opacity-15 mr-3"
			>
				<span
					style="font-size: 40px !important"
					class="m-auto material-icons-outlined text-primary"
					>campaign</span
				>
			</div>
			<div class="flex md:flex-row flex-col md:space-x-2 md:mt-0 mt-1 w-full">
				<!-- responsive title, timestamp, & author -->
				<div class="flex flex-col">
					<h1 style="line-height: 1.1" class="mb-0 hidden md:block">
						{{ $t("course_tree.poll_title") }}
					</h1>
					<h3 style="line-height: 1.1" class="mb-0 md:hidden">
						{{ $t("course_tree.poll_title") }}
					</h3>
					<div class="flex space-x-2 ml-0.5">
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
				<!-- teacher actions-->
				<div class="ml-auto flex items-center">
					<Btn
						v-if="canEdit"
						@click="onEdit"
						:variant="'icon'"
						:outline="true"
						class="
							icon-btn-primary
							hover:opacity-100
							transition-opacity
							duration-100
							ease
							opacity-50
						"
						:tooltip="$t('misc.edit')"
					>
						<span class="text-xl material-icons"> edit </span>
					</Btn>
					<CopyToClipboard
						class="hover:opacity-100 transition-opacity duration-100 ease opacity-50"
						:icon-only="true"
						:tooltip="$t('exercise_solution.share')"
						:value="permalink"
					/>
				</div>
			</div>
		</div>

		<!-- body -->
		<div class="mx-2 md:mx-4">
			<div class="mt-8">
				<ProcessedTextFragment :value="node.text" />
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
								<p class="text-sm text-muted italic">
									{{ $t("course_tree.poll_choice_not_saved_yet") }}
								</p>
							</div>
						</template>
					</RadioGroup>

					<!-- results -->
					<div v-if="showResults" class="flex flex-col items-center ml-auto space-y-2">
						<!-- <h3>{{ $t("course_tree.poll_results") }}</h3> -->
						<Pie :chartData="pollVotesData" :chartOptions="chartOptions" :height="280">
						</Pie>
					</div>
				</div>
			</div>

			<!-- children -->
			<!-- <div class="mt-12">
				<div v-if="loadingChildren">
					<SlotSkeleton />
					<SlotSkeleton />
				</div>
				<div class="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
					<div class="" v-for="child in children" :key="child.id">
						<CourseTreeNode
							v-bind="$props"
							:node="child"
							@deleteNode="$emit('deleteNode', $event)"
						/>
					</div>
				</div>
			</div> -->

			<!-- comments -->
			<!-- <CourseTreeNodeCommentSection
				:loadingComments="loadingComments"
				class="mt-8"
				:nodeId="node.id"
			/> -->
		</div>
	</div>
</template>

<script lang="ts">
import Btn from "@/components/ui/Btn.vue";
import CopyToClipboard from "@/components/ui/CopyToClipboard.vue";
import ProcessedTextFragment from "@/components/ui/ProcessedTextFragment.vue";
import RadioGroup from "@/components/ui/RadioGroup.vue";
import SlotSkeleton from "@/components/ui/skeletons/SlotSkeleton.vue";
import Timestamp from "@/components/ui/Timestamp.vue";
import { getTranslatedString as _ } from "@/i18n";
import { courseIdMixin, loadingMixin, nodeMixin } from "@/mixins";
import {
	CourseTreeNode as ICourseTreeNode,
	FileNode,
	PollNode,
	PollNodeChoice,
	PollNodeState,
} from "@/models";
import { defineComponent, PropType } from "@vue/runtime-core";
import CourseTreeNode from "../node/CourseTreeNode.vue";
import { nodeEmits, nodeProps } from "../shared";
import { getColorFromString, md5, setErrorNotification } from "@/utils";

import { Pie } from "vue-chartjs";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { TChartData } from "vue-chartjs/dist/types";
import { DataFrequency, makeLabelText } from "@/reports";
import { SelectableOption } from "@/interfaces";
import { mapStores } from "pinia";
import { useMainStore } from "@/stores/mainStore";

ChartJS.register(ArcElement, Tooltip, Legend);
export default defineComponent({
	name: "PollNodeDetail",
	mixins: [loadingMixin, nodeMixin, courseIdMixin],
	props: {
		node: {
			type: Object as PropType<PollNode>,
			required: true,
		},
		children: {
			type: Array as PropType<ICourseTreeNode[]>,
			default: () => [],
		},
		...nodeProps,
	},
	emits: {
		...nodeEmits,
	},
	created() {
		// TODO possibly extract shared logic
		this.$emit("loadChildren", { node: this.node, fromFirstPage: true });
		this.$emit("loadComments", this.node);
	},
	data() {
		return {
			PollNodeState,
			draftSelectedChoiceId: null as null | string,
		};
	},
	methods: {
		onEdit() {
			this.$emit("editNode", this.node);
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
		// TODO extract shared logic
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
	components: {
		Timestamp,
		ProcessedTextFragment,
		Btn,
		SlotSkeleton,
		//CourseTreeNode,
		CopyToClipboard,
		RadioGroup,
		Pie,
	},
});
</script>

<style></style>
