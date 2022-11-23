<template>
	<div class="card-border grid grid-cols-12">
		<div class="col-span-3 h-32 bg-gray-200 flex">
			<svg
				class="text-gray-600 m-auto"
				style="width: 60px; height: 60px"
				viewBox="0 0 24 24"
			>
				<path
					fill="currentColor"
					d="M13,9V3.5L18.5,9M6,2C4.89,2 4,2.89 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2H6Z"
				/>
			</svg>
			<!-- <span class="material-icons text-lightText">file</span> -->
		</div>
		<div class="flex col-span-7"><h4 class="m-auto">Allegato 1</h4></div>
	</div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "@vue/runtime-core";
export default defineComponent({
	name: "FileNode",
	props: {},
	methods: {},
	computed: {},
});
</script>

<style></style>
