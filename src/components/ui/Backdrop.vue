<template>
	<div
		v-if="orientation === 'horizontal'"
		class="absolute z-20 w-full py-2 border-b rounded-t-lg rounded-b-sm -bottom-0 shadow-t-elevation-2 bg-light"
	>
		<div class="flex items-center w-full px-4 py-1">
			<div>
				<div class="">
					<slot name="title"></slot>
				</div>
			</div>

			<Btn @click="expanded = !expanded" :variant="'icon'" :outline="true" class="ml-auto"
				><span
					class="transition-transform duration-200 ease-out transform material-icons-outlined"
					:class="{ 'rotate-180': expanded }"
				>
					{{ false && expanded ? "expand_more" : "expand_less" }}
				</span></Btn
			>
		</div>
		<div
			class="ease-in-out transition-max-height"
			:class="[expanded ? 'max-h-72 duration-200 overflow-y-auto' : 'max-h-0 duration-75 overflow-y-hidden']"
		>
			<slot></slot>
		</div>
	</div>
	<div style="z-index: 999999" v-else class="absolute flex overflow-hidden top-20 right-20">
		<div class="absolute right-0">
			<Btn @click="expanded = !expanded" :variant="'icon'" :outline="true" class="z-50"
				><span
					class="transition-transform duration-200 ease-out transform material-icons-outlined"
					:class="{ '-rotate-90': !expanded, 'rotate-90': expanded }"
				>
					{{ false && expanded ? "expand_more" : "expand_less" }}
				</span></Btn
			>
		</div>
		<div
			:class="{ absolute: false && expanded }"
			class="top-0 right-0 w-10 h-full bg-white rounded-tl-md rounded-bl-md"
		></div>
		<div
			class="h-full overflow-y-hidden transition-all duration-300 ease-in-out transform bg-white"
			:class="{
				'-ml-inf': !expanded,
				'ml-0 overflow-hidden': expanded,
			}"
		>
			<div class="px-4 py-2">
				<slot name="title"></slot>
			</div>
			<div class="h-full overflow-y-auto">
				<slot></slot>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "@vue/runtime-core";
import Btn from "./Btn.vue";
export default defineComponent({
	name: "Backdrop",
	props: {
		orientation: {
			type: String as PropType<"vertical" | "horizontal">,
			default: "vertical",
		},
	},
	methods: {},
	data() {
		return {
			expanded: false,
		};
	},
	computed: {},
	components: { Btn },
});
</script>

<style></style>
