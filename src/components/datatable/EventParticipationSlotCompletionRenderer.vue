<template>
	<div class="flex items-center">
		<div class="">
			<!-- ag-selectable-cell -->
			<div :class="[hasAnswer ? 'text-success opacity-80' : 'text-muted opacity-50']">
				<span
					class="material-icons text-lg mx-auto"
					style="font-size: 20px !important; padding-top: 12.5px !important"
				>
					{{ hasAnswer ? "done" : "remove" }}</span
				>
			</div>
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
		hasAnswer() {
			return (
				// TODO add has_answer to interface
				(this.params.value as any).has_answer
			);
		},
	},
	components: {},
});
</script>

<style></style>
