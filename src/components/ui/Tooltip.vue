<template>
	<div>
		<div
			class="tooltip w-max"
			@mouseover="allowHoverOnText ? showText() : null"
			@mouseleave="allowHoverOnText ? hideText() : null"
		>
			<span
				@mouseover="!allowHoverOnText ? showText() : null"
				@mouseleave="!allowHoverOnText ? hideText() : null"
				v-if="!$slots.default"
				:class="{
					'hover:bg-gray-200 hover:bg-opacity-80 rounded-md px-1.5 transition-colors duration-100 tooltip-handle': true,
				}"
				class="
					text-base
					cursor-default
					select-none
					opacity-80
					material-icons-outlined
					hover:text-primary-dark
				"
			>
				help_outline
			</span>
			<div
				@mouseover="!allowHoverOnText ? showText() : null"
				@mouseleave="!allowHoverOnText ? hideText() : null"
				class="tooltip-handle"
				v-else
			>
				<slot> </slot>
			</div>
			<transition
				:name="noArrow ? 'tooltip-fade-bounce' : 'tooltip-fade'"
				v-if="textCode || textValue"
				><div
					v-if="show"
					class="z-20 max-w-xs md:max-w-max tooltip-text"
					:class="{
						'tooltip-right': placement === 'right',
						'tooltip-bottom': placement === 'bottom',
						'tooltip-top': placement === 'top',
						'tooltip-left': placement === 'left',
						'tooltip-no-arrow tooltip': noArrow,
					}"
				>
					<p>{{ helpText }}</p>
					<slot name="body"></slot></div
			></transition>
		</div>
	</div>
</template>

<script lang="ts">
import { getTranslatedString as _ } from "@/i18n";
import { defineComponent, PropType } from "@vue/runtime-core";
export default defineComponent({
	name: "Tooltip",
	props: {
		textCode: {
			type: String,
			required: false,
		},
		textValue: {
			type: String,
			default: "",
			required: false,
		},
		placement: {
			type: String as PropType<"right" | "left" | "top" | "bottom">,
			default: "right",
		},
		noArrow: {
			type: Boolean,
			default: false,
		},
		allowHoverOnText: {
			type: Boolean,
			default: false,
		},
	},
	data() {
		return {
			show: false,
			showHandle: null as null | number,
		};
	},
	methods: {
		setShow(val: boolean) {
			this.show = val;
		},
		showText() {
			if (!this.showHandle) {
				this.showHandle = setTimeout(() => this.setShow(true), this.noArrow ? 200 : 0);
			}
		},
		hideText() {
			if (this.showHandle) {
				clearTimeout(this.showHandle);
				this.showHandle = null;
			}
			this.setShow(false);
		},
	},
	computed: {
		helpText(): string {
			return this.textValue || _("help_texts." + this.textCode);
		},
	},
});
</script>

<style></style>
