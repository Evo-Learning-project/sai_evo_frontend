<template>
	<AbstractExercise v-bind="$props"></AbstractExercise>
</template>

<script lang="ts">
import { defineComponent, PropType } from "@vue/runtime-core";
import { exerciseProps } from "./shared";
import AbstractExercise from "./AbstractExercise.vue";
export default defineComponent({
	name: "AggregatedExercise",
	props: {
		...exerciseProps,
	},
	methods: {},
	computed: {},
	components: { AbstractExercise },
});
</script>

<style></style>
