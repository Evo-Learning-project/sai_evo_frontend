<template>
	<div class="ag-cell-label-container" role="presentation">
		<span ref="eMenu" class="ag-header-icon ag-header-cell-menu-button"></span>
		<div ref="eLabel" class="ag-header-cell-label" role="presentation">
			<span ref="eSortOrder" class="ag-header-icon ag-sort-order"></span>
			<span ref="eSortAsc" class="ag-header-icon ag-sort-ascending-icon"></span>
			<span ref="eSortDesc" class="ag-header-icon ag-sort-descending-icon"></span>
			<span ref="eSortNone" class="ag-header-icon ag-sort-none-icon"></span>
			<!-- <span
				style="background-color: ${
		examsColors[e.id]
		}; margin-right: 5px; min-width: 10px; min-height: 10px; width: 10px; height: 10px; border-radius: 50%;"
			></span> -->

			<span
				ref="eText"
				class="ag-header-cell-text"
				style="white-space: break-spaces; max-width: 150px"
				role="columnheader"
			>
				<router-link
					class="hover:text-primary hover:underline overflow-ellipsis overflow-hidden"
					target="_blank"
					style="
						display: -webkit-box;
						-webkit-line-clamp: 2;
						-webkit-box-orient: vertical;
					"
					:to="{
						name: 'ExamResults',
						params: { examId },
					}"
					>{{ params.displayName }}
				</router-link>
			</span>
			<span ref="eFilter" class="ag-header-icon ag-filter-icon"></span>
		</div>
	</div>

	<!-- <router-link
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
	</router-link> -->
</template>

<script lang="ts">
import { EventParticipation } from "@/models";
import { defineComponent, PropType } from "@vue/runtime-core";
import { icons as assessmentStateIcons } from "@/assets/assessmentStateIcons";
import Btn from "../ui/Btn.vue";
import { IHeaderParams } from "ag-grid-community";

export default defineComponent({
	name: "CourseInsightsExamHeaderRenderer",
	props: {
		params: {
			type: Object as PropType<IHeaderParams>,
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
	computed: {
		examId() {
			return this.params.column.getColId().split("_")[1];
		},
	},
	components: {},
});
</script>

<style></style>
