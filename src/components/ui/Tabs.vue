<template>
	<SegmentedControls
		:options="options"
		:modelValue="modelValue"
		@update:modelValue="$emit('update:modelValue', $event)"
	></SegmentedControls>
</template>

<script lang="ts">
import { defineComponent, PropType } from "@vue/runtime-core";
import SegmentedControls from "./SegmentedControls.vue";
export default defineComponent({
	name: "Tabs",
	props: ["options", "modelValue", "disabled"],
	methods: {},
	computed: {},
	components: { SegmentedControls },
});
</script>

<style></style>
