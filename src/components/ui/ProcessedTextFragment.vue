<template>
	<!-- TODO use dynamic template (vue3-runtime-template) to render backtick-enclosed 
		text into CodeFragment
	components if you detect the value contains code -->
	<div
		v-html="sanitizedFormattedValue"
		:class="{
			'text-muted font-light': useDefault && defaultValue.length > 0,
		}"
	></div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import { formatExerciseText, stripHtmlFromLaTexBlocks } from "@/utils";

export default defineComponent({
	name: "ProcessedTextFragment",
	props: {
		value: {
			type: String,
			required: true,
		},
		defaultValue: {
			type: String,
			default: "",
		},
	},
	methods: {},
	computed: {
		useDefault(): boolean {
			return this.value.trim().length === 0;
		},
		formattedValue(): string {
			if (this.useDefault) {
				return this.defaultValue;
			}
			return formatExerciseText(this.value);
		},
		sanitizedFormattedValue(): string {
			return this.$sanitize(stripHtmlFromLaTexBlocks(this.formattedValue));
		},
	},
});
</script>

<style></style>
