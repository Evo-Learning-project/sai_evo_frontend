<template>
	<div>EventParticipationPreview</div>
</template>

<script lang="ts">
import { EventParticipation } from "@/models";
import { defineComponent, PropType } from "@vue/runtime-core";

export default defineComponent({
	name: "EventParticipationPreview",
	props: {
		participation: {
			type: Object as PropType<EventParticipation>,
			required: true,
		},
	},
});
</script>

<style></style>
