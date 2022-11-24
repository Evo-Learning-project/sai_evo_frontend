<template>
	<div
		tabindex="0"
		@click="$emit('showFileNode')"
		@keyup.enter="$emit('showFileNode')"
		v-wave="{ initialOpacity: 0.25 }"
		class="
			cursor-pointer
			card-border
			grid grid-cols-12
			hover:bg-light
			transition-colors
			duration-75
			ease
		"
	>
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
		<div class="flex col-span-7 p-4">
			<div class="my-auto">
				<h4>{{ node.file.name }}</h4>
				<p class="text-muted text-sm">{{ humanReadableFileSize }}</p>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { FileNode } from "@/models";
import { getHumanFileSize } from "@/utils";
import { defineComponent, PropType } from "@vue/runtime-core";
import { nodeProps } from "../shared";
export default defineComponent({
	name: "FileNode",
	props: {
		node: {
			type: Object as PropType<FileNode>,
			required: true,
		},
		...nodeProps,
	},
	methods: {},
	computed: {
		humanReadableFileSize() {
			return getHumanFileSize(this.node.file.size);
		},
	},
});
</script>

<style></style>
