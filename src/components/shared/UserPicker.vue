<template>
	<Combobox
		:items="items"
		:modelValue="modelValue"
		:filterFunction="filterFunction"
		:isCreatableFunction="isCreatableFunction"
	></Combobox>
</template>
<script lang="ts">
import { SelectableOption } from "@/interfaces";
import { defineComponent, PropType } from "@vue/runtime-core";
import Combobox from "../ui/Combobox.vue";
export default defineComponent({
	name: "UserPicker",
	props: {
		modelValue: {
			type: Array as PropType<SelectableOption[]>,
			required: true,
		},
		items: {
			type: Array as PropType<SelectableOption[]>,
			required: true,
		},
		filterFunction: {
			type: Function as PropType<(search: string, option: SelectableOption) => boolean>,
			// by default, no filtering is performed and it is up
			// to the parent component to handle search
			default: () => true,
		},
		isCreatableFunction: {
			// a function that takes in the search text and returns whether that's a valid
			// payload for creating a new item
			type: Function as PropType<(search: string) => boolean>,
			default: () => false,
		},
	},
	components: { Combobox },
});
</script>
