<template>
	<div class="flex items-center h-full">
		<p class="m-auto" style="padding-bottom: 3px; line-height: 1 !important">
			{{ params.value }}
		</p>
	</div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "@vue/runtime-core";

export default defineComponent({
	name: "EventParticipationScoreRenderer",
	props: {
		params: {
			type: Object as PropType<{ value: number | string }>,
			required: true,
		},
	},
	methods: {},
	computed: {},
});
</script>

<style></style>
