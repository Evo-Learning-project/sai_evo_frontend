<template>
	<div>
		<div v-for="(step, index) in steps" :key="id + '-step-' + index">
			<div class="flex items-start space-x-2 mb-3">
				<div class="flex flex-col space-y-3 items-center">
					<div class="w-4 h-4 rounded-full bg-primary" :class="step.data?.class ?? ''"></div>
					<div :class="[index < steps.length - 1 ? 'h-10' : '', 'border-l-1.5 border-gray-200']"></div>
				</div>
				<div class="mb-4">
					<slot v-bind:timestamp="step.timestamp" v-bind:eventType="step.eventType" v-bind:data="step.data"></slot>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { v4 as uuid4 } from "uuid";

import { defineComponent, PropType } from "@vue/runtime-core";
export default defineComponent({
	name: "Timeline",
	props: {
		steps: {
			type: Array as PropType<{ eventType: any; timestamp: string; data: any }[]>,
			required: true,
		},
	},
	data() {
		return {
			id: uuid4(),
		};
	},
	methods: {},
	computed: {},
});
</script>

<style></style>
