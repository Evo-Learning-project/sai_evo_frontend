<template>
	<div
		class="relative"
		v-click-outside="() => (expanded ? $emit('toggleExpanded') : undefined)"
	>
		<div v-if="$slots.activator?.()" @click="$emit('toggleExpanded')">
			<slot name="activator"></slot>
		</div>
		<Btn
			v-else
			:variant="label ? 'primary' : 'icon'"
			:outline="!label"
			@click="$emit('toggleExpanded')"
		>
			<!-- :tooltip="!expanded ? tooltip : ''" -->
			<slot name="icon"></slot>
			<span v-if="!$slots.icon?.()" class="material-icons-outlined">{{ icon }}</span>
			<span class="ml-1" v-if="label">{{ label }}</span>
			<div
				v-if="trailingIcon"
				class="h-full w-0 opacity-30"
				style="border-width: 0.5px; margin-left: 10px; margin-right: 5px"
			></div>
			<span v-if="trailingIcon" class="material-icons-outlined -mr-4">{{
				trailingIcon
			}}</span>
		</Btn>
		<div
			class="
				absolute
				z-50
				overflow-y-auto
				transition-all
				duration-100
				ease-in
				transform
				bg-white
				mt-1.5
				card
				shadow-popup
			"
			:class="{
				'opacity-0 scale-95 invisible max-h-97': !expanded,
				'max-h-97 opacity-100 scale-100': expanded,
				'origin-top-left left-0': placement === 'left',
				'origin-top-right right-0': placement === 'right',
			}"
		>
			<slot></slot>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "@vue/runtime-core";
import Btn from "./Btn.vue";
export default defineComponent({
	name: "DropdownMenu",
	props: {
		tooltip: {
			type: String,
			default: "",
		},
		label: {
			type: String,
			default: "",
		},
		icon: {
			type: String,
			default: "more_vert",
		},
		trailingIcon: {
			type: String,
			default: "",
		},
		expanded: {
			type: Boolean,
			required: true,
		},
		placement: {
			type: String as PropType<"left" | "right">,
			default: "left",
		},
	},
	methods: {},
	computed: {},
	components: { Btn },
});
</script>

<style></style>
