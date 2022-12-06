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
		<div class="flex items-start">
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
			<div class="flex flex-col w-full">
				<router-link :to="{ name: 'NodeDetail', params: { nodeId: node.id } }">
					<h2 style="line-height: 0.95" class="mb-2 hover:text-primary hover:underline">
						{{ $t("course_tree.poll_title") }}
					</h2>
				</router-link>
				<div class="flex space-x-2 ml-0.5 -mt-2">
					<p v-if="node.creator" class="text-sm">
						{{ node.creator.full_name }}
					</p>
					<Timestamp :date-only="true" class="text-sm text-muted" :value="node.created" />
				</div>
				<!-- body -->
				<div class="mt-2 flex flex-wrap items-end">
					<ProcessedTextFragment
						class="w-full overflow-x-hidden overflow-ellipsis text-muted"
						:value="node.text"
					/>
				</div>
				<!-- choices -->
				<div class="mt-4 hidden-in-dragging-element" v-if="node.choices.length > 0">
					<div class="">
						<!-- <div class="" v-for="choice in node.choices" :key="choice.id">
							
						</div> -->
						<!-- v-model="selectedChoicesProxy"-->
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
						<RadioGroup
							class="-ml-2 flex"
							:options="pollChoicesAsOptions"
							:modelValue="[]"
							:disabled="!canVote"
						>
							<template v-slot:item="{ description }">
								<!-- TODO show number of selections-->
								<div v-if="false" class="flex items-center space-x-2">
									<p
										:class="{
											'text-success': description === 'done',
											'text-danger-dark': description === 'close',
										}"
										class="text-sm font-semibold text-muted material-icons-outlined"
									>
										{{ description }}
									</p>
								</div>
							</template>
						</RadioGroup>
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
				<p class="text-muted mr-4" v-if="node.state === PollNodeState.DRAFT">
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
		<!-- text -->
		<!-- <div class="ml-1">
			<ProcessedTextFragment
				style="
					display: -webkit-box;
					-webkit-line-clamp: 2;
					-webkit-box-orient: vertical;
					overflow: hidden;
				"
				class="w-full overflow-x-hidden overflow-ellipsis text-muted"
				:value="textPreview"
			/>
		</div> -->
		<!-- footer -->
		<!-- <div class="flex items-center">

		</div> -->
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
import { PollNode, PollNodeState } from "@/models";
import { defineComponent, PropType } from "@vue/runtime-core";
import { nodeEmits, nodeProps } from "../shared";
export default defineComponent({
	name: "PollNode",
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
		};
	},
	emits: {
		...nodeEmits,
	},
	methods: {
		onEdit() {
			this.$emit("editNode", this.node);
		},
		onDelete() {
			this.$emit("deleteNode", this.node);
		},
	},
	computed: {
		textPreview() {
			return this.node.text;
		},
		permalink() {
			// TODO implement for all nodes
			return "";
		},
		canVote() {
			return this.node.state === PollNodeState.OPEN;
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
	},
});
</script>

<style></style>
