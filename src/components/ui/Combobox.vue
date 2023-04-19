<template>
	<div class="combo-box">
		<DropdownMenu
			:expanded="expanded"
			@toggleExpanded="onToggleExpanded()"
			:loading="shouldShowLoading"
		>
			<template v-slot:activator>
				<div class="relative">
					<TextInput
						:leftIcon="leftIcon"
						v-model="searchText"
						:placeholder="placeholder || undefined"
						>{{ label }}</TextInput
					>
					<p
						style="font-size: 12.5px"
						class="absolute -bottom-5 left-0 text-muted"
						v-if="hint"
					>
						{{ hint }}
					</p>
				</div>
			</template>
			<div class="">
				<label
					v-for="(item, index) in filteredItems"
					:for="id + '-input-' + index"
					:key="item[itemId]"
				>
					<div v-wave class="flex py-3 hover:bg-light cursor-pointer -mx-5 pl-5 pr-8">
						<input
							@input="onInput(item.value, $event)"
							@click="item.value == modelValue ? (expanded = false) : null"
							class="w-0 h-0 opacity-0"
							type="radio"
							:id="id + '-input-' + index"
							:value="item.value"
							:checked="item.value == modelValue"
						/>
						<slot :item="item" :searchText="searchText"></slot>
					</div>
				</label>
				<div v-if="filteredItems.length === 0 && !isCreatableFunction(searchText)">
					<slot name="noResults" v-bind:searchText="searchText"></slot>
				</div>
				<div v-if="filteredItems.length === 0 && isCreatableFunction(searchText)">
					<div
						v-wave
						class="flex py-2 hover:bg-light cursor-pointer -mx-5 px-5"
						@click="onCreateOption()"
					>
						<slot name="createOption" v-bind:searchText="searchText"></slot>
					</div>
				</div>
			</div>
		</DropdownMenu>
	</div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "@vue/runtime-core";
import TextInput from "./TextInput.vue";
import DropdownMenu from "./DropdownMenu.vue";
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
		leftIcon: {
			type: String,
			default: "",
		},
		hint: {
			type: String,
			default: "",
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
		loading: {
			type: Boolean,
			default: false,
		},
	},
	watch: {
		searchText(newVal) {
			this.expanded = newVal.length > 0;
			this.$emit("updateSearchText", newVal);
		},
		loading(newVal) {
			// only show progress when combobox has been loading for a while
			if (!newVal) {
				this.shouldShowLoading = false;
			} else {
				setTimeout(() => (this.shouldShowLoading = this.loading), 1500);
			}
		},
	},
	created() {
		this.id = uuid4();
	},
	data() {
		return {
			searchText: "",
			expanded: false,
			id: "",
			shouldShowLoading: false,
		};
	},
	methods: {
		onToggleExpanded() {
			if (this.expanded) {
				this.expanded = false;
			} else {
				this.expanded = this.searchText.length > 0 || this.items.length > 0;
			}
		},
		onInput(value: string, inputEvent: Event) {
			(inputEvent.target as unknown as { checked: boolean }).checked = false;
			inputEvent.preventDefault();
			this.$emit("update:modelValue", value);
			this.expanded = false;
			this.searchText = "";
		},
		onCreateOption() {
			this.$emit("createOption", this.searchText);
			this.searchText = "";
		},
	},
	computed: {
		filteredItems() {
			return this.items.filter(i => this.filterFunction(this.searchText, i));
		},
	},
	components: { TextInput, DropdownMenu },
});
</script>

<style></style>
