<template>
	<div class="mb-10">
		<div class="w-full">
			<div class="w-full mb-5">
				<div class="w-full h-4 mb-2 skeleton-unit"></div>
				<div class="w-full h-4 mb-2 skeleton-unit"></div>
				<div class="w-full h-4 mb-2 skeleton-unit"></div>
			</div>
			<div class="w-4/5 h-3 mb-2 skeleton-unit"></div>
			<div class="w-4/5 h-3 mb-2 skeleton-unit"></div>
			<div class="w-4/5 h-3 mb-2 skeleton-unit"></div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "@vue/runtime-core";
export default defineComponent({
	name: "SlotSkeleton",
	props: {},
	methods: {},
	computed: {},
});
</script>

<style></style>
