<template>
	<div>
		<div
			role="progressbar"
			:aria-valuenow="percentage"
			aria-valuemin="0"
			aria-valuemax="100"
			:style="style"
		>
			<div v-if="displayType === 'fraction'">{{ value }} / {{ total }}</div>
			<div v-else>
				{{ percentage }}
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "@vue/runtime-core";
export default defineComponent({
	name: "CircularProgress",
	props: {
		value: {
			type: Number,
			required: true,
		},
		total: {
			type: Number,
			required: true,
		},
		displayType: {
			type: String as PropType<"percentage" | "fraction">,
			default: "fraction",
		},
		size: {
			type: String as PropType<"sm" | "md" | "lg">,
			default: "md",
		},
	},
	methods: {},
	computed: {
		percentage() {
			return Math.floor((this.value / this.total) * 100);
		},
		sideLength() {
			return this.size === "sm" ? 3.5 : this.size === "md" ? 7 : 10;
		},
		style() {
			return {
				width: this.sideLength + "rem",
				height: this.sideLength + "rem",
				"font-size": this.sideLength / 4.25 + "rem",
				"--value": this.percentage,
			};
		},
	},
});
</script>

<style>
@keyframes growProgressBar {
	0%,
	10% {
		--pgPercentage: 0;
	}
	100% {
		--pgPercentage: var(--value);
	}
}

@property --pgPercentage {
	syntax: "<number>";
	inherits: false;
	initial-value: 0;
}

div[role="progressbar"] {
	--fg: #6a16f0;
	--bg: rgba(102, 106, 209, 0.2);
	--pgPercentage: var(--value);
	animation: growProgressBar 1s 1 forwards;
	border-radius: 50%;
	display: grid;
	place-items: center;
	background: radial-gradient(closest-side, white 80%, transparent 0 99.9%, white 0),
		conic-gradient(var(--fg) calc(var(--pgPercentage) * 1%), var(--bg) 0);
	font-family: Helvetica, Arial, sans-serif;
	color: var(--fg);
}
</style>
