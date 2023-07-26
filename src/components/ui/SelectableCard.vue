<template>
	<div
		tabindex="0"
		@keydown.enter="$emit('itemSelected')"
		@click="$emit('itemSelected')"
		:class="{
			'outline-primary hover:bg-opacity-20 outline-4 border-transparent bg-primary bg-opacity-10 text-primary':
				selected,
			'hover:bg-light': selected,
		}"
		v-wave
		class="
			transition-colors
			duration-100
			cursor-pointer
			card card-border
			flex flex-col
			items-center
			justify-center
			p-8
		"
	>
		<slot name="image"></slot>
		<slot name="title"></slot>
	</div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "@vue/runtime-core";
export default defineComponent({
	name: "SelectableCard",
	props: {
		selected: {
			type: Boolean,
			required: true,
		},
	},
	methods: {},
	computed: {},
});
</script>

<style></style>
