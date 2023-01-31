<template>
	<div class="combo-box">
		<DropdownMenu :expanded="expanded" @toggleExpanded="onToggleExpanded()">
			<template v-slot:activator>
				<TextInput
					:leftIcon="leftIcon"
					v-model="searchText"
					:placeholder="placeholder || undefined"
					>{{ label }}</TextInput
				>
			</template>
			<label
				v-for="(item, index) in filteredItems"
				:for="id + '-input-' + index"
				:key="item[itemId]"
			>
				<div v-wave class="flex py-2 hover:bg-light cursor-pointer -mx-5 px-5">
					<input
						@input="onInput(item.value, $event)"
						@click="item.value == modelValue ? (expanded = false) : null"
						class="w-0 h-0 opacity-0"
						type="radio"
						:id="id + '-input-' + index"
						:value="item.value"
						:checked="item.value == modelValue"
					/>
					<slot v-bind:item="item"></slot>
				</div>
			</label>
		</DropdownMenu>
	</div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "@vue/runtime-core";
import TextInput from "../TextInput.vue";
import DropdownMenu from "../DropdownMenu.vue";
import { SelectableOption } from "@/interfaces";
import { v4 as uuid4 } from "uuid";

export default defineComponent({
	name: "Combobox",
	props: {
		modelValue: {
			type: Array as PropType<SelectableOption[]>,
			required: true,
		},
		items: {
			type: Array as PropType<SelectableOption[]>,
			required: true,
		},
		allowCreate: {
			type: Boolean,
			default: true,
		},
		allowMultiple: {
			type: Boolean,
			default: false,
		},
		itemId: {
			type: String,
			default: "id",
		},
		placeholder: {
			type: String,
			default: "",
		},
		label: {
			type: String,
			default: "",
		},
		leftIcon: { type: String, default: "" },
	},
	watch: {
		searchText(newVal) {
			this.expanded = newVal.length > 0;
		},
	},
	created() {
		this.id = uuid4();
	},
	data() {
		return {
			searchText: "",
			expanded: false,
			id: "2",
		};
	},
	methods: {
		onToggleExpanded() {
			if (this.expanded) {
				this.expanded = false;
			} else {
				this.expanded = this.searchText.length > 0;
			}
		},
		onInput(value: string, inputEvent: Event) {
			console.log("INPUT", value);
			(inputEvent.target as unknown as { checked: boolean }).checked = false;
			inputEvent.preventDefault();
			this.$emit("update:modelValue", value);
			this.expanded = false;
			this.searchText = "";
		},
	},
	computed: {
		filteredItems() {
			return this.items;
		},
	},
	components: { TextInput, DropdownMenu },
});
</script>

<style></style>
