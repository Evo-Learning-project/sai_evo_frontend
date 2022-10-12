<template>
	<div
		class="relative overflow-hidden"
		:class="{
			'faded-left': !atBeginX,
			'faded-right': !atEndX,
		}"
	>
		<div
			:style="{
				opacity: atBeginX ? 0 : 1,
				'z-index': atBeginX ? -1 : 15,
			}"
			class="faded-navigate-previous absolute left-0"
			v-if="!atBeginX"
		>
			<Btn
				@click="scrollBy(-15)"
				style="z-index: 200"
				:size="'xs'"
				:outline="true"
				:variant="'icon'"
				><span class="material-icons">navigate_before</span></Btn
			>
		</div>
		<div
			v-if="isScrollable"
			:style="{
				opacity: atEndX ? 0 : 1,
				'z-index': atEndX ? -1 : 15,
			}"
			class="faded-navigate-next absolute right-0"
		>
			<Btn
				@click="scrollBy(15)"
				style="z-index: 200"
				:size="'xs'"
				:outline="true"
				:variant="'icon'"
				><span class="material-icons">navigate_next</span></Btn
			>
		</div>

		<div class="flex overflow-x-auto scrollable-slot" :id="elementId">
			<slot></slot>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "@vue/runtime-core";
import { v4 as uuid4 } from "uuid";
import Btn from "./Btn.vue";
export default defineComponent({
	name: "FadedEdgesScrollableFragment",
	props: {},
	mounted() {
		this.element = document.getElementById(this.elementId);
		this.element?.addEventListener("scroll", this.debounce(this.onScroll), {
			passive: true,
		});
		this.onScroll();
		// (ugly workaround) trigger method to make the right arrow disappear if element isn't scrollable
		setTimeout(() => this.onScroll(), 50);
	},
	data() {
		return {
			atBeginX: true,
			atEndX: false,
			atBeginY: true,
			atEndY: false,
			elementId: uuid4(),
			element: null as null | HTMLElement,
			isScrollable: false,
		};
	},
	methods: {
		debounce(fn: any) {
			// This holds the requestAnimationFrame reference, so we can cancel it if we wish
			let frame: number;
			// The debounce function returns a new function that can receive a variable number of arguments
			return (...params: any[]) => {
				// If the frame variable has been defined, clear it now, and queue for next frame
				if (frame) {
					cancelAnimationFrame(frame);
				}
				// Queue our function call for the next frame
				frame = requestAnimationFrame(() => {
					// Call our function and pass any params we received
					fn(...params);
				});
			};
		},
		onScroll() {
			const el = this.element as HTMLElement;
			this.isScrollable =
				el.scrollWidth > el.clientWidth &&
				["scroll", "auto"].indexOf(getComputedStyle(el).overflowX) >= 0;
			this.atEndX =
				!this.isScrollable || -(el.scrollLeft + el.clientWidth) + el.scrollWidth <= 1;
			this.atBeginX = el.scrollLeft === 0;
		},
		scrollBy(perc: number) {
			const el = this.element as HTMLElement;
			const amount = (el.scrollWidth * perc) / 100;
			el.scrollLeft = el.scrollLeft + amount;
		},
	},
	computed: {},
	components: { Btn },
});
</script>

<style>
.card-filled .bg-white .faded-navigate-previous,
.card-filled .bg-white .faded-navigate-next {
	background-color: rgba(255, 255, 255, 0.5);
}

.card-filled .faded-navigate-previous,
.card-filled .faded-navigate-next {
	background-color: rgba(243, 244, 246, 0.5);
}

.faded-navigate-next:before,
.faded-right:after,
.bg-white .faded-navigate-next:before,
.bg-white .faded-right:after {
	background: linear-gradient(
		to right,
		rgba(255, 255, 255, 0),
		rgba(255, 255, 255, 1) 90%
	);
	content: "";
	position: absolute;
	z-index: 11;
	top: 0;
	right: 0;
	bottom: 0;
	pointer-events: none;
	width: 50px;
}

.faded-navigate-previous:after,
.faded-left:before,
.card-filled .bg-white .faded-navigate-next:before,
.card-filled .bg-white .faded-left:before {
	background: linear-gradient(
		to left,
		rgba(255, 255, 255, 0),
		rgba(255, 255, 255, 1) 90%
	);
	content: "";
	position: absolute;
	top: 0;
	z-index: 11;
	left: 0;
	bottom: 0;
	pointer-events: none;
	width: 50px;
}

/* --- */

.card-filled .faded-navigate-next:before,
.card-filled .faded-right:after {
	background: linear-gradient(
		to right,
		rgba(255, 255, 255, 0),
		rgba(243, 244, 246, 1) 90%
	);
	content: "";
	position: absolute;
	z-index: 11;
	top: 0;
	right: 0;
	bottom: 0;
	pointer-events: none;
	width: 50px;
}

.card-filled .faded-navigate-previous:after,
.card-filled .faded-left:before {
	background: linear-gradient(
		to left,
		rgba(255, 255, 255, 0),
		rgba(243, 244, 246, 1) 90%
	);
	content: "";
	position: absolute;
	top: 0;
	z-index: 11;
	left: 0;
	bottom: 0;
	pointer-events: none;
	width: 50px;
}

.scrollable-slot {
	scroll-behavior: smooth;

	-ms-overflow-style: none;
	/* for Internet Explorer, Edge */
	scrollbar-width: none;
	/* for Firefox */
}

.scrollable-slot::-webkit-scrollbar {
	display: none;
	/* for Chrome, Safari, and Opera */
}
</style>
