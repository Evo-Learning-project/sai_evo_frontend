<template>
	<div class="linear-activity">
		<div v-if="indeterminate" class="indeterminate" />
		<div v-else class="determinate" :style="{ width: progress + '%' }" />
	</div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "@vue/runtime-core";
export default defineComponent({
	name: "LinearProgress",
	props: {
		progress: {
			type: Number,
			required: false,
			validator: (v: number) => v >= 0 && v <= 100,
		},
	},
	methods: {},
	computed: {
		indeterminate() {
			return typeof this.progress === "undefined";
		},
	},
});
</script>

<style></style>
