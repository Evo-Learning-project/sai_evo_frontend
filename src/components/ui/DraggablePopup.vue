<template>
	<div
		ref="draggableContainer"
		:id="containerId + '-draggable-container'"
		:style="
			'box-shadow: 0 1px 3px 0 rgb(60 64 67 / 30%), 0 4px 8px 3px rgb(60 64 67 / 15%);top: ' +
			initialTop +
			'px;left: ' +
			initialLeft +
			'%;z-index: ' +
			(inForeground ? '99999' : '200')
		"
		class="
			fixed
			w-11/12
			p-2
			overflow-y-auto
			transition-opacity
			duration-75
			card
			hover:opacity-100
		"
		:class="{
			'opacity-80': !opaque,
			'bg-light': !whiteBg,
			'bg-white': whiteBg,
			'md:w-2/5': !large,
			'md:w-3/5': large,
			resize: resizable,
		}"
	>
		<div
			class="absolute w-full cursor-move"
			:class="[dragOnTitleOnly ? 'h-18' : 'h-full']"
			@mousedown="dragMouseDown"
		></div>
		<div class="flex items-center w-full px-4 pt-3">
			<h2 class="mb-0">{{ title }}</h2>

			<Btn
				:tooltip="$t('misc.close')"
				:variant="'icon'"
				:outline="true"
				@click="$emit('close')"
				class="z-30 ml-auto"
			>
				<span class="material-icons-outlined">close</span>
			</Btn>
		</div>
		<div class="px-4 pb-4">
			<slot></slot>
		</div>
	</div>
</template>

<script lang="ts">
import { texMixin } from "@/mixins";
import { v4 as uuid4 } from "uuid";
import { defineComponent } from "vue";
import Btn from "./Btn.vue";

export default defineComponent({
	name: "DraggablePopup",
	props: {
		title: {
			type: String,
			default: "",
		},
		whiteBg: {
			type: Boolean,
			default: false,
		},
		dragOnTitleOnly: {
			type: Boolean,
			default: false,
		},
		initialTop: {
			type: Number,
			default: -30,
		},
		initialLeft: {
			type: Number,
			default: 63,
		},
		inForeground: {
			type: Boolean,
			default: false,
		},
		opaque: {
			type: Boolean,
			default: false,
		},
		resizable: {
			type: Boolean,
			default: true,
		},
		large: {
			type: Boolean,
			default: false,
		},
	},
	mounted() {
		// keep draggable area in sync with actual scroll width and height of the popup
		setInterval(() => {
			const container = document.getElementById(
				this.containerId + "-draggable-container",
			);
			if (container) {
				this.overlayHeight = container.scrollHeight - 10;
				this.overlayWidth = container.scrollWidth - 10;
			}
		}, 10000);
	},
	data() {
		return {
			overlayHeight: 0,
			overlayWidth: 0,
			positions: {
				clientX: 0,
				clientY: 0,
				movementX: 0,
				movementY: 0,
			},
			containerId: uuid4(),
		};
	},
	methods: {
		dragMouseDown: function (event: any) {
			event.preventDefault();
			// get the mouse cursor position at startup:
			this.positions.clientX = event.clientX;
			this.positions.clientY = event.clientY;
			document.onmousemove = this.elementDrag;
			document.onmouseup = this.closeDragElement;
		},
		elementDrag: function (event: any) {
			event.preventDefault();
			this.positions.movementX = (this.positions?.clientX ?? 0) - event.clientX;
			this.positions.movementY = (this.positions?.clientY ?? 0) - event.clientY;
			this.positions.clientX = event.clientX;
			this.positions.clientY = event.clientY;
			const maxX = window.innerWidth;
			const maxY = window.innerHeight;
			// prevent scrolling past the top or left of the parent element
			const resX = Math.max(
				(this.$refs.draggableContainer as any).offsetLeft - this.positions.movementX,
				-100,
			);
			const resY = Math.max(
				(this.$refs.draggableContainer as any).offsetTop - this.positions.movementY,
				-200,
			);
			const popup = document.getElementById(this.containerId + "-draggable-container");
			const popupW = popup?.offsetWidth ?? 0;
			const popupH = popup?.offsetHeight ?? 0;
			// set the element's new position:
			// prevent scrolling out of page from the right or bottom
			(this.$refs.draggableContainer as any).style.top =
				// (true || resY < maxY - popupH ? resY : maxY - popupH)
				resY + "px";
			(this.$refs.draggableContainer as any).style.left =
				//(true || resX < maxX - popupW ? resX : maxX - popupW)
				resX + "px";
		},
		closeDragElement() {
			document.onmouseup = null;
			document.onmousemove = null;
		},
		resize() {
			console.log("resizing");
		},
	},
	computed: {
		overlayStyle() {
			return `width: ${this.overlayWidth}px; height: ${this.overlayHeight}px;`;
		},
	},
	components: { Btn },
});
</script>
