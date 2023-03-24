<template>
	<div class="flex items-center">
		<div class="m-auto transform translate-x-1/3">
			<div
				v-if="
					params.value.execution_results &&
					params.value.execution_results.state === 'running'
				"
				class="text-muted mt-1"
			>
				<span
					style="font-size: 20px !important"
					class="material-icons-outlined animate-spin"
					>sync</span
				>
			</div>
			<Btn
				:variant="'icon'"
				:outline="true"
				style="margin-top: 7.5px !important; line-height: 1 !important"
				:class="{
					'transition-opacity duration-75 hover:opacity-100 opacity-70': hasNullishScore,
				}"
				v-else
			>
				<!-- ag-selectable-cell -->
				<div class="">
					<span
						v-if="hasNullishScore"
						class="text-yellow-900 material-icons-outlined mx-auto"
						style="font-size: 20px !important; padding-top: 3.5px !important"
						>pending_actions</span
					>
					<span v-else class="mx-auto" style="padding-top: -5px !important">
						{{ params.value.score }}
					</span>
				</div></Btn
			>
		</div>
	</div>
</template>

<script lang="ts">
import { EventParticipationSlot } from "@/models";
import { defineComponent, PropType } from "@vue/runtime-core";
import Btn from "@/components/ui/Btn.vue";
export default defineComponent({
	name: "EventParticipationSlotScoreRenderer",
	props: {
		params: {
			type: Object as PropType<{ value: EventParticipationSlot }>,
			required: true,
		},
	},
	methods: {},
	computed: {
		hasNullishScore() {
			return (
				this.params.value.score === null || typeof this.params.value.score === "undefined"
			);
		},
	},
	components: { Btn },
});
</script>

<style></style>
