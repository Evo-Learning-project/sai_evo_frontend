<template>
	<div :title="$t('event_participation_states.' + params.value)" class="mt-1">
		<span
			v-if="params.value == EventParticipationState.IN_PROGRESS"
			class="focus-within:text-lg material-icons-outlined text-muted"
			style="margin-left: 13px"
			>{{participationStateIcons[params.value as EventParticipationState][0] }}</span
		>
		<Tooltip
			:placement="'top'"
			:noArrow="true"
			:text-value="$t('event_monitor.undo_turn_in')"
			class="fixed pl-1.5"
			style="z-index: 999999 !important"
			v-else
			><Btn :variant="'icon'" :outline="true">
				<span
					style="font-size: 20px !important"
					class="mx-auto text-lg material-icons-outlined text-success"
					>{{participationStateIcons[params.value as EventParticipationState][0] }}</span
				></Btn
			></Tooltip
		>
	</div>
</template>

<script lang="ts">
import { EventParticipationState } from "@/models";
import { defineComponent, PropType } from "@vue/runtime-core";
import { icons as participationStateIcons } from "@/assets/participationStateIcons";
import Btn from "../ui/Btn.vue";
import Tooltip from "../ui/Tooltip.vue";
export default defineComponent({
	name: "EventParticipationStateRenderer",
	props: {
		params: {
			type: Object as PropType<{
				value: EventParticipationState;
			}>,
			required: true,
		},
	},
	data() {
		return {
			EventParticipationState,
			participationStateIcons,
		};
	},
	methods: {},
	computed: {},
	components: { Btn, Tooltip },
});
</script>

<style></style>
