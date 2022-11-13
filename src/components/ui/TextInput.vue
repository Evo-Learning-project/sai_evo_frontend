<template>
	<div class="darken-on-hover">
		<div
			:class="{
				'border-danger-dark focus-within:border-danger-dark': $slots.errors,
				'py-1.5 px-2 rounded-t-sm border-b-2': !searchBar,
				'py-2 px-3 rounded-full': searchBar,
			}"
			class="
				light-input
				relative
				z-10
				bg-light
				hover:bg-gray-150
				focus-within:border-primary
				duration-300
				transition-border
			"
		>
			<input
				type="text"
				:value="modelValue"
				@blur="$emit('blur')"
				@input="$emit('update:modelValue', $event.target.value)"
				:placeholder="placeholder"
				:class="{
					'floating-label-error': $slots.errors?.(),
					'floating-label': !fixedLabel,
					'pl-5': leftIcon.length > 0,
				}"
				class="z-10 block w-full bg-transparent appearance-none focus:outline-none"
			/>
			<div
				v-if="leftIcon.length > 0"
				:class="['absolute -z-1', searchBar ? 'left-3 bottom-1' : 'left-1.5 bottom-0.5']"
			>
				<span class="text-base text-muted material-icons-outlined">
					{{ leftIcon }}
				</span>
			</div>
			<label
				:class="{ 'top-2 left-1.5 origin-0 fixed-label': fixedLabel }"
				class="absolute bottom-1.5 origin-0 -z-1"
			>
				<slot></slot>
			</label>
			<div v-if="rightIcon.length > 0" class="absolute bottom-0.5 right-1.5 -z-1">
				<span class="text-base text-muted material-icons-outlined">
					{{ rightIcon }}
				</span>
			</div>
		</div>
		<div v-if="$slots.errors?.()" class="text-sm font-light text-danger-dark">
			<slot name="errors"></slot>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";

export default defineComponent({
	name: "TextInput",
	props: {
		modelValue: {
			type: String,
			required: true,
		},
		rightIcon: {
			type: String,
			default: "",
		},
		leftIcon: {
			type: String,
			default: "",
		},
		placeholder: {
			type: String,
			default: " ",
		},
		fixedLabel: {
			type: Boolean,
			default: false,
		},
		searchBar: {
			type: Boolean,
			default: false,
		},
	},
});
</script>
