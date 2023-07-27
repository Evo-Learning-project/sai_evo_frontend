<template>
	<span
		:class="[
			params.value == ParticipationAssessmentProgress.PARTIALLY_ASSESSED
				? 'text-yellow-900'
				: 'text-success',
			'pt-3.5 ml-1 text-lg material-icons-outlined',
		]"
		>{{ assessmentStateIcons[params.value][0] }}</span
	>
</template>

<script lang="ts">
import { ParticipationAssessmentProgress } from "@/models";
import { defineComponent, PropType } from "@vue/runtime-core";
import { icons as assessmentStateIcons } from "@/assets/assessmentStateIcons";

export default defineComponent({
	name: "EventParticipationAssessmentStateRenderer",
	props: {
		params: {
			type: Object as PropType<{ value: ParticipationAssessmentProgress }>,
			required: true,
		},
	},
	data() {
		return {
			ParticipationAssessmentProgress,
			assessmentStateIcons,
		};
	},
	methods: {},
	computed: {},
});
</script>

<style></style>
