<template>
	<router-link
		style="margin-top: 9px; line-height: 1"
		class="flex"
		v-if="params.value.id"
		target="_blank"
		:to="{
			name: 'ExamParticipationFull',
			params: { participationId: params.value.id, examId: params.value.examId },
		}"
	>
		<Btn :variant="'icon'" :outline="true">
			<span>{{ params.value.score }}</span>
		</Btn>
	</router-link>
</template>

<script lang="ts">
import { EventParticipation } from "@/models";
import { defineComponent, PropType } from "@vue/runtime-core";
import { icons as assessmentStateIcons } from "@/assets/assessmentStateIcons";
import Btn from "../ui/Btn.vue";

export default defineComponent({
	name: "CourseInsightsExamParticipationRenderer",
	props: {
		params: {
			type: Object as PropType<{
				value: {
					id: string;
					examId: string;
					score: null | string | number;
				};
			}>,
			required: true,
		},
	},
	created() {
		console.log(this.params);
	},
	data() {
		return {};
	},
	methods: {},
	computed: {},
	components: { Btn },
});
</script>

<style></style>
