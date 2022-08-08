<template>
	<div class="flex items-center justify-center">
		<svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
			<circle class="checkmark__circle" cx="26" cy="26" r="25" fill="none" />
			<path class="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
		</svg>
	</div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";

export default defineComponent({
	name: "AnimatedIcon",
});
</script>

<style>
.checkmark__circle {
	stroke-dasharray: 166;
	stroke-dashoffset: 166;
	stroke-width: 5;
	stroke-miterlimit: 10;
	stroke: #10b981;
	fill: none;
	animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) forwards;
}

.checkmark {
	width: 35px;
	height: 35px;
	border-radius: 50%;
	display: block;
	stroke-width: 4;
	stroke: #10b981; /*#fff;*/
	stroke-miterlimit: 10;
	margin: 10% auto;
	animation: fill 0.2s ease-in-out 0.3s forwards, scale 0.2s ease-in-out 0.7s both;
}

.checkmark__check {
	transform-origin: 50% 50%;
	stroke-dasharray: 48;
	stroke-dashoffset: 48;
	animation: stroke 0.2s cubic-bezier(0.65, 0, 0.45, 1) 0.6s forwards;
}

@keyframes stroke {
	100% {
		stroke-dashoffset: 0;
	}
}

@keyframes scale {
	0%,
	100% {
		transform: none;
	}

	50% {
		transform: scale3d(1.1, 1.1, 1);
	}
}

@keyframes fill {
	100% {
		box-shadow: inset 0px 0px 0px 30px transparent; /* #10b981; */
	}
}
</style>
