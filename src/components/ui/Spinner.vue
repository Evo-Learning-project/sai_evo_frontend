<template>
	<div class="flex items-center justify-center">
		<!-- <div
			:style="size === 'xl' ? 'filter: drop-shadow(1px 1px 2px rgba(0,0,0,0.2))' : ''"
			class="inline-block rounded-full spinner-border"
			:class="{
				'w-6 h-6 border-2': size === 'lg',
				'w-5 h-5 border-2': size === 'md',
				'w-3 h-3 border-1.5': size === 'sm',
				'w-12 h-12 border-4 ': size === 'xl',

				'animate-spin-fast': fast,
				'animate-spin': !fast,
			}"
			role="status"
		></div> -->
		<div
			:class="{
				'text-primary': variant === 'primary',
				'text-gray-800': variant === 'dark',
				'text-gray-400': variant === 'gray',
			}"
		>
			<svg
				class="spinner"
				:width="spinnerSize"
				:height="spinnerSize"
				:style="size === 'xl' ? 'filter: drop-shadow(1px 1px 2px rgba(0,0,0,0.1))' : ''"
				viewBox="0 0 66 66"
				xmlns="http://www.w3.org/2000/svg"
			>
				<circle
					class="path"
					fill="none"
					stroke-width="6"
					stroke-linecap="round"
					cx="33"
					cy="33"
					r="30"
				></circle>
			</svg>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import { PropType } from "vue";

export default defineComponent({
	name: "Spinner",
	props: {
		size: {
			type: String as PropType<"sm" | "md" | "lg" | "xl">,
			default: "md",
		},
		variant: {
			type: String as PropType<"primary" | "gray" | "light" | "dark">,
			default: "gray",
		},
		fast: {
			type: Boolean,
			default: false,
		},
	},
	computed: {
		spinnerSize() {
			switch (this.size) {
				case "sm":
					return "12px";
				case "md":
					return "20px";
				case "lg":
					return "24px";
				case "xl":
					return "48px";
				default:
					return "12px";
			}
		},
	},
});
</script>

<style>
/* .spinner-border {
	vertical-align: -0.125em;
	border-right: 0.25em solid;
	border-right-color: transparent !important;
}
.border-gray {
	border-color: rgba(156, 163, 175, 0.75);
}
.animate-spin-fast {
	animation: spin 0.6s linear infinite;
} */
.spinner {
	-webkit-animation: rotator 1.4s linear infinite;
	animation: rotator 1.4s linear infinite;
	stroke: currentColor;
}

@-webkit-keyframes rotator {
	0% {
		-webkit-transform: rotate(0deg);
		transform: rotate(0deg);
	}
	100% {
		-webkit-transform: rotate(270deg);
		transform: rotate(270deg);
	}
}

@keyframes rotator {
	0% {
		-webkit-transform: rotate(0deg);
		transform: rotate(0deg);
	}
	100% {
		-webkit-transform: rotate(270deg);
		transform: rotate(270deg);
	}
}
.path {
	stroke-dasharray: 187;
	stroke-dashoffset: 0;
	-webkit-transform-origin: center;
	-ms-transform-origin: center;
	transform-origin: center;
	-webkit-animation: dash 1.4s ease-in-out infinite, colors 5.6s ease-in-out infinite;
	animation: dash 1.4s ease-in-out infinite, colors 5.6s ease-in-out infinite;
}

@-webkit-keyframes dash {
	0% {
		stroke-dashoffset: 187;
	}
	50% {
		stroke-dashoffset: 46.75;
		-webkit-transform: rotate(135deg);
		transform: rotate(135deg);
	}
	100% {
		stroke-dashoffset: 187;
		-webkit-transform: rotate(450deg);
		transform: rotate(450deg);
	}
}
@keyframes dash {
	0% {
		stroke-dashoffset: 187;
	}
	50% {
		stroke-dashoffset: 46.75;
		-webkit-transform: rotate(135deg);
		transform: rotate(135deg);
	}
	100% {
		stroke-dashoffset: 187;
		-webkit-transform: rotate(450deg);
		transform: rotate(450deg);
	}
}
</style>
