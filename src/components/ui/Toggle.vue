<template>
	<div
		class="flex items-center"
		:class="{
			'opacity-40 pointer-events-none': disabled,
		}"
	>
		<div
			v-wave-trigger:toggleCheckbox
			:class="{ 'order-12 ml-4': labelOnLeft }"
			class="
				relative
				inline-block
				w-10
				h-4
				mt-1
				mr-2
				align-middle
				transition
				duration-200
				ease-in
				bg-transparent
				rounded-full
				select-none
				toggle-container
			"
		>
			<input
				style="z-index: 3"
				type="checkbox"
				name="toggle"
				:value="value"
				v-model="proxyModelValue"
				:id="overrideId || id"
				:class="{
					'bg-white': !modelValue,
					'bg-primary': modelValue,
				}"
				class="
					absolute
					-left-0.5
					block
					transition-all
					duration-100
					rounded-full
					toggle-handle
					appearance-none
					cursor-pointer
					hover:ring-0
					ring-secondary
					active:ring-opacity-40
					ring-opacity-20
					toggle-checkbox
				"
			/>
			<div
				v-wave="{ trigger: 'toggleCheckbox', color: '#666ad1' }"
				class="
					absolute
					w-12
					h-12
					transition-all
					duration-100
					ease-in-out
					rounded-full
					bg-opacity-10 bg-primary
					toggle-shadow
					-top-4
				"
			></div>
			<label
				style="z-index: 4"
				:for="overrideId || id"
				:class="[proxyModelValue ? 'text-light' : 'text-gray-600']"
				class="
					absolute
					text-lg
					font-semibold
					transform
					translate-y-1/2
					cursor-pointer
					toggle-mark
					opacity-70
					material-icons-outlined
					bottom-1/2
				"
				>&nbsp;</label
			>

			<label
				style="z-index: 2"
				:for="overrideId || id"
				class="relative block overflow-hidden bg-gray-400 rounded-full cursor-pointer toggle-rail toggle-label"
			></label>
		</div>
		<label :for="id" v-if="$slots.default">
			<slot></slot>
		</label>
	</div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import { v4 as uuid4 } from "uuid";
export default defineComponent({
	name: "Toggle",
	props: {
		modelValue: [Boolean, Array],
		value: {
			default: null,
		},
		labelOnLeft: {
			type: Boolean,
			default: false,
		},
		overrideId: {
			type: String,
			default: "",
		},
		disabled: {
			type: Boolean,
			default: false,
		},
	},
	created() {
		this.id = uuid4();
	},
	data() {
		return {
			id: "",
		};
	},
	computed: {
		proxyModelValue: {
			get() {
				return this.modelValue;
			},
			set(val: unknown) {
				this.$emit("update:modelValue", val);
			},
		},
	},
});
</script>

<style>
/* FIXME review shadow */
</style>
