<template>
	<div
		class="
			group
			card card-border card-hoverable
			hover-shadow-elevation hover:border-transparent
			relative
		"
	>
		<!-- TODO hover group-->
		<span
			v-if="canEdit"
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
		<div class="flex items-center">
			<div class="flex rounded-full w-10 h-10 bg-primary bg-opacity-15 mr-3">
				<span
					style="font-size: 28px !important"
					class="m-auto material-icons-outlined text-primary"
					>book</span
				>
			</div>
			<div class="flex flex-col -space-y-2">
				<router-link :to="{ name: 'NodeDetail', params: { nodeId: node.id } }">
					<h2 class="mb-0 hover:text-primary hover:underline">{{ node.title }}</h2>
				</router-link>
				<Timestamp :date-only="true" class="text-sm text-muted" :value="node.created" />
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
				<CopyToClipboard
					:icon-only="true"
					:tooltip="$t('exercise_solution.share')"
					:value="permalink"
				/>
			</div>
		</div>
		<!-- body -->
		<!-- <div class="ml-1">
			<ProcessedTextFragment
				style="
					display: -webkit-box;
					-webkit-line-clamp: 2;
					-webkit-box-orient: vertical;
					overflow: hidden;
				"
				class="w-full overflow-x-hidden overflow-ellipsis text-muted"
				:value="bodyPreview"
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
import Timestamp from "@/components/ui/Timestamp.vue";
import { LessonNode } from "@/models";
import { defineComponent, PropType } from "@vue/runtime-core";
import { nodeProps } from "../shared";
export default defineComponent({
	name: "LessonNode",
	props: {
		node: {
			type: Object as PropType<LessonNode>,
			required: true,
		},
		...nodeProps,
	},
	methods: {
		onEdit() {
			console.log("onedit");
		},
	},
	computed: {
		bodyPreview() {
			return this.node.body;
		},
		permalink() {
			// TODO implement for all nodes
			return "";
		},
	},
	// eslint-disable-next-line vue/no-unused-components
	components: { ProcessedTextFragment, Timestamp, Btn, CopyToClipboard },
});
</script>

<style></style>
