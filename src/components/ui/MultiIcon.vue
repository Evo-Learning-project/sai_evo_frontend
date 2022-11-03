<template>
	<div v-if="icons?.length > 0" :class="['-mb-5px']">
		<img
			class="transform scale-125 ml-1.5 my-0"
			v-if="isRawIcon"
			src="../../../public/c.svg"
		/>
		<span
			v-else
			:style="'font-size:' + fontSize"
			:class="[
				classExceptions[icon] ?? '',
				'mt-0.5 mx-auto',
				useTwoTone ? 'material-icons-two-tone' : 'material-icons-outlined',
			]"
			v-for="(icon, index) in parsedIcons"
			:key="id + '-icon-' + index"
		>
			{{ icon }}
		</span>
	</div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "@vue/runtime-core";
import { v4 as uuid4 } from "uuid";

export default defineComponent({
	name: "MultiIcon",
	props: {
		icons: {
			type: Array as PropType<string[]>,
		},
		useTwoTone: {
			type: Boolean,
			default: false,
		},
		small: {
			type: Boolean,
			default: false,
		},
	},
	created() {
		this.id = uuid4();
	},
	data() {
		return {
			id: "",
		};
	},
	computed: {
		icon() {
			return this.icons?.[0] ?? "";
		},
		sizeExceptions(): Record<string, string | undefined> {
			return {
				javascript: "28px !important",
			};
		},
		classExceptions(): Record<string, string | undefined> {
			return {
				javascript: "-ml-1 -mt-1.25px",
				update: "pt-0.5",
				block: "pt-0.5",
				event_available: "two-tone-success pt-0.5 mr-0.5",
			};
		},
		fontSize() {
			const sizeException = this.sizeExceptions[this.icon];
			if (sizeException) {
				return sizeException;
			}

			return this.small ? "16px !important" : "20px !important";
		},
		isRawIcon(): boolean {
			return this.icons?.[0].startsWith("raw-") ?? false;
		},
		parsedIcons() {
			return this.icons?.map(i =>
				i.slice(-3) === "-lg" || i.slice(-3) === "-sm"
					? i.slice(0, -3)
					: i.slice(0, 4) === "raw-"
					? i.slice(4)
					: i,
			);
		},
	},
});
</script>

<style></style>
