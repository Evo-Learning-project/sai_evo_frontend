<template>
	<Tooltip v-if="tooltip" :noArrow="true" :placement="'bottom'" :textValue="tooltip">
		<button
			v-wave="disabled ? false : {}"
			:disabled="disabled || loading"
			class="relative overflow-hidden disabled:cursor-not-allowed"
			:class="{
				'disabled:opacity-40 transition-colors-opacity duration-100 ease-linear':
					variant === 'secondary',
				'disabled:opacity-70': variant !== 'secondary',
				'shadow-elevation-2 bg-light': forceActive,
				'bg-success-light bg-opacity-30': forceActive && variant === 'success-borderless',
				'px-6 py-2 font-medium': !outline && size === 'base' && variant !== 'transparent',
				'px-6 py-6.3px font-medium': outline && size === 'base' && variant !== 'icon',
				'px-3.5 .5': size === 'sm' && variant !== 'icon',
				'px-1': size === 'xs' && variant !== 'icon',
				'px-14 py-2 text-lg font-medium': size === 'lg' && variant !== 'icon',
				'text-onPrimary bg-primary hover:bg-primary-dark shadow-btn':
					!outline && variant === 'primary',
				'text-onSecondary bg-secondary': !outline && variant === 'secondary',
				'hover:bg-secondary-dark shadow-btn':
					!outline && variant === 'secondary' && !disabled,
				'text-danger-dark bg-danger shadow-btn': !outline && variant === 'danger',
				'text-danger-dark border-danger-dark bg-white border hover:bg-danger-dark hover:bg-opacity-5':
					outline && variant === 'danger',
				'text-success-dark bg-success-light shadow-btn':
					!outline && variant === 'success',
				'transition-colors duration-100': outline,
				'focus:outline-primary': false && variant === 'primary',
				'focus:outline-danger-dark': variant === 'danger',
				'focus:outline-success': false && variant === 'success',
				'hover:bg-light hover:shadow-inner': variant === 'light',
				'text-primary bg-transparent hover:bg-primary hover:bg-opacity-5 border-primary border-1.5 ':
					outline && variant === 'primary',
				'text-lg font-medium text-primary hover:bg-light ':
					variant === 'primary-borderless',
				'px-6': variant === 'primary-borderless' && size !== 'xs',
				'text-lg font-bold text-secondary hover:bg-light px-6 focus:bg-secondary-light focus:bg-opacity-30':
					variant === 'secondary-borderless',
				'text-lg font-bold text-success hover:bg-light px-6 focus:bg-success-light focus:bg-opacity-30':
					variant === 'success-borderless',
				'border-gray-300 bg-white hover:bg-primary hover:bg-opacity-10 hover:text-primary transition-colors duration-100':
					variant === 'transparent',
				rounded: variant !== 'transparent',
				'rounded-full bg-transparent hover:bg-gray-200 text-gray-600 icon-btn':
					variant === 'icon',
				'icon-btn icon-btn-sm': variant === 'icon' && size === 'sm',
				'icon-btn icon-btn-xs': variant === 'icon' && size === 'xs',
				'icon-btn icon-btn-base': variant === 'icon' && size === 'base',
				'icon-btn icon-btn-lg': variant === 'icon' && size === 'lg',
			}"
		>
			<!-- FIXME review shadow -->
			<div class="flex w-full">
				<p class="flex items-center mx-auto" :class="loading ? 'invisible' : ''">
					<slot></slot>
				</p>
			</div>
			<p
				v-if="loading"
				class="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
			>
				<Spinner :size="'md'" :variant="'gray'" />
			</p>
			<slot name="content"></slot>
		</button>
	</Tooltip>
	<button
		v-else
		v-wave="disabled ? false : {}"
		:disabled="disabled || loading"
		class="relative overflow-hidden disabled:cursor-not-allowed"
		:class="{
			'disabled:opacity-40 transition-colors-opacity duration-100 ease-linear':
				variant === 'secondary',
			'disabled:opacity-70': variant !== 'secondary',
			'shadow-elevation-2 bg-light': forceActive,
			'bg-success-light bg-opacity-30': forceActive && variant === 'success-borderless',
			'px-6 py-2 font-medium': !outline && size === 'base' && variant !== 'transparent',
			'px-6 py-6.3px font-medium': outline && size === 'base' && variant !== 'icon',
			'px-3.5 py-1.5': size === 'sm' && variant !== 'icon',
			'px-1': size === 'xs' && variant !== 'icon',
			'px-14 py-2 text-lg font-medium': size === 'lg' && variant !== 'icon',
			'text-onPrimary bg-primary hover:bg-primary-dark shadow-btn':
				!outline && variant === 'primary',
			'text-onSecondary bg-secondary': !outline && variant === 'secondary',
			'hover:bg-secondary-dark shadow-btn':
				!outline && variant === 'secondary' && !disabled,
			'text-danger-dark bg-danger shadow-btn': !outline && variant === 'danger',
			'text-danger-dark border-danger-dark bg-white border hover:bg-danger-dark hover:bg-opacity-5':
				outline && variant === 'danger',
			'text-success-dark bg-success-light shadow-btn': !outline && variant === 'success',
			'transition-colors duration-100': outline,
			'focus:outline-primary': false && variant === 'primary',
			'focus:outline-danger-dark': variant === 'danger',
			'focus:outline-success': false && variant === 'success',
			'hover:bg-light hover:shadow-inner': variant === 'light',
			'text-primary bg-transparent hover:bg-primary hover:bg-opacity-5 border-primary border-1.5 ':
				outline && variant === 'primary',
			'text-lg font-medium text-primary hover:bg-light ':
				variant === 'primary-borderless',
			'px-6': variant === 'primary-borderless' && size !== 'xs',
			'text-lg font-bold text-secondary hover:bg-light px-6 focus:bg-secondary-light focus:bg-opacity-30':
				variant === 'secondary-borderless',
			'text-lg font-bold text-success hover:bg-light px-6 focus:bg-success-light focus:bg-opacity-30':
				variant === 'success-borderless',
			'border-gray-300 bg-white hover:bg-primary hover:bg-opacity-10 hover:text-primary transition-colors duration-100':
				variant === 'transparent',
			rounded: variant !== 'transparent',
			'rounded-full bg-transparent hover:bg-gray-200 text-gray-600 icon-btn':
				variant === 'icon',
			'icon-btn icon-btn-sm': variant === 'icon' && size === 'sm',
			'icon-btn icon-btn-xs': variant === 'icon' && size === 'xs',
			'icon-btn icon-btn-base': variant === 'icon' && size === 'base',
			'icon-btn icon-btn-lg': variant === 'icon' && size === 'lg',
		}"
	>
		<!-- FIXME review shadow -->
		<div class="flex w-full">
			<p class="flex items-center mx-auto" :class="loading ? 'invisible' : ''">
				<slot></slot>
			</p>
		</div>
		<p
			v-if="loading"
			class="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
		>
			<Spinner :size="'md'" :variant="'gray'" />
		</p>
		<slot name="content"></slot>
	</button>
</template>

<script lang="ts">
import { defineComponent, PropType } from "@vue/runtime-core";
import Spinner from "./Spinner.vue";
import Tooltip from "./Tooltip.vue";

export default defineComponent({
	components: {
		Spinner,
		Tooltip,
	},
	name: "Btn",
	props: {
		outline: {
			type: Boolean,
			default: false,
		},
		variant: {
			type: String as PropType<
				| "primary"
				| "secondary"
				| "danger"
				| "success"
				| "dark"
				| "light"
				| "primary-borderless"
				| "secondary-borderless"
				| "success-borderless"
				| "transparent"
				| "icon"
			>,
			default: "primary",
		},
		size: {
			type: String as PropType<"xs" | "sm" | "base" | "lg">,
			default: "base",
		},
		forceActive: {
			type: Boolean,
			default: false,
		},
		loading: {
			type: Boolean,
			default: false,
		},
		disabled: {
			type: Boolean,
			default: false,
		},
		tooltip: {
			type: String,
			default: "",
		},
	},
	data() {
		return {};
	},
	computed: {
		rippleClass() {
			switch (this.variant) {
				case "primary-borderless":
					return "ripple-primary";
				case "success-borderless":
					return "ripple-success";
				case "transparent":
					return "ripple-primary";
				case "primary":
					if (this.outline) {
						return "ripple-primary";
					}
					return "ripple-white";
				case "icon":
					return "ripple-icon";
				default:
					return "ripple-white";
			}
		},
	},
});
</script>
