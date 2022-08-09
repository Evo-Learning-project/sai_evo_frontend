<template>
	<div
		:class="{
			'border-danger-dark focus-within:border-danger-dark': $slots.errors,
			'py-1.5 px-2': !small,
			'py-0.5 px-1 w-20': small,
			'bg-light': filled,
		}"
		class="
			relative
			z-10
			duration-300
			border-b-2
			rounded-t-sm
			light-input
			transition-border
			focus-within:border-primary
		"
	>
		<input
			type="number"
			:min="min"
			:max="max"
			:disabled="disabled"
			placeholder=" "
			v-model.number="proxyModelValue"
			class="
				z-10
				block
				w-full
				bg-transparent
				appearance-none
				floating-label
				focus:outline-none
			"
			:class="{
				'pl-5': leftIcon.length > 0,
				'floating-label-error': $slots.errors?.(),
			}"
		/>
		<label class="absolute bottom-1.5 origin-0 -z-1 w-full">
			<slot></slot>
		</label>
		<div v-if="rightIcon.length > 0" class="absolute bottom-0.5 right-1.5 -z-1">
			<span
				class="text-base text-muted"
				:class="[iconFilled ? 'material-icons' : 'material-icons-outlined']"
			>
				{{ rightIcon }}
			</span>
		</div>
		<div
			v-if="$slots.rightHint"
			class="absolute z-10 -mb-1.25px opacity-70 bottom-2 text-muted right-7"
		>
			<slot name="rightHint"></slot>
		</div>
		<div v-if="leftIcon.length > 0" style="bottom: 3.2px" class="absolute left-1.5 -z-1">
			<span
				class="text-base text-muted"
				:class="[iconFilled ? 'material-icons' : 'material-icons-outlined']"
			>
				{{ leftIcon }}
			</span>
		</div>
		<div v-if="$slots.errors?.()" class="hidden text-sm font-light text-danger-dark">
			<slot name="errors"></slot>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";

export default defineComponent({
	name: "NumberInput",
	props: {
		disabled: {
			type: Boolean,
			default: false,
		},
		modelValue: {
			type: [Number, String],
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
		iconFilled: {
			type: Boolean,
			default: false,
		},
		min: {
			type: Number,
			default: -1000000000,
		},
		max: {
			type: Number,
			default: 1000000000,
		},
		small: {
			type: Boolean,
			default: false,
		},
		filled: {
			type: Boolean,
			default: true,
		},
	},
	// methods: {
	//   onInput(value: string) {
	//     this.$emit("update:modelValue", value);
	//   },
	// },
	computed: {
		proxyModelValue: {
			get() {
				return this.modelValue;
			},
			set(value: any) {
				// TODO allow 2 decimal digits with "^\d*(\.\d{0,2})?$"
				this.$emit("update:modelValue", value);
			},
		},
	},
});
</script>
